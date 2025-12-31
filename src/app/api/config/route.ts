// src/app/api/config/route.ts
import { getWebsiteConfig, getCategories } from '@/lib/notion';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [config, categories] = await Promise.all([
      getWebsiteConfig(),
      getCategories(),
    ]);
    
    return NextResponse.json({
      ...config,
      categories: categories.map(cat => ({ name: cat.name })),
    });
  } catch (error) {
    console.error('获取配置失败:', error);
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    );
  }
}
