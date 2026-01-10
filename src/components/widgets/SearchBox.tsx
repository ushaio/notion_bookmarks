'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Bookmark, ChevronDown, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// 搜索引擎配置
const searchEngines = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=', icon: '🔍' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=', icon: '🔎' },
  { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=', icon: '🅱️' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: '🦆' },
  { id: 'bingcn', name: '必应中国', url: 'https://cn.bing.com/search?q=', icon: '🇨🇳' },
];

type SearchMode = 'bookmark' | 'browser';

interface SearchBoxProps {
  onBookmarkSearch?: (keyword: string) => void;
  className?: string;
}

export default function SearchBox({ onBookmarkSearch, className = '' }: SearchBoxProps) {
  const [mounted, setMounted] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('bookmark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState(searchEngines[0]);
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEngineDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBookmarkSearch = useCallback((query: string) => {
    if (onBookmarkSearch) {
      onBookmarkSearch(query);
    }
  }, [onBookmarkSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (searchMode === 'bookmark') {
      handleBookmarkSearch(value);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    if (searchMode === 'browser') {
      const searchUrl = selectedEngine.url + encodeURIComponent(searchQuery.trim());
      window.open(searchUrl, '_blank');
    } else {
      handleBookmarkSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setSearchQuery('');
      if (searchMode === 'bookmark') {
        handleBookmarkSearch('');
      }
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (searchMode === 'bookmark') {
      handleBookmarkSearch('');
    }
    inputRef.current?.focus();
  };

  const toggleSearchMode = (mode: SearchMode) => {
    setSearchMode(mode);
    setSearchQuery('');
    if (mode === 'bookmark') {
      handleBookmarkSearch('');
    }
  };

  const selectEngine = (engine: typeof searchEngines[0]) => {
    setSelectedEngine(engine);
    setShowEngineDropdown(false);
  };

  if (!mounted) {
    return (
      <div className={cn("w-full max-w-2xl mx-auto", className)}>
        <div className="search-box-widget p-6 rounded-2xl bg-card/80 backdrop-blur-sm">
          <div className="h-12 bg-muted/50 rounded-xl skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "search-box-widget relative p-6 rounded-2xl",
          "bg-card/90 backdrop-blur-md",
          "border border-border/40",
          "transition-all duration-500",
          isFocused && "border-primary/30 shadow-lg shadow-primary/5"
        )}
      >
        {/* 背景装饰 - 水墨晕染 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500",
            "bg-gradient-to-bl from-primary/10 to-transparent",
            isFocused ? "opacity-100" : "opacity-30"
          )}></div>
          <div className={cn(
            "absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500",
            "bg-gradient-to-tr from-secondary/10 to-transparent",
            isFocused ? "opacity-100" : "opacity-20"
          )}></div>
        </div>

        <div className="relative z-10 space-y-4">
          {/* 搜索模式切换 - 印章风格 */}
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSearchMode('bookmark')}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                searchMode === 'bookmark'
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Bookmark className="w-4 h-4" />
              <span>书签搜索</span>
              {searchMode === 'bookmark' && (
                <motion.div
                  layoutId="searchModeIndicator"
                  className="absolute inset-0 bg-primary rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
            
            <div className="w-px h-6 bg-border/50"></div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSearchMode('browser')}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                searchMode === 'browser'
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Globe className="w-4 h-4" />
              <span>浏览器搜索</span>
            </motion.button>
          </div>

          {/* 搜索框主体 */}
          <div className="flex items-center gap-3">
            {/* 搜索引擎选择器（仅浏览器搜索模式） */}
            <AnimatePresence>
              {searchMode === 'browser' && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative" 
                  ref={dropdownRef}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEngineDropdown(!showEngineDropdown)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300",
                      "bg-muted/50 hover:bg-muted border border-border/40",
                      showEngineDropdown && "border-primary/30"
                    )}
                  >
                    <span className="text-xl">{selectedEngine.icon}</span>
                    <motion.div
                      animate={{ rotate: showEngineDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {showEngineDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-44 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        {searchEngines.map((engine, index) => (
                          <motion.button
                            key={engine.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => selectEngine(engine)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                              "hover:bg-accent",
                              selectedEngine.id === engine.id && "bg-accent/50"
                            )}
                          >
                            <span className="text-xl">{engine.icon}</span>
                            <span style={{ fontFamily: 'var(--font-body)' }}>{engine.name}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 搜索输入框 */}
            <div className={cn(
              "flex-1 flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300",
              "bg-background border",
              isFocused 
                ? "border-primary/50 shadow-md shadow-primary/10 ring-2 ring-primary/10" 
                : "border-border/40 hover:border-border"
            )}>
              <Search className={cn(
                "w-5 h-5 flex-shrink-0 transition-colors duration-300",
                isFocused ? "text-primary" : "text-muted-foreground"
              )} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={searchMode === 'bookmark' ? '搜索书签（标题、描述、URL）...' : `使用 ${selectedEngine.name} 搜索...`}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleClear}
                    className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* 搜索按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className={cn(
                "px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300",
                "bg-primary text-primary-foreground",
                "hover:shadow-lg hover:shadow-primary/20",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              搜索
            </motion.button>
          </div>

          {/* 搜索提示 - 禅意风格 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <Sparkles className="w-3 h-3" />
            {searchMode === 'bookmark' ? (
              <span style={{ fontFamily: 'var(--font-display)' }}>输入关键词，即刻发现</span>
            ) : (
              <span style={{ fontFamily: 'var(--font-display)' }}>按 Enter 键，探索世界</span>
            )}
            <Sparkles className="w-3 h-3" />
          </motion.div>
        </div>

        {/* 底部装饰线 */}
        <div className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500",
          "bg-gradient-to-r from-transparent via-primary to-transparent",
          isFocused ? "w-3/4 opacity-60" : "w-1/4 opacity-20"
        )}></div>
      </motion.div>
    </div>
  );
}