import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

// 处理站点图标上传请求
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // 检查是否有favicon图标
    const faviconFile = formData.get("favicon") as File | null;
    if (faviconFile) {
      const faviconBuffer = Buffer.from(await faviconFile.arrayBuffer());
      await writeFile(
        join(process.cwd(), "public/favicon.ico"),
        faviconBuffer
      );
    }
    
    // 检查是否有logo图片
    const logoFile = formData.get("logo") as File | null;
    if (logoFile) {
      const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
      await writeFile(
        join(process.cwd(), "public/images/logo.png"),
        logoBuffer
      );
    }
    
    // 检查是否有apple touch图标
    const appleTouchFile = formData.get("appleTouchIcon") as File | null;
    if (appleTouchFile) {
      // 确保目录存在
      const appleIconPath = join(process.cwd(), "public/images/icons/apple-touch-icon.png");
      const appleTouchBuffer = Buffer.from(await appleTouchFile.arrayBuffer());
      await writeFile(appleIconPath, appleTouchBuffer);
    }
    
    // 如果没有上传任何图标，返回错误
    if (!faviconFile && !logoFile && !appleTouchFile) {
      return NextResponse.json(
        { success: false, error: "未上传任何图标" },
        { status: 400 }
      );
    }
    
    // 成功响应
    return NextResponse.json({ 
      success: true,
      message: "图标已更新，您可能需要清除浏览器缓存才能看到变化" 
    });
  } catch (error) {
    console.error("处理图标上传时出错:", error);
    return NextResponse.json(
      { success: false, error: "处理图标时出错" },
      { status: 500 }
    );
  }
} 