import { authMiddleware } from "@clerk/nextjs";

// 使用Clerk的authMiddleware進行路由保護
export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/pricing',
    '/contact',
    '/faq'
  ]
});

// 配置匹配的路徑
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|favicon.ico).*)'],
}; 