"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import Navbar from "./components/navbar";

// 图片分组，每组8张
const imagesRow1 = [
  { id: 1, src: "/images/samples/pixar.jpeg", width: 800, height: 800, alt: "Pixar Style AI Generated Image" },
  { id: 2, src: "/images/samples/10.jpeg", width: 800, height: 800, alt: "AI Generated Image" },
  { id: 3, src: "/images/samples/black_board.jpeg", width: 800, height: 800, alt: "Black Board Style AI Generated Image" },
  { id: 4, src: "/images/samples/photo_restore.jpeg", width: 800, height: 800, alt: "Photo Restore Style AI Generated Image" },
  { id: 5, src: "/images/samples/crazy_doodle.jpeg", width: 800, height: 800, alt: "Crazy Doodle Style AI Generated Image" },
  { id: 6, src: "/images/samples/line_art.jpeg", width: 800, height: 800, alt: "Line Art Style AI Generated Image" },
  { id: 7, src: "/images/samples/clay.jpeg", width: 800, height: 800, alt: "Clay Style AI Generated Image" },
  { id: 8, src: "/images/samples/marble.jpeg", width: 800, height: 800, alt: "Marble Style AI Generated Image" },
];

const imagesRow2 = [
  { id: 1, src: "/images/samples/renaissance.jpg", width: 800, height: 800, alt: "Renaissance Style AI Generated Image" },
  { id: 2, src: "/images/samples/voxel.jpeg", width: 800, height: 800, alt: "Voxel Style AI Generated Image" },
  { id: 3, src: "/images/samples/four_panel.jpg", width: 800, height: 800, alt: "Four Panel Style AI Generated Image" },
  { id: 4, src: "/images/samples/toy_box.jpg", width: 800, height: 800, alt: "Toy Box Style AI Generated Image" },
  { id: 5, src: "/images/samples/ghibli.jpeg", width: 800, height: 800, alt: "Ghibli Style AI Generated Image" },
  { id: 6, src: "/images/samples/mini_workspace.jpeg", width: 800, height: 800, alt: "Mini Workspace Style AI Generated Image" },
  { id: 7, src: "/images/samples/app_icon.jpg", width: 800, height: 800, alt: "App Icon Style AI Generated Image" },
  { id: 8, src: "/images/samples/marriage_photo.jpeg", width: 800, height: 800, alt: "Marriage Photo Style AI Generated Image" },
];

const imagesRow3 = [
  { id: 1, src: "/images/samples/1.jpeg", width: 800, height: 800, alt: "AI Generated Image" },
  { id: 2, src: "/images/samples/2.jpeg", width: 800, height: 800, alt: "AI Generated Image" },
  { id: 3, src: "/images/samples/3.jpeg", width: 800, height: 800, alt: "AI Generated Image" },
  { id: 4, src: "/images/samples/4.jpeg", width: 800, height: 800, alt: "AI Generated Image" },
  { id: 5, src: "/images/samples/5.jpg", width: 800, height: 800, alt: "AI Generated Image" },
  { id: 6, src: "/images/samples/6.jpg", width: 800, height: 800, alt: "AI Generated Image" },
  { id: 7, src: "/images/samples/12.jpg", width: 800, height: 800, alt: "AI Generated Image" },
  { id: 8, src: "/images/samples/13.jpeg", width: 800, height: 800, alt: "AI Generated Image" },
];

export default function Home() {
  const [row1Position, setRow1Position] = useState(0);
  const [row2Position, setRow2Position] = useState(0);
  const [row3Position, setRow3Position] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  // 滚动动画
  useEffect(() => {
    const animate = () => {
      setRow1Position(prev => (prev + 0.2) % 1800); // 向右移动，增加範圍
      setRow2Position(prev => (prev - 0.25) % 1800); // 向左移动，增加範圍
      setRow3Position(prev => (prev + 0.18) % 1800); // 向右移动，增加範圍
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <>
      <Navbar />
      <main>
        {/* 主标题区域 */}
        <div className="w-full max-w-[75rem] mx-auto px-4">
          <div className="h-[150px] flex items-center justify-center">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-12">
              <div className="flex items-center gap-3 sm:gap-6">
                <h1 className="text-2xl sm:text-[2.8rem] leading-normal font-bold gradient-text-1 whitespace-nowrap">Image AI</h1>
                <span className="text-lg sm:text-[1.8rem] font-bold gradient-text-2 whitespace-nowrap">智能图片创作</span>
              </div>
              <div>
                <Link href="/dashboard" className="px-5 sm:px-8 py-2 sm:py-3 rounded-full text-white text-sm sm:text-base font-medium gradient-button shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap">
                  开始创造
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 动态图片展示区域 */}
        <div className="w-full max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full relative overflow-hidden pb-8">
            <div className="h-full w-full overflow-hidden cursor-grab active:cursor-grabbing">
              <section 
                className="relative flex w-full items-center justify-center overflow-hidden" 
                style={{
                  height: "calc(100vh - 300px)",
                  background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)"
                }}
              >
                <div 
                  className="relative z-2 flex-none grid gap-[14px] grid-rows-[0.85fr,1.15fr,0.85fr] grid-cols-[100%] origin-center" 
                  style={{
                    height: "calc(-60px + 100vh)",
                    width: "150vw",
                    transform: "rotate(-22deg) scale(1.18)"
                  }}
                >
                  {/* 第一行 */}
                  <div 
                    className="grid gap-4 grid-cols-[repeat(8,1fr)] will-change-transform will-change-filter" 
                    style={{
                      transform: `translate3d(${row1Position}px, 0px, 0px) scale(0.88, 0.88)`
                    }}
                  >
                    {imagesRow1.map((img) => (
                      <div key={img.id} className="relative aspect-square transform hover:scale-[1.08] transition-transform duration-300">
                        <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center text-foreground text-xl shadow-lg">
                          <Image
                            alt={img.alt}
                            width={330}
                            height={330}
                            src={img.src}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 第二行 */}
                  <div 
                    className="grid gap-4 grid-cols-[repeat(8,1fr)] will-change-transform will-change-filter" 
                    style={{
                      transform: `translate3d(${row2Position}px, 0px, 0px) scale(1.08, 1.08)`
                    }}
                  >
                    {imagesRow2.map((img) => (
                      <div key={img.id} className="relative aspect-square transform hover:scale-[1.08] transition-transform duration-300">
                        <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center text-foreground text-xl shadow-lg">
                          <Image
                            alt={img.alt}
                            width={330}
                            height={330}
                            src={img.src}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 第三行 */}
                  <div 
                    className="grid gap-4 grid-cols-[repeat(8,1fr)] will-change-transform will-change-filter" 
                    style={{
                      transform: `translate3d(${row3Position}px, 0px, 0px) scale(0.88, 0.88)`
                    }}
                  >
                    {imagesRow3.map((img) => (
                      <div key={img.id} className="relative aspect-square transform hover:scale-[1.08] transition-transform duration-300">
                        <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center text-foreground text-xl shadow-lg">
                          <Image
                            alt={img.alt}
                            width={330}
                            height={330}
                            src={img.src}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
