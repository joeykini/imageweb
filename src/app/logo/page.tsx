import Image from 'next/image';
import Link from 'next/link';

export default function LogoPage() {
  // 圖標使用的相同源路徑
  const logoPath = "/logo.svg";
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">網站圖標</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">頂部導航圖標</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="border p-4 rounded-md flex items-center justify-center bg-gray-50">
              <Image 
                src={logoPath}
                alt="網站頂部圖標"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="ml-2">
              <p className="text-sm text-gray-600">尺寸: 20x20</p>
              <p className="text-sm text-gray-600">位置: 頂部導航 Logo</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <p>使用代碼:</p>
            <pre className="bg-gray-100 p-3 rounded-md mt-2 overflow-x-auto">
              {`<img alt="Site Logo" width="20" height="20" src="/logo.svg" />`}
            </pre>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">頁腳圖標</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="border p-4 rounded-md flex items-center justify-center bg-gray-50">
              <Image 
                src={logoPath}
                alt="頁腳圖標"
                width={14}
                height={14}
                className="object-contain"
              />
            </div>
            <div className="ml-2">
              <p className="text-sm text-gray-600">尺寸: 3.5x3.5 (14px)</p>
              <p className="text-sm text-gray-600">位置: 頁腳 Joey © 2025 前</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <p>使用代碼:</p>
            <pre className="bg-gray-100 p-3 rounded-md mt-2 overflow-x-auto">
              {`<img alt="Joey Course" className="w-3.5 h-3.5" src="/logo.svg" />`}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">下載圖標</h2>
        <p className="mb-4">您可以下載原始圖標文件，用於其他場景：</p>
        
        <Link 
          href={logoPath} 
          download="logo.svg"
          className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          下載圖標
        </Link>
      </div>
      
      <div className="mt-10 pt-4 border-t">
        <Link href="/" className="text-blue-600 hover:underline">
          返回首頁
        </Link>
      </div>

      <div className="mt-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">SVG 代碼</h2>
        <p className="mb-4">您可以直接使用以下 SVG 代碼：</p>
        <pre className="bg-white p-3 rounded-md overflow-x-auto border text-sm">
{`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#3B82F6"/>
  <path d="M16 8L22 14H18V22H14V14H10L16 8Z" fill="white"/>
  <path d="M8 24H24V26H8V24Z" fill="white"/>
</svg>`}
        </pre>
      </div>
    </div>
  );
} 