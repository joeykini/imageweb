import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

// 处理图片上传请求
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // 检查是否有群二维码图片
    const groupQrFile = formData.get("groupQrCode") as File | null;
    if (groupQrFile) {
      const groupQrBuffer = Buffer.from(await groupQrFile.arrayBuffer());
      await writeFile(
        join(process.cwd(), "public/images/contact/wx_group.png"),
        groupQrBuffer
      );
    }
    
    // 检查是否有个人二维码图片
    const personalQrFile = formData.get("personalQrCode") as File | null;
    if (personalQrFile) {
      const personalQrBuffer = Buffer.from(await personalQrFile.arrayBuffer());
      await writeFile(
        join(process.cwd(), "public/images/contact/wechat-personal.png"),
        personalQrBuffer
      );
    }
    
    // 如果没有上传任何图片，返回错误
    if (!groupQrFile && !personalQrFile) {
      return NextResponse.json(
        { success: false, error: "未上传任何图片" },
        { status: 400 }
      );
    }
    
    // 成功响应
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("处理图片上传时出错:", error);
    return NextResponse.json(
      { success: false, error: "处理图片时出错" },
      { status: 500 }
    );
  }
} 