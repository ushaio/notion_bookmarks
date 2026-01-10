'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame, TrendingUp, RefreshCw } from 'lucide-react';

interface HotNewsItem {
  title: string;
  url: string;
  views: string;
  platform: string;
}

const platforms = [
  { id: 'weibo', name: '微博', icon: '🔥' },
  { id: 'baidu', name: '百度', icon: '📊' },
  { id: 'bilibili', name: 'B站', icon: '📺' },
  { id: 'toutiao', name: '头条', icon: '📰' },
  { id: 'douyin', name: '抖音', icon: '🎵' }
];

export default function HotNews() {
  const [activePlatform, setActivePlatform] = useState('weibo');
  const [news, setNews] = useState<HotNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allNews, setAllNews] = useState<Record<string, HotNewsItem[]>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastFetchTime = useRef<number>(0);
  const CACHE_TIME = 15 * 60 * 1000;

  const fetchHotNews = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTime.current < CACHE_TIME && Object.keys(allNews).length > 0) {
      setNews(allNews[activePlatform] || []);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (force) setIsRefreshing(true);
      
      const response = await fetch('/api/hot-news');
      if (!response.ok) {
        throw new Error('获取热搜数据失败');
      }
      const data = await response.json();
      setAllNews(data);
      setNews(data[activePlatform] || []);
      lastFetchTime.current = now;
    } catch (error) {
      console.error('Failed to fetch hot news:', error);
      setError('获取热搜数据失败，请稍后重试');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [activePlatform, allNews, CACHE_TIME]);

  useEffect(() => {
    if (allNews[activePlatform]) {
      setNews(allNews[activePlatform]);
    }
  }, [activePlatform, allNews]);

  useEffect(() => {
    const autoRotate = () => {
      const currentIndex = platforms.findIndex(p => p.id === activePlatform);
      const nextIndex = (currentIndex + 1) % platforms.length;
      setActivePlatform(platforms[nextIndex].id);
    };

    const interval = setInterval(autoRotate, 30000);
    return () => clearInterval(interval);
  }, [activePlatform]);

  useEffect(() => {
    fetchHotNews();
    const refreshInterval = setInterval(() => fetchHotNews(true), 15 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [fetchHotNews]);

  const handleRefresh = () => {
    fetchHotNews(true);
  };

  const currentPlatform = platforms.find(p => p.id === activePlatform);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="widget-card relative rounded-2xl overflow-hidden w-[400px] h-[180px] flex flex-col"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* 头部 - 平台选择器 */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            热门榜单
          </span>
        </div>
        
        {/* 平台切换 */}
        <div className="flex items-center gap-1">
          {platforms.map((platform) => (
            <motion.button
              key={platform.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePlatform(platform.id)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-300",
                activePlatform === platform.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="mr-1">{platform.icon}</span>
              {platform.name}
            </motion.button>
          ))}
          
          {/* 刷新按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
          </motion.button>
        </div>
      </div>

      {/* 热搜列表 */}
      <div className="relative z-10 flex-1 overflow-y-auto py-2 px-3 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          {loading && !allNews[activePlatform] ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                获取热搜数据...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-sm text-destructive"
            >
              {error}
            </motion.div>
          ) : news.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-sm text-muted-foreground"
            >
              暂无数据
            </motion.div>
          ) : (
            <motion.div
              key={activePlatform}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-0.5"
            >
              {news.slice(0, 5).map((item, index) => (
                <motion.a
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all duration-200",
                    "hover:bg-accent/50"
                  )}
                >
                  {/* 排名 */}
                  <span className={cn(
                    "w-5 h-5 flex items-center justify-center text-xs font-bold rounded",
                    index === 0 && "bg-red-500/10 text-red-500",
                    index === 1 && "bg-orange-500/10 text-orange-500",
                    index === 2 && "bg-amber-500/10 text-amber-500",
                    index > 2 && "bg-muted text-muted-foreground"
                  )} style={{ fontFamily: 'var(--font-display)' }}>
                    {index + 1}
                  </span>
                  
                  {/* 标题 */}
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "text-sm truncate block transition-colors duration-200",
                      "text-foreground/90 group-hover:text-primary"
                    )}>
                      {item.title}
                    </span>
                  </div>
                  
                  {/* 热度 */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <TrendingUp className="w-3 h-3" />
                    <span>{item.views}</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </motion.div>
  );
}