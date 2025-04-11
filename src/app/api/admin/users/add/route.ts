import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';

export async function POST(request: Request) {
  try {
    // 檢查管理員權限
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "未授權訪問" 
      }, { status: 401 });
    }
    
    // 解析請求數據
    const body = await request.json();
    
    // 驗證必要字段
    if (!body.name || !body.email) {
      return NextResponse.json({ 
        success: false, 
        error: "用戶名和郵箱是必須的" 
      }, { status: 400 });
    }
    
    // 檢查郵箱是否已存在
    const existingUsers = await clerkClient.users.getUserList({
      emailAddress: [body.email],
    });
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: "該郵箱已被使用" 
      }, { status: 400 });
    }
    
    try {
      // 創建新用戶 (Clerk API)
      const newClerkUser = await clerkClient.users.createUser({
        firstName: body.name.split(' ')[0] || '',
        lastName: body.name.split(' ').slice(1).join(' ') || '',
        emailAddress: [body.email],
        password: Math.random().toString(36).substring(2, 12), // 生成隨機密碼
        publicMetadata: {
          role: body.role || '普通用户',
          points: body.points || 200
        }
      });
      
      // 轉換為我們應用中的用戶格式
      const newUser = {
        id: newClerkUser.id,
        username: `${newClerkUser.firstName || ''} ${newClerkUser.lastName || ''}`.trim() || '未設置姓名',
        email: body.email,
        status: 'active',
        role: body.role || '普通用户',
        points: body.points || 200,
        registerDate: new Date().toISOString().split('T')[0],
        lastLogin: '尚未登錄',
        avatar: newClerkUser.imageUrl
      };
      
      // 返回成功響應
      return NextResponse.json({ 
        success: true, 
        message: "用戶創建成功",
        user: newUser
      });
    } catch (clerkError) {
      console.error("Clerk API創建用戶失敗:", clerkError);
      return NextResponse.json({ 
        success: false, 
        error: "無法創建用戶，請檢查郵箱是否有效" 
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error("添加用戶時出錯:", error);
    return NextResponse.json({ 
      success: false, 
      error: "服務器錯誤" 
    }, { status: 500 });
  }
} 