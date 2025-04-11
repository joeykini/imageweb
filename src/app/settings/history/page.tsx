"use client";

import React, { useEffect, useState } from 'react';
// 移除 useUser
// import { useUser } from '@clerk/nextjs';
import Navbar from '@/app/components/navbar';
import Image from 'next/image';
import Link from 'next/link';

// 定义生成记录的类型
interface GenerationRecord {
  id: string;
  createdAt: Date;
  prompt: string;
  imageUrl: string;
  model: string;
  style: string;
  status: string;
  points: number;
}

// 空的生成历史数据
const emptyGenerations: GenerationRecord[] = [];

// 模拟用户数据，直接使用一个对象
const mockUser = { 
  id: 'mock-user-id', 
  fullName: 'Mock User',
  username: 'mockuser' 
};

export default function HistoryPage() {
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('success');

  useEffect(() => {
    // 模拟从API加载数据
    const loadGenerations = async () => {
      setIsLoading(true);
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 返回空数组，表示没有生成记录
      setGenerations(emptyGenerations);
      setIsLoading(false);
    };

    loadGenerations();
  }, []);

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-[64rem] mx-auto px-4 pt-20 pb-6 sm:pt-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 左侧菜单 */}
          <div className="md:w-60 flex-shrink-0">
            <div className="space-y-2">
              <Link
                href="/settings/history"
                className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full justify-start text-left bg-accent text-accent-foreground hover:text-white"
              >
                生成历史
              </Link>
              <Link
                href="/settings/recharge"
                className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full justify-start text-left hover:bg-accent hover:text-accent-foreground"
              >
                余额充值
              </Link>
              <Link
                href="/settings/orders"
                className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full justify-start text-left hover:bg-accent hover:text-accent-foreground"
              >
                订单历史
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full justify-start text-left hover:bg-accent hover:text-accent-foreground"
              >
                个人信息
              </Link>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            <div className="p-8 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] background relative">
              <div className="p-8 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5 w-full">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : generations.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[0.9375rem] font-semibold">生成历史</h2>
                        <p className="text-xs text-blue-500 font-medium">请及时存储图片到本地</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-10 w-10 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent hover:text-accent-foreground'}`}
                          onClick={() => setViewMode('list')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list h-4 w-4">
                            <path d="M3 12h.01"></path>
                            <path d="M3 18h.01"></path>
                            <path d="M3 6h.01"></path>
                            <path d="M8 12h13"></path>
                            <path d="M8 18h13"></path>
                            <path d="M8 6h13"></path>
                          </svg>
                        </button>
                        <button
                          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-10 w-10 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent hover:text-accent-foreground'}`}
                          onClick={() => setViewMode('grid')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid3x3 h-4 w-4">
                            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                            <path d="M3 9h18"></path>
                            <path d="M3 15h18"></path>
                            <path d="M9 3v18"></path>
                            <path d="M15 3v18"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          状态
                        </label>
                        <button 
                          type="button" 
                          role="combobox" 
                          aria-expanded="false" 
                          aria-autocomplete="none" 
                          dir="ltr" 
                          data-state="closed" 
                          className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full"
                          onClick={() => {/* 切换选项 */}}
                        >
                          <span style={{ pointerEvents: 'none' }}>成功</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 opacity-50" aria-hidden="true">
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          时间范围
                        </label>
                        <div className="flex gap-2">
                          <button 
                            className="inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1 justify-start text-left font-normal text-muted-foreground"
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            data-state="closed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar mr-2 h-4 w-4">
                              <path d="M8 2v4"></path>
                              <path d="M16 2v4"></path>
                              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                              <path d="M3 10h18"></path>
                            </svg>
                            选择时间范围
                          </button>
                          <button 
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 shrink-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search h-4 w-4">
                              <circle cx="11" cy="11" r="8"></circle>
                              <path d="m21 21-4.3-4.3"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* 这里渲染生成记录 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-min">
                      {/* 遍历生成记录渲染列表 */}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4">
                        <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                        <circle cx="12" cy="9.5" r="3.5"></circle>
                        <path d="M12 13v8"></path>
                        <path d="M8 21h8"></path>
                      </svg>
                      <h2 className="text-xl font-semibold mb-2">暂无生成记录</h2>
                      <p className="text-gray-600 mb-6">去创造页面开始生成您的第一张图片吧！</p>
                      <Link 
                        href="/create" 
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        开始创造
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 