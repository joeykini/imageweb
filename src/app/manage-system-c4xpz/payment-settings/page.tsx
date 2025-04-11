"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('payment-settings');
  const [isEditing, setIsEditing] = useState(false);
  
  // 支付方式設置
  const [paymentMethods, setPaymentMethods] = useState([
    { 
      id: 'epay', 
      name: '彩虹易支付', 
      enabled: true, 
      config: {
        merchantId: 'MERCHANT_10001',
        secretKey: '**************',
        gateway: 'https://pay.example.com/',
        notifyUrl: 'https://example.com/api/payment/callback/epay'
      } 
    },
    { 
      id: 'usdt', 
      name: 'USDT支付', 
      enabled: true, 
      config: {
        walletAddress: '0xD8DA6BF26964aF9D7eEd9e03E53415D37aA96045',
        network: 'TRC20',
        exchangeRate: '7.23',
        expirationTime: '30'
      } 
    }
  ]);
  
  // 積分套餐設置
  const [pointsPackages, setPointsPackages] = useState([
    { id: 1, name: '基礎套餐', points: 1000, price: 10, enabled: true },
    { id: 2, name: '標準套餐', points: 5500, price: 50, enabled: true, discount: '10%' },
    { id: 3, name: '高級套餐', points: 12000, price: 100, enabled: true, discount: '20%' },
    { id: 4, name: '企業套餐', points: 50000, price: 300, enabled: false, discount: '40%' }
  ]);
  
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  
  // 檢查是否已登錄
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/manage-system-c4xpz');
    }
  }, [router]);
  
  const handleLogout = () => {
    localStorage.setItem('adminLoggedIn', 'false');
    router.push('/manage-system-c4xpz');
  };
  
  // 更新支付方式狀態
  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === id ? {...method, enabled: !method.enabled} : method
    ));
  };
  
  // 編輯支付方式配置
  const handleEditMethod = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method) {
      setEditingMethod({...method});
      setIsEditing(true);
    }
  };
  
  // 保存支付方式配置
  const saveMethodConfig = () => {
    if (!editingMethod) return;
    
    setPaymentMethods(paymentMethods.map(method => 
      method.id === editingMethod.id ? editingMethod : method
    ));
    
    setEditingMethod(null);
    setIsEditing(false);
  };
  
  // 更新積分套餐狀態
  const togglePackage = (id: number) => {
    setPointsPackages(pointsPackages.map(pkg => 
      pkg.id === id ? {...pkg, enabled: !pkg.enabled} : pkg
    ));
  };
  
  // 編輯積分套餐
  const handleEditPackage = (id: number) => {
    const pkg = pointsPackages.find(p => p.id === id);
    if (pkg) {
      setEditingPackage({...pkg});
      setIsPackageModalOpen(true);
    }
  };
  
  // 保存積分套餐
  const savePackage = () => {
    if (!editingPackage) return;
    
    if (editingPackage.id) {
      // 更新現有套餐
      setPointsPackages(pointsPackages.map(pkg => 
        pkg.id === editingPackage.id ? editingPackage : pkg
      ));
    } else {
      // 添加新套餐
      const newId = Math.max(...pointsPackages.map(pkg => pkg.id)) + 1;
      setPointsPackages([...pointsPackages, {...editingPackage, id: newId}]);
    }
    
    setEditingPackage(null);
    setIsPackageModalOpen(false);
  };
  
  // 添加新套餐
  const addNewPackage = () => {
    setEditingPackage({
      id: 0,
      name: '',
      points: 1000,
      price: 10,
      enabled: true,
      discount: ''
    });
    setIsPackageModalOpen(true);
  };
  
  // 刪除套餐
  const deletePackage = (id: number) => {
    setPointsPackages(pointsPackages.filter(pkg => pkg.id !== id));
  };
  
  // 更新編輯中支付方式配置字段
  const updateMethodConfig = (key: string, value: string) => {
    if (!editingMethod) return;
    
    setEditingMethod({
      ...editingMethod,
      config: {
        ...editingMethod.config,
        [key]: value
      }
    });
  };
  
  return (
    <div className="max-w-[90rem] mx-auto px-4">
      {/* 主內容區 */}
      <div className="w-full">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold mb-1">支付設置</h1>
          <p className="text-gray-500 text-sm">管理支付方式和積分套餐配置</p>
        </div>
        
        {/* 支付方式設置區域 */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">支付方式設置</h2>
          
          {isEditing && editingMethod ? (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium">{editingMethod.name}配置</h3>
              </div>
              
              {editingMethod.id === 'epay' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">商戶ID (Merchant ID)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.merchantId}
                      onChange={(e) => updateMethodConfig('merchantId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">商戶密鑰 (Secret Key)</label>
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.secretKey}
                      onChange={(e) => updateMethodConfig('secretKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">支付網關 (Gateway URL)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.gateway}
                      onChange={(e) => updateMethodConfig('gateway', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">回調通知URL (Notify URL)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.notifyUrl}
                      onChange={(e) => updateMethodConfig('notifyUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-1">支付方式說明：</p>
                    <p className="text-xs text-gray-500">彩虹易支付是一個聚合支付平台，支持支付寶、微信、QQ錢包等多種支付方式。設置商戶ID和密鑰後，系統會自動對接所有支付方式。</p>
                  </div>
                </div>
              )}
              
              {editingMethod.id === 'wechat' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">應用ID (App ID)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.appId}
                      onChange={(e) => updateMethodConfig('appId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">商戶ID (Mch ID)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.mchId}
                      onChange={(e) => updateMethodConfig('mchId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API密鑰 (API Key)</label>
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.apiKey}
                      onChange={(e) => updateMethodConfig('apiKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">回調通知URL (Notify URL)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.notifyUrl}
                      onChange={(e) => updateMethodConfig('notifyUrl', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {editingMethod.id === 'alipay' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">應用ID (App ID)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.appId}
                      onChange={(e) => updateMethodConfig('appId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">私鑰 (Private Key)</label>
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.privateKey}
                      onChange={(e) => updateMethodConfig('privateKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">公鑰 (Public Key)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.publicKey}
                      onChange={(e) => updateMethodConfig('publicKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">回調通知URL (Notify URL)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.notifyUrl}
                      onChange={(e) => updateMethodConfig('notifyUrl', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {editingMethod.id === 'usdt' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">錢包地址 (Wallet Address)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.walletAddress}
                      onChange={(e) => updateMethodConfig('walletAddress', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">網絡 (Network)</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.network}
                      onChange={(e) => updateMethodConfig('network', e.target.value)}
                    >
                      <option value="TRC20">TRC20</option>
                      <option value="ERC20">ERC20</option>
                      <option value="BEP20">BEP20 (BSC)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">匯率 (1 USDT = ? RMB)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.exchangeRate}
                      onChange={(e) => updateMethodConfig('exchangeRate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">過期時間 (分鐘)</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMethod.config.expirationTime}
                      onChange={(e) => updateMethodConfig('expirationTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setEditingMethod(null);
                    setIsEditing(false);
                  }}
                >
                  取消
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={saveMethodConfig}
                >
                  保存配置
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{method.name}</h3>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${method.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {method.enabled ? '已啟用' : '已禁用'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                        onClick={() => handleEditMethod(method.id)}
                      >
                        設置
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm rounded-md ${method.enabled ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                        onClick={() => togglePaymentMethod(method.id)}
                      >
                        {method.enabled ? '禁用' : '啟用'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(method.config).map(([key, value], index) => {
                      // 隱藏敏感信息
                      const displayValue = key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') ? 
                        '••••••••••••••••' : 
                        typeof value === 'string' ? value : JSON.stringify(value);
                      
                      return (
                        <div key={index} className="flex">
                          <span className="text-gray-500 text-sm">{key}: </span>
                          <span className="text-sm ml-1">{displayValue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 積分套餐設置區域 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">積分套餐設置</h2>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={addNewPackage}
            >
              添加套餐
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    名稱
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    積分數量
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    價格 (¥)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    折扣
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pointsPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pkg.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.discount || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${pkg.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {pkg.enabled ? '已啟用' : '已禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEditPackage(pkg.id)}
                      >
                        編輯
                      </button>
                      <button 
                        className={`${pkg.enabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        onClick={() => togglePackage(pkg.id)}
                      >
                        {pkg.enabled ? '禁用' : '啟用'}
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => deletePackage(pkg.id)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* 編輯套餐彈窗 */}
      {isPackageModalOpen && editingPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{editingPackage.id ? '編輯套餐' : '添加套餐'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">套餐名稱</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md"
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">積分數量</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md"
                  value={editingPackage.points}
                  onChange={(e) => setEditingPackage({...editingPackage, points: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">價格 (¥)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md"
                  value={editingPackage.price}
                  onChange={(e) => setEditingPackage({...editingPackage, price: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">折扣 (選填，例如 "10%")</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md"
                  value={editingPackage.discount || ''}
                  onChange={(e) => setEditingPackage({...editingPackage, discount: e.target.value})}
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="enabled"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={editingPackage.enabled}
                  onChange={(e) => setEditingPackage({...editingPackage, enabled: e.target.checked})}
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">啟用此套餐</label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => {
                  setIsPackageModalOpen(false);
                  setEditingPackage(null);
                }}
              >
                取消
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={savePackage}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 