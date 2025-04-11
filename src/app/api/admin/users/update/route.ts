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
      // 獲取用戶當前數據
      const user = await clerkClient.users.getUser(body.userId);
      
      // 構建更新對象
      const updateData: any = {};
      
      // 處理用戶名 (姓名)
      if (body.username) {
        const nameParts = body.username.trim().split(' ');
        if (nameParts.length > 0) {
          updateData.firstName = nameParts[0];
          if (nameParts.length > 1) {
            updateData.lastName = nameParts.slice(1).join(' ');
          }
        }
      }
      
      // 處理角色和積分
      if (body.role !== undefined || body.points !== undefined) {
        updateData.publicMetadata = {
          ...user.publicMetadata
        };
        
        if (body.role !== undefined) {
          updateData.publicMetadata.role = body.role;
        }
        
        if (body.points !== undefined) {
          updateData.publicMetadata.points = body.points;
        }
      }
      
      // 調用Clerk API更新用戶
      await clerkClient.users.updateUser(body.userId, updateData);
      
      // 返回成功響應
      return NextResponse.json({ 
        success: true, 
        message: "用戶信息已更新"
      });
    } catch (clerkError) {
      console.error("更新用戶信息失敗:", clerkError);
      return NextResponse.json({ 
        success: false, 
        error: "更新用戶信息失敗" 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("更新用戶信息時出錯:", error);
    return NextResponse.json({ 
      success: false, 
      error: "服務器錯誤" 
    }, { status: 500 });
  }
} 