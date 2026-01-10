'use client';

import { Link } from '@/types/notion';
import { motion } from 'framer-motion';
import { IconExternalLink } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  link: Link;
  className?: string;
}

// 提示框组件 - 禅意风格
function Tooltip({ content, show, x, y }: { content: string; show: boolean; x: number; y: number }) {
  if (!show) return null;
  
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  
  return createPortal(
    <motion.div 
      initial={{ opacity: 0, y: 5, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      className="fixed p-3 rounded-lg bg-card/95 backdrop-blur-md
                border border-border/50 shadow-lg max-w-xs z-[100] pointer-events-none"
      style={{ 
        left: x,
        top: y - 8,
        transform: 'translateY(-100%)',
        fontFamily: 'var(--font-body)'
      }}
    >
      <p className="text-sm text-foreground leading-relaxed">{content}</p>
      {/* 小三角 */}
      <div className="absolute bottom-0 left-4 w-2 h-2 bg-card border-r border-b border-border/50 transform translate-y-1/2 rotate-45"></div>
    </motion.div>,
    document.body
  );
}

// 获取图标URL的辅助函数
function getIconUrl(link: Link): string {
  if (link.iconfile) {
    return link.iconfile;
  }
  
  if (link.iconlink) {
    return link.iconlink;
  }
  
  return '/globe.svg';
}

export default function LinkCard({ link, className }: LinkCardProps) {
  const [titleTooltip, setTitleTooltip] = useState({ show: false, x: 0, y: 0 });
  const [descTooltip, setDescTooltip] = useState({ show: false, x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(getIconUrl(link));
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageSrc && imgRef.current) {
      const img = new window.Image();
      img.src = imageSrc;
      img.onload = () => {
        if (imgRef.current) {
          imgRef.current.src = imageSrc;
          setImageLoaded(true);
        }
      };
      img.onerror = () => {
        setImageSrc('/globe.svg');
        setImageError(true);
        setImageLoaded(true);
      };
    }
  }, [imageSrc]);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    setImageSrc(getIconUrl(link));
  }, [link]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLElement>,
    setter: typeof setTitleTooltip
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setter({
      show: true,
      x: rect.left,
      y: rect.top
    });
  };

  const handleMouseLeave = (setter: typeof setTitleTooltip) => {
    setter({ show: false, x: 0, y: 0 });
  };

  return (
    <>
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "group relative block p-4 rounded-xl overflow-hidden",
          "bg-card border border-border/40",
          "hover:border-primary/40 hover:shadow-lg",
          "transition-all duration-300",
          "w-full max-w-full",
          className
        )}
      >
        {/* 水墨晕染背景效果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-xl"></div>
        </div>

        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/60 transition-all duration-500"></div>

        {/* 内容容器 */}
        <div className="relative flex flex-col h-full gap-3">
          {/* 图标和名称行 */}
          <div className="flex items-start gap-3">
            {/* 图标容器 - 印章风格 */}
            <motion.div 
              className="relative shrink-0"
              whileHover={{ rotate: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/50 border border-border/50 p-1.5 group-hover:border-primary/30 transition-colors duration-300">
                <div className="relative w-full h-full">
                  <img
                    ref={imgRef}
                    alt="Site Icon"
                    className={cn(
                      "w-full h-full object-contain transition-all duration-300",
                      imageLoaded ? "opacity-100" : "opacity-0",
                      "group-hover:scale-110"
                    )}
                    onError={handleImageError}
                    loading="eager"
                    decoding="async"
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
              {/* 印章角标 */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary/10 rounded-sm rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
            
            {/* 网站名称 */}
            <div className="flex-1 min-w-0 pt-1">
              <div 
                className="relative"
                onMouseEnter={(e) => handleMouseEnter(e, setTitleTooltip)}
                onMouseLeave={() => handleMouseLeave(setTitleTooltip)}
              >
                <h3 
                  className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1 pr-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {link.name}
                </h3>
              </div>
              
              {/* 外链图标 */}
              <div className="absolute right-4 top-4">
                <IconExternalLink 
                  className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                />
              </div>
            </div>
          </div>

          {/* 描述行 */}
          {link.desc && (
            <div 
              className="flex-1"
              onMouseEnter={(e) => handleMouseEnter(e, setDescTooltip)}
              onMouseLeave={() => handleMouseLeave(setDescTooltip)}
            >
              <p 
                className="text-sm text-muted-foreground group-hover:text-foreground/80 line-clamp-2 transition-colors duration-300 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {link.desc}
              </p>
            </div>
          )}

          {/* 标签行 - 水墨标签风格 */}
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {link.tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 text-xs rounded-md",
                    "bg-muted/60 text-muted-foreground",
                    "group-hover:bg-primary/10 group-hover:text-primary/90",
                    "transition-all duration-300 border border-transparent",
                    "group-hover:border-primary/20"
                  )}
                  title={tag}
                >
                  <span className="truncate max-w-[80px]">{tag}</span>
                </motion.span>
              ))}
              {link.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/90 transition-all duration-300">
                  +{link.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 底部装饰 - 毛笔笔触 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-3/4 transition-all duration-500"></div>
      </motion.a>

      {/* 提示框 */}
      <Tooltip 
        content={link.name}
        show={titleTooltip.show}
        x={titleTooltip.x}
        y={titleTooltip.y}
      />
      {link.desc && (
        <Tooltip 
          content={link.desc}
          show={descTooltip.show}
          x={descTooltip.x}
          y={descTooltip.y}
        />
      )}
    </>
  );
}