"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from 'next/link';
import Navbar from '../components/navbar';

// 定义模型和风格选项
const modelOptions = [
  { id: "basic", name: "基础版", description: "使用全特性模型，适合一般场景", pointCost: 100 },
  { id: "pro", name: "高级版", description: "高质量渲染，适合专业使用场景", pointCost: 150 }
];

const styleOptions = [
  { id: "default", name: "默认", description: "基础绘图风格，保持原始图像特征", image: "/images/samples/default.jpeg" },
  { id: "ghibli", name: "吉卜力", description: "宫崎骏动画风格，充满魔幻现实主义，温暖怀旧的氛围", image: "/images/samples/ghibli.jpeg" },
  { id: "cute_app_icon", name: "可爱 APP 图标", description: "可爱玩具风格，3D 风格，高质感，适用于单人模式", image: "/images/samples/app_icon.jpg" },
  { id: "marriage_photo", name: "结婚照", description: "上传至多两张照片后，生成一张结婚合影照", image: "/images/samples/marriage_photo.jpeg" },
  { id: "toy_box", name: "玩具盒", description: "将人物转化为可动人偶，包含配件和包装盒设计", image: "/images/samples/toy_box.jpg" },
  { id: "four_panel_comic", name: "四格漫画", description: "经典四格漫画布局，现代办公场景，卡通风格，幽默诙谐", image: "/images/samples/four_panel.jpg" },
  { id: "photo_restore", name: "老照片修复", description: "修复老照片，上色并提高清晰度", image: "/images/samples/photo_restore.jpeg" },
  { id: "voxel", name: "像素 Voxel 风格", description: "将图像转换为3D像素风格", image: "/images/samples/voxel.jpeg" },
  { id: "clay", name: "粘土风", description: "粘土质感，卡通风格，拟人化效果", image: "/images/samples/clay.jpeg" },
  { id: "marble_statue", name: "大理石雕像", description: "超写实大理石雕塑效果，展现优雅的光泽和艺术工艺", image: "/images/samples/marble.jpeg" },
  { id: "crazy_doodle", name: "疯狂涂鸦", description: "手写中文批注和涂鸦风格，充满创意和趣味性", image: "/images/samples/crazy_doodle.jpeg" },
  { id: "line_art", name: "线条画", description: "彩色线条绘画风格", image: "/images/samples/line_art.jpeg" },
  { id: "renaissance", name: "文艺复兴", description: "文艺复兴时期绘画风格", image: "/images/samples/renaissance.jpg" },
  { id: "black_board", name: "黑板画", description: "黑板画风格，需要提示词中包含黑板上的文案", image: "/images/samples/black_board.jpeg" },
];

