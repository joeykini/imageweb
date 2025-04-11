"use client";

import Link from 'next/link';
import Navbar from '../components/navbar';

export default function UserProfilePage() {
  return (
    <>
      <Navbar />
      <div className="max-w-[64rem] mx-auto px-4 pt-20 pb-6 sm:pt-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 左側選單 */}
          <div className="md:w-60 flex-shrink-0">
            <div className="space-y-2">
              <Link
                href="/settings/history"
                className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full justify-start text-left hover:bg-accent hover:text-accent-foreground"
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
                className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full justify-start text-left bg-accent text-accent-foreground hover:text-white"
              >
                个人信息
              </Link>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            <div className="p-6 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] background relative">
              <div className="p-6 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5 w-full">
                {/* 用户基本信息 */}
                <div className="flex flex-col items-center gap-2 mb-6">
                  <div className="w-full relative flex justify-center">
                    <img 
                      className="size-20 rounded-full" 
                      src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkk0YjNka2NGV1NENGRFODZBVEtjMnZqakUifQ" 
                      alt="User Avatar"
                    />
                  </div>
                  <h1 className="text-[1.0625rem] font-semibold text-center">迷藏 徒鹿</h1>
                </div>

                {/* 用户详细信息 */}
                <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">邮箱</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">joeykini@gmail.com</span>
                    </span>
                  </div>
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">最近登录</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">2025/4/5</span>
                    </span>
                  </div>
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">注册时间</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">2025/4/5</span>
                    </span>
                  </div>
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">用户 ID</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">user_2vI4b35fIuxlBSUL9ylIX8YwF0u</span>
                    </span>
                  </div>
                </div>

                {/* 积分信息 */}
                <h2 className="mt-6 mb-4 text-[0.9375rem] font-semibold">积分信息</h2>
                <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">可用积分</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">200</span>
                    </span>
                  </div>
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">本月消费</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">0</span>
                    </span>
                  </div>
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">交易次数</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">0</span>
                    </span>
                  </div>
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">账户类型</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">高级会员</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 