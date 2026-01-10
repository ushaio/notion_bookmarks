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
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/50">
      {modes.map(({ mode, icon, label }) => (
        <motion.button
          key={mode}
          onClick={() => onChange(mode)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            viewMode === mode
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
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
        className="w-full px-4 lg:px-6 py-6"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1">
            <SearchBox onBookmarkSearch={handleBookmarkSearch} />
          </div>
          <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
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