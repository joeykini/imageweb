import { NextRequest, NextResponse } from 'next/server';
import * as paymentService from '@/lib/payment';

// 處理支付回調
export async function POST(req: NextRequest) {
  try {
    // 從請求中獲取支付提供商信息
    const url = new URL(req.url);
    const paymentMethod = url.pathname.split('/').pop() || '';
    
    // 驗證支付方式是否有效
    if (!['wechat', 'alipay', 'usdt', 'epay'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: '不支持的支付方式' },
        { status: 400 }
      );
    }
    
    // 根據不同的支付方式處理回調數據
    let payload;
    if (paymentMethod === 'epay') {
      // 彩虹易支付回調處理
      payload = Object.fromEntries(url.searchParams);
    } else {
      // 其他支付方式
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        payload = await req.json();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        payload = Object.fromEntries(formData);
      } else {
        // 默認嘗試解析為JSON
        try {
          payload = await req.json();
        } catch (e) {
          // 如果解析失敗，嘗試解析為表單數據
          try {
            const formData = await req.formData();
            payload = Object.fromEntries(formData);
          } catch (e) {
            // 如果都失敗，使用URL參數
            payload = Object.fromEntries(url.searchParams);
          }
        }
      }
    }
    
    // 處理支付回調
    const success = await paymentService.handlePaymentWebhook(
      paymentMethod as paymentService.PaymentMethod,
      payload
    );
    
    if (success) {
      // 成功處理回調
      if (paymentMethod === 'epay') {
        // 彩虹易支付要求返回 "success"
        return new NextResponse("success");
      }
      return NextResponse.json({ success: true });
    } else {
      // 回調處理失敗
      return NextResponse.json(
        { error: '回調處理失敗' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('處理支付回調失敗:', error);
    return NextResponse.json(
      { error: '處理支付回調失敗' },
      { status: 500 }
    );
  }
} 