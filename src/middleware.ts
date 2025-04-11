// 注意：使用Clerk時，這個中間件不需要，已經在根目錄的middleware.ts中設置了Clerk的authMiddleware
// 此文件保留做參考，但不再生效

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 基本的中間件，只是傳遞請求，實際授權檢查在根目錄的middleware.ts中處理
export function middleware(request: NextRequest) {
  // 簡單返回 NextResponse.next() 以繼續處理請求
  return NextResponse.next();
}

// 只匹配少數路徑，避免與根目錄的middleware衝突
export const config = {
  matcher: ['/api/user-specific-routes/:path*'],
};

/* import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 基本的中間件，暫時不做額外檢查
export function middleware(request: NextRequest) {
  // 簡單返回 NextResponse.next() 以繼續處理請求
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; */ 