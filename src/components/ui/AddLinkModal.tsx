// src/components/ui/AddLinkModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categories?: { name: string }[];
}

export function AddLinkModal({ isOpen, onClose, onSuccess, categories = [] }: AddLinkModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    desc: '',
    category1: '',
    category2: '',
    iconlink: '',
    isAdminOnly: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        url: '',
        desc: '',
        category1: categories[0]?.name || '',
        category2: '',
        iconlink: '',
        isAdminOnly: false,
      });
      setError('');
    }
  }, [isOpen, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        onSuccess?.();
      } else {
        setError(data.error || '添加失败');
      }
    } catch (err) {
      console.error('添加书签失败:', err);
      setError('添加失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 模态框 */}
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加书签
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          {/* 名称 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="网站名称"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium mb-1">描述</label>
            <textarea
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="简短描述"
              rows={2}
            />
          </div>

          {/* 一级分类 */}
          <div>
            <label className="block text-sm font-medium mb-1">一级分类</label>
            <select
              value={formData.category1}
              onChange={(e) => setFormData({ ...formData, category1: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">选择分类</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 二级分类 */}
          <div>
            <label className="block text-sm font-medium mb-1">二级分类</label>
            <input
              type="text"
              value={formData.category2}
              onChange={(e) => setFormData({ ...formData, category2: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="输入二级分类"
            />
          </div>

          {/* 图标链接 */}
          <div>
            <label className="block text-sm font-medium mb-1">图标链接</label>
            <input
              type="url"
              value={formData.iconlink}
              onChange={(e) => setFormData({ ...formData, iconlink: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/icon.png"
            />
          </div>

          {/* 仅管理员可见 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAdminOnly"
              checked={formData.isAdminOnly}
              onChange={(e) => setFormData({ ...formData, isAdminOnly: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="isAdminOnly" className="text-sm">
              仅管理员可见
            </label>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  添加中...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  添加
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
