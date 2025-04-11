import { db } from '../db';
import * as epay from './epay';

export type PaymentMethod = 'epay' | 'usdt';

export type PaymentCreateOptions = {
  userId: string;
  amount: number; // 金額，以分為單位
  pointsAmount: number; // 積分數量
  metadata?: Record<string, any>;
};

export type PaymentResult = {
  success: boolean;
  orderId: string;
  paymentId?: string; // 外部支付系統的訂單ID
  paymentUrl?: string; // 支付鏈接
  qrCodeUrl?: string; // 二維碼圖片URL（微信支付等）
  message?: string; // 錯誤信息
  walletAddress?: string; // USDT錢包地址（僅加密貨幣）
  walletNetwork?: string; // USDT網絡（僅加密貨幣）
};

// 創建支付訂單
export async function createPayment(
  method: PaymentMethod,
  options: PaymentCreateOptions
): Promise<PaymentResult> {
  try {
    // 創建訂單記錄
    const order = await db.order.create({
      data: {
        userId: options.userId,
        amount: options.amount,
        pointsAmount: options.pointsAmount,
        status: 'pending',
        paymentMethod: method,
        metadata: options.metadata || {},
      },
    });

    // 根據支付方式不同，調用不同的支付接口
    let paymentResult: Partial<PaymentResult> = { success: false };

    switch (method) {
      case 'usdt':
        // 模擬 USDT 支付
        paymentResult = {
          success: true,
          paymentId: `usdt_${Date.now()}`,
          paymentUrl: `/payment/usdt?orderId=${order.id}`,
          qrCodeUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`,
          walletAddress: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
          walletNetwork: 'TRC20',
        };
        break;
        
      case 'epay':
        paymentResult = await epay.createPayment({
          outTradeNo: order.id,
          amount: options.amount,
          description: `充值 ${options.pointsAmount} 積分`,
        });
        break;

      default:
        throw new Error(`不支持的支付方式: ${method}`);
    }

    // 更新訂單記錄
    if (paymentResult.paymentId) {
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentId: paymentResult.paymentId,
        },
      });
    }

    return {
      success: paymentResult.success || false,
      orderId: order.id,
      paymentId: paymentResult.paymentId,
      paymentUrl: paymentResult.paymentUrl,
      qrCodeUrl: paymentResult.qrCodeUrl,
      message: paymentResult.message,
      walletAddress: paymentResult.walletAddress,
      walletNetwork: paymentResult.walletNetwork,
    };
  } catch (error) {
    console.error('支付創建失敗:', error);
    return {
      success: false,
      orderId: '',
      message: error instanceof Error ? error.message : '支付創建失敗',
    };
  }
}

// 驗證支付狀態
export async function verifyPayment(orderId: string): Promise<boolean> {
  try {
    // 獲取訂單信息
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.status !== 'pending') {
      return false;
    }

    // 根據不同的支付方式查詢支付狀態
    let isPaymentSuccessful = false;

    switch (order.paymentMethod) {
      case 'usdt':
        // 模擬 USDT 支付驗證
        isPaymentSuccessful = Math.random() > 0.5; // 50% 概率返回成功
        break;
        
      case 'epay':
        isPaymentSuccessful = await epay.verifyPayment(order.paymentId || '');
        break;

      default:
        throw new Error(`不支持的支付方式: ${order.paymentMethod}`);
    }

    // 如果支付成功，更新訂單狀態和用戶積分
    if (isPaymentSuccessful) {
      // 更新訂單狀態
      await db.order.update({
        where: { id: orderId },
        data: {
          status: 'success',
        },
      });

      // 更新用戶積分
      await db.points.update({
        where: { userId: order.userId },
        data: {
          amount: {
            increment: order.pointsAmount,
          },
        },
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error('支付驗證失敗:', error);
    return false;
  }
}

// 處理支付回調
export async function handlePaymentWebhook(
  method: PaymentMethod,
  payload: any
): Promise<boolean> {
  try {
    let orderId = '';
    let isPaymentSuccessful = false;

    // 根據不同的支付方式處理回調
    switch (method) {
      case 'usdt':
        // 模擬 USDT 回調處理
        orderId = payload.order_id || '';
        isPaymentSuccessful = payload.status === 'completed';
        break;
        
      case 'epay':
        const result = epay.handleWebhook(payload);
        orderId = result.orderId;
        isPaymentSuccessful = result.isPaymentSuccessful;
        break;

      default:
        throw new Error(`不支持的支付方式: ${method}`);
    }

    // 如果支付成功，更新訂單狀態和用戶積分
    if (isPaymentSuccessful && orderId) {
      // 獲取訂單信息
      const order = await db.order.findUnique({
        where: { id: orderId },
      });

      if (!order || order.status !== 'pending') {
        return false;
      }

      // 更新訂單狀態
      await db.order.update({
        where: { id: orderId },
        data: {
          status: 'success',
        },
      });

      // 更新用戶積分
      await db.points.update({
        where: { userId: order.userId },
        data: {
          amount: {
            increment: order.pointsAmount,
          },
        },
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error('處理支付回調失敗:', error);
    return false;
  }
} 