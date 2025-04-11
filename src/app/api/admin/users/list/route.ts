import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';

export async function GET() {
  try {
    // 檢查管理員權限
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "未授權訪問" 
      }, { status: 401 });
    }
    
    // 從Clerk獲取用戶列表
    const clerkUsers = await clerkClient.users.getUserList({
      limit: 100,
    });
    
    // 轉換Clerk用戶數據格式為我們系統需要的格式
    const users = clerkUsers.map((user) => {
      // 獲取主要電子郵件
      const primaryEmail = user.emailAddresses.find(
        email => email.id === user.primaryEmailAddressId
      )?.emailAddress || '';
      
      return {
        id: user.id,
        username: `${user.firstName || ''} ${user.lastName || ''}`.trim() || '未設置姓名',
        email: primaryEmail,
        status: user.banned ? 'banned' : 'active',
        role: user.publicMetadata?.role as string || '普通用户',
        points: (user.publicMetadata?.points as number) || 0,
        registerDate: new Date(user.createdAt).toISOString().split('T')[0],
        lastLogin: user.lastSignInAt 
          ? new Date(user.lastSignInAt).toISOString().split('T')[0] 
          : '從未登錄',
        avatar: user.imageUrl
      };
    });
    
    // 返回用戶列表
    return NextResponse.json({ 
      success: true, 
      users: users
    });
  } catch (error) {
    console.error("獲取用戶列表時出錯:", error);
    return NextResponse.json({ 
      success: false, 
      error: "服務器錯誤" 
    }, { status: 500 });
  }
} 