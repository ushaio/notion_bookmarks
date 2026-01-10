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
          "group relative block p-5 rounded-2xl overflow-hidden",
          "bg-card border border-border/40",
          "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5",
          "transition-all duration-500 ease-smooth",
          "w-full max-w-full",
          className
        )}
      >
        {/* 现代感背景装饰 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl"></div>
        </div>

        {/* 悬浮时的边框发光效果 */}
        <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-2xl transition-colors duration-500"></div>

        {/* 内容容器 */}
        <div className="relative flex flex-col h-full gap-4">
          {/* 图标和名称行 */}
          <div className="flex items-center gap-4">
            {/* 图标容器 - 现代圆角矩形 */}
            <motion.div
              className="relative shrink-0"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-secondary/50 border border-border/50 p-2.5 group-hover:border-primary/20 transition-all duration-500 group-hover:shadow-inner">
                <div className="relative w-full h-full">
                  <img
                    ref={imgRef}
                    alt="Site Icon"
                    className={cn(
                      "w-full h-full object-contain transition-all duration-500",
                      imageLoaded ? "opacity-100" : "opacity-0",
                      "group-hover:scale-110"
                    )}
                    onError={handleImageError}
                    loading="eager"
                    decoding="async"
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* 网站名称 */}
            <div className="flex-1 min-w-0">
              <div
                className="relative"
                onMouseEnter={(e) => handleMouseEnter(e, setTitleTooltip)}
                onMouseLeave={() => handleMouseLeave(setTitleTooltip)}
              >
                <h3
                  className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1 pr-6 tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {link.name}
                </h3>
              </div>
              
              {/* 链接预览小字 */}
              <p className="text-[10px] text-muted-foreground/60 truncate font-mono mt-0.5">
                {link.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
              </p>
            </div>

            {/* 外链图标 - 更加精致 */}
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-secondary/0 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-500">
                <IconExternalLink
                  className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-40 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* 描述行 - 优化排版 */}
          {link.desc && (
            <div
              className="flex-1"
              onMouseEnter={(e) => handleMouseEnter(e, setDescTooltip)}
              onMouseLeave={() => handleMouseLeave(setDescTooltip)}
            >
              <p
                className="text-sm text-muted-foreground/80 group-hover:text-foreground/90 line-clamp-2 transition-colors duration-300 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {link.desc}
              </p>
            </div>
          )}

          {/* 标签行 - 现代胶囊风格 */}
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {link.tags.slice(0, 2).map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg",
                    "bg-secondary text-muted-foreground/70",
                    "group-hover:bg-primary/10 group-hover:text-primary",
                    "transition-all duration-500 border border-transparent",
                    "group-hover:border-primary/10"
                  )}
                >
                  {tag}
                </motion.span>
              ))}
              {link.tags.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-lg bg-secondary text-muted-foreground/50 group-hover:text-primary/60 transition-colors duration-500">
                  +{link.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
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