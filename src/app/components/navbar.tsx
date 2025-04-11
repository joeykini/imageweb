"use client";

import Link from "next/link";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const isActive = (path: string) => {
    if (path === "/settings/history") {
      return pathname === "/settings" || pathname?.startsWith("/settings/");
    }
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <header className="sm:fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between w-full min-h-[3.5rem] sm:min-h-[4rem] px-4 sm:px-6 py-2 sm:py-0 bg-white/85 backdrop-blur-md border-b border-gray-200/70 shadow-sm">
      <div className="flex gap-4 items-center hidden md:flex">
        <Link href="/">
          <Image
            alt="Site Logo"
            width={24}
            height={24}
            src="/images/logo1.png"
          />
        </Link>
        <div aria-hidden="true" className="hidden md:block w-px h-6 bg-[#C7C7C8]"></div>
        <Link href="/" title="Image AI - 智能图片生成器">
          Image AI
        </Link>
      </div>

      <div className="flex-1 min-w-0 flex justify-center">
        <nav aria-label="Main" className="relative z-10 flex max-w-max flex-1 items-center justify-center w-full">
          <div style={{ position: "relative" }}>
            <ul className="group flex-1 list-none justify-center space-x-1 flex flex-wrap items-center gap-0.5 md:gap-1">
              <div className="md:hidden mr-2 pb-0.5 pl-2">
                <li>
                  <Link href="/">
                    <Image
                      alt="Site Logo"
                      width={24}
                      height={24}
                      src="/images/logo1.png"
                    />
                  </Link>
                </li>
              </div>
              <li className="flex-shrink-0">
                <Link
                  href="/settings/history"
                  className={`group inline-flex h-10 w-max items-center justify-center rounded-md py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 px-2 md:px-4 min-w-0 whitespace-nowrap ${isActive("/settings/history") ? "bg-accent text-accent-foreground" : "bg-background"}`}
                >
                  🖼️ 我的
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link
                  href="/dashboard"
                  className={`group inline-flex h-10 w-max items-center justify-center rounded-md py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 px-2 md:px-4 min-w-0 whitespace-nowrap ${isActive("/dashboard") ? "bg-accent text-accent-foreground" : "bg-background"}`}
                >
                  🎨 创造
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link
                  href="/pricing"
                  className={`group inline-flex h-10 w-max items-center justify-center rounded-md py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 px-2 md:px-4 min-w-0 whitespace-nowrap ${isActive("/pricing") ? "bg-accent text-accent-foreground" : "bg-background"}`}
                >
                  🚀 价格
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link
                  href="/contact"
                  className={`group inline-flex h-10 w-max items-center justify-center rounded-md py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 px-2 md:px-4 min-w-0 whitespace-nowrap ${isActive("/contact") ? "bg-accent text-accent-foreground" : "bg-background"}`}
                >
                  💻 联系
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link
                  href="/faq"
                  className={`group inline-flex h-10 w-max items-center justify-center rounded-md py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 px-2 md:px-4 min-w-0 whitespace-nowrap ${isActive("/faq") ? "bg-accent text-accent-foreground" : "bg-background"}`}
                >
                  💬 问答
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#131316] text-white text-sm font-semibold whitespace-nowrap">
              登录
            </button>
          </SignInButton>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
} 