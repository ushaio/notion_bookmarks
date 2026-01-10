'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WidgetsContainerProps {
  children: React.ReactNode;
}

export default function WidgetsContainer({ children }: WidgetsContainerProps) {
  const childArray = React.Children.toArray(children);
  
  return (
    <div className="w-full mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* 标题区域 */}
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-1 h-5 bg-primary rounded-full"></div>
          <h2 
            className="text-sm font-medium text-muted-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            快捷工具
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
        </div>
        
        {/* 小部件滚动容器 */}
        <div className="relative overflow-hidden">
          {/* 左侧渐变遮罩 */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-0 lg:opacity-100"></div>
          
          {/* 右侧渐变遮罩 */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          {/* 滚动区域 */}
          <div className="flex overflow-x-auto pb-2 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-border lg:scrollbar-track-transparent">
            <div className="flex gap-4 px-1">
              {childArray.map((child, index) => (
                <motion.div 
                  key={index} 
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  {child}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}