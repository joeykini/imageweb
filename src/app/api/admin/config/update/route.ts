import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';

// 更新環境變量文件
function updateEnvFile(filePath: string, updates: Record<string, string>) {
  try {
    // 如果文件不存在，創建一個空文件
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
    }
    
    // 讀取當前環境變量
    let envContent = fs.readFileSync(filePath, 'utf8');
    const envLines = envContent.split('\n');
    const updatedLines = [...envLines];
    
    // 遍歷需要更新的變量
    for (const [key, value] of Object.entries(updates)) {
      const escapedValue = value.includes(' ') ? `"${value}"` : value;
      const newLine = `${key}=${escapedValue}`;
      
      // 查找是否已經存在該變量
      const index = envLines.findIndex(line => {
        return line.trim() && line.match(new RegExp(`^${key}=`));
      });
      
      if (index >= 0) {
        // 更新已存在的變量
        updatedLines[index] = newLine;
      } else {
        // 添加新變量
        updatedLines.push(newLine);
      }
    }
    
    // 寫入更新後的內容
    fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
    return true;
  } catch (error) {
    console.error('更新環境變量失敗:', error);
    return false;
  }
}

// 更新API配置
export async function POST(request: Request) {
  try {
    // 檢查管理員權限 (這裡應該有更完善的權限檢查)
    // const session = await getServerSession();
    // if (!session || !session.user || !(session.user as any).isAdmin) {
    //   return NextResponse.json({ success: false, error: '未授權訪問' }, { status: 401 });
    // }
    
    // 解析請求體
    const body = await request.json();
    
    // 驗證請求數據
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ 
        success: false, 
        error: '無效的請求數據' 
      }, { status: 400 });
    }
    
    // 準備更新的環境變量
    const updates: Record<string, string> = {};
    
    // 更新API密鑰
    if (body.apiKey !== undefined) {
      updates.API_KEY = body.apiKey;
    }
    
    // 更新API基礎URL
    if (body.baseUrl !== undefined) {
      updates.API_BASE_URL = body.baseUrl;
    }
    
    // 更新主要API端點
    if (body.primaryApiEndpoint !== undefined) {
      updates.PRIMARY_API_ENDPOINT = body.primaryApiEndpoint;
    }
    
    // 更新備用API端點
    if (body.backupApiEndpoint !== undefined) {
      updates.BACKUP_API_ENDPOINT = body.backupApiEndpoint;
    }
    
    // 更新API超時設置
    if (body.apiTimeout !== undefined) {
      updates.API_TIMEOUT = body.apiTimeout.toString();
    }
    
    // 更新最大重試次數
    if (body.maxRetries !== undefined) {
      updates.MAX_RETRIES = body.maxRetries.toString();
    }
    
    // 沒有需要更新的數據
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '未提供要更新的數據' 
      }, { status: 400 });
    }
    
    // 更新環境變量文件
    const envPath = path.join(process.cwd(), '.env.local');
    const updated = updateEnvFile(envPath, updates);
    
    if (!updated) {
      return NextResponse.json({ 
        success: false, 
        error: '更新環境變量失敗' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'API配置已更新' 
    });
    
  } catch (error) {
    console.error('更新API配置失敗:', error);
    return NextResponse.json({ 
      success: false, 
      error: '更新API配置失敗' 
    }, { status: 500 });
  }
} 