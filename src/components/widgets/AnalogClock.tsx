'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AnalogClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 骨架屏
  if (!time) {
    return (
      <div className="widget-card p-4 rounded-2xl w-[160px] h-[160px] flex items-center justify-center">
        <div className="w-[130px] h-[130px] rounded-full skeleton"></div>
      </div>
    );
  }

  // 计算指针角度
  const secondsDegrees = (time.getSeconds() / 60) * 360;
  const minutesDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hoursDegrees = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="widget-card relative p-4 rounded-2xl w-[160px] h-[160px] flex items-center justify-center group overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
      </div>
      
      {/* 时钟表盘 */}
      <div className="relative w-[130px] h-[130px] rounded-full border-2 border-border/50 bg-background/80 shadow-inner group-hover:border-primary/30 transition-colors duration-300">
        
        {/* 外圈装饰 */}
        <div className="absolute inset-1 rounded-full border border-border/20"></div>
        
        {/* 时钟刻度 */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute bg-foreground/60",
              i % 3 === 0 ? "w-[2px]" : "w-[1px]"
            )}
            style={{
              height: i % 3 === 0 ? '10px' : '6px',
              left: '50%',
              top: '6px',
              transformOrigin: '50% 59px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}
        
        {/* 时钟数字 - 仅显示主要数字 */}
        {[12, 3, 6, 9].map((num) => {
          const angle = (num === 12 ? 0 : num * 30);
          const radian = (angle - 90) * (Math.PI / 180);
          const radius = 42;
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);
          
          return (
            <div
              key={num}
              className="absolute text-xs font-semibold text-foreground/80"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {num}
            </div>
          );
        })}
        
        {/* 时针 */}
        <motion.div
          className="absolute w-[3px] h-[32px] bg-foreground rounded-full origin-bottom"
          style={{
            left: 'calc(50% - 1.5px)',
            bottom: '50%',
          }}
          animate={{ rotate: hoursDegrees }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />

        {/* 分针 */}
        <motion.div
          className="absolute w-[2px] h-[42px] bg-foreground/80 rounded-full origin-bottom"
          style={{
            left: 'calc(50% - 1px)',
            bottom: '50%',
          }}
          animate={{ rotate: minutesDegrees }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />

        {/* 秒针 */}
        <motion.div
          className="absolute w-[1px] h-[48px] bg-primary rounded-full origin-bottom"
          style={{
            left: 'calc(50% - 0.5px)',
            bottom: '50%',
          }}
          animate={{ rotate: secondsDegrees }}
          transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        >
          {/* 秒针尾部 */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
        </motion.div>

        {/* 中心点 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-md">
          <div className="absolute inset-0.5 rounded-full bg-primary-foreground/20"></div>
        </div>
        
        {/* 内圈装饰 */}
        <div className="absolute inset-[35%] rounded-full border border-border/10"></div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </motion.div>
  );
}