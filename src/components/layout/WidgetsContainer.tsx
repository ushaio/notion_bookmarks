'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WidgetsContainerProps {
  children: React.ReactNode;
}

export default function WidgetsContainer({ children }: WidgetsContainerProps) {
  const childArray = React.Children.toArray(children);
  
  return (
    <div className="w-full mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* 标题区域 - 更加精致的排版 */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
            <h2
              className="text-lg font-bold tracking-tight text-foreground"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              快捷工具 <span className="text-xs font-normal text-muted-foreground ml-2 opacity-70">Quick Tools</span>
            </h2>
          </div>
          <div className="flex-1 mx-6 h-px bg-gradient-to-r from-border/50 via-border to-transparent"></div>
        </div>
        
        {/* 小部件网格布局 - 采用 Bento 风格网格替代横向滚动，提高内容密度 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {childArray.map((child, index) => (
            <motion.div
              key={index}
              className="bento-card p-4 flex items-center justify-center min-h-[120px]"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: "easeOut"
              }}
            >
              {child}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}