'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Lunar from 'lunar-javascript';
import { cn } from '@/lib/utils';

export default function SimpleTime() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [lunarDate, setLunarDate] = useState('');
  
  const dateRef = useRef({
    day: 0,
    month: 0,
    year: 0
  });

  // 农历日期转换函数
  function getLunarDate(date: Date): string {
    try {
      const { Solar } = Lunar;
      const lunar = Solar.fromDate(date).getLunar();
      return `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
    } catch (error) {
      console.error('Error calculating lunar date:', error);
      return '农历日期获取失败';
    }
  }

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setTime(now);
    setLunarDate(getLunarDate(now));
    
    dateRef.current = {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear()
    };
    
    const timer = setInterval(() => {
      const currentTime = new Date();
      setTime(currentTime);
      
      if (currentTime.getDate() !== dateRef.current.day ||
          currentTime.getMonth() !== dateRef.current.month ||
          currentTime.getFullYear() !== dateRef.current.year) {
        
        dateRef.current = {
          day: currentTime.getDate(),
          month: currentTime.getMonth(),
          year: currentTime.getFullYear()
        };
        
        setLunarDate(getLunarDate(currentTime));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const month = (time?.getMonth() || 0) + 1;
  const day = time?.getDate() || 0;
  const hours = (time?.getHours() || 0).toString().padStart(2, '0');
  const minutes = (time?.getMinutes() || 0).toString().padStart(2, '0');
  const seconds = (time?.getSeconds() || 0).toString().padStart(2, '0');
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[time?.getDay() || 0];

  // 骨架屏
  if (!mounted || !time) {
    return (
      <div className="widget-card p-5 rounded-2xl w-[300px] h-[160px] flex items-center">
        <div className="flex items-center gap-4 w-full">
          <div className="w-20 h-24 rounded-xl skeleton"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 w-16 skeleton rounded"></div>
            <div className="h-4 w-24 skeleton rounded"></div>
            <div className="h-6 w-20 skeleton rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="widget-card relative p-5 rounded-2xl w-[300px] h-[160px] overflow-hidden group"
    >
      {/* 背景装饰 - 水墨晕染 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
      </div>
      
      <div className="relative z-10 flex items-center h-full gap-4">
        {/* 左侧日历 - 传统日历风格 */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.02, rotate: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-20 h-24 rounded-xl bg-background border border-border/50 flex flex-col overflow-hidden shadow-md">
            {/* 月份头部 - 朱砂红 */}
            <div className="bg-primary text-primary-foreground text-sm text-center py-1.5 font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              {month}月
            </div>
            {/* 日期主体 */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
              <motion.span 
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl font-bold text-foreground"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {day}
              </motion.span>
            </div>
          </div>
          {/* 印章装饰 */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-2 border-primary/30 rounded-sm rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
        
        {/* 右侧信息 */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          {/* 星期 */}
          <div 
            className="text-lg font-semibold text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            星期{weekDay}
          </div>
          
          {/* 农历日期 */}
          <div className="flex items-center gap-2">
            <span
              className="text-sm text-muted-foreground"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              农历 {lunarDate}
            </span>
          </div>
          
          {/* 时间显示 */}
          <motion.div 
            className="flex items-baseline gap-0.5 mt-1"
            key={`${hours}:${minutes}:${seconds}`}
          >
            <span 
              className="text-2xl font-bold text-foreground tabular-nums"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {hours}
            </span>
            <motion.span 
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-2xl font-bold text-primary"
            >
              :
            </motion.span>
            <span 
              className="text-2xl font-bold text-foreground tabular-nums"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {minutes}
            </span>
            <span className="text-lg text-muted-foreground ml-1 tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
              {seconds}
            </span>
          </motion.div>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </motion.div>
  );
}