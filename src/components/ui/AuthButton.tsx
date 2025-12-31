// src/components/ui/AuthButton.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, Shield } from 'lucide-react';
import { LoginModal } from './LoginModal';

export function AuthButton() {
  const { isAdmin, isLoading, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    // 刷新页面以重新获取数据
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <Shield className="w-3 h-3" />
          管理员
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          title="退出登录"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">退出</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        title="管理员登录"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">登录</span>
      </button>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}
