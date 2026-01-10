// src/components/LinkContainer.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LinkCard from "@/components/ui/LinkCard";
import * as Icons from "lucide-react";
import { ExternalLink } from "lucide-react";
import { Link, Category } from '@/types/notion';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// 视图模式类型
export type ViewMode = 'normal' | 'compact' | 'list';

interface LinkContainerProps {
  initialLinks: Link[];
  enabledCategories: Set<string>;
  categories: Category[];
  searchKeyword?: string;
  viewMode?: ViewMode;
}

// 粘性标题组件 - 纯 CSS sticky 实现
interface StickyCategoryHeaderProps {
  category: Category;
  linkCount: number;
}

function StickyCategoryHeader({ category, linkCount }: StickyCategoryHeaderProps) {
  const IconComponent = category.iconName && Icons[category.iconName as keyof typeof Icons]
    ? Icons[category.iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>
    : Icons.Bookmark;

  return (
    <div
      className={cn(
        "sticky z-20",
        "top-[112px] lg:top-0",
        "bg-background/80 backdrop-blur-xl",
        "-mx-4 px-4 lg:-mx-6 lg:px-6",
        "py-6 mb-4",
        "border-b border-border/10",
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              "bg-primary/10 text-primary border border-primary/20",
              "shadow-[0_0_20px_rgba(var(--primary),0.1)]"
            )}
          >
            <IconComponent className="w-6 h-6" />
          </motion.div>
          
          <div className="flex flex-col">
            <h2
              className="text-2xl font-black tracking-tight text-foreground"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {category.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1 w-8 bg-primary rounded-full"></div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Category Section
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/50 border border-border/50 backdrop-blur-sm">
          <span className="text-sm font-bold text-primary">{linkCount}</span>
          <span className="text-xs text-muted-foreground font-medium">Bookmarks</span>
        </div>
      </div>
    </div>
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

// 紧凑型链接卡片组件（用于高效模式）
function CompactLinkCard({ link, className }: { link: Link; className?: string }) {
  const iconUrl = getIconUrl(link);
  
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center gap-2.5 p-2 rounded-lg",
        "bg-card/60 hover:bg-card border border-border/30 hover:border-primary/30",
        "transition-all duration-200 group shadow-sm hover:shadow-md",
        className
      )}
    >
      {/* 图标 */}
      <div className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/30 group-hover:border-primary/20 transition-colors">
        <img
          src={iconUrl}
          alt=""
          className="w-4.5 h-4.5 object-contain group-hover:scale-110 transition-transform duration-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/globe.svg';
          }}
        />
      </div>
      
      {/* 名称 */}
      <span className="flex-1 text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
        {link.name}
      </span>
      
      {/* 外链图标 */}
      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </motion.a>
  );
}

// 列表型链接项组件（用于列表模式）
function ListLinkItem({ link, className }: { link: Link; className?: string }) {
  const iconUrl = getIconUrl(link);
  
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 2, backgroundColor: 'hsl(var(--muted) / 0.3)' }}
      className={cn(
        "flex items-center gap-2 py-1 px-1.5 rounded",
        "transition-all duration-150 group",
        className
      )}
    >
      {/* 图标 */}
      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img
          src={iconUrl}
          alt=""
          className="w-3.5 h-3.5 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/globe.svg';
          }}
        />
      </div>
      
      {/* 名称 */}
      <span className="flex-1 text-xs text-foreground truncate group-hover:text-primary transition-colors leading-tight">
        {link.name}
      </span>
      
      {/* 外链图标 */}
      <ExternalLink className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </motion.a>
  );
}

// 列表模式的分类卡片组件（用于多栏布局）
interface ListCategoryCardProps {
  subCategory: string;
  links: Link[];
  categoryId: string;
}

function ListCategoryCard({ subCategory, links, categoryId }: ListCategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "break-inside-avoid mb-3",
        "bg-card/40 backdrop-blur-sm rounded-lg",
        "border border-border/30 hover:border-primary/20",
        "transition-all duration-200 hover:shadow-md",
        "overflow-hidden"
      )}
    >
      {/* 子分类标题 */}
      <div className={cn(
        "px-3 py-2",
        "bg-muted/30 border-b border-border/20",
        "flex items-center gap-2"
      )}>
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
        <h4
          className="text-sm font-medium text-foreground/90 flex-1 truncate"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {subCategory}
        </h4>
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
          {links.length}
        </span>
      </div>
      
      {/* 链接列表 */}
      <div className="p-2 space-y-0.5">
        {links.map((link) => (
          <ListLinkItem key={link.id} link={link} />
        ))}
      </div>
    </motion.div>
  );
}

