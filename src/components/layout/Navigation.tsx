'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { AuthButton } from '@/components/ui/AuthButton'
import * as Icons from 'lucide-react'
import { WebsiteConfig } from '@/types/notion'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

interface Category {
  id: string
  name: string
  iconName?: string
  subCategories: {
    id: string
    name: string
  }[]
}

interface NavigationProps {
  categories: Category[]
  config: WebsiteConfig
}

const defaultConfig: WebsiteConfig = {
  SOCIAL_GITHUB: '',
  SOCIAL_BLOG: '',
  SOCIAL_X: '',
  SOCIAL_JIKE: '',
  SOCIAL_WEIBO: ''
}

export default function Navigation({ categories, config = defaultConfig }: NavigationProps) {
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const { theme } = useTheme()

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // 处理导航点击
  const handleNavClick = (categoryId: string, subCategoryId?: string) => {
    setActiveCategory(categoryId)
    
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    const elementId = subCategoryId ? `${categoryId}-${subCategoryId}` : categoryId
    const element = document.getElementById(elementId)
    
    if (element) {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const targetTop = rect.top + scrollTop - 100
      
      const root = document.documentElement
      const previousScrollBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo({ top: targetTop, behavior: 'auto' })
      root.style.scrollBehavior = previousScrollBehavior
    }
  }

  useEffect(() => {
    if (categories.length > 0 && activeCategory === '') {
      setActiveCategory(categories[0].id)
    }
  }, [categories, activeCategory])

  return (
    <>
      {/* 移动端顶部导航 - 禅意风格 */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            {/* 印章风格Logo */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-primary rounded-sm rotate-3"></div>
              <span className="text-primary font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                {config.SITE_TITLE?.charAt(0) || '禅'}
              </span>
            </div>
            <span className="neon-title text-base">{config.SITE_TITLE}</span>
          </div>
          <div className="flex items-center gap-2">
            <AuthButton />
            {config.SHOW_THEME_SWITCHER !== 'false' && <ThemeSwitcher />}
          </div>
        </div>
        
        {/* 分类滚动条 - 水墨风格 */}
        <div className="relative overflow-x-auto scrollbar-none border-t border-border/30">
          <div className="flex items-center h-11 px-4 gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNavClick(category.id)}
                className={cn(
                  "relative whitespace-nowrap px-4 py-1.5 text-sm rounded-full transition-all duration-300 shrink-0",
                  "font-medium tracking-wide",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {category.name}
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          {/* 渐变遮罩 */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
        </div>
      </nav>

      {/* 桌面端侧边导航 - 禅意风格 */}
      <nav className="hidden lg:flex flex-col w-[280px] flex-shrink-0 h-screen sticky top-0 border-r border-border/50 bg-background/80 backdrop-blur-sm">
        {/* 顶部Logo区域 */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 印章风格Logo */}
              <motion.div 
                className="relative w-10 h-10 flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute inset-0 border-2 border-primary rounded-sm rotate-3"></div>
                <div className="absolute inset-0 border border-primary/30 rounded-sm -rotate-2"></div>
                <span className="text-primary font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  {config.SITE_TITLE?.charAt(0) || '禅'}
                </span>
              </motion.div>
              <div>
                <h1 className="neon-title text-lg leading-tight">{config.SITE_TITLE}</h1>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                  书签导航
                </p>
              </div>
            </div>
            {config.SHOW_THEME_SWITCHER !== 'false' && <ThemeSwitcher />}
          </div>
          
          {/* 认证按钮 */}
          <div className="mt-4 flex justify-end">
            <AuthButton />
          </div>
        </div>

        {/* 分类列表 */}
        <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <ul className="space-y-1">
            {categories.map((category, index) => {
              const IconComponent = category.iconName && (category.iconName in Icons)
                ? (Icons[category.iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>)
                : Icons.Bookmark

              const isExpanded = expandedCategories.has(category.id)

              return (
                <motion.li 
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col">
                    {/* 主分类按钮 */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={cn(
                        "group w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300",
                        isExpanded
                          ? "bg-accent/80 shadow-sm"
                          : "hover:bg-accent/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                          isExpanded 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary"
                        )}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span 
                          className={cn(
                            "font-medium transition-colors duration-300",
                            isExpanded ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                          )}
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {category.name}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icons.ChevronDown className={cn(
                          "w-4 h-4 transition-colors",
                          isExpanded ? "text-primary" : "text-muted-foreground"
                        )} />
                      </motion.div>
                    </button>

                    {/* 子分类列表 */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden ml-4 mt-1 space-y-0.5 border-l-2 border-border/50 pl-4"
                        >
                          {category.subCategories.map((subCategory, subIndex) => (
                            <motion.li 
                              key={subCategory.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subIndex * 0.03 }}
                            >
                              <button
                                onClick={() => handleNavClick(category.id, subCategory.id)}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm",
                                  "hover:bg-accent/50 hover:text-foreground",
                                  activeCategory === `${category.id}-${subCategory.id}`
                                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary -ml-[2px] pl-[14px]"
                                    : "text-muted-foreground"
                                )}
                              >
                                {subCategory.name}
                              </button>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* 底部装饰 */}
        <div className="p-4 border-t border-border/30">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span style={{ fontFamily: 'var(--font-display)' }}>静心 · 专注 · 效率</span>
          </div>
        </div>
      </nav>
    </>
  )
}
