"use client";

import Link from 'next/link';
import Navbar from '../../components/navbar';

export default function RechargePage() {
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
                className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full justify-start text-left bg-accent text-accent-foreground hover:text-white"
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
                <h2 className="text-[0.9375rem] font-semibold mb-6">充值中心</h2>
                <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0] mb-8">
                  <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
                    <span className="text-xs font-semibold block flex-shrink-0">当前积分</span>
                    <span className="text-xs text-[#7D7D7E] font-mono block relative">
                      <span className="block truncate w-full">200</span>
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg border border-[#EDEDED] hover:border-primary transition-colors cursor-pointer">
                    <h3 className="text-lg font-semibold mb-2">新手套装</h3>
                    <p className="text-sm text-muted-foreground mb-4">10元 = 1000积分</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥10</span>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">立即充值</button>
                    </div>
                  </div>
                  <div className="p-6 rounded-lg border border-[#EDEDED] hover:border-primary transition-colors cursor-pointer">
                    <h3 className="text-lg font-semibold mb-2">专业套餐</h3>
                    <p className="text-sm text-muted-foreground mb-4">50 元 = 5500 积分</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥50</span>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">立即充值</button>
                    </div>
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