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
      {/* 移动端顶部导航 - 现代精致风格 */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-lg">
                {config.SITE_TITLE?.charAt(0) || 'B'}
              </span>
            </div>
            <span className="text-lg font-black tracking-tighter">{config.SITE_TITLE}</span>
          </div>
          <div className="flex items-center gap-3">
            <AuthButton />
            {config.SHOW_THEME_SWITCHER !== 'false' && <ThemeSwitcher />}
          </div>
        </div>
        
        {/* 分类滚动条 */}
        <div className="relative overflow-x-auto scrollbar-none border-t border-border/10">
          <div className="flex items-center h-12 px-4 gap-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleNavClick(category.id)}
                className={cn(
                  "relative whitespace-nowrap px-5 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shrink-0",
                  activeCategory === category.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {category.name}
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 桌面端侧边导航 - 现代精致风格 */}
      <nav className="hidden lg:flex flex-col w-[280px] flex-shrink-0 h-screen sticky top-0 border-r border-border/50 bg-card/30 backdrop-blur-xl">
        {/* 顶部Logo区域 */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative w-12 h-12 flex items-center justify-center bg-primary rounded-2xl shadow-xl shadow-primary/20"
                whileHover={{ scale: 1.05, rotate: -5 }}
              >
                <span className="text-primary-foreground font-black text-2xl">
                  {config.SITE_TITLE?.charAt(0) || 'B'}
                </span>
              </motion.div>
              <div>
                <h1 className="text-xl font-black tracking-tighter leading-none">{config.SITE_TITLE}</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1.5">
                  Dashboard
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-2xl bg-secondary/50 border border-border/50">
            <AuthButton />
            {config.SHOW_THEME_SWITCHER !== 'false' && <ThemeSwitcher />}
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
                        "group w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300",
                        isExpanded
                          ? "bg-primary/5 shadow-inner"
                          : "hover:bg-secondary/80"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                          isExpanded
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-bold tracking-tight transition-colors duration-300",
                            isExpanded ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )}
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
        <div className="p-8 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary text-center">
              Stay Focused
            </p>
          </div>
        </div>
      </nav>
    </>
  )
}
