// src/app/page.tsx
import Navigation from '@/components/layout/Navigation';
import { getLinks, getCategories, getWebsiteConfig } from '@/lib/notion';
import Footer from '@/components/layout/Footer';
import { SimpleTime, AnalogClock, HotNews } from '@/components/widgets';
import WidgetsContainer from '@/components/layout/WidgetsContainer';
import ContentArea from '@/components/layout/ContentArea';
import React from 'react';

export const revalidate = 43200; // 12小时重新验证一次

export default async function HomePage() {
  // 获取数据
  const [notionCategories, links, config] = await Promise.all([
    getCategories(),
    getLinks(),
    getWebsiteConfig(),
  ]);

  // 获取启用的分类名称集合
  const enabledCategories = new Set(notionCategories.map(cat => cat.name));

  // 处理链接数据，只保留启用分类中的链接
  const processedLinks = links
    .map(link => ({
      ...link,
      category1: link.category1 || '未分类',
      category2: link.category2 || '默认'
    }))
    .filter(link => enabledCategories.has(link.category1));

  // 获取有链接的分类集合
  const categoriesWithLinks = new Set(processedLinks.map(link => link.category1));

  // 过滤掉没有链接的分类
  const activeCategories = notionCategories.filter(category => 
    categoriesWithLinks.has(category.name)
  );

  // 为 Notion 分类添加子分类信息
  const categoriesWithSubs = activeCategories.map(category => {
    const subCategories = new Set(
      processedLinks
        .filter(link => link.category1 === category.name)
        .map(link => link.category2)
    );

    return {
      ...category,
      subCategories: Array.from(subCategories).map(subCat => ({
        id: subCat.toLowerCase().replace(/\s+/g, '-'),
        name: subCat
      }))
    };
  });

  const widgetMap: Record<string, React.ReactNode> = {
    '简易时钟': <SimpleTime />,
    '圆形时钟': <AnalogClock />,
    '热搜': <HotNews />,
  };
  
  const widgetConfig = config.WIDGET_CONFIG?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
  const widgets = widgetConfig
    .map((name, idx) => {
      const Comp = widgetMap[name];
      if (!Comp) return null;
      return <React.Fragment key={name + '-' + idx}>{Comp}</React.Fragment>;
    })
    .filter(Boolean);

  // 构建 widgets 容器
  const widgetsElement = widgets.length > 0 ? (
    <WidgetsContainer>
      {widgets}
    </WidgetsContainer>
  ) : null;

  return (
    <div className="min-h-screen bg-background relative">
      {/* 现代感背景装饰 - 极光/网格效果 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px] animate-pulse-soft delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* 移动端顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-30 lg:hidden">
        <Navigation categories={categoriesWithSubs} config={config} />
      </nav>
      
      {/* PC端侧边栏导航 */}
      <aside className="fixed left-0 top-0 w-[280px] h-screen z-20 hidden lg:block">
        <Navigation categories={categoriesWithSubs} config={config} />
      </aside>
      
      {/* 主内容区域 */}
      <main className="relative ml-0 lg:ml-[280px] pt-[112px] lg:pt-0 min-h-screen">
        <ContentArea
          initialLinks={processedLinks}
          enabledCategories={enabledCategories}
          categories={activeCategories}
          widgets={widgetsElement}
        />
      </main>
      
      {/* 页脚 */}
      <Footer config={config} className="ml-0 lg:ml-[280px]" />
    </div>
  );
}