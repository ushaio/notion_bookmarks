'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Zap } from 'lucide-react';
import LinkContainer from '@/components/layout/LinkContainer';
import { SearchBox } from '@/components/widgets';
import { Link, Category } from '@/types/notion';
import { cn } from '@/lib/utils';

// 视图模式类型
export type ViewMode = 'normal' | 'compact' | 'list';

interface ContentAreaProps {
  initialLinks: Link[];
  enabledCategories: Set<string>;
  categories: Category[];
  widgets: React.ReactNode;
}

// 视图切换按钮组件
function ViewModeToggle({
  viewMode,
  onChange
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  const modes: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'normal', icon: <LayoutGrid className="w-4 h-4" />, label: '标准' },
    { mode: 'compact', icon: <Zap className="w-4 h-4" />, label: '高效' },
    { mode: 'list', icon: <List className="w-4 h-4" />, label: '列表' },
  ];

  return (
    <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-secondary/50 border border-border/50 backdrop-blur-sm">
      {modes.map(({ mode, icon, label }) => (
        <motion.button
          key={mode}
          onClick={() => onChange(mode)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300",
            viewMode === mode
              ? "bg-card text-primary shadow-lg shadow-black/5 border border-border/50"
              : "text-muted-foreground hover:text-foreground hover:bg-card/30"
          )}
        >
          {icon}
          <span className="hidden md:inline">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default function ContentArea({
  initialLinks,
  enabledCategories,
  categories,
  widgets,
}: ContentAreaProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('normal');

  // 从 localStorage 恢复视图模式
  useEffect(() => {
    const savedMode = localStorage.getItem('bookmarks-view-mode') as ViewMode;
    if (savedMode && ['normal', 'compact', 'list'].includes(savedMode)) {
      setViewMode(savedMode);
    }
  }, []);

  // 保存视图模式到 localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('bookmarks-view-mode', mode);
  };

  const handleBookmarkSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <div className="min-h-full">
      {/* 小部件区域 */}
      {widgets && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 lg:px-6 pt-4"
        >
          {widgets}
        </motion.div>
      )}
      
      {/* 搜索框和视图切换区域 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full px-4 lg:px-6 py-12"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-4xl">
            <SearchBox onBookmarkSearch={handleBookmarkSearch} />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
          </motion.div>
        </div>
      </motion.div>
      
      {/* 书签内容区域 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full min-w-0 px-4 lg:px-6 pb-24"
      >
        <LinkContainer
          initialLinks={initialLinks}
          enabledCategories={enabledCategories}
          categories={categories}
          searchKeyword={searchKeyword}
          viewMode={viewMode}
        />
      </motion.div>
    </div>
  );
}