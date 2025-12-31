// src/app/api/revalidate/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function POST() {
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

    // 重新验证首页缓存
    revalidatePath('/');
    
    return NextResponse.json({
      success: true,
      message: '同步成功，页面缓存已更新',
      revalidatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('重新验证缓存失败:', error);
    return NextResponse.json(
      { success: false, error: '同步失败，请稍后重试' },
      { status: 500 }
    );
  }
}
