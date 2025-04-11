"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/navbar";

interface Image {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

// 模拟订单数据接口
interface Order {
  id: string;
  product: string;
  amount: number;
  status: "success" | "pending" | "failed";
  created_at: string;
}

export default function MyAccountPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState<"history" | "points" | "orders" | "profile">("history");
  
  // 用户相关数据
  const [points, setPoints] = useState(100);
  const [selectedPointsPackage, setSelectedPointsPackage] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    if (currentTab === "history") {
      fetchImages();
    } else if (currentTab === "orders") {
      fetchOrders();
    }
  }, [currentTab]);
  
  const fetchImages = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/images?search=${searchTerm}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取图片失败');
      }
      
      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      console.error('获取图片错误:', err);
      setError(err instanceof Error ? err.message : "获取图片时出错，请稍后再试");
    } finally {
      setLoading(false);
    }
  };
  
  // 模拟获取订单数据
  const fetchOrders = async () => {
    setLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟订单数据
      const mockOrders: Order[] = [
        { 
          id: "ord_123456", 
          product: "100积分套餐", 
          amount: 19.9, 
          status: "success", 
          created_at: "2023-11-15T08:30:00Z" 
        },
        { 
          id: "ord_123457", 
          product: "300积分套餐", 
          amount: 49.9, 
          status: "success", 
          created_at: "2023-10-22T14:45:00Z" 
        },
        { 
          id: "ord_123458", 
          product: "50积分套餐", 
          amount: 9.9, 
          status: "pending", 
          created_at: "2023-12-01T18:10:00Z" 
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error("获取订单失败", error);
    } finally {
      setLoading(false);
    }
  };
  
  // 当搜索词变化时，获取新的图片
  useEffect(() => {
    if (currentTab === "history") {
      const delayDebounceFn = setTimeout(() => {
        fetchImages();
      }, 500);
      
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm]);
  
  // 处理删除图片
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除图片失败');
      }
      
      // 从列表中移除已删除的图片
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      console.error('删除图片错误:', err);
      alert(err instanceof Error ? err.message : "删除图片时出错，请稍后再试");
    }
  };
  
  // 处理积分充值
  const handleRechargePoints = () => {
    alert(`将跳转到支付页面购买: ${selectedPointsPackage}`);
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  // 积分套餐选项
  const pointsPackages = [
    { id: "basic", name: "入门套餐", points: 100, price: 19.9 },
    { id: "standard", name: "标准套餐", points: 300, price: 49.9 },
    { id: "premium", name: "高级套餐", points: 1000, price: 149.9 },
    { id: "ultimate", name: "终极套餐", points: 3000, price: 399.9 }
  ];
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 sm:pt-24">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧选项卡 */}
          <div className="w-full md:w-60 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 text-center border-b border-gray-200">
                <div className="inline-block w-16 h-16 rounded-full bg-gray-200 mb-3"></div>
                <h2 className="text-sm font-medium">用户名</h2>
                <p className="text-xs text-gray-500 mt-1">user@example.com</p>
                <div className="mt-2 text-center">
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    当前积分: {points}
                  </span>
                </div>
              </div>
              
              <nav className="p-2">
                <button 
                  onClick={() => setCurrentTab("history")}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm ${
                    currentTab === "history" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  生成历史
                </button>
                
                <button 
                  onClick={() => setCurrentTab("points")}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm ${
                    currentTab === "points" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  余额充值
                </button>
                
                <button 
                  onClick={() => setCurrentTab("orders")}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm ${
                    currentTab === "orders" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  订单历史
                </button>
                
                <button 
                  onClick={() => setCurrentTab("profile")}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm ${
                    currentTab === "profile" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  个人信息
                </button>
              </nav>
            </div>
          </div>
          
          {/* 右侧内容 */}
          <div className="w-full">
            {/* 历史生成 */}
            {currentTab === "history" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-medium">历史生成</h2>
                  <Link 
                    href="/create" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors text-xs"
                  >
                    创建新图片
                  </Link>
                </div>
                
                <div className="mb-4">
                  <div className="relative w-full">
                    <input 
                      type="text"
                      placeholder="搜索图片描述..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {searchTerm && (
                      <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm("")}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-500 text-sm">加载中...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-10">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="mt-2 text-gray-500 text-sm">暂无生成历史，点击"创建新图片"开始创作</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <img 
                            src={image.image_url} 
                            alt={image.prompt} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-500 truncate">{image.prompt}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-400">{formatDate(image.created_at)}</span>
                            <button
                              onClick={() => handleDelete(image.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* 积分充值 */}
            {currentTab === "points" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-base font-medium mb-4">积分充值</h2>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">当前积分余额: <span className="font-semibold">{points}</span></p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium">选择充值套餐:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {pointsPackages.map((pkg) => (
                      <div 
                        key={pkg.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          selectedPointsPackage === pkg.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedPointsPackage(pkg.id)}
                      >
                        <div className="font-medium text-sm">{pkg.name}</div>
                        <div className="text-blue-600 text-sm font-bold mt-1">¥{pkg.price}</div>
                        <div className="text-xs text-gray-500 mt-1">{pkg.points} 积分</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleRechargePoints}
                    disabled={!selectedPointsPackage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedPointsPackage
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    立即充值
                  </button>
                </div>
              </div>
            )}
            
            {/* 订单历史 */}
            {currentTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-base font-medium mb-4">订单历史</h2>
                
                {loading ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-500 text-sm">加载中...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <p className="mt-2 text-gray-500 text-sm">暂无订单记录</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{order.id}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{order.product}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">¥{order.amount.toFixed(2)}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full 
                                ${order.status === 'success' ? 'bg-green-100 text-green-800' : 
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                                {order.status === 'success' ? '已完成' : 
                                order.status === 'pending' ? '处理中' : 
                                '失败'}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{formatDate(order.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* 个人信息 */}
            {currentTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-base font-medium mb-4">个人信息</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">用户名</label>
                    <input 
                      type="text" 
                      value="用户名" 
                      disabled 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">电子邮箱</label>
                    <input 
                      type="email" 
                      value="user@example.com" 
                      disabled 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">注册时间</label>
                    <input 
                      type="text" 
                      value="2023-01-01" 
                      disabled 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">会员类型</label>
                    <input 
                      type="text" 
                      value="基础会员" 
                      disabled 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                    修改密码
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 