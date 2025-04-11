"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BadgeCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 套餐類型
type Package = {
  id: string;
  name: string;
  points: number;
  price: number;
  description: string;
  popular: boolean;
};

// 支付方式類型
type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
};

// 模擬數據
const mockPackages: Package[] = [
  {
    id: 'basic',
    name: '新手套餐',
    points: 1000,
    price: 1000, // 10元 (以分为单位)
    description: '適合新用戶初次體驗',
    popular: true
  },
  {
    id: 'pro',
    name: '專業套餐',
    points: 5500,
    price: 5000, // 50元 (以分为单位)
    description: '性價比最高，提供更多積分',
    popular: false
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'epay',
    name: '彩虹易支付',
    icon: '/images/payment/epay.png',
    description: '支持微信、支付寶、QQ錢包等多種支付方式',
    enabled: true
  }
];

// 充值頁面
export default function RechargePointsPage() {
  const router = useRouter();
  
  // 狀態管理
  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [selectedPackage, setSelectedPackage] = useState<string>('basic');
  const [selectedPayment, setSelectedPayment] = useState<string>('epay');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  // 提交付款
  const handleSubmitPayment = async () => {
    if (!selectedPackage || !selectedPayment) {
      setError('請選擇套餐和支付方式');
      return;
    }
    
    try {
      setPaymentLoading(true);
      
      // 選中的套餐信息
      const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
      if (!selectedPkg) {
        setError('選擇的套餐不存在');
        setPaymentLoading(false);
        return;
      }
      
      // 先顯示模態框
      setPaymentModalOpen(true);
      
      // 如果是彩虹易支付，直接進行跳轉
      if (selectedPayment === 'epay') {
        // 實際環境中這裡應該與後端API通信，獲取支付URL
        // 模擬一個API請求
        setTimeout(() => {
          // 模擬API響應，正式環境替換為實際API調用
          const packageId = selectedPackage;
          const amount = selectedPkg.price;
          
          // 構建彩虹易支付直接跳轉URL
          const paymentUrl = `/api/payment/create?method=epay&packageId=${packageId}&amount=${amount}`;
          
          // 跳轉到支付頁面
          window.location.href = paymentUrl;
        }, 1000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError('支付請求失敗，請稍後重試');
      setPaymentLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-500">載入中...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="mr-2 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">充值積分</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* 套餐選擇 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">選擇套餐</h2>
          <div className="grid gap-4">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`cursor-pointer transition-all border rounded-lg p-4 ${
                  selectedPackage === pkg.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="text-lg font-medium">{pkg.name}</div>
                  {pkg.popular && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center">
                      <BadgeCheck className="h-3 w-3 mr-1" /> 最受歡迎
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{pkg.description}</div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">
                    {(pkg.price / 100).toFixed(2)} <span className="text-base font-normal text-gray-500">元</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    獲得 {pkg.points} 積分
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 支付方式 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">選擇支付方式</h2>
          <div className="border rounded-lg p-6">
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer ${
                    selectedPayment === method.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <input 
                    type="radio" 
                    id={method.id}
                    checked={selectedPayment === method.id}
                    onChange={() => setSelectedPayment(method.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={method.id} className="flex items-center cursor-pointer w-full">
                    <div className="w-8 h-8 mr-3 relative flex-shrink-0">
                      {/* 替代图像，因为可能没有实际图像 */}
                      <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                        {method.id === 'wechat' && <span className="text-green-600 text-xs">微信</span>}
                        {method.id === 'alipay' && <span className="text-blue-600 text-xs">支付寶</span>}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t mt-4">
              <div className="text-sm text-gray-500">
                點擊下方按鈕後將顯示支付信息
              </div>
              <button 
                onClick={handleSubmitPayment} 
                disabled={!selectedPackage || !selectedPayment || paymentLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    處理中...
                  </span>
                ) : '立即支付'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 支付模態框 */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                {packages.find(pkg => pkg.id === selectedPackage)?.name} - {(packages.find(pkg => pkg.id === selectedPackage)?.price || 0) / 100}元 
                ({packages.find(pkg => pkg.id === selectedPackage)?.points}積分)
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4 py-4">
              <button 
                className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 h-24 flex flex-col items-center justify-center gap-2 border-2 border-zinc-900 dark:border-white transition-all duration-300 shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700 active:bg-zinc-50 dark:active:bg-zinc-800"
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <span>處理中，請稍候...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl">彩虹易支付</span>
                    <span className="text-sm">WeChat Pay / Alipay / QQ Pay</span>
                  </>
                )}
              </button>
            </div>
            
            <button 
              type="button" 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => setPaymentModalOpen(false)}
              disabled={paymentLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">關閉</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 