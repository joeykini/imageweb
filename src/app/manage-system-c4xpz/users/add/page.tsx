"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewUserForm {
  name: string;
  email: string;
  role: string;
  points: number;
}

export default function AddUser() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // 新用户表单数据
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '',
    email: '',
    role: '普通用户',
    points: 200
  });
  
  // 处理添加用户表单变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) : value
    }));
  };
  
  // 处理添加用户
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // 调用API添加用户
      const response = await fetch('/api/admin/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 添加成功，返回用户列表页面
        router.push('/manage-system-c4xpz/users');
      } else {
        // 显示错误信息
        setErrorMessage(data.error || '添加用户失败');
      }
    } catch (error) {
      console.error('添加用户时出错:', error);
      setErrorMessage('系统错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-[90rem] mx-auto px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">添加新用户</h1>
            <p className="text-gray-500 text-sm">创建新的系统用户</p>
          </div>
          <Link 
            href="/manage-system-c4xpz/users" 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回用户列表
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleAddUser} className="max-w-2xl">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input 
                type="text" 
                name="name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
              <input 
                type="email" 
                name="email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
              <select 
                name="role"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newUser.role}
                onChange={handleInputChange}
              >
                <option value="普通用户">普通用户</option>
                <option value="付费用户">付费用户</option>
                <option value="VIP用户">VIP用户</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">初始积分</label>
              <input 
                type="number" 
                name="points"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newUser.points}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Link
              href="/manage-system-c4xpz/users"
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              取消
            </Link>
            <button 
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '正在添加...' : '添加用户'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 