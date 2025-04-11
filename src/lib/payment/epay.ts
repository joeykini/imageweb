import crypto from 'crypto';
import querystring from 'querystring';
import axios from 'axios';

// 彩虹易支付配置
const config = {
  merchantId: process.env.EPAY_MERCHANT_ID || 'your_merchant_id',  // 你的商戶ID
  secretKey: process.env.EPAY_SECRET_KEY || 'your_secret_key',     // 你的密鑰
  gateway: process.env.EPAY_GATEWAY_URL || 'https://pay.example.com/',  // 支付網關
  notifyUrl: process.env.EPAY_NOTIFY_URL || 'https://your-site.com/api/payment/webhook', // 回調地址
  returnUrl: process.env.EPAY_RETURN_URL || 'https://your-site.com/payment/success', // 支付成功跳轉
};

// 生成簽名
function generateSign(params: Record<string, any>): string {
  // 按照鍵名ASCII碼從小到大排序
  const sortedKeys = Object.keys(params).sort();
  
  // 拼接參數
  let stringToSign = '';
  for (const key of sortedKeys) {
    // 跳過值為空的參數和sign參數
    if (params[key] !== '' && params[key] !== null && params[key] !== undefined && key !== 'sign' && key !== 'sign_type') {
      stringToSign += `${key}=${params[key]}&`;
    }
  }
  
  // 加上密鑰
  stringToSign += `key=${config.secretKey}`;
  
  // MD5加密並轉大寫
  return crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase();
}

// 驗證簽名
function verifySign(params: Record<string, any>): boolean {
  const receivedSign = params.sign;
  if (!receivedSign) return false;
  
  // 創建一個新對象用於計算簽名
  const newParams = { ...params };
  delete newParams.sign;
  delete newParams.sign_type;
  
  const calculatedSign = generateSign(newParams);
  return receivedSign === calculatedSign;
}

// 創建支付訂單
export async function createPayment({
  outTradeNo,
  amount,
  description
}: {
  outTradeNo: string;
  amount: number;
  description: string;
}): Promise<{
  success: boolean;
  orderId: string;
  paymentId?: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  message?: string;
}> {
  try {
    // 準備請求參數
    const params: Record<string, any> = {
      pid: config.merchantId,              // 商戶ID
      type: 'alipay',                      // 支付類型 (alipay, wxpay, qqpay)
      out_trade_no: outTradeNo,            // 商戶訂單號
      notify_url: config.notifyUrl,        // 異步通知地址
      return_url: config.returnUrl,        // 支付成功後的跳轉地址
      name: description,                   // 商品名稱
      money: (amount / 100).toFixed(2),    // 金額，單位：元
      sign_type: 'MD5',                    // 簽名類型
    };
    
    // 生成簽名
    params.sign = generateSign(params);
    
    // 構建請求URL
    const paymentUrl = `${config.gateway}submit.php?${querystring.stringify(params)}`;
    
    return {
      success: true,
      orderId: outTradeNo,
      paymentId: outTradeNo, // 使用我們的訂單號作為外部系統支付ID
      paymentUrl,            // 返回支付URL，前端可以跳轉
      qrCodeUrl: `${config.gateway}qrcode.php?data=${encodeURIComponent(paymentUrl)}`, // 生成二維碼URL
    };
  } catch (error) {
    console.error('彩虹易支付創建訂單失敗:', error);
    return {
      success: false,
      orderId: outTradeNo,
      message: error instanceof Error ? error.message : '支付創建失敗',
    };
  }
}

// 驗證支付狀態
export async function verifyPayment(paymentId: string): Promise<boolean> {
  try {
    // 準備請求參數
    const params: Record<string, any> = {
      pid: config.merchantId,
      out_trade_no: paymentId,
      sign_type: 'MD5',
    };
    
    // 生成簽名
    params.sign = generateSign(params);
    
    // 發送請求查詢訂單狀態
    const response = await axios.get(`${config.gateway}api.php?act=order&${querystring.stringify(params)}`);
    
    if (response.data.code === 1 && response.data.status === 1) {
      // 狀態碼1表示支付成功
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('彩虹易支付訂單查詢失敗:', error);
    return false;
  }
}

// 處理支付回調
export function handleWebhook(payload: any): {
  orderId: string;
  isPaymentSuccessful: boolean;
} {
  try {
    // 驗證簽名
    if (!verifySign(payload)) {
      console.error('彩虹易支付回調簽名驗證失敗');
      return { orderId: '', isPaymentSuccessful: false };
    }
    
    // 驗證商戶ID
    if (payload.pid !== config.merchantId) {
      console.error('彩虹易支付回調商戶ID不匹配');
      return { orderId: '', isPaymentSuccessful: false };
    }
    
    // 驗證支付狀態
    const isPaymentSuccessful = payload.trade_status === 'TRADE_SUCCESS';
    
    return {
      orderId: payload.out_trade_no,
      isPaymentSuccessful,
    };
  } catch (error) {
    console.error('處理彩虹易支付回調失敗:', error);
    return { orderId: '', isPaymentSuccessful: false };
  }
} 