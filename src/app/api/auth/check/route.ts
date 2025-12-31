// src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    
    if (token) {
      return NextResponse.json({ 
        isAdmin: true,
        message: '已登录' 
      });
    }
    
    return NextResponse.json({ 
      isAdmin: false,
      message: '未登录' 
    });
  } catch (error) {
    console.error('检查认证状态失败:', error);
    return NextResponse.json(
      { isAdmin: false, error: '检查认证状态失败' },
      { status: 500 }
    );
  }
}
