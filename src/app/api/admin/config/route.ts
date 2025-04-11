import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';

// 讀取環境變量文件
function parseEnvFile(filePath: string) {
  try {
    const envContent = fs.readFileSync(filePath, 'utf8');
    const envVars: Record<string, string> = {};
    
    envContent.split('\n').forEach(line => {
      // 忽略注釋和空行
      if (line.trim() && !line.startsWith('#')) {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1'); // 去除引號
          envVars[key] = value;
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('讀取環境變量失敗:', error);
    return {};
  }
}

// 獲取API配置
export async function GET(request: Request) {
  try {
    // 檢查管理員權限 (這裡應該有更完善的權限檢查)
    // const session = await getServerSession();
    // if (!session || !session.user || !(session.user as any).isAdmin) {
    //   return NextResponse.json({ success: false, error: '未授權訪問' }, { status: 401 });
    // }
    
    // 獲取環境變量
    const envPath = path.join(process.cwd(), '.env.local');
    const envVars = parseEnvFile(envPath);
    
    // 提取API相關配置
    const apiConfig = {
      apiKey: envVars.API_KEY || '',
      baseUrl: envVars.API_BASE_URL || 'https://api.zhizengzeng.com/v1',
      primaryApiEndpoint: envVars.PRIMARY_API_ENDPOINT || '',
      backupApiEndpoint: envVars.BACKUP_API_ENDPOINT || '',
      apiTimeout: parseInt(envVars.API_TIMEOUT || '30000', 10),
      maxRetries: parseInt(envVars.MAX_RETRIES || '2', 10)
    };
    
    return NextResponse.json({ 
      success: true, 
      config: apiConfig
    });
    
  } catch (error) {
    console.error('獲取API配置失敗:', error);
    return NextResponse.json({ 
      success: false, 
      error: '獲取API配置失敗' 
    }, { status: 500 });
  }
} 