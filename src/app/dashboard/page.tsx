"use client";

import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Navbar from "../components/navbar";
import { ErrorBoundary } from "react-error-boundary";

// 錯誤回退組件
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="bg-red-50 p-6 rounded-lg text-center">
      <h2 className="text-xl font-semibold text-red-800 mb-2">出錯了</h2>
      <p className="text-red-700 mb-4">發生了一個錯誤：{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        重試
      </button>
    </div>
  );
}

const promptSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required.",
  }),
});

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  // 默認關閉模擬模式
  const [useMockData, setUseMockData] = useState(false);
  const maxRetries = 2;
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const styleDialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState({
    name: "默认",
    description: "基础绘图风格，保持原始图像特征",
    image: "/images/samples/default.jpeg"
  });
  const [selectedModel, setSelectedModel] = useState({
    name: "基础版",
    description: "基于DALL-E-3，使用AI繪圖模型，适合一般场景",
    cost: 80
  });
  const [activeTab, setActiveTab] = useState('generate');

  const styleOptions = [
    { name: "默认", description: "基础绘图风格，保持原始图像特征", image: "/images/samples/default.jpeg" },
    { name: "吉卜力", description: "宫崎骏动画风格，充满魔幻现实主义，温暖怀旧的氛围", image: "/images/samples/ghibli.jpeg" },
    { name: "可爱 APP 图标", description: "可爱玩具风格，3D 风格，高质感，适用于单人模式", image: "/images/samples/app_icon.jpg" },
    { name: "皮克斯", description: "皮克斯动画风格，充满创意和想象力，适合儿童和家庭", image: "/images/samples/13.jpeg" },
    { name: "微缩工作室", description: "微缩工作室风格，Q版3D游戏风", image: "/images/samples/mini_workspace.jpeg" },
    { name: "结婚照", description: "上传至多两张照片后，生成一张结婚合影照", image: "/images/samples/marriage_photo.jpeg" },
    { name: "玩具盒", description: "将人物转化为可动人偶，包含配件和包装盒设计", image: "/images/samples/toy_box.jpg" },
    { name: "四格漫画", description: "经典四格漫画布局，现代办公场景，卡通风格，幽默诙谐", image: "/images/samples/four_panel.jpg" },
    { name: "老照片修复", description: "修复老照片，上色并提高清晰度", image: "/images/samples/photo_restore.jpeg" },
    { name: "像素 Voxel 风格", description: "将图像转换为3D像素风格", image: "/images/samples/voxel.jpeg" },
    { name: "粘土风", description: "粘土质感，卡通风格，拟人化效果", image: "/images/samples/clay.jpeg" },
    { name: "大理石雕像", description: "超写实大理石雕塑效果，展现优雅的光泽和艺术工艺", image: "/images/samples/marble.jpeg" },
    { name: "疯狂涂鸦", description: "手写中文批注和涂鸦风格，充满创意和趣味性", image: "/images/samples/crazy_doodle.jpeg" },
    { name: "线条画", description: "彩色线条绘画风格", image: "/images/samples/line_art.jpeg" },
    { name: "文艺复兴", description: "文艺复兴时期绘画风格", image: "/images/samples/renaissance.jpg" },
    { name: "黑板画", description: "黑板画风格，需要提示词中包含黑板上的文案", image: "/images/samples/black_board.jpeg" }
  ];

  const modelOptions = [
    { name: "基础版", description: "基于DALL-E-3，使用AI繪圖模型，适合一般场景", cost: 80 },
    { name: "专业版", description: "基于DALL-E-3 HD，更高质量输出，适合专业场景", cost: 120 },
    { name: "高级版", description: "基于DALL-E-3 Ultra，最高质量，最高精度", cost: 200 }
  ];

  useEffect(() => {
    // 確保用戶已登錄
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // 處理點擊文檔其他區域關閉下拉選單和對話框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 處理模型下拉選單
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      
      // 處理風格對話框
      if (isStyleDialogOpen && styleDialogRef.current && !styleDialogRef.current.contains(event.target as Node)) {
        setIsStyleDialogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStyleDialogOpen]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // 檢查是否有提示詞或上傳的圖片
      if (!prompt.trim() && uploadedImages.length === 0) {
        setError("請輸入提示詞或上傳參考圖片");
        setIsLoading(false);
        return;
      }

      // 如果使用模擬數據模式，直接返回模擬圖片
      if (useMockData) {
        console.log("使用本地模擬數據模式");
        // 模擬API請求延遲
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult("https://placehold.co/1024x1024/EEE/31343C?text=本地模擬圖片");
        
        // 切換到結果標籤頁
        switchToResultsTab();
        setIsLoading(false);
        return;
      }

      // 準備上傳的圖片數據（如果有）
      let imagesData: string[] = [];
      if (uploadedImages.length > 0) {
        imagesData = uploadedImages.map(image => {
          // 從 data URL 中提取實際的 base64 字符串
          const base64Part = image.split(',')[1];
          if (!base64Part) {
            console.error("無法從圖片中提取Base64數據");
            return "";
          }
          return base64Part;
        }).filter(data => data !== ""); // 過濾掉無效的數據
      }

      console.log("提交數據:", { 
        prompt: prompt.trim(),
        style: selectedStyle.name,
        model: selectedModel.name,
        imagesCount: imagesData.length,
        retryAttempt: retryCount + 1
      });

      const sendRequest = async () => {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            prompt: prompt.trim(),
            style: selectedStyle.name,
            model: selectedModel.name,
            images: imagesData
          }),
        });

        if (!response.ok) {
          let errorMessage = "生成圖片時出錯";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
            
            // 開發環境下顯示調試信息
            if (errorData.debug) {
              const debugInfo = JSON.stringify(errorData.debug, null, 2);
              console.error('API調試信息:', debugInfo);
              errorMessage += `\n\n開發模式調試信息: ${debugInfo}`;
            }
          } catch (e) {
            console.error("無法解析錯誤響應:", e);
            errorMessage = `伺服器錯誤 (${response.status}): 請稍後再試`;
          }
          throw new Error(errorMessage);
        }

        let data;
        try {
          data = await response.json();
        } catch (e) {
          console.error("無法解析成功響應:", e);
          throw new Error("無法解析伺服器響應");
        }

        if (data.success && data.imageUrl) {
          setResult(data.imageUrl);
          setRetryCount(0); // 成功後重置重試計數
          
          // 切換到結果標籤頁
          switchToResultsTab();
        } else {
          throw new Error(data.error || "生成圖片失敗，請稍後再試");
        }
      };

      try {
        await sendRequest();
      } catch (apiError: any) {
        console.error("API請求錯誤:", apiError);
        
        // 檢查是否可以重試 (網絡錯誤或連接問題)
        const isNetworkError = 
          apiError instanceof TypeError || 
          apiError.message.includes('網絡') || 
          apiError.message.includes('連接') || 
          apiError.message.includes('無法連接') ||
          apiError.message.includes('超時');
          
        if (retryCount < maxRetries && isNetworkError) {
          setError(`連接失敗，正在嘗試重新連接...(${retryCount + 1}/${maxRetries + 1})`);
          setRetryCount(prev => prev + 1);
          
          // 延遲1.5秒後重試
          setTimeout(() => {
            handleSubmit();
          }, 1500);
          return;
        }
        
        // 重試次數用完或非網絡錯誤，直接拋出
        throw apiError;
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError(error.message || "生成圖片時出錯");
      }
      console.error("Error:", error);
      
      // 如果不是在重試過程中，重置重試計數
      if (!error.message?.includes('正在嘗試重新連接')) {
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // 檢查檔案大小限制 (4MB)
    const file = files[0];
    if (file.size > 4 * 1024 * 1024) {
      setError("圖片大小不能超過 4MB");
      return;
    }
    
    // 檢查已上傳的圖片數量
    if (uploadedImages.length >= (selectedModel.name === "高级版" ? 4 : 2)) {
      setError(`${selectedModel.name}最多可上傳 ${selectedModel.name === "高级版" ? 4 : 2} 張圖片`);
      return;
    }
    
    // 讀取並顯示圖片
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        setUploadedImages((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // 切換到結果頁的函數
  const switchToResultsTab = () => {
    setActiveTab('results');
  };

  // 切換到生成頁的函數
  const switchToGenerateTab = () => {
    setActiveTab('generate');
  };

  // 如果用戶信息還在加載中，顯示加載狀態
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 sm:pt-16">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <div className="w-full h-96 flex justify-center items-center">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="max-w-[75rem] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-[10px]">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // 重置應用狀態
            setPrompt("");
            setIsLoading(false);
            setError(null);
            setResult(null);
            setRetryCount(0);
            // 可能需要其他狀態重置
          }}
        >
          <div className="grid gap-4 sm:gap-6 pb-2 sm:pb-4">
            <div>
              <div className="draw-container bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="mx-auto p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-5/12 space-y-4">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-4">
                          <div className="w-full relative" ref={modelDropdownRef}>
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="model-select">选择模型</label>
                            <button 
                              type="button" 
                              role="combobox" 
                              aria-expanded={isModelDropdownOpen}
                              aria-autocomplete="none" 
                              dir="ltr" 
                              data-state={isModelDropdownOpen ? "open" : "closed"}
                              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1" 
                              id="model-select"
                              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            >
                              <span style={{ pointerEvents: "none" }}>
                                <div className="flex w-full items-center justify-between">
                                  <div>
                                    {selectedModel.name}
                                    <span className="ml-2 text-xs text-gray-500">{selectedModel.description}</span>
                                    <small className="ml-2 text-xs text-blue-500">{selectedModel.cost} 积分</small>
                                  </div>
                                </div>
                              </span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 opacity-50" aria-hidden="true">
                                <path d="m6 9 6 6 6-6"></path>
                              </svg>
                            </button>
                            
                            {isModelDropdownOpen && (
                              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                                <ul className="py-1 max-h-60 overflow-auto">
                                  {modelOptions.map((model, index) => (
                                    <li 
                                      key={index}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setSelectedModel(model);
                                        setIsModelDropdownOpen(false);
                                      }}
                                    >
                                      <div>
                                        {model.name}
                                        <span className="ml-2 text-xs text-gray-500">{model.description}</span>
                                        <small className="ml-2 text-xs text-blue-500">{model.cost} 积分</small>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="w-full">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="style-select">选择生成风格</label>
                            <div className="space-y-2">
                              <button 
                                className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start" 
                                type="button" 
                                aria-haspopup="dialog" 
                                aria-expanded="false" 
                                data-state="closed"
                                onClick={() => setIsStyleDialogOpen(true)}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="relative w-6 h-6 rounded overflow-hidden">
                                    <img 
                                      alt={selectedStyle.name} 
                                      loading="lazy" 
                                      decoding="async" 
                                      className="object-cover" 
                                      src={selectedStyle.image} 
                                      style={{ position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" }}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span>{selectedStyle.name}</span>
                                    <span className="text-xs text-muted-foreground/70 truncate pt-0.5">{selectedStyle.description}</span>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-col gap-4">
                            <div className="w-full">
                              <label className="text-sm font-medium leading-none">
                                参考图片 (最多 {selectedModel.name === "高级版" ? 4 : 2} 张，体积 4MB，已使用 {(uploadedImages.length * 2).toFixed(1)}MB)
                              </label>
                              <div className="flex flex-row gap-2 w-full mt-2 flex-wrap">
                                {uploadedImages.map((image, index) => (
                                  <div key={index} className="relative w-12 h-12 sm:w-24 sm:h-24 shrink-0">
                                    <div className="w-full h-full rounded-md overflow-hidden">
                                      <Image
                                        src={image}
                                        alt={`上傳的圖片 ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <button
                                      onClick={() => removeImage(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                
                                {uploadedImages.length < (selectedModel.name === "高级版" ? 4 : 2) && (
                                  <div className="draw-image-upload-button w-12 h-12 sm:w-24 sm:h-24 shrink-0">
                                    <button 
                                      className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-full h-full flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-0"
                                      onClick={handleImageUploadClick}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-plus w-3 h-3 sm:w-6 sm:h-6"
                                      >
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5v14"></path>
                                      </svg>
                                      <span className="text-[10px] sm:text-xs">添加图片</span>
                                    </button>
                                    <input 
                                      id="file-upload" 
                                      accept="image/*" 
                                      className="hidden" 
                                      type="file" 
                                      ref={fileInputRef}
                                      onChange={handleImageUpload}
                                    />
                                  </div>
                                )}
                              </div>
                              {error && error.includes("圖片") && (
                                <p className="text-xs text-red-500 mt-1">{error}</p>
                              )}
                            </div>

                            <div className="w-full">
                              <label className="text-sm font-medium leading-none" htmlFor="prompt">
                                提示词
                              </label>
                              <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-[60px] mt-2"
                                placeholder="输入提示词..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-blue-500 mb-2">
                        * 请上传参考图片或输入提示词，至少填写一项
                      </div>

                      {process.env.NODE_ENV === 'development' && (
                        <div className="mb-2 flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                          <span className="text-xs text-gray-700">本地開發模式</span>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-600 mr-2">使用模擬數據</span>
                            <button 
                              onClick={() => setUseMockData(!useMockData)}
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useMockData ? 'bg-blue-600' : 'bg-gray-300'}`}
                              role="switch"
                              aria-checked={useMockData}
                            >
                              <span className={`pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useMockData ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={isLoading || (!prompt.trim() && uploadedImages.length === 0)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        onClick={handleSubmit}
                      >
                        {isLoading ? (
                          retryCount > 0 ? (
                            <>
                              <span className="animate-pulse">重新連接中 ({retryCount}/{maxRetries})</span>
                              <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </>
                          ) : (
                            <>
                              生成中...
                              <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </>
                          )
                        ) : (
                          <>
                            {useMockData ? '生成模擬圖片' : `生成 (消耗 ${selectedModel.cost} 积分)`}
                            {!prompt.trim() && uploadedImages.length === 0 && <span className="ml-2 text-xs">请填写参考图片或提示词</span>}
                          </>
                        )}
                      </button>
                      
                      {useMockData && (
                        <div className="mt-1 text-xs text-amber-600 text-center">
                          當前使用模擬數據模式，不會實際調用API或消耗積分
                        </div>
                      )}

                      <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                          剩余积分 200，点击刷新
                        </button>
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline py-2 px-1 h-auto text-sm font-medium bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:to-blue-500 transition-all duration-300">
                          立即充值 🚀
                        </button>
                      </div>
                    </div>

                    <div className="w-full md:w-7/12 h-[500px] md:h-auto">
                      <div dir="ltr" data-orientation="horizontal" className="flex flex-col h-full">
                        <div className="px-4">
                          <div role="tablist" aria-orientation="horizontal" className="h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground grid w-full grid-cols-2" tabIndex={0} data-orientation="horizontal" style={{ outline: "none" }}>
                            <button 
                              type="button" 
                              role="tab" 
                              aria-selected={activeTab === 'generate'} 
                              aria-controls="content-generate" 
                              data-state={activeTab === 'generate' ? "active" : "inactive"} 
                              id="trigger-generate" 
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow" 
                              tabIndex={activeTab === 'generate' ? 0 : -1} 
                              data-orientation="horizontal"
                              onClick={() => switchToGenerateTab()}
                            >
                              生成
                            </button>
                            <button 
                              type="button" 
                              role="tab" 
                              aria-selected={activeTab === 'results'} 
                              aria-controls="content-results" 
                              data-state={activeTab === 'results' ? "active" : "inactive"} 
                              data-disabled={!result} 
                              disabled={!result} 
                              id="trigger-results" 
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow" 
                              tabIndex={activeTab === 'results' ? 0 : -1} 
                              data-orientation="horizontal"
                              onClick={() => result && switchToResultsTab()}
                            >
                              结果
                            </button>
                          </div>
                        </div>

                        <div className="tabs-content-container flex-1 min-h-0 p-4">
                          <div className="h-full border rounded-lg">
                            <div 
                              data-state={activeTab === 'generate' ? "active" : "inactive"} 
                              data-orientation="horizontal" 
                              role="tabpanel" 
                              aria-labelledby="trigger-generate" 
                              id="content-generate" 
                              tabIndex={0} 
                              className={`ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-full p-6 overflow-auto ${activeTab !== 'generate' ? 'hidden' : ''}`}
                            >
                              {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                  <p className="mt-4 text-gray-600">
                                    {retryCount > 0 
                                      ? `連接失敗，正在嘗試重新連接...(${retryCount}/${maxRetries + 1})` 
                                      : "生成中，請稍候..."}
                                  </p>
                                  {retryCount > 0 && (
                                    <p className="mt-2 text-xs text-amber-600">
                                      如果多次連接失敗，可能是網絡問題或API服務暫時不可用
                                    </p>
                                  )}
                                </div>
                              ) : error ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                  <div className="text-red-500 text-center max-w-lg">
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                                      <h3 className="text-lg font-medium text-red-800 mb-2">出錯了</h3>
                                      <p className="text-red-700">{error.split('\n\n')[0]}</p>
                                    </div>
                                    
                                    {error.includes('開發模式調試信息:') && (
                                      <div className="mt-2 text-xs text-left w-full bg-gray-100 p-3 rounded overflow-auto max-h-[200px] border border-gray-300">
                                        <div className="font-medium mb-1 text-gray-700">開發模式調試信息：</div>
                                        <pre className="text-gray-800">{error.split('開發模式調試信息:')[1]}</pre>
                                      </div>
                                    )}
                                    
                                    <div className="flex space-x-3 mt-4 justify-center">
                                      <button
                                        onClick={() => {
                                          setError(null);
                                          // 如果是連接錯誤，重置重試計數並重新提交
                                          if (error.includes('連接') || error.includes('網絡')) {
                                            setRetryCount(0);
                                            setTimeout(() => handleSubmit(), 500);
                                          }
                                        }}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                      >
                                        重試
                                      </button>
                                      
                                      {process.env.NODE_ENV === 'development' && (
                                        <button
                                          onClick={() => {
                                            // 以提示用戶在開發模式下使用模擬數據
                                            alert('在本地開發時，可以通過添加環境變量 MOCK_API=true 來使用模擬數據，避免API連接錯誤。\n\n請在項目根目錄創建 .env.local 文件並添加：\nMOCK_API=true');
                                          }}
                                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                          開發提示
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                  <div className="max-w-md space-y-2 px-4">
                                    <ul>
                                      <li className="flex items-center p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                        <span className="mr-2">🚶</span>
                                        <span className="text-sm text-amber-700">图片生成速度比较慢，平均每张在 1-2 分钟，请耐心等待</span>
                                      </li>
                                      <li className="flex items-center p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                        <span className="mr-2">💰</span>
                                        <span className="text-sm text-emerald-700">图片失败不会扣除积分，如果遇到错误扣分，请截图联系反馈，可以返还积分</span>
                                      </li>
                                      <li className="flex items-center p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                        <span className="mr-2">🔄</span>
                                        <span className="text-sm text-blue-700">参考图片和提示词是二选一关系，只需要有一项</span>
                                      </li>
                                      <li className="flex items-center p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                        <span className="mr-2">🖼️</span>
                                        <span className="text-sm text-purple-700">基础版最多 2 张参考图片，高级版可以上传 4 张</span>
                                      </li>
                                      <li className="flex items-center p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                        <span className="mr-2">⭐</span>
                                        <span className="text-sm text-orange-700">基础版与高级版的模型是一样的，但是高级版的稳定性更高</span>
                                      </li>
                                      <li className="flex items-center p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                        <span className="mr-2">💡</span>
                                        <span className="text-sm text-indigo-700">如果风格提示词不满意，可以考虑使用默认风格加自定义提示词</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div 
                              data-state={activeTab === 'results' ? "active" : "inactive"} 
                              data-orientation="horizontal" 
                              role="tabpanel" 
                              aria-labelledby="trigger-results" 
                              id="content-results" 
                              tabIndex={0} 
                              className={`ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-full p-6 ${activeTab !== 'results' ? 'hidden' : ''}`}
                            >
                              {result && (
                                <div className="flex flex-col items-center justify-center h-full">
                                  <div className="relative w-full aspect-square max-w-md mx-auto mb-4">
                                    <Image
                                      src={result}
                                      alt="Generated image"
                                      fill
                                      className="object-contain rounded-md shadow-md"
                                      onError={(e) => {
                                        // 圖片載入失敗時顯示占位符
                                        console.error("圖片載入失敗:", result);
                                        e.currentTarget.src = "https://placehold.co/1024x1024/EEE/31343C?text=圖片載入失敗";
                                      }}
                                    />
                                  </div>
                                  <div className="flex space-x-2 mt-4">
                                    <a
                                      href={result}
                                      download="generated-image.png"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                      下載圖片
                                    </a>
                                    <button
                                      onClick={() => {
                                        setResult(null);
                                        // 切換回生成標籤頁
                                        switchToGenerateTab();
                                      }}
                                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                      重新生成
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </main>

      {/* 風格選擇對話框 */}
      {isStyleDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div 
            ref={styleDialogRef}
            role="dialog" 
            aria-describedby="radix-:r1d:" 
            aria-labelledby="radix-:r1c:" 
            data-state="open" 
            className="relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg sm:max-w-[800px]" 
            tabIndex={-1} 
            style={{ pointerEvents: 'auto' }}
          >
            <h2 id="radix-:r1c:" className="text-lg font-semibold leading-none tracking-tight">选择生成风格</h2>
            <div dir="ltr" className="relative overflow-hidden h-[600px] pr-4" style={{ position: 'relative' }}>
              <div data-radix-scroll-area-viewport="" className="h-full w-full rounded-[inherit]" style={{ overflow: 'hidden scroll' }}>
                <div style={{ minWidth: '100%', display: 'table' }}>
                  <div className="grid grid-cols-4 gap-3">
                    {styleOptions.map((style, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col gap-1.5 p-1.5 rounded-lg border hover:bg-accent cursor-pointer" 
                        onClick={() => {
                          setSelectedStyle(style);
                          setIsStyleDialogOpen(false);
                        }}
                      >
                        <div className="relative w-full aspect-square rounded overflow-hidden">
                          <img 
                            alt={style.name} 
                            loading="lazy" 
                            decoding="async" 
                            className="object-contain" 
                            src={style.image} 
                            style={{ position: 'absolute', height: '100%', width: '100%', inset: 0, color: 'transparent' }}
                          />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="font-medium text-xs">{style.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{style.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button 
              type="button" 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => setIsStyleDialogOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 