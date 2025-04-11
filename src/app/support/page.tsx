"use client";

import { useState } from "react";
import Image from "next/image";

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">聯絡客服</h1>
      <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
        如有任何問題或需要支援，請通過以下方式聯絡我們
      </p>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 客服微信 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">客服微信</h2>
            <div className="aspect-square w-64 mx-auto bg-gray-100 mb-4 flex items-center justify-center">
              {/* 這裡將來放置客服微信二維碼圖片 */}
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>客服微信二維碼</p>
              </div>
            </div>
            <p className="text-gray-600">掃描二維碼添加客服微信</p>
            <p className="text-gray-600 mt-2">客服時間: 週一至週五 9:00-18:00</p>
          </div>
          
          {/* 技術支持微信 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">技術支持微信</h2>
            <div className="aspect-square w-64 mx-auto bg-gray-100 mb-4 flex items-center justify-center">
              {/* 這裡將來放置技術支持微信二維碼圖片 */}
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>技術支持微信二維碼</p>
              </div>
            </div>
            <p className="text-gray-600">掃描二維碼添加技術支持微信</p>
            <p className="text-gray-600 mt-2">技術支持時間: 週一至週日 10:00-22:00</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium mb-4">其他聯絡方式</h3>
          <p className="text-gray-600 mb-2">電子郵件: <a href="mailto:support@imageai.com" className="text-blue-600">support@imageai.com</a></p>
          <p className="text-gray-600">緊急聯絡電話: <a href="tel:+8610123456789" className="text-blue-600">+86 (10) 1234-5678</a></p>
        </div>
      </div>
    </div>
  );
} 