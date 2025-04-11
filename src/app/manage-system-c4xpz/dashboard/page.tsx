"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // 檢查是否已登錄
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/manage-system-c4xpz');
    }
  }, [router]);
  
  // 獲取用戶總數
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/users/list');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.users)) {
          setUserCount(data.users.length);
        } else {
          console.error('獲取用戶列表失敗:', data.error || '未知錯誤');
        }
      } catch (error) {
        console.error('獲取用戶列表出錯:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCount();
  }, []);
  
  const handleLogout = () => {
    localStorage.setItem('adminLoggedIn', 'false');
    router.push('/manage-system-c4xpz');
  };
  
  return (
    <div>
      {/* 歡迎區塊 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">歡迎回來，管理員</h1>
        <p className="text-gray-500">以下是系統的概覽情況</p>
      </div>
      
      {/* 主要統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-sm font-medium text-gray-500">總用戶數</h3>
                <div className="mt-1 flex items-baseline">
                  {isLoading ? (
                    <span className="text-2xl font-semibold text-gray-400">加載中...</span>
                  ) : (
                    <>
                      <span className="text-2xl font-semibold text-gray-900">{userCount}</span>
                      {/* 可選的增長指標 */}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-sm font-medium text-gray-500">本月收入</h3>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-gray-900">¥0</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-1"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-sm font-medium text-gray-500">生成圖像</h3>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-gray-900">0</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-1"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-sm font-medium text-gray-500">系統狀態</h3>
                <div className="mt-1 flex items-baseline">
                  <span className="text-lg font-semibold text-gray-900">運行正常</span>
                  <span className="ml-2 h-3 w-3 rounded-full bg-green-500"></span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-1"></div>
        </div>
      </div>
      
      {/* 圖表和快速操作區 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">收入趨勢</h2>
            <div className="flex space-x-2">
              <div className="text-sm text-gray-500 px-2 py-1 bg-gray-50 rounded border">
                數據接入中...
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <p className="mt-2">數據統計模塊待接入</p>
              <p className="text-sm">請先添加和管理用戶數據</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">快速操作</h2>
          
          <div className="space-y-4">
            <Link href="/manage-system-c4xpz/users/add" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">新增用戶</h3>
                <p className="text-sm text-gray-500">手動添加新用戶</p>
              </div>
            </Link>
            
            <Link href="/manage-system-c4xpz/api-settings" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">API 設置</h3>
                <p className="text-sm text-gray-500">設置和管理 API 連接</p>
              </div>
            </Link>
            
            <Link href="/manage-system-c4xpz/payment-settings" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">支付設置</h3>
                <p className="text-sm text-gray-500">管理支付方式和價格</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* 最近活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">最近活動</h2>
            <div className="text-sm text-gray-500">暫無記錄</div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-h-[200px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <p className="mt-2">暫無活動記錄</p>
                <p className="text-sm">用戶活動將在此顯示</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">用戶增長</h2>
            <div className="text-sm text-gray-500">數據接入中</div>
          </div>
          
          <div className="min-h-[200px] flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="mt-2">統計數據待接入</p>
              <p className="text-sm">用戶增長趨勢將在此顯示</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 