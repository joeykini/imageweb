"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function IconSettingsPage() {
  const router = useRouter();
  
  // 状态
  const [favicon, setFavicon] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [appleTouchIcon, setAppleTouchIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // 文件上传引用
  const faviconRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const appleTouchIconRef = useRef<HTMLInputElement>(null);
  
  // 加载现有图片
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/manage-system-c4xpz');
    } else {
      loadImages();
    }
  }, [router]);
  
  // 加载图片
  const loadImages = async () => {
    setIsLoading(true);
    
    try {
      // 检查是否存在favicon图标
      const faviconFetch = await fetch('/favicon.ico');
      if (faviconFetch.ok) {
        setFavicon('/favicon.ico');
      }
      
      // 检查是否存在网站logo
      const logoFetch = await fetch('/images/logo.png');
      if (logoFetch.ok) {
        setLogo('/images/logo.png');
      }
      
      // 检查是否存在Apple Touch图标
      const appleTouchFetch = await fetch('/images/icons/apple-touch-icon.png');
      if (appleTouchFetch.ok) {
        setAppleTouchIcon('/images/icons/apple-touch-icon.png');
      }
    } catch (error) {
      console.error('加载图片失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'favicon' | 'logo' | 'apple') => {
    const file = event.target.files?.[0];
    if (file) {
      // favicon接受.ico文件，其他接受图片文件
      if (type === 'favicon' && !file.name.endsWith('.ico') && !file.type.includes('image/')) {
        setError("favicon请上传.ico文件或PNG图片");
        return;
      } else if (type !== 'favicon' && !file.type.includes('image/')) {
        setError("请上传图片文件");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {  // 2MB
        setError("图片大小不能超过2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'favicon') {
          setFavicon(result);
        } else if (type === 'logo') {
          setLogo(result);
        } else {
          setAppleTouchIcon(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 触发文件选择
  const triggerFileSelect = (type: 'favicon' | 'logo' | 'apple') => {
    if (type === 'favicon' && faviconRef.current) {
      faviconRef.current.click();
    } else if (type === 'logo' && logoRef.current) {
      logoRef.current.click();
    } else if (type === 'apple' && appleTouchIconRef.current) {
      appleTouchIconRef.current.click();
    }
  };
  
  // 保存图片
  const saveImages = async () => {
    setIsSaving(true);
    setError("");
    
    try {
      const formData = new FormData();
      
      // 将DataURL转换为Blob并添加到FormData
      if (favicon && favicon.startsWith('data:')) {
        const blob = await fetch(favicon).then(r => r.blob());
        formData.append('favicon', blob, 'favicon.ico');
      }
      
      if (logo && logo.startsWith('data:')) {
        const blob = await fetch(logo).then(r => r.blob());
        formData.append('logo', blob, 'logo.png');
      }
      
      if (appleTouchIcon && appleTouchIcon.startsWith('data:')) {
        const blob = await fetch(appleTouchIcon).then(r => r.blob());
        formData.append('appleTouchIcon', blob, 'apple-touch-icon.png');
      }
      
      // 发送到服务器
      const response = await fetch('/api/admin/site-icons', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage("站点图标已成功更新");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.error || "更新图标失败");
      }
    } catch (error) {
      console.error('保存图标失败:', error);
      setError("保存图标失败，请稍后再试");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="max-w-[90rem] mx-auto px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-2xl font-bold mb-1">站点图标设置</h1>
        <p className="text-gray-500 text-sm">管理网站图标和Logo</p>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 成功提示 */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 图标上传部分 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">站点图标管理</h2>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            onClick={saveImages}
            disabled={isSaving || isLoading}
          >
            {isSaving ? '保存中...' : '保存更改'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Favicon */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">网站图标 (Favicon)</h3>
            <p className="text-sm text-gray-500 mb-4">显示在浏览器标签页上的小图标</p>
            
            <div className="h-[150px] w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white mb-4">
              {isLoading ? (
                <div className="text-gray-400">加载中...</div>
              ) : favicon ? (
                <div className="relative h-[48px] w-[48px]">
                  <Image
                    src={favicon}
                    alt="Favicon"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="text-gray-400">未上传图标</div>
              )}
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                accept=".ico,image/png,image/x-icon"
                className="hidden"
                ref={faviconRef}
                onChange={(e) => handleFileChange(e, 'favicon')}
              />
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => triggerFileSelect('favicon')}
              >
                选择图标
              </button>
            </div>
          </div>
          
          {/* Logo */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">网站Logo</h3>
            <p className="text-sm text-gray-500 mb-4">显示在网站顶部的Logo图片</p>
            
            <div className="h-[150px] w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white mb-4">
              {isLoading ? (
                <div className="text-gray-400">加载中...</div>
              ) : logo ? (
                <div className="relative h-full w-full p-4">
                  <Image
                    src={logo}
                    alt="Website Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div className="text-gray-400">未上传Logo</div>
              )}
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                ref={logoRef}
                onChange={(e) => handleFileChange(e, 'logo')}
              />
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => triggerFileSelect('logo')}
              >
                选择Logo
              </button>
            </div>
          </div>
          
          {/* Apple Touch Icon */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Apple Touch 图标</h3>
            <p className="text-sm text-gray-500 mb-4">iOS设备添加到主屏幕时显示的图标</p>
            
            <div className="h-[150px] w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white mb-4">
              {isLoading ? (
                <div className="text-gray-400">加载中...</div>
              ) : appleTouchIcon ? (
                <div className="relative h-[120px] w-[120px]">
                  <Image
                    src={appleTouchIcon}
                    alt="Apple Touch Icon"
                    width={120}
                    height={120}
                    className="rounded-[22px] object-contain"
                  />
                </div>
              ) : (
                <div className="text-gray-400">未上传图标</div>
              )}
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/png"
                className="hidden"
                ref={appleTouchIconRef}
                onChange={(e) => handleFileChange(e, 'apple')}
              />
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => triggerFileSelect('apple')}
              >
                选择图标
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">站点图标说明</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">站点图标是网站身份的重要组成部分，推荐上传以下格式的图标：</p>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
              <li><span className="font-medium">网站图标 (Favicon):</span> 32x32像素的.ico文件或PNG图片</li>
              <li><span className="font-medium">网站Logo:</span> 透明背景的PNG或SVG图片，建议宽度至少200像素</li>
              <li><span className="font-medium">Apple Touch图标:</span> 180x180像素的PNG图片，圆角会自动添加</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 