export default function LinkContainer({
  initialLinks,
  enabledCategories,
  categories,
  searchKeyword = '',
  viewMode = 'normal',
}: LinkContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
  }, []);

  // 根据管理员状态过滤链接
  const filteredByAdmin = useMemo(() => {
    if (isAdmin) {
      return initialLinks;
    }
    return initialLinks.filter(link => !link.isAdminOnly);
  }, [initialLinks, isAdmin]);

  // 根据搜索关键词过滤链接
  const filteredLinks = useMemo(() => {
    if (!searchKeyword.trim()) {
      return filteredByAdmin;
    }
    
    const keyword = searchKeyword.toLowerCase().trim();
    return filteredByAdmin.filter(link => {
      const nameMatch = link.name?.toLowerCase().includes(keyword);
      const descMatch = link.desc?.toLowerCase().includes(keyword);
      const urlMatch = link.url?.toLowerCase().includes(keyword);
      const tagsMatch = link.tags?.some(tag => tag.toLowerCase().includes(keyword));
      return nameMatch || descMatch || urlMatch || tagsMatch;
    });
  }, [filteredByAdmin, searchKeyword]);

  // 按一级和二级分类组织链接
  const linksByCategory = useMemo(() => {
    return filteredLinks.reduce((acc, link) => {
      const cat1 = link.category1;
      const cat2 = link.category2;

      if (enabledCategories.has(cat1)) {
        if (!acc[cat1]) {
          acc[cat1] = {};
        }
        if (!acc[cat1][cat2]) {
          acc[cat1][cat2] = [];
        }
        acc[cat1][cat2].push(link);
      }
      return acc;
    }, {} as Record<string, Record<string, Link[]>>);
  }, [filteredLinks, enabledCategories]);

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  const searchResultCount = searchKeyword.trim() ? filteredLinks.length : 0;

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // 根据视图模式获取网格类名
  const getGridClassName = () => {
    switch (viewMode) {
      case 'compact':
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3";
      case 'list':
        return "columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5";
    }
  };

  // 根据视图模式获取间距类名
  const getSpacingClassName = () => {
    switch (viewMode) {
      case 'compact':
        return "space-y-8";
      case 'list':
        return "space-y-4";
      default:
        return "space-y-16";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(getSpacingClassName(), "pb-12 w-full min-w-0")}
    >
      {/* 搜索结果提示 */}
      <AnimatePresence>
        {searchKeyword.trim() && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-4 px-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/40"
          >
            <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              搜索 "<span className="font-medium text-foreground">{searchKeyword}</span>" 
              {searchResultCount > 0 ? (
                <span>，找到 <span className="font-semibold text-primary">{searchResultCount}</span> 个结果</span>
              ) : (
                <span className="text-destructive">，未找到匹配的书签</span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {categories.map((category) => {
        const categoryLinks = linksByCategory[category.name];
        if (!categoryLinks) return null;

        const linkCount = Object.values(categoryLinks).flat().length;

        return (
          <motion.section
            key={category.id}
            id={category.id}
            variants={itemVariants}
            className="space-y-6 relative"
          >
            {/* 粘性分类标题 */}
            <StickyCategoryHeader
              category={category}
              linkCount={linkCount}
            />

            {/* 列表模式：多栏多分类瀑布流布局 */}
            {viewMode === 'list' ? (
              <div className={cn(getGridClassName(), "pt-2")}>
                {Object.entries(categoryLinks).map(([subCategory, links], subIndex) => (
                  <ListCategoryCard
                    key={`${category.id}-${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
                    subCategory={subCategory}
                    links={links}
                    categoryId={category.id}
                  />
                ))}
              </div>
            ) : (
              /* 普通模式和紧凑模式：按子分类分组显示 */
              <div className={cn(viewMode === 'compact' ? "space-y-6" : "space-y-10", "pt-2")}>
                {Object.entries(categoryLinks).map(([subCategory, links], subIndex) => (
                  <motion.div
                    key={`${category.id}-${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
                    id={`${category.id}-${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: subIndex * 0.05 }}
                    className={cn(viewMode === 'compact' ? "space-y-2" : "space-y-4")}
                  >
                    {/* 子分类标题 */}
                    <div className="flex items-center gap-3 pl-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                      <h3
                        className={cn(
                          "font-medium text-foreground/90",
                          viewMode === 'compact' ? "text-base" : "text-lg"
                        )}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {subCategory}
                      </h3>
                      <div className="text-xs text-muted-foreground bg-muted/30 rounded-full px-2 py-0.5">
                        {links.length}
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
                    </div>
                    
                    {/* 链接卡片 - 根据视图模式渲染不同组件 */}
                    <div className={cn(getGridClassName(), "w-full")}>
                      {links.map((link, linkIndex) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: linkIndex * 0.03 }}
                        >
                          {viewMode === 'normal' && (
                            <LinkCard link={link} className="w-full h-full" />
                          )}
                          {viewMode === 'compact' && (
                            <CompactLinkCard link={link} />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        );
      })}

      {/* 无搜索结果时的空状态 */}
      <AnimatePresence>
        {searchKeyword.trim() && searchResultCount === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-16"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🔍
            </motion.div>
            <h3 
              className="text-xl font-semibold text-foreground mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              未找到匹配的书签
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              尝试使用不同的关键词搜索，或者切换到浏览器搜索模式探索更多内容
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部更新时间 */}
      {mounted && currentTime && !searchKeyword.trim() && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span 
              className="text-sm text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              最近更新：{formatDate(currentTime)}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
