// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    const adminName = process.env.ADMIN_NAME;
    const adminPwd = process.env.ADMIN_PWD;
    
    if (!adminName || !adminPwd) {
      return NextResponse.json(
        { error: '服务器配置错误' },
        { status: 500 }
      );
    }
    
    if (username === adminName && password === adminPwd) {
      // 创建简单的认证token（生产环境建议使用JWT）
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      // 设置cookie
      const cookieStore = await cookies();
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7天
        path: '/',
      });
      
      return NextResponse.json({ 
        success: true, 
        message: '登录成功',
        isAdmin: true 
      });
    }
    
    return NextResponse.json(
      { error: '用户名或密码错误' },
      { status: 401 }
    );
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
