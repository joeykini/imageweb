"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/navbar';

export default function ContactPage() {
  const [groupQrExists, setGroupQrExists] = useState<boolean>(false);
  const [personalQrExists, setPersonalQrExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkImages = async () => {
      try {
        // 检查群二维码是否存在
        const groupResponse = await fetch('/images/contact/wx_group.png', { method: 'HEAD' });
        setGroupQrExists(groupResponse.ok);
        
        // 检查个人二维码是否存在
        const personalResponse = await fetch('/images/contact/wechat-personal.png', { method: 'HEAD' });
        setPersonalQrExists(personalResponse.ok);
      } catch (error) {
        console.error('加载图片错误:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkImages();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-6 sm:pt-24">
        <div className="p-8 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] background relative">
          <div className="p-8 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-[1.0625rem] font-semibold">加入微信群</h2>
                <div className="px-2.5 py-6 bg-[#FAFAFB] rounded-lg w-full flex flex-col items-center">
                  {isLoading ? (
                    <div className="h-[280px] w-[280px] bg-gray-200 animate-pulse rounded-lg"></div>
                  ) : groupQrExists ? (
                    <Image
                      src="/images/contact/wx_group.png"
                      alt="WeChat Group QR Code"
                      width={280}
                      height={280}
                      className="rounded-lg h-[280px] w-auto"
                    />
                  ) : (
                    <div className="h-[280px] w-[280px] flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <p className="text-center px-4">微信群二维码尚未设置，请联系管理员</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-[1.0625rem] font-semibold">添加个人微信</h2>
                <div className="px-2.5 py-6 bg-[#FAFAFB] rounded-lg w-full flex flex-col items-center">
                  {isLoading ? (
                    <div className="h-[280px] w-[280px] bg-gray-200 animate-pulse rounded-lg"></div>
                  ) : personalQrExists ? (
                    <Image
                      src="/images/contact/wechat-personal.png"
                      alt="Personal WeChat QR Code"
                      width={280}
                      height={280}
                      className="rounded-lg h-[280px] w-auto"
                    />
                  ) : (
                    <div className="h-[280px] w-[280px] flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <p className="text-center px-4">个人微信二维码尚未设置，请联系管理员</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <a
                href="https://interjc.net/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#7D7D7E] hover:text-primary transition-colors"
              >
                更多联系方式
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 