import { auth, currentUser } from '@clerk/nextjs';
import { db } from './db';

// 用戶角色類型
export type UserRole = 'user' | 'admin' | 'superadmin';

// 獲取當前用戶信息，包括數據庫中的擴展信息
export async function getCurrentUserWithDb() {
  const { userId } = auth();
  const clerkUser = await currentUser();
  
  if (!userId || !clerkUser) {
    return null;
  }
  
  // 從數據庫中獲取用戶擴展信息
  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
      points: true,
    }
  });
  
  // 如果用戶不在數據庫中，則創建一個新用戶
  if (!dbUser) {
    const newUser = await db.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        imageUrl: clerkUser.imageUrl || '',
        role: 'user',
        points: {
          create: {
            amount: 200, // 新用戶贈送200積分
          }
        }
      },
      include: {
        subscription: true,
        points: true,
      }
    });
    
    return {
      ...clerkUser,
      ...newUser,
      role: newUser.role as UserRole,
    };
  }
  
  return {
    ...clerkUser,
    ...dbUser,
    role: dbUser.role as UserRole,
  };
}

// 獲取當前用戶的角色
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUserWithDb();
  return user ? user.role : null;
}

// 檢查用戶是否為管理員
export async function isAdmin() {
  const role = await getUserRole();
  return role === 'admin' || role === 'superadmin';
}

// 檢查用戶是否有足夠的積分
export async function hasEnoughPoints(amount: number) {
  const user = await getCurrentUserWithDb();
  
  if (!user || !user.points) {
    return false;
  }
  
  return user.points.amount >= amount;
}

// 檢查用戶是否已登錄，如果未登錄返回401
export async function requireAuth() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  return userId;
}

// 檢查用戶是否是管理員，如果不是返回403
export async function requireAdmin() {
  const isUserAdmin = await isAdmin();
  
  if (!isUserAdmin) {
    throw new Error('Forbidden');
  }
  
  return true;
} 