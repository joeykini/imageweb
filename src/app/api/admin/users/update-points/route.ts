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
    if (!body.userId || body.points === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: "用戶ID和積分是必須的" 
      }, { status: 400 });
    }
    
    try {
      // 獲取用戶當前數據
      const user = await clerkClient.users.getUser(body.userId);
      
      // 計算新的積分
      const currentPoints = (user.publicMetadata?.points as number) || 0;
      const newPoints = body.absolute 
        ? body.points 
        : currentPoints + body.points;
      
      // 更新用戶積分
      await clerkClient.users.updateUser(body.userId, {
        publicMetadata: {
          ...user.publicMetadata,
          points: newPoints
        }
      });
      
      // 返回成功響應
      return NextResponse.json({ 
        success: true, 
        message: "用戶積分已更新",
        points: newPoints
      });
    } catch (clerkError) {
      console.error("更新用戶積分失敗:", clerkError);
      return NextResponse.json({ 
        success: false, 
        error: "更新用戶積分失敗" 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("更新用戶積分時出錯:", error);
    return NextResponse.json({ 
      success: false, 
      error: "服務器錯誤" 
    }, { status: 500 });
  }
} 