// src/components/ui/AddLinkModal.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Loader2, Search } from 'lucide-react';

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
  const [isFetching, setIsFetching] = useState(false);
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

  // 获取网站元数据
  const fetchMeta = useCallback(async (url: string) => {
    if (!url || isFetching) return;
    
    try {
      new URL(url);
    } catch {
      return; // URL 格式不正确，不获取
    }

    setIsFetching(true);
    try {
      const response = await fetch('/api/fetch-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          name: prev.name || data.title || '',
          iconlink: prev.iconlink || data.icon || '',
        }));
      }
    } catch (err) {
      console.error('获取网站信息失败:', err);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  // URL 输入失焦时自动获取
  const handleUrlBlur = () => {
    if (formData.url && !formData.name) {
      fetchMeta(formData.url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加书签
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          {/* URL - 放在最前面 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                onBlur={handleUrlBlur}
                className="flex-1 px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com"
                required
              />
              <button
                type="button"
                onClick={() => fetchMeta(formData.url)}
                disabled={isFetching || !formData.url}
                className="px-3 py-2 border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                title="获取网站信息"
              >
                {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">输入 URL 后点击搜索按钮自动获取名称和图标</p>
          </div>

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

          {/* 图标链接 */}
          <div>
            <label className="block text-sm font-medium mb-1">图标链接</label>
            <div className="flex gap-2 items-center">
              {formData.iconlink && (
                <img 
                  src={formData.iconlink} 
                  alt="icon" 
                  className="w-8 h-8 rounded object-contain bg-white"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <input
                type="url"
                value={formData.iconlink}
                onChange={(e) => setFormData({ ...formData, iconlink: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/icon.png"
              />
            </div>
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
                <option key={cat.name} value={cat.name}>{cat.name}</option>
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

          {/* 仅管理员可见 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAdminOnly"
              checked={formData.isAdminOnly}
              onChange={(e) => setFormData({ ...formData, isAdminOnly: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="isAdminOnly" className="text-sm">仅管理员可见</label>
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
                <><Loader2 className="w-4 h-4 animate-spin" />添加中...</>
              ) : (
                <><Plus className="w-4 h-4" />添加</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
