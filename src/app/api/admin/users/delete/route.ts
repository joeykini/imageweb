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
    
    try {
      // 調用Clerk API刪除用戶
      await clerkClient.users.deleteUser(body.userId);
      
      // 返回成功響應
      return NextResponse.json({ 
        success: true, 
        message: "用戶已被刪除"
      });
    } catch (clerkError) {
      console.error("刪除用戶失敗:", clerkError);
      return NextResponse.json({ 
        success: false, 
        error: "刪除用戶失敗，可能是權限不足或用戶不存在" 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("刪除用戶時出錯:", error);
    return NextResponse.json({ 
      success: false, 
      error: "服務器錯誤" 
    }, { status: 500 });
  }
} 