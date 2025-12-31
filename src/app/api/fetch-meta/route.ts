// src/app/api/fetch-meta/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL 不能为空' },
        { status: 400 }
      );
    }

    // 获取网页内容
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    const html = await response.text();
    
    // 提取标题
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // 提取图标
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    
    // 尝试多种图标格式
    let icon = '';
    
    // 1. 查找 link rel="icon" 或 rel="shortcut icon"
    const iconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i) ||
                      html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i);
    
    // 2. 查找 apple-touch-icon
    const appleIconMatch = html.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i) ||
                           html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon["']/i);
    
    if (iconMatch) {
      icon = iconMatch[1];
    } else if (appleIconMatch) {
      icon = appleIconMatch[1];
    }
    
    // 处理相对路径
    if (icon) {
      if (icon.startsWith('//')) {
        icon = `${urlObj.protocol}${icon}`;
      } else if (icon.startsWith('/')) {
        icon = `${baseUrl}${icon}`;
      } else if (!icon.startsWith('http')) {
        icon = `${baseUrl}/${icon}`;
      }
    } else {
      // 默认使用 favicon.ico
      icon = `${baseUrl}/favicon.ico`;
    }

    return NextResponse.json({
      success: true,
      title,
      icon,
    });
  } catch (error) {
    console.error('获取网站元数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取网站信息失败' },
      { status: 500 }
    );
  }
}
