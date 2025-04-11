"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  // 检查是否在登录页面
  const isLoginPage = pathname === '/manage-system-c4xpz';
  
  // 如果是登录页面，则不显示布局
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 菜单项配置
  const menuItems = [
    { 
      title: '仪表盘', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', 
      path: '/manage-system-c4xpz/dashboard',
      badge: null
    },
    { 
      title: '用户管理', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', 
      path: '/manage-system-c4xpz/users',
      badge: null
    },
    { 
      title: 'API 设置', 
      icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', 
      path: '/manage-system-c4xpz/api-settings',
      badge: null
    },
    { 
      title: '支付设置', 
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z', 
      path: '/manage-system-c4xpz/payment-settings',
      badge: null
    },
    { 
      title: '联系管理', 
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', 
      path: '/manage-system-c4xpz/contact-settings',
      badge: null
    },
    { 
      title: '站点图标', 
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', 
      path: '/manage-system-c4xpz/icon-settings',
      badge: null
    }
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* 侧边栏标题 */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <Link href="/manage-system-c4xpz/dashboard" className="flex items-center gap-2">
              <Image src="/images/logo1.png" alt="Logo" width={32} height={32} />
              <span className="text-lg font-semibold">Image AI</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                管理后台
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/manage-system-c4xpz/dashboard" className="mx-auto">
              <Image src="/images/logo1.png" alt="Logo" width={32} height={32} />
            </Link>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="收起侧边栏"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 mx-auto mb-2"
              aria-label="展开侧边栏"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
        
        {/* 菜单项 */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-lg ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {!collapsed && (
                      <>
                        <span className="ml-3 flex-1 whitespace-nowrap">{item.title}</span>
                        {item.badge && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* 底部菜单 */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-4">
          <Link
            href="/"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            {!collapsed && <span className="ml-3">返回前台</span>}
          </Link>
        </div>
      </aside>

      {/* 主要内容区 */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">{menuItems.find(item => item.path === pathname)?.title || '管理后台'}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 搜索框 */}
            <div className="relative max-w-md hidden sm:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索..."
                className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* 管理员信息 */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">管理员</span>
            </div>
          </div>
        </header>
        
        {/* 页面内容 */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
        
        {/* 页脚 */}
        <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} Image AI. 版权所有.
          </p>
        </footer>
      </div>
    </div>
  );
} 