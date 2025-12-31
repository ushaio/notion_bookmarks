// src/app/api/links/route.ts
import { getLinks, createLink, CreateLinkInput } from '@/lib/notion';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const links = await getLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error('获取链接失败:', error);
    return NextResponse.json(
      { error: '获取链接失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '未授权，请先登录' },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json() as CreateLinkInput;
    
    // 验证必填字段
    if (!body.name || !body.url) {
      return NextResponse.json(
        { success: false, error: '名称和URL为必填项' },
        { status: 400 }
      );
    }

    // 验证URL格式
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'URL格式不正确' },
        { status: 400 }
      );
    }

    // 创建书签
    const result = await createLink(body);
    
    return NextResponse.json({
      success: true,
      message: '书签添加成功',
      id: result.id,
    });
  } catch (error) {
    console.error('添加书签失败:', error);
    return NextResponse.json(
      { success: false, error: '添加书签失败，请稍后重试' },
      { status: 500 }
    );
  }
}
