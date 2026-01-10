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
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative p-1.5 rounded-[2rem]",
          "bg-card/40 backdrop-blur-2xl",
          "border border-border/50 shadow-2xl shadow-black/5",
          "transition-all duration-500",
          isFocused && "bg-card/60 border-primary/20 shadow-primary/5"
        )}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2">
          {/* 搜索模式切换 */}
          <div className="flex p-1 bg-secondary/50 rounded-[1.5rem] self-stretch sm:self-auto">
            <button
              onClick={() => toggleSearchMode('bookmark')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[1.25rem] text-xs font-bold transition-all duration-300",
                searchMode === 'bookmark'
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Bookmarks</span>
            </button>
            <button
              onClick={() => toggleSearchMode('browser')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[1.25rem] text-xs font-bold transition-all duration-300",
                searchMode === 'browser'
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Web</span>
            </button>
          </div>

          {/* 搜索输入主体 */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2 self-stretch">
            <AnimatePresence mode="wait">
              {searchMode === 'browser' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                  ref={dropdownRef}
                >
                  <button
                    onClick={() => setShowEngineDropdown(!showEngineDropdown)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <span className="text-lg">{selectedEngine.icon}</span>
                  </button>

                  <AnimatePresence>
                    {showEngineDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-3 w-48 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50 p-1"
                      >
                        {searchEngines.map((engine) => (
                          <button
                            key={engine.id}
                            onClick={() => selectEngine(engine)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all",
                              "hover:bg-primary/10 hover:text-primary",
                              selectedEngine.id === engine.id ? "bg-primary/5 text-primary font-bold" : "text-muted-foreground"
                            )}
                          >
                            <span className="text-lg">{engine.icon}</span>
                            <span className="font-medium">{engine.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 relative flex items-center">
              <Search className={cn(
                "absolute left-0 w-4 h-4 transition-colors duration-300",
                isFocused ? "text-primary" : "text-muted-foreground/50"
              )} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={searchMode === 'bookmark' ? 'Search bookmarks...' : `Search with ${selectedEngine.name}...`}
                className="w-full bg-transparent pl-7 pr-8 py-2 outline-none text-foreground placeholder:text-muted-foreground/40 text-sm font-medium"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleClear}
                    className="absolute right-0 p-1 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 搜索按钮 */}
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className={cn(
              "px-6 py-3 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all duration-300",
              "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
              "hover:scale-[1.02] active:scale-[0.98]",
              "disabled:opacity-30 disabled:grayscale disabled:hover:scale-100"
            )}
          >
            Search
          </button>
        </div>

        {/* 底部装饰线 */}
        <div className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500",
          "bg-gradient-to-r from-transparent via-primary to-transparent",
          isFocused ? "w-3/4 opacity-60" : "w-1/4 opacity-20"
        )}></div>
      </motion.div>

      {/* 搜索提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2 mt-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold"
      >
        <Sparkles className="w-3 h-3" />
        <span>{searchMode === 'bookmark' ? 'Discover your bookmarks' : 'Explore the web'}</span>
        <Sparkles className="w-3 h-3" />
      </motion.div>
    </div>
  );
}