"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Pricing() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{id: string, price: number} | null>(null);
  
  const openPaymentModal = (packageId: string, price: number) => {
    if (!isLoggedIn) {
      router.push('/sign-in?redirect_url=/pricing');
      return;
    }
    setSelectedPackage({ id: packageId, price });
    setIsModalOpen(true);
  };
  
  const handleFreeSignup = () => {
    if (!isLoggedIn) {
      router.push('/sign-in?redirect_url=/create');
      return;
    }
    router.push('/create');
  };
  
  const handlePaymentMethodSelect = (method: string) => {
    if (!selectedPackage) return;
    
    const paymentUrl = `/api/payment?method=${method}&packageId=${selectedPackage.id}&amount=${selectedPackage.price}`;
    window.location.href = paymentUrl;
  };
  
  return (
    <>
      <Header />
      <div className="w-full max-w-6xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center space-y-6 mb-16">
          <div className="font-handwritten text-xl text-blue-500 rotate-[-1deg]">按次付费</div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold font-handwritten text-zinc-900 dark:text-white rotate-[-1deg]">高质量绘图，无需办理 PLUS 会员
              <div className="absolute -right-12 top-0 text-amber-500 rotate-12">✨</div>
              <div className="absolute -left-8 bottom-0 text-blue-500 -rotate-12">⭐️</div>
            </h2>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-blue-500/20 rotate-[-1deg] rounded-full blur-sm"></div>
          </div>
          <p className="font-handwritten text-xl text-zinc-600 dark:text-zinc-400 rotate-[-1deg]">注册即送积分，立即开始创作</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group transition-all duration-300 rotate-[-1deg]">
            <div className="absolute inset-0 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px] group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]"></div>
            <div className="relative p-6">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center border-2 border-zinc-900 dark:border-white text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-gift w-6 h-6"
                  >
                    <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                    <path d="M12 8v13"></path>
                    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
                    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
                  </svg>
                </div>
                <h3 className="font-handwritten text-2xl text-zinc-900 dark:text-white">免费试用</h3>
                <p className="font-handwritten text-zinc-600 dark:text-zinc-400">适合入门体验</p>
              </div>
              <div className="mb-6 font-handwritten">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">FREE</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">300 积分免费赠送</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">普通模型 100 积分/次</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">立即开始使用</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">无需付费</span>
                </div>
              </div>
              <button 
                onClick={handleFreeSignup}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full h-12 font-handwritten text-lg relative border-2 border-zinc-900 dark:border-white transition-all duration-300 shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700 active:bg-zinc-50 dark:active:bg-zinc-800">
                立即开始
              </button>
            </div>
          </div>
          <div className="relative group transition-all duration-300 rotate-[1deg]">
            <div className="absolute inset-0 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px] group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]"></div>
            <div className="relative p-6">
              <div className="absolute -top-2 -right-2 bg-amber-400 text-zinc-900 font-handwritten px-3 py-1 rounded-full rotate-12 text-sm border-2 border-zinc-900">最受欢迎</div>
            <div className="mb-6">
                <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center border-2 border-zinc-900 dark:border-white text-amber-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-star w-6 h-6"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                </div>
                <h3 className="font-handwritten text-2xl text-zinc-900 dark:text-white">新手套装</h3>
                <p className="font-handwritten text-zinc-600 dark:text-zinc-400">10元 = 1000积分</p>
              </div>
              <div className="mb-6 font-handwritten">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">¥10</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">增加 1000 积分</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">普通模型 100 积分/次</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">高级模型 150 积分/次</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">解锁高级模型，体验更优质画质</span>
                </div>
              </div>
              <button 
                onClick={() => openPaymentModal('basic', 1000)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full h-12 font-handwritten text-lg relative border-2 border-zinc-900 dark:border-white transition-all duration-300 shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] bg-amber-400 text-zinc-900 hover:bg-amber-300 active:bg-amber-400 dark:hover:bg-amber-300 dark:active:bg-amber-400">
                立即充值
              </button>
            </div>
          </div>
          <div className="relative group transition-all duration-300 rotate-[-2deg]">
            <div className="absolute inset-0 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px] group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]"></div>
            <div className="relative p-6">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center border-2 border-zinc-900 dark:border-white text-purple-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-crown w-6 h-6"
                  >
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
                    <path d="M5 21h14"></path>
                  </svg>
                </div>
                <h3 className="font-handwritten text-2xl text-zinc-900 dark:text-white">专业套餐</h3>
                <p className="font-handwritten text-zinc-600 dark:text-zinc-400">50 元 = 5500 积分</p>
              </div>
              <div className="mb-6 font-handwritten">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">¥50</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">增加 5500 积分</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">普通模型 100 积分/次</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">高级模型 150 积分/次</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check w-3 h-3"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="font-handwritten text-lg text-zinc-900 dark:text-white">量贩装 享超值折扣</span>
                </div>
              </div>
              <button 
                onClick={() => openPaymentModal('pro', 5000)} 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full h-12 font-handwritten text-lg relative border-2 border-zinc-900 dark:border-white transition-all duration-300 shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700 active:bg-zinc-50 dark:active:bg-zinc-800">
                立即充值
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button 
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
              </svg>
            </button>
            <h3 className="text-xl font-bold mb-4">请选择支付方式</h3>
            <p className="text-gray-600 mb-6">
              当前选择: {selectedPackage?.id} - ¥{selectedPackage?.price.toFixed(2)}
            </p>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                onClick={() => handlePaymentMethodSelect('alipay')}
              >
                <span className="font-medium flex items-center">
                  <img src="/images/alipay.png" alt="支付宝" className="w-6 h-6 mr-2" />
                  支付宝
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
              <button 
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                onClick={() => handlePaymentMethodSelect('wechat')}
              >
                <span className="font-medium flex items-center">
                  <img src="/images/wechat.png" alt="微信支付" className="w-6 h-6 mr-2" />
                  微信支付
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
              <button 
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                onClick={() => handlePaymentMethodSelect('epay')}
              >
                <span className="font-medium flex items-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#4CAF50" />
                    <path d="M16.8 8.4H7.2C6.54 8.4 6 8.94 6 9.6V14.4C6 15.06 6.54 15.6 7.2 15.6H16.8C17.46 15.6 18 15.06 18 14.4V9.6C18 8.94 17.46 8.4 16.8 8.4Z" fill="white" />
                    <path d="M12 13.2C12.9941 13.2 13.8 12.3941 13.8 11.4C13.8 10.4059 12.9941 9.6 12 9.6C11.0059 9.6 10.2 10.4059 10.2 11.4C10.2 12.3941 11.0059 13.2 12 13.2Z" fill="#4CAF50" />
                  </svg>
                  彩虹易支付
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              支付成功后积分将自动添加到您的账户
            </p>
          </div>
        </div>
      )}

      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 text-4xl rotate-12">✎</div>
        <div className="absolute bottom-40 right-20 text-4xl -rotate-12">✏️</div>
      </div>
    </>
  );
} 