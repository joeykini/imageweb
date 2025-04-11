"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ContactSettingsPage() {
  const router = useRouter();
  
  // 状态
  const [groupQrCode, setGroupQrCode] = useState<string | null>(null);
  const [personalQrCode, setPersonalQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // 文件上传引用
  const groupQrRef = useRef<HTMLInputElement>(null);
  const personalQrRef = useRef<HTMLInputElement>(null);
  
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
      // 检查是否存在微信群二维码图片
      const groupQrFetch = await fetch('/images/contact/wx_group.png');
      if (groupQrFetch.ok) {
        setGroupQrCode('/images/contact/wx_group.png');
      }
      
      // 检查是否存在个人微信二维码图片
      const personalQrFetch = await fetch('/images/contact/wechat-personal.png');
      if (personalQrFetch.ok) {
        setPersonalQrCode('/images/contact/wechat-personal.png');
      }
    } catch (error) {
      console.error('加载图片失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'group' | 'personal') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        setError("只支持PNG和JPEG格式的图片");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {  // 2MB
        setError("图片大小不能超过2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'group') {
          setGroupQrCode(result);
        } else {
          setPersonalQrCode(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 触发文件选择
  const triggerFileSelect = (type: 'group' | 'personal') => {
    if (type === 'group' && groupQrRef.current) {
      groupQrRef.current.click();
    } else if (type === 'personal' && personalQrRef.current) {
      personalQrRef.current.click();
    }
  };
  
  // 保存图片
  const saveImages = async () => {
    setIsSaving(true);
    setError("");
    
    try {
      const formData = new FormData();
      
      // 将DataURL转换为Blob并添加到FormData
      if (groupQrCode && groupQrCode.startsWith('data:')) {
        const blob = await fetch(groupQrCode).then(r => r.blob());
        formData.append('groupQrCode', blob, 'wx_group.png');
      }
      
      if (personalQrCode && personalQrCode.startsWith('data:')) {
        const blob = await fetch(personalQrCode).then(r => r.blob());
        formData.append('personalQrCode', blob, 'wechat-personal.png');
      }
      
      // 发送到服务器
      const response = await fetch('/api/admin/contact-images', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage("联系方式图片已成功更新");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.error || "更新图片失败");
      }
    } catch (error) {
      console.error('保存图片失败:', error);
      setError("保存图片失败，请稍后再试");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="max-w-[90rem] mx-auto px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-2xl font-bold mb-1">联系管理</h1>
        <p className="text-gray-500 text-sm">管理联系页面的二维码图片</p>
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
      
      {/* 图片上传部分 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">联系方式图片</h2>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            onClick={saveImages}
            disabled={isSaving || isLoading}
          >
            {isSaving ? '保存中...' : '保存更改'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 微信群二维码 */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">微信群二维码</h3>
            <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white mb-4">
              {isLoading ? (
                <div className="text-gray-400">加载中...</div>
              ) : groupQrCode ? (
                <div className="relative w-full h-full">
                  <Image
                    src={groupQrCode}
                    alt="WeChat Group QR Code"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-4"
                  />
                </div>
              ) : (
                <div className="text-gray-400">未上传图片</div>
              )}
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                ref={groupQrRef}
                onChange={(e) => handleFileChange(e, 'group')}
              />
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => triggerFileSelect('group')}
              >
                选择图片
              </button>
            </div>
          </div>
          
          {/* 个人微信二维码 */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">个人微信二维码</h3>
            <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white mb-4">
              {isLoading ? (
                <div className="text-gray-400">加载中...</div>
              ) : personalQrCode ? (
                <div className="relative w-full h-full">
                  <Image
                    src={personalQrCode}
                    alt="Personal WeChat QR Code"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-4"
                  />
                </div>
              ) : (
                <div className="text-gray-400">未上传图片</div>
              )}
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                ref={personalQrRef}
                onChange={(e) => handleFileChange(e, 'personal')}
              />
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => triggerFileSelect('personal')}
              >
                选择图片
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">联系页面预览</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">此功能允许您直接管理联系页面的二维码图片，上传的图片将显示在前台联系页面中。</p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">注意：</span> 请确保上传的二维码清晰可扫描，建议使用尺寸为至少300x300像素的PNG格式图片。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 