export default function CreatePage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState("basic");
  const [selectedStyle, setSelectedStyle] = useState("cute_app_icon");
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [styleModalOpen, setStyleModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("generate");
  const [results, setResults] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingPoints, setRemainingPoints] = useState(200);
  const [points, setPoints] = useState<number>(200);
  const [error, setError] = useState<string | null>(null);

  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const styleButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styleModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
      
      // 檢測點擊風格對話框外部區域
      if (styleModalOpen && styleModalRef.current && !(styleModalRef.current.contains(event.target as Node))) {
        // 檢查點擊的不是風格按鈕本身
        if (styleButtonRef.current && !styleButtonRef.current.contains(event.target as Node)) {
          setStyleModalOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [styleModalOpen]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const handleFileUploadClick = () => document.getElementById('file-upload')?.click();
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value);
  
  // 获取当前选择的模型对应的积分消耗
  const getCurrentModelPointCost = () => {
    const currentModel = modelOptions.find(m => m.id === selectedModel);
    return currentModel?.pointCost || 100;
  };
  
  const handleGenerateImage = async () => {
    if (!prompt && !imageFile) return;
    
    const pointCost = getCurrentModelPointCost();
    
    setIsGenerating(true);
    setCurrentTab("results");
    setError(null); // 重置錯誤狀態
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          style: selectedStyle
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '生成圖片失敗');
      }

      setResults(data.images);
      setRemainingPoints(prev => prev - pointCost);
    } catch (error) {
      console.error('生成圖片錯誤:', error);
      setError(error instanceof Error ? error.message : '生成圖片時出錯，請稍後再試');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const canGenerate = (!!prompt || !!imageFile) && remainingPoints >= getCurrentModelPointCost();
  const selectedStyleOption = styleOptions.find(s => s.id === selectedStyle);

  // 獲取用戶積分
  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        // 這裡應該從API獲取用戶積分，現在簡單模擬
        // 實際項目中應該調用API: const response = await fetch('/api/user/points');
        setRemainingPoints(200); // 使用已有的狀態變量
      } catch (error) {
        console.error('獲取用戶積分失敗:', error);
      }
    };
    
    fetchUserPoints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧控制面板 */}
          <div className="w-full lg:w-5/12 space-y-4">
            <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm">
              {/* 模型选择 */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-900" htmlFor="model-select">选择模型</label>
                <div className="relative" ref={modelDropdownRef}>
                  <button 
                    type="button" 
                    role="combobox"
                    aria-controls="model-options"
                    id="model-select"
                    className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  >
                    <span>
                      <div className="flex items-center justify-between">
                        <div>
                          {modelOptions.find(m => m.id === selectedModel)?.name}
                          <span className="ml-2 text-xs text-gray-500">
                            {modelOptions.find(m => m.id === selectedModel)?.description}
                          </span>
                        </div>
                      </div>
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" height="24" viewBox="0 0 24 24" fill="none" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                      className="h-4 w-4 opacity-50"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>
                  
                  {modelDropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white text-gray-900 shadow-lg">
                      <div className="flex flex-col gap-1 p-1">
                        {modelOptions.map((option) => (
                          <button
                            key={option.id}
                            className={`flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100 ${selectedModel === option.id ? 'bg-gray-100 font-medium' : ''}`}
                            onClick={() => {
                              setSelectedModel(option.id);
                              setModelDropdownOpen(false);
                            }}
                          >
                            <div>
                              {option.name}
                              <span className="ml-2 text-xs text-gray-500">{option.description}</span>
                            </div>
                            <span className="text-xs text-blue-500">消耗 {option.pointCost} 积分</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 风格选择 */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-900" htmlFor="style-select">
                  选择生成风格
                </label>
                <button 
                  ref={styleButtonRef}
                  type="button" 
                  className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start"
                  onClick={() => setStyleModalOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded overflow-hidden">
                      <Image 
                        src={selectedStyleOption?.image || "/images/samples/default.jpeg"}
                        alt={selectedStyleOption?.name || "默认风格"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{selectedStyleOption?.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                        {selectedStyleOption?.description}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
              
              {/* 图片上传 */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-900">参考图片 (最多2张)</label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full">
                    <button 
                      onClick={handleFileUploadClick}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                    >
                      上传图片
                    </button>
                    <input 
                      id="file-upload" 
                      accept="image/*" 
                      className="hidden" 
                      type="file"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 w-full">
                    {imagePreview && (
                      <div className="relative aspect-square rounded overflow-hidden border">
                        <Image 
                          src={imagePreview} 
                          alt="Preview" 
                          fill
                          className="object-cover" 
                        />
                        <button 
                          onClick={handleRemoveImage}
                          className="absolute top-0.5 right-0.5 bg-white/80 rounded-full p-0.5 shadow-sm hover:bg-white"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="14" height="14" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 提示词输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-900" htmlFor="prompt">提示词</label>
                <textarea 
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-[200px]" 
                  id="prompt" 
                  placeholder="输入提示词..."
                  value={prompt}
                  onChange={handlePromptChange}
                />
              </div>
            </div>
            
            <div className="text-sm text-blue-500 mb-2">
              * 请上传参考图片或输入提示词，至少填写一项
            </div>
            
            {/* 生成按钮 */}
            <button 
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full ${!canGenerate ? 'opacity-50' : ''}`}
              disabled={!canGenerate}
              onClick={handleGenerateImage}
            >
              生成 (消耗 {getCurrentModelPointCost()} 积分)
              {!canGenerate && !prompt && !imageFile && <span className="ml-2 text-xs">请填写参考图片或提示词</span>}
              {!canGenerate && (prompt || imageFile) && remainingPoints < getCurrentModelPointCost() && <span className="ml-2 text-xs">积分不足</span>}
            </button>
            
            {/* 积分显示 */}
            <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <button 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setRemainingPoints(200)}
              >
                剩余积分 {remainingPoints}，点击刷新
              </button>
              <Link href="/pricing">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline py-2 px-3 h-auto text-sm font-medium bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:from-pink-500 hover:to-blue-500 transition-all duration-300">
                  立即充值 🚀
                </button>
              </Link>
            </div>
          </div>
          
          {/* 右侧结果展示 */}
          <div className="w-full lg:w-7/12 h-[500px] lg:h-auto">
            <div dir="ltr" data-orientation="horizontal" className="flex flex-col h-full">
              <div className="px-4">
                <div 
                  role="tablist" 
                  aria-orientation="horizontal" 
                  className="h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground grid w-full grid-cols-2"
                  tabIndex={0}
                >
                  <button 
                    type="button" 
                    role="tab" 
                    aria-selected={currentTab === 'generate'} 
                    data-state={currentTab === 'generate' ? 'active' : 'inactive'}
                    id="generate-tab"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow`}
                    onClick={() => setCurrentTab('generate')}
                  >
                    生成
                  </button>
                  <button 
                    type="button" 
                    role="tab" 
                    aria-selected={currentTab === 'results'} 
                    data-state={currentTab === 'results' ? 'active' : 'inactive'}
                    data-disabled={results.length === 0 && !isGenerating}
                    disabled={results.length === 0 && !isGenerating}
                    id="results-tab"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow`}
                    onClick={() => setCurrentTab('results')}
                  >
                    结果（请及时保存）
                  </button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 p-4">
                <div className="h-full border rounded-lg">
                  {/* 生成标签页 */}
                  <div 
                    data-state={currentTab === 'generate' ? 'active' : 'inactive'}
                    data-orientation="horizontal"
                    role="tabpanel" 
                    aria-labelledby="generate-tab"
                    id="generate-tab-content"
                    tabIndex={0}
                    hidden={currentTab !== 'generate'}
                    className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-full p-6 overflow-auto"
                  >
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                        className="w-12 h-12 opacity-20"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                    </div>
                  </div>
                  
                  {/* 结果标签页 */}
                  <div 
                    data-state={currentTab === 'results' ? 'active' : 'inactive'}
                    data-orientation="horizontal"
                    role="tabpanel" 
                    aria-labelledby="results-tab"
                    id="results-tab-content"
                    tabIndex={0}
                    hidden={currentTab !== 'results'}
                    className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-full p-6"
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 风格选择对话框 */}
        {styleModalOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div>
            <div
              ref={styleModalRef}
              role="dialog"
              aria-labelledby="style-dialog-title"
              aria-describedby="style-dialog-description"
              className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[800px]"
            >
              <h2 id="style-dialog-title" className="text-lg font-semibold leading-none tracking-tight">选择生成风格</h2>
              <div className="relative overflow-hidden h-[600px] pr-4">
                <div className="h-full w-full rounded-[inherit]" style={{ overflow: "hidden scroll" }}>
                  <div style={{ minWidth: "100%", display: "table" }}>
                    <div className="grid grid-cols-4 gap-3">
                      {styleOptions.map((style) => (
                        <div 
                          key={style.id}
                          className={`flex flex-col gap-1.5 p-1.5 rounded-lg border hover:bg-accent cursor-pointer ${selectedStyle === style.id ? 'border-primary' : ''}`}
                          onClick={() => {
                            setSelectedStyle(style.id);
                            setStyleModalOpen(false);
                          }}
                        >
                          <div className="relative w-full aspect-square rounded overflow-hidden">
                            <Image 
                              src={style.image} 
                              alt={style.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="space-y-0.5 w-full">
                            <h3 className="font-medium text-xs truncate">{style.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 break-words">{style.description}</p>
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
                onClick={() => setStyleModalOpen(false)}
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
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 