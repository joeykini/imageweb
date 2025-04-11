"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// 定義用戶接口
interface User {
  id: number;
  username: string;
  email: string;
  status: string;
  role: string;
  points: number;
  registerDate: string;
  lastLogin: string;
  avatar?: string; // 可選頭像
}

// 定義新用戶表單數據接口
interface NewUserForm {
  name: string;
  email: string;
  role: string;
  points: number;
}

// 狀態和角色顏色映射的類型
interface StatusColors {
  [key: string]: string;
}

interface RoleColors {
  [key: string]: string;
}

export default function UsersManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserEdit, setCurrentUserEdit] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('所有状态');
  const [selectedRole, setSelectedRole] = useState('所有角色');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // 检查是否已登录
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/manage-system-c4xpz');
    }
  }, [router]);
  
  // 获取用户列表
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users/list');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error('获取用户列表失败:', data.error || '未知错误');
        }
      } catch (error) {
        console.error('获取用户列表出错:', error);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleLogout = () => {
    localStorage.setItem('adminLoggedIn', 'false');
    router.push('/manage-system-c4xpz');
  };
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEditUser = (user: User) => {
    setCurrentUserEdit({...user});
    setIsModalOpen(true);
  };
  
  const handleSaveUser = async () => {
    if (!currentUserEdit) return;
    
    try {
      // 調用API更新用戶信息
      const response = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserEdit.id,
          username: currentUserEdit.username,
          points: currentUserEdit.points,
          role: currentUserEdit.role
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 更新本地用戶列表
        setUsers(users.map(user => 
          user.id === currentUserEdit.id ? currentUserEdit : user
        ));
        setIsModalOpen(false);
        setCurrentUserEdit(null);
      } else {
        alert(`更新用戶失敗: ${data.error || '未知錯誤'}`);
      }
    } catch (error) {
      console.error('更新用戶信息時出錯:', error);
      alert('更新用戶時發生錯誤，請重試');
    }
  };
  
  const handleToggleStatus = async (userId: number) => {
    try {
      // 獲取當前用戶狀態
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const newStatus = user.status === 'active' ? true : false;
      
      // 調用API更新用戶狀態
      const response = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          banned: newStatus
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 更新本地用戶列表
        setUsers(users.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              status: user.status === 'active' ? 'banned' : 'active'
            };
          }
          return user;
        }));
      } else {
        alert(`操作失敗: ${data.error || '未知錯誤'}`);
      }
    } catch (error) {
      console.error('更新用戶狀態時出錯:', error);
      alert('更新用戶狀態時發生錯誤，請重試');
    }
  };
  
  const addPoints = async (userId: number, amount: number) => {
    try {
      // 調用API更新用戶積分
      const response = await fetch('/api/admin/users/update-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          points: amount,
          absolute: false // 添加積分而不是設置絕對值
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 更新本地用戶列表
        setUsers(users.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              points: data.points || (user.points + amount)
            };
          }
          return user;
        }));
      } else {
        alert(`操作失敗: ${data.error || '未知錯誤'}`);
      }
    } catch (error) {
      console.error('更新用戶積分時出錯:', error);
      alert('更新用戶積分時發生錯誤，請重試');
    }
  };
  
  // 筛选用户
  const filteredUsersData = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === '所有状态' || user.status === selectedStatus;
    const matchesRole = selectedRole === '所有角色' || user.role === selectedRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // 分页设置
  const usersPerPage = 5;
  const totalPages = Math.ceil(filteredUsersData.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsersData.slice(indexOfFirstUser, indexOfLastUser);
  
  // 状态颜色映射
  const statusColors: StatusColors = {
    'active': 'bg-green-100 text-green-800',
    'banned': 'bg-red-100 text-red-800'
  };
  
  // 角色颜色映射
  const roleColors: RoleColors = {
    '普通用户': 'bg-gray-100 text-gray-800',
    '付费用户': 'bg-blue-100 text-blue-800',
    'VIP用户': 'bg-purple-100 text-purple-800'
  };
  
  // 处理删除用户
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // 調用API刪除用戶
      const response = await fetch(`/api/admin/users/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userToDelete.id
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 從本地列表中移除用戶
        setUsers(users.filter(user => user.id !== userToDelete.id));
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        alert(`刪除用戶失敗: ${data.error || '未知錯誤'}`);
      }
    } catch (error) {
      console.error('刪除用戶時出錯:', error);
      alert('刪除用戶時發生錯誤，請重試');
    }
  };
  
  // 添加新用户表单数据
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
    
    try {
      // 显示加载或处理状态
      // 这里可以添加一个状态来显示正在处理
      
      // 调用API添加用户
      const response = await fetch('/api/admin/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        // 添加成功，更新用户列表
        setUsers(prev => [...prev, data.user as User]);
        setShowAddUserModal(false);
        
        // 重置表单
        setNewUser({
          name: '',
          email: '',
          role: '普通用户',
          points: 200
        });
        
        // 可以显示一个成功提示
        alert('添加用户成功!');
      } else {
        // 显示错误信息
        alert(`添加用户失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('添加用户时出错:', error);
      alert('添加用户时发生错误，请重试');
    }
  };
  
  // 分页导航
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  return (
    <div className="max-w-[90rem] mx-auto px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-2xl font-bold mb-1">用户管理</h1>
        <p className="text-gray-500 text-sm">管理系统用户、权限和状态</p>
      </div>
      
      {/* 搜索和筛选区域 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div>
              <select 
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="所有状态">所有状态</option>
                <option value="active">启用</option>
                <option value="banned">禁用</option>
              </select>
            </div>
            <div>
              <select 
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="所有角色">所有角色</option>
                <option value="普通用户">普通用户</option>
                <option value="付费用户">付费用户</option>
                <option value="VIP用户">VIP用户</option>
              </select>
            </div>
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              添加用户
            </button>
          </div>
        </div>
      </div>
      
      {/* 用户表格 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  积分
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注册日期
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最近登录
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <span>{user.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[user.status]}`}>
                      {user.status === 'active' ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role ? roleColors[user.role] : 'bg-gray-100 text-gray-800'}`}>
                      {user.role || '普通用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.registerDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className={user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                      >
                        {user.status === 'active' ? '禁用' : '启用'}
                      </button>
                      <button 
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 分页控制 */}
      <div className="bg-white p-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              显示 
              <span className="font-medium"> {indexOfFirstUser + 1} </span>
              至 
              <span className="font-medium"> {Math.min(indexOfLastUser, filteredUsersData.length)} </span>
              项，共 
              <span className="font-medium"> {filteredUsersData.length} </span>
              项结果
            </p>
          </div>
          <div>
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">上一页</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* 页码按钮 */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === index + 1 ? 'bg-blue-50 text-blue-600 z-10' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">下一页</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* 编辑用户弹窗 */}
      {isModalOpen && currentUserEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">编辑用户</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={currentUserEdit.username}
                  onChange={(e) => setCurrentUserEdit({...currentUserEdit, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={currentUserEdit.email}
                  onChange={(e) => setCurrentUserEdit({...currentUserEdit, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">积分</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={currentUserEdit.points}
                  onChange={(e) => setCurrentUserEdit({...currentUserEdit, points: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={currentUserEdit.status}
                  onChange={(e) => setCurrentUserEdit({...currentUserEdit, status: e.target.value})}
                >
                  <option value="active">启用</option>
                  <option value="banned">禁用</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                取消
              </button>
              <button 
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 添加用户弹窗 */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">添加新用户</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
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
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 删除确认弹窗 */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">确认删除</h2>
            <p className="mb-6">您确定要删除用户 <span className="font-semibold">{userToDelete.username}</span> 吗？此操作无法撤销。</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                取消
              </button>
              <button 
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 