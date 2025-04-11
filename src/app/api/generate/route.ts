import { NextResponse } from 'next/server';

// API配置從環境變量中獲取
const API_KEY = process.env.API_KEY || "";
const API_BASE_URL = process.env.API_BASE_URL || "https://api.zhizengzeng.com/v1";
const PRIMARY_API_ENDPOINT = process.env.PRIMARY_API_ENDPOINT || `${API_BASE_URL}/images/generations`;
const BACKUP_API_ENDPOINT = process.env.BACKUP_API_ENDPOINT || PRIMARY_API_ENDPOINT;
const OPENAI_COMPATIBLE_ENDPOINT = process.env.OPENAI_COMPATIBLE_ENDPOINT || PRIMARY_API_ENDPOINT;
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || "30000", 10);
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || "2", 10);

// OpenAI兼容的DALL-E模型
const DALLE_MODEL = process.env.DALLE_MODEL || "dall-e-3";

// 遞歸查找對象中的圖片URL
function findImageUrlInObject(obj: any, depth: number = 0): string | null {
  // 防止過深遞歸
  if (depth > 5) return null;
  
  // 如果是null或undefined，直接返回
  if (obj === null || obj === undefined) return null;
  
  // 如果是字符串且看起來像URL，返回它
  if (typeof obj === 'string') {
    if (obj.startsWith('http') || obj.startsWith('https') || obj.startsWith('data:image')) {
      return obj;
    }
    return null;
  }
  
  // 檢查常見URL屬性名
  const urlProps = ['url', 'image', 'imageUrl', 'img', 'src', 'uri', 'link', 'href'];
  for (const prop of urlProps) {
    if (obj[prop] && typeof obj[prop] === 'string') {
      const val = obj[prop];
      if (val.startsWith('http') || val.startsWith('https') || val.startsWith('data:image')) {
        return val;
      }
    }
  }
  
  // 如果是數組，遍歷每個元素
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findImageUrlInObject(item, depth + 1);
      if (result) return result;
    }
  }
  
  // 如果是對象，遍歷所有屬性
  if (typeof obj === 'object') {
    for (const key in obj) {
      const result = findImageUrlInObject(obj[key], depth + 1);
      if (result) return result;
    }
  }
  
  return null;
}

interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  prompt?: string;
}

// 創建帶超時的fetch請求
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// 帶重試邏輯的fetch請求
async function fetchWithRetry(url: string, options: RequestInit, timeout: number, maxRetries: number, useOpenAIFormat: boolean = false) {
  let lastError;
  let currentEndpoint = url;
  let currentOptions = { ...options };
  let useOpenAIEndpoint = false;

  // 嘗試主端點和備用端點
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 如果不是第一次嘗試，切換到備用端點
      if (attempt === 1 && currentEndpoint === PRIMARY_API_ENDPOINT) {
        console.log(`主端點請求失敗，嘗試備用端點: ${BACKUP_API_ENDPOINT}`);
        currentEndpoint = BACKUP_API_ENDPOINT;
      } 
      // 如果是最後一次嘗試，切換到OpenAI兼容格式
      else if (attempt === 2 && !useOpenAIEndpoint && useOpenAIFormat) {
        console.log(`嘗試使用OpenAI兼容格式: ${OPENAI_COMPATIBLE_ENDPOINT}`);
        currentEndpoint = OPENAI_COMPATIBLE_ENDPOINT;
        useOpenAIEndpoint = true;
        
        // 轉換為OpenAI格式的請求體 - 使用DALL-E-3
        const originalBody = JSON.parse(options.body as string);
        const openAIBody = {
          model: DALLE_MODEL,  // 使用DALL-E-3
          prompt: originalBody.prompt,
          n: originalBody.n || 1,
          size: originalBody.size || "1024x1024",
          quality: originalBody.quality || "standard",
          response_format: "url"
        };
        
        currentOptions = {
          ...options,
          body: JSON.stringify(openAIBody)
        };
      }
      
      console.log(`API請求嘗試 ${attempt + 1}/${maxRetries + 1}: ${currentEndpoint}`);
      console.log("請求格式:", useOpenAIEndpoint ? "OpenAI兼容" : "原始AIGC");
      
      const response = await fetchWithTimeout(currentEndpoint, currentOptions, timeout);
      return { response, useOpenAIFormat: useOpenAIEndpoint, currentEndpoint };
    } catch (error: any) {
      lastError = error;
      console.error(`嘗試 ${attempt + 1} 失敗:`, error.message);
      
      // 如果這是最後一次嘗試，則拋出錯誤
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // 等待一段時間後重試
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  // 這裡不應該到達，但為了類型安全
  throw lastError;
}

