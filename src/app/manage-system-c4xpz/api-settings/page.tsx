"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ApiSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('api-settings');
  
  // API配置状态
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://api.zhizengzeng.com/v1");
  const [primaryApiEndpoint, setPrimaryApiEndpoint] = useState("");
  const [backupApiEndpoint, setBackupApiEndpoint] = useState("");
  const [apiTimeout, setApiTimeout] = useState(30000);
  const [maxRetries, setMaxRetries] = useState(2);
  
  // UI状态
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  
  // 临时编辑状态
  const [tempApiKey, setTempApiKey] = useState("");
  const [tempBaseUrl, setTempBaseUrl] = useState("");
  const [tempPrimaryApiEndpoint, setTempPrimaryApiEndpoint] = useState("");
  const [tempBackupApiEndpoint, setTempBackupApiEndpoint] = useState("");
  const [tempApiTimeout, setTempApiTimeout] = useState(0);
  const [tempMaxRetries, setTempMaxRetries] = useState(0);
  
  // 检查是否已登录
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/manage-system-c4xpz');
    } else {
      // 加载API配置
      loadApiConfig();
    }
  }, [router]);
  
  // 加载API配置
  const loadApiConfig = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/admin/config');
      const data = await response.json();
      
      if (data.success && data.config) {
        const config = data.config;
        
        // 设置主要状态
        setApiKey(config.apiKey || "");
        setBaseUrl(config.baseUrl || "https://api.zhizengzeng.com/v1");
        setPrimaryApiEndpoint(config.primaryApiEndpoint || "");
        setBackupApiEndpoint(config.backupApiEndpoint || "");
        setApiTimeout(config.apiTimeout || 30000);
        setMaxRetries(config.maxRetries || 2);
        
        // 设置临时编辑状态
        setTempApiKey(config.apiKey || "");
        setTempBaseUrl(config.baseUrl || "https://api.zhizengzeng.com/v1");
        setTempPrimaryApiEndpoint(config.primaryApiEndpoint || "");
        setTempBackupApiEndpoint(config.backupApiEndpoint || "");
        setTempApiTimeout(config.apiTimeout || 30000);
        setTempMaxRetries(config.maxRetries || 2);
      } else {
        setError(data.error || "加载API配置失败");
      }
    } catch (error) {
      console.error('加载API配置失败:', error);
      setError("加载API配置失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };
  
  // 生成新的API密钥
  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      setError("请输入API密钥名称");
      return;
    }
    
    // 生成一个随机的API密钥
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'sk-';
    for (let i = 0; i < 24; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // 设置新的API密钥
    setTempApiKey(key);
    setNewKeyName("");
    
    // 显示通知
    setSuccessMessage("已生成新的API密钥，请确保保存更改");
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  
  // 保存API配置
  const saveApiConfig = async () => {
    setIsSaving(true);
    setError("");
    
    try {
      const response = await fetch('/api/admin/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: tempApiKey,
          baseUrl: tempBaseUrl,
          primaryApiEndpoint: tempPrimaryApiEndpoint,
          backupApiEndpoint: tempBackupApiEndpoint,
          apiTimeout: tempApiTimeout,
          maxRetries: tempMaxRetries
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 更新主状态
        setApiKey(tempApiKey);
        setBaseUrl(tempBaseUrl);
        setPrimaryApiEndpoint(tempPrimaryApiEndpoint);
        setBackupApiEndpoint(tempBackupApiEndpoint);
        setApiTimeout(tempApiTimeout);
        setMaxRetries(tempMaxRetries);
        
        // 退出编辑模式
        setIsEditing(false);
        
        // 显示成功消息
        setSuccessMessage("API配置已成功更新");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.error || "更新API配置失败");
      }
    } catch (error) {
      console.error('更新API配置失败:', error);
      setError("更新API配置失败，请稍后再试");
    } finally {
      setIsSaving(false);
    }
  };
  
  // 取消编辑
  const cancelEditing = () => {
    // 恢复到原始值
    setTempApiKey(apiKey);
    setTempBaseUrl(baseUrl);
    setTempPrimaryApiEndpoint(primaryApiEndpoint);
    setTempBackupApiEndpoint(backupApiEndpoint);
    setTempApiTimeout(apiTimeout);
    setTempMaxRetries(maxRetries);
    
    // 退出编辑模式
    setIsEditing(false);
  };
  
  // 开始编辑
  const startEditing = () => {
    setIsEditing(true);
  };
  
  const handleLogout = () => {
    localStorage.setItem('adminLoggedIn', 'false');
    router.push('/manage-system-c4xpz');
  };
  
  return (
    <div className="max-w-[90rem] mx-auto px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-2xl font-bold mb-1">API 设置</h1>
        <p className="text-gray-500 text-sm">管理 API 密钥和接口配置</p>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 成功提示 */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* API 密钥管理 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">API 密钥管理</h2>
          {isEditing ? (
            <div className="space-x-2">
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                onClick={saveApiConfig}
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存设置'}
              </button>
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={cancelEditing}
                disabled={isSaving}
              >
                取消
              </button>
            </div>
          ) : (
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={startEditing}
            >
              编辑设置
            </button>
          )}
        </div>
        
        <div className="mb-6">
          {isEditing && (
            <div className="flex mb-4">
              <input 
                type="text" 
                placeholder="输入新 API Key 描述"
                className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                onClick={generateApiKey}
              >
                生成新密钥
              </button>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">当前 API 密钥</label>
            <div className="flex items-center">
              {isEditing ? (
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="输入 API 密钥"
                />
              ) : (
                <div className="flex-1 px-3 py-2 border border-gray-200 rounded-md bg-white">
                  <span className="font-mono">
                    {apiKey ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 4)}` : '未设置'}
                  </span>
                </div>
              )}
              
              {!isEditing && apiKey && (
                <button 
                  className="ml-2 p-2 text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey);
                    setSuccessMessage("API密钥已复制到剪贴板");
                    setTimeout(() => setSuccessMessage(""), 3000);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">API 基础 URL</label>
            {isEditing ? (
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={tempBaseUrl}
                onChange={(e) => setTempBaseUrl(e.target.value)}
                placeholder="例如: https://api.example.com/v1"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-white">
                {baseUrl || '未设置'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 高级 API 设置 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">高级 API 设置</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">主要 API 端点</label>
            {isEditing ? (
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={tempPrimaryApiEndpoint}
                onChange={(e) => setTempPrimaryApiEndpoint(e.target.value)}
                placeholder="例如: https://api.example.com/v1/images/generations"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-white">
                {primaryApiEndpoint || baseUrl + '/images/generations'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备用 API 端点</label>
            {isEditing ? (
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={tempBackupApiEndpoint}
                onChange={(e) => setTempBackupApiEndpoint(e.target.value)}
                placeholder="例如: https://backup-api.example.com/v1/images/generations"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-white">
                {backupApiEndpoint || '未设置 (使用主端点)'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API 请求超时 (毫秒)</label>
            {isEditing ? (
              <input 
                type="number" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={tempApiTimeout}
                onChange={(e) => setTempApiTimeout(parseInt(e.target.value) || 0)}
                min="1000"
                step="1000"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-white">
                {apiTimeout} 毫秒
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">最大重试次数</label>
            {isEditing ? (
              <input 
                type="number" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={tempMaxRetries}
                onChange={(e) => setTempMaxRetries(parseInt(e.target.value) || 0)}
                min="0"
                max="5"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-white">
                {maxRetries}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 提示与说明 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">提示与说明</h2>
        
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
          <h3 className="font-medium text-blue-800 mb-2">API 密钥安全注意事项</h3>
          <p className="text-blue-700 text-sm">
            请妥善保管您的 API 密钥，不要在客户端代码中直接使用它们。API 密钥应该只在服务器端使用。
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2">配置生效说明</h3>
          <p className="text-yellow-700 text-sm">
            更新 API 配置后可能需要重启服务器才能完全生效。如果您的更改没有立即生效，请尝试重新启动应用程序。
          </p>
        </div>
      </div>
    </div>
  );
} 