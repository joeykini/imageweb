"use client";

import Link from 'next/link';
import { useState } from 'react';
import React from 'react';
import Image from 'next/image';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 开启支付模态窗口
  const handlePointsClick = () => {
    setIsModalOpen(true);
  };
  
  // 选择支付方式
  const handlePaymentMethodSelect = (method: string) => {
    // 直接跳转到支付API
    const paymentUrl = `/api/payment?method=${method}&packageId=basic&amount=1000`;
    window.location.href = paymentUrl;
  };
  
  return (
    <footer className="bg-white w-full border-t border-[#EEEEF0] py-0.5">
      <div className="max-w-[90rem] mx-auto py-0.5 flex flex-col lg:flex-row justify-between gap-1 px-4">
        <div className="flex items-center gap-4 justify-center lg:justify-start">
          <div className="flex gap-2 font-medium text-sm items-center">
            <img src="/images/logo1.png" alt="Joey Course" className="w-4 h-4" />
            Joey<span className="text-gray-500">© 2025</span>
          </div>
        </div>
        <ul className="flex flex-wrap gap-4 justify-center lg:justify-end">
          <li>
            <a href="/pricing" className="flex items-center gap-2 font-medium text-[0.8125rem] rounded-full px-3 py-2 hover:bg-gray-100">
              <span>剩余 200 积分，点击购买</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="12" height="12" rx="3" fill="#EEEEF0"></rect>
                <path d="M5.75 10.25L10.25 5.75M10.25 5.75H6.75M10.25 5.75V9.25" stroke="#9394A1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>

      {/* 支付模态窗口 */}
      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div 
            role="dialog" 
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[425px]"
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                新手套装 - 10元 (1000积分)
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 py-4">
              <button 
                onClick={() => handlePaymentMethodSelect('epay')}
                className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 h-24 flex flex-col items-center justify-center gap-2 border-2 border-zinc-900 dark:border-white transition-all duration-300 shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700 active:bg-zinc-50 dark:active:bg-zinc-800"
              >
                <span className="text-2xl">彩虹易支付</span>
                <span className="text-sm">微信/支付宝/QQ钱包</span>
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">关闭</span>
            </button>
          </div>
        </>
      )}
    </footer>
  );
} 