export async function POST(request: Request): Promise<NextResponse<GenerateImageResponse>> {
  try {
    const { prompt, style = 'default', model = '基础版', images = [] } = await request.json();

    if (!prompt && !prompt.trim() && images.length === 0) {
      return NextResponse.json(
        { success: false, error: '請提供有效的文本描述或參考圖片' },
        { status: 400 }
      );
    }

    // 本地測試環境使用模擬數據 (只有在明確設置了 MOCK_API=true 時才使用)
    if (typeof process !== 'undefined' && 
        process.env.NODE_ENV !== 'production' && 
        process.env.MOCK_API === 'true') {
      console.log('本地開發環境使用模擬數據');
      
      // 模擬延遲
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 返回固定圖片URL
      return NextResponse.json({
        success: true,
        imageUrl: "https://placehold.co/1024x1024/EEE/31343C?text=開發環境模擬圖片",
        prompt
      });
    }

    // 下面的代碼僅在生產環境中執行

    // 生成風格提示詞映射
    const stylePrompts: Record<string, string> = {
      '默认': '',
      '吉卜力': 'Studio Ghibli style, anime style, fantasy, magical realism, whimsical, nostalgic atmosphere, ',
      '可爱 APP 图标': '3D cute app icon, toy style, high quality, minimal design, glossy finish, ',
      '皮克斯': 'Pixar style, 3D animation, family-friendly, colorful, creative, imaginative, ',
      '微缩工作室': 'Miniature studio, tiny world, Q-style 3D, game style, detailed, ',
      '结婚照': 'Wedding photo, professional portrait, romantic, elegant, high resolution, ',
      '玩具盒': 'Action figure in toy box, product packaging, collectible toy, details and accessories, ',
      '四格漫画': 'Four panel comic strip, cartoon style, office humor, modern workplace scenes, ',
      '老照片修复': 'Restored old photograph, vibrant colors, enhanced details, classic style, ',
      '像素 Voxel 风格': 'Voxel art, 3D pixel style, video game aesthetic, blocky design, ',
      '粘土风': 'Clay art style, claymation, tactile texture, cartoon character, ',
      '大理石雕像': 'Marble sculpture, hyperrealistic, elegant sheen, artistic craftsmanship, ',
      '疯狂涂鸦': 'Crazy doodle, handwritten Chinese annotations, creative, playful, ',
      '线条画': 'Colorful line art, outline drawing, minimalist, elegant, ',
      '文艺复兴': 'Renaissance painting style, classical art, dramatic lighting, rich colors, ',
      '黑板画': 'Blackboard drawing, chalk art, educational, text on blackboard, '
    };

    // 根據模型類型設置不同的參數
    const modelConfig = {
      '基础版': {
        quality: 'standard',
        width: 1024,
        height: 1024
      },
      '专业版': {
        quality: 'hd',
        width: 1024,
        height: 1024
      },
      '高级版': {
        quality: 'ultra',
        width: 1024,
        height: 1024
      }
    };

    // 获取模型配置
    const config = modelConfig[model as keyof typeof modelConfig] || modelConfig['基础版'];
    
    // 组合风格和提示词
    const stylePrompt = stylePrompts[style] || '';
    const fullPrompt = `${stylePrompt}${prompt}`;

    // 準備API請求主體
    const requestBody: any = {
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024", // 固定使用標準尺寸，避免格式問題
      quality: config.quality,
      response_format: "url",
      model: DALLE_MODEL
    };

    // 如果有上傳的圖片，嘗試添加到請求中
    // 注意：DALL-E-3可能不支持參考圖片，這裡做保險處理
    try {
      if (images && images.length > 0) {
        // 僅支持一張參考圖片
        const limitedImages = images.slice(0, 1);
        
        if (limitedImages.length > 0) {
          // 警告：這個功能可能不被支持
          requestBody.reference_images = limitedImages;
        }
      }
    } catch (e) {
      console.warn("添加參考圖片時出錯，將忽略參考圖片:", e);
      // 繼續處理，不中斷請求
    }

    console.log(`準備連接到API，將嘗試最多 ${MAX_RETRIES + 1} 次請求`);
    console.log(`請求參數: ${JSON.stringify({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.substring(0, 10)}...` // 只顯示部分API密鑰以保護安全
      },
      requestBody: {
        prompt: requestBody.prompt.substring(0, 30) + '...',
        model: requestBody.model,
        width: requestBody.width,
        height: requestBody.height,
        quality: requestBody.quality,
        imageCount: requestBody.reference_images?.length || 0
      }
    })}`);

    // 調用API生成圖片
    let apiResponse;
    let useOpenAIFormat = false;
    let currentEndpoint = PRIMARY_API_ENDPOINT; // 添加默認端點變數
    try {
      const result = await fetchWithRetry(PRIMARY_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          // 添加額外的頭信息，可能對智增增API有幫助
          'Accept': 'application/json',
          'User-Agent': 'ImageWeb/1.0'
        },
        body: JSON.stringify(requestBody)
      }, API_TIMEOUT, MAX_RETRIES, true);
      
      apiResponse = result.response;
      useOpenAIFormat = result.useOpenAIFormat;
      currentEndpoint = result.currentEndpoint; // 獲取當前使用的端點
      
      console.log(`API響應狀態: ${apiResponse.status} ${apiResponse.statusText}`);
      console.log(`使用的API格式: ${useOpenAIFormat ? 'OpenAI兼容' : '原始AIGC'}`);
      console.log(`使用的API端點: ${currentEndpoint}`);
    } catch (fetchError: any) {
      console.error('所有API連接嘗試失敗:', fetchError);
      
      // 提供更具體的錯誤信息
      let errorDetail = '未知網絡錯誤';
      if (fetchError.name === 'AbortError') {
        errorDetail = '請求超時，伺服器響應時間過長';
      } else if (fetchError.message) {
        errorDetail = fetchError.message;
      }
      
      return NextResponse.json(
        { success: false, error: `無法連接到圖像生成服務: ${errorDetail}，已嘗試所有可用端點` },
        { status: 503 }
      );
    }

    if (!apiResponse.ok) {
      let errorMessage = '圖片生成失敗';
      let originalError = null;
      try {
        const errorData = await apiResponse.json();
        console.error('API錯誤詳情:', JSON.stringify(errorData));
        originalError = errorData;
        errorMessage = errorData.error?.message || `圖片生成失敗，伺服器回應：${apiResponse.status} ${apiResponse.statusText}`;
      } catch (e) {
        console.error('無法解析API錯誤響應:', e);
      }
      
      console.error(`API請求失敗: 狀態碼=${apiResponse.status}, 訊息=${errorMessage}`);
      
      // 添加調試信息以幫助開發階段診斷問題
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { 
            success: false, 
            error: errorMessage,
            debug: {
              apiEndpoint: currentEndpoint,
              requestFormat: useOpenAIFormat ? 'OpenAI' : 'AIGC',
              statusCode: apiResponse.status,
              statusText: apiResponse.statusText,
              originalError
            }
          },
          { status: apiResponse.status }
        );
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: apiResponse.status }
      );
    }

    let data;
    try {
      data = await apiResponse.json();
      console.log('API成功響應完整數據:', JSON.stringify(data));
      console.log('API成功響應數據結構:', Object.keys(data));
    } catch (e) {
      console.error('無法解析API成功響應:', e);
      return NextResponse.json(
        { success: false, error: '無法解析圖像生成服務的回應' },
        { status: 500 }
      );
    }
    
    // 根據不同的API格式獲取圖片URL (針對智增增API調整)
    let imageUrl;
    
    // 檢查各種可能的響應格式
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      // 標準格式: { data: [ { url: "..." } ] }
      imageUrl = data.data[0]?.url;
      
      // 如果沒有直接的url屬性，嘗試查找其他可能的屬性
      if (!imageUrl && typeof data.data[0] === 'object') {
        imageUrl = data.data[0].image || data.data[0].b64_json || data.data[0].uri;
      }
    } else if (data.url) {
      // 直接URL格式: { url: "..." }
      imageUrl = data.url;
    } else if (data.image) {
      // 直接圖片格式: { image: "..." }
      imageUrl = data.image;
    } else if (data.data && typeof data.data === 'object') {
      // 嵌套對象格式
      if (data.data.url) {
        imageUrl = data.data.url;
      } else if (data.data.image) {
        imageUrl = data.data.image;
      } else if (data.data.b64_json) {
        // Base64格式
        imageUrl = `data:image/png;base64,${data.data.b64_json}`;
      }
    } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      // OpenAI相容格式
      if (typeof data.images[0] === 'string') {
        imageUrl = data.images[0];
      } else if (typeof data.images[0] === 'object') {
        imageUrl = data.images[0].url || data.images[0].image || data.images[0].b64_json;
        
        // 如果是Base64格式，轉換為Data URL
        if (data.images[0].b64_json) {
          imageUrl = `data:image/png;base64,${data.images[0].b64_json}`;
        }
      }
    } else if (data.result && typeof data.result === 'string') {
      // 結果字符串格式: { result: "http://..." }
      imageUrl = data.result;
    } else if (typeof data === 'string' && (data.startsWith('http') || data.startsWith('data:'))) {
      // API直接返回URL字符串
      imageUrl = data;
    }
    
    // 遞歸查找URL (如果上面的方法都沒找到)
    if (!imageUrl) {
      imageUrl = findImageUrlInObject(data);
    }
    
    // 如果找不到URL, 返回錯誤
    if (!imageUrl) {
      console.error('API未返回圖片URL, 完整響應:', JSON.stringify(data));
      
      // 開發環境下提供完整響應幫助調試
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { 
            success: false, 
            error: '圖片URL未返回，但API已成功響應', 
            debug: {
              fullResponse: data
            }
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: '圖片URL未返回，但API已成功響應' },
        { status: 500 }
      );
    }

    console.log('成功獲取圖片URL:', imageUrl.substring(0, 30) + '...');

    // 在實際應用中，這裡應該將生成記錄保存到數據庫
    console.log('生成圖片請求:', { 
      prompt, 
      style,
      model,
      userId: 'user_test_id',
      imagesCount: images ? images.length : 0
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt
    });
    
  } catch (error) {
    console.error('圖像生成錯誤:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '生成圖片時出錯，請稍後再試'
      },
      { status: 500 }
    );
  }
} 