import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 在实际应用中，您会从身份验证中获取用户 ID
    // 这里我们使用一个假的测试 ID
    const userId = 'user_test_id';
    
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const search = searchParams.get('search') || '';
    
    // 在实际应用中，会从数据库中获取数据
    // 例如：
    // const result = await sql`
    //   SELECT id, prompt, image_url, created_at
    //   FROM user_images
    //   WHERE user_id = ${userId}
    //   AND (${search} = '' OR prompt ILIKE ${`%${search}%`})
    //   ORDER BY created_at DESC
    //   LIMIT ${limit} OFFSET ${offset}
    // `;
    // 
    // const images = result.rows;

    // 模拟数据库数据
    // 在生产环境中，这将由实际的数据库查询替代
    const mockImages = [
      {
        id: "img1",
        prompt: "一只可爱的小猫咪在阳光下的草地上玩耍",
        image_url: "https://placehold.co/600x400/3B82F6/FFFFFF?text=AI+生成图片+1",
        created_at: "2023-10-15T08:30:00Z"
      },
      {
        id: "img2",
        prompt: "未来城市夜景，霓虹灯光照亮高楼大厦",
        image_url: "https://placehold.co/600x400/3B82F6/FFFFFF?text=AI+生成图片+2",
        created_at: "2023-10-14T15:45:00Z"
      },
      {
        id: "img3",
        prompt: "一片山脉下的宁静湖泊，倒映着蓝天白云",
        image_url: "https://placehold.co/600x400/3B82F6/FFFFFF?text=AI+生成图片+3",
        created_at: "2023-10-13T12:20:00Z"
      },
      {
        id: "img4",
        prompt: "科幻太空船在宇宙中穿梭，远处是闪烁的星云",
        image_url: "https://placehold.co/600x400/3B82F6/FFFFFF?text=AI+生成图片+4",
        created_at: "2023-10-12T09:10:00Z"
      },
      {
        id: "img5",
        prompt: "古老的森林中的神秘小屋，门前有迷雾笼罩",
        image_url: "https://placehold.co/600x400/3B82F6/FFFFFF?text=AI+生成图片+5",
        created_at: "2023-10-11T18:05:00Z"
      },
      {
        id: "img6",
        prompt: "水晶般清澈的海滩，沙滩上有色彩鲜艳的贝壳",
        image_url: "https://placehold.co/600x400/3B82F6/FFFFFF?text=AI+生成图片+6",
        created_at: "2023-10-10T14:30:00Z"
      }
    ];

    // 如果有搜索词，过滤结果
    const filteredImages = search 
      ? mockImages.filter(img => img.prompt.toLowerCase().includes(search.toLowerCase()))
      : mockImages;
    
    // 分页处理
    const paginatedImages = filteredImages.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      images: paginatedImages,
      total: filteredImages.length
    });
    
  } catch (error) {
    console.error('获取图片错误:', error);
    return NextResponse.json(
      { error: '获取图片时出错，请稍后再试' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: '请提供要删除的图片 ID' },
        { status: 400 }
      );
    }

    // 在实际应用中，您会从身份验证中获取用户 ID
    const userId = 'user_test_id';
    
    // 在实际应用中，会从数据库中删除数据
    // 例如：
    // await sql`
    //   DELETE FROM user_images
    //   WHERE id = ${id} AND user_id = ${userId}
    // `;

    // 模拟成功删除
    console.log('删除图片:', { id, userId });
    
    return NextResponse.json({
      success: true,
      message: '图片已成功删除'
    });
    
  } catch (error) {
    console.error('删除图片错误:', error);
    return NextResponse.json(
      { error: '删除图片时出错，请稍后再试' },
      { status: 500 }
    );
  }
} 