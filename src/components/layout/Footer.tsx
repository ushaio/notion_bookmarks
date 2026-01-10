'use client'

import { WebsiteConfig } from '@/types/notion'
import { FaGithub, FaXTwitter, FaWeibo } from 'react-icons/fa6'
import { FaBlogger } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface FooterProps {
  config: WebsiteConfig
  className?: string
}

export default function Footer({ config, className = "" }: FooterProps) {
  const socialLinks = [
    { key: 'github', url: config.SOCIAL_GITHUB, icon: FaGithub, title: 'GitHub' },
    { key: 'blog', url: config.SOCIAL_BLOG, icon: FaBlogger, title: 'Blog' },
    { key: 'x', url: config.SOCIAL_X, icon: FaXTwitter, title: 'X (Twitter)' },
    { key: 'weibo', url: config.SOCIAL_WEIBO, icon: FaWeibo, title: '微博' },
  ].filter(link => link.url);

  return (
    <footer className={cn(
      "fixed bottom-0 left-0 right-0 z-10",
      "bg-background/80 backdrop-blur-md border-t border-border/30",
      "py-4",
      className
    )}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* 社交链接 */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  "bg-muted/50 text-muted-foreground",
                  "hover:bg-primary/10 hover:text-primary",
                  "transition-colors duration-300",
                  "border border-transparent hover:border-primary/20"
                )}
                title={link.title}
              >
                <link.icon className="w-4 h-4" />
              </motion.a>
            ))}
            
            {/* 即刻 */}
            {config.SOCIAL_JIKE && (
              <motion.a
                href={config.SOCIAL_JIKE}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: socialLinks.length * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  "bg-muted/50",
                  "hover:bg-primary/10",
                  "transition-colors duration-300",
                  "border border-transparent hover:border-primary/20"
                )}
                title="即刻"
              >
                <img
                  src="/logo_jike.png"
                  alt="即刻"
                  width={18}
                  height={18}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </motion.a>
            )}
            
            {/* 小红书 */}
            {config.SOCIAL_XIAOHONGSHU && (
              <motion.a
                href={config.SOCIAL_XIAOHONGSHU}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (socialLinks.length + 1) * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  "bg-muted/50",
                  "hover:bg-primary/10",
                  "transition-colors duration-300",
                  "border border-transparent hover:border-primary/20"
                )}
                title="小红书"
              >
                <img
                  src="/xhs_logo.svg"
                  alt="小红书"
                  width={18}
                  height={18}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </motion.a>
            )}
          </div>
          
          {/* 版权信息 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-1 md:flex-row md:gap-4"
          >
            <p 
              className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-primary fill-primary/20" />
              <span>Next.js & Notion</span>
            </p>
            <div className="hidden md:block w-px h-4 bg-border/50"></div>
            <p 
              className="text-sm text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              © {new Date().getFullYear()} {config.SITE_AUTHOR}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}