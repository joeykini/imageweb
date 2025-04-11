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
    if (!body.userId) {
      return NextResponse.json({ 
        success: false, 
        error: "用戶ID是必須的" 
      }, { status: 400 });
    }
    
    const banStatus = !!body.banned; // 確保是布爾值
    
    try {
      // 獲取用戶當前數據
      const user = await clerkClient.users.getUser(body.userId);
      
      // 更新用戶狀態 (封禁或解封)
      await clerkClient.users.updateUser(body.userId, {
        publicMetadata: {
          ...user.publicMetadata,
          banned: banStatus
        }
      });
      
      // 返回成功響應
      return NextResponse.json({ 
        success: true, 
        message: banStatus ? "用戶已被封禁" : "用戶已被解封"
      });
    } catch (clerkError) {
      console.error("更新用戶狀態失敗:", clerkError);
      return NextResponse.json({ 
        success: false, 
        error: "更新用戶狀態失敗" 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("封禁/解封用戶時出錯:", error);
    return NextResponse.json({ 
      success: false, 
      error: "服務器錯誤" 
    }, { status: 500 });
  }
} 