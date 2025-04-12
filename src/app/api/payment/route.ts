import { NextRequest, NextResponse } from 'next/server';
import { createPayment, PaymentMethod } from '@/lib/payment'; 
import { db } from '@/lib/db';

// 可用的支付套餐
const PACKAGES = [
  { id: 'free', name: '免費試用', price: 0, points: 300 },
  { id: 'basic', name: '新手套裝', price: 1000, points: 1000 },
  { id: 'pro', name: '專業套餐', price: 5000, points: 5500 },
  { id: 'ultimate', name: '旗艦套餐', price: 10000, points: 12000 },
];

// 可用的支付方式
const PAYMENT_METHODS = [
  { id: 'epay', name: '彩虹易支付', description: '微信/支付寶/QQ錢包' },
  { id: 'usdt', name: 'USDT', description: 'TRC20網絡' }
];

// 簡單的用戶認證函數 (模擬)
function getUserId(req: NextRequest): string | null {
  // 從 cookie 或 header 中獲取用戶ID
  // 實際應用中應該從 JWT 或 session 中獲取
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 從 cookie 中獲取
  const cookies = req.cookies;
  const userIdCookie = cookies.get('userId');
  
  // 如果没有找到用戶ID，這裏模擬生成一個臨時ID
  return userIdCookie?.value || `user_${Date.now()}`;
}

export async function GET(req: NextRequest) {
  try {
    // 獲取查詢參數
    const searchParams = req.nextUrl.searchParams;
    const method = searchParams.get('method');
    const packageId = searchParams.get('packageId');
    const amount = searchParams.get('amount');
    
    // 檢查是否是支付初始化請求
    if (method && packageId && amount) {
      const userId = getUserId(req);
      if (!userId) {
        return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
      }
      
      // 創建訂單
      const selectedPackage = PACKAGES.find(p => p.id === packageId);
      if (!selectedPackage) {
        return NextResponse.json({ error: '無效的套餐' }, { status: 400 });
      }
      
      // 創建訂單記錄
      const order = await db.order.create({
        data: {
          userId,
          packageId,
          amount: parseInt(amount),
          paymentMethod: method,
          status: 'pending',
          pointsToAdd: selectedPackage.points
        }
      });
      
      // 創建支付
      const paymentResult = await createPayment(method as PaymentMethod, {
        userId,
        amount: parseInt(amount),
        pointsAmount: selectedPackage.points,
        metadata: {
          packageId: selectedPackage.id,
          packageName: selectedPackage.name
        }
      });
      
      if (!paymentResult.success) {
        return NextResponse.json({ error: paymentResult.message || '支付創建失敗' }, { status: 500 });
      }
      
      // 如果是彩虹易支付，直接返回支付鏈接進行跳轉
      if (method === 'epay') {
        return NextResponse.redirect(paymentResult.paymentUrl as string);
      }
      
      // 返回支付信息
      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentId: paymentResult.paymentId,
        paymentUrl: paymentResult.paymentUrl,
        qrCodeUrl: paymentResult.qrCodeUrl
      });
    }
    
    // 返回可用的支付方式和套餐
    return NextResponse.json({
      paymentMethods: PAYMENT_METHODS,
      packages: PACKAGES
    });
    
  } catch (error) {
    console.error('支付API錯誤:', error);
    return NextResponse.json({ error: '處理請求時出錯' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 獲取用戶ID (從請求頭或Cookie中)
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }
    
    const body = await req.json();
    const { method, packageId } = body;
    
    // 驗證請求參數
    if (!method || !packageId) {
      return NextResponse.json({ error: '缺少必要參數' }, { status: 400 });
    }
    
    // 驗證支付方式和套餐是否有效
    const paymentMethod = PAYMENT_METHODS.find(m => m.id === method);
    const selectedPackage = PACKAGES.find(p => p.id === packageId);
    
    if (!paymentMethod) {
      return NextResponse.json({ error: '不支持的支付方式' }, { status: 400 });
    }
    
    if (!selectedPackage) {
      return NextResponse.json({ error: '無效的套餐' }, { status: 400 });
    }
    
    // 創建訂單
    const order = await db.order.create({
      data: {
        userId,
        packageId,
        amount: selectedPackage.price,
        paymentMethod: method,
        status: 'pending',
        pointsToAdd: selectedPackage.points
      }
    });
    
    // 創建支付
    const paymentResult = await createPayment(method as PaymentMethod, {
      userId,
      amount: selectedPackage.price,
      pointsAmount: selectedPackage.points,
      metadata: {
        packageId: selectedPackage.id,
        packageName: selectedPackage.name
      }
    });
    
    if (!paymentResult.success) {
      return NextResponse.json({ error: paymentResult.message || '支付創建失敗' }, { status: 500 });
    }
    
    // 返回支付信息
    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentId: paymentResult.paymentId,
      paymentUrl: paymentResult.paymentUrl,
      qrCodeUrl: paymentResult.qrCodeUrl
    });
    
  } catch (error) {
    console.error('創建支付訂單錯誤:', error);
    return NextResponse.json({ error: '處理請求時出錯' }, { status: 500 });
  }
} 