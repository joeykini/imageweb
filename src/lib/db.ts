// 模擬數據庫操作
class MockDB {
  private ordersData: any[] = [];
  private pointsData: any[] = [];
  private usersData: any[] = [];
  
  user = {
    create: async ({ data, include }: any) => {
      const user = { 
        id: `user_${Date.now()}`, 
        ...data, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      this.usersData.push(user);
      
      // 如果需要創建積分記錄
      if (data.points?.create) {
        const points = {
          id: `points_${Date.now()}`,
          userId: user.id,
          ...data.points.create,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.pointsData.push(points);
        
        if (include?.points) {
          user.points = points;
        }
      }
      
      return user;
    },
    findUnique: async ({ where, include }: any) => {
      const user = this.usersData.find(u => u.clerkId === where.clerkId);
      if (!user) return null;
      
      if (include?.points) {
        user.points = this.pointsData.find(p => p.userId === user.id);
      }
      
      if (include?.subscription) {
        user.subscription = null; // 暫時不實現訂閱功能
      }
      
      return user;
    }
  };
  
  order = {
    create: async ({ data }: any) => {
      const order = { 
        id: `order_${Date.now()}`, 
        ...data, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      this.ordersData.push(order);
      return order;
    },
    update: async ({ where, data }: any) => {
      const orderIndex = this.ordersData.findIndex(o => o.id === where.id);
      if (orderIndex === -1) return null;
      
      this.ordersData[orderIndex] = {
        ...this.ordersData[orderIndex],
        ...data,
        updatedAt: new Date()
      };
      
      return this.ordersData[orderIndex];
    },
    findUnique: async ({ where }: any) => {
      return this.ordersData.find(o => o.id === where.id) || null;
    }
  };
  
  points = {
    update: async ({ where, data }: any) => {
      const pointsIndex = this.pointsData.findIndex(p => p.userId === where.userId);
      
      if (pointsIndex === -1) {
        // 如果用户不存在积分记录，创建一个新的
        const newPoints = {
          id: `points_${Date.now()}`,
          userId: where.userId,
          amount: data.amount.increment || 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.pointsData.push(newPoints);
        return newPoints;
      }
      
      // 增加积分
      if (data.amount && data.amount.increment) {
        this.pointsData[pointsIndex].amount += data.amount.increment;
      }
      
      this.pointsData[pointsIndex].updatedAt = new Date();
      return this.pointsData[pointsIndex];
    },
    findUnique: async ({ where }: any) => {
      return this.pointsData.find(p => p.userId === where.userId) || null;
    }
  };
}

// 導出模擬數據庫實例
export const db = new MockDB(); 