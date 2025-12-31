// src/components/ui/AuthButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, Shield, RefreshCw, Plus } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { AddLinkModal } from './AddLinkModal';

interface Category {
  name: string;
}

export function AuthButton() {
  const { isAdmin, isLoading, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // 获取分类列表
  useEffect(() => {
    if (isAdmin) {
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          // 从配置中获取分类，或者使用默认分类
          if (data.categories) {
            setCategories(data.categories);
          }
        })
        .catch(err => console.error('获取分类失败:', err));
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    await logout();
    // 刷新页面以重新获取数据
    window.location.reload();
  };

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 同步成功后刷新页面
        window.location.reload();
      } else {
        alert(data.error || '同步失败');
      }
    } catch (error) {
      console.error('同步失败:', error);
      alert('同步失败，请稍后重试');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddSuccess = () => {
    // 添加成功后同步并刷新
    handleSync();
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (isAdmin) {
    return (
      <>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Shield className="w-3 h-3" />
            管理员
          </span>
          <button
            onClick={() => setShowAddLinkModal(true)}
            className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title="添加书签"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">添加</span>
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
            title="从 Notion 同步书签"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? '同步中' : '同步'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">退出</span>
          </button>
        </div>
        <AddLinkModal
          isOpen={showAddLinkModal}
          onClose={() => setShowAddLinkModal(false)}
          onSuccess={handleAddSuccess}
          categories={categories}
        />
      </>
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
