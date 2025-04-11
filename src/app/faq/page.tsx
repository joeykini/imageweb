"use client";

import React, { useState } from 'react';
import Navbar from '../components/navbar';

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>("item-0");

  const handleToggle = (index: number) => {
    const itemKey = `item-${index}`;
    setOpenItem(openItem === itemKey ? null : itemKey);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-6 sm:pt-24">
        <div className="p-8 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] background relative">
          <div className="p-8 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5 w-full">
            <h1 className="text-3xl font-bold mb-8">常見問答</h1>
            <div className="w-full" data-orientation="vertical">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  data-state={openItem === `item-${index}` ? "open" : "closed"} 
                  data-orientation="vertical" 
                  className="border-b"
                >
                  <h3 data-orientation="vertical" data-state={openItem === `item-${index}` ? "open" : "closed"} className="flex">
                    <button 
                      type="button" 
                      aria-controls={`radix-:r${index + 1}:`} 
                      aria-expanded={openItem === `item-${index}`} 
                      data-state={openItem === `item-${index}` ? "open" : "closed"} 
                      data-orientation="vertical"
                      id={`radix-:r${index}:`}
                      className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180"
                      onClick={() => handleToggle(index)}
                    >
                      {faq.question}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-chevron-down h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                  </h3>
                  <div
                    data-state={openItem === `item-${index}` ? "open" : "closed"} 
                    id={`radix-:r${index + 1}:`} 
                    role="region" 
                    aria-labelledby={`radix-:r${index}:`} 
                    data-orientation="vertical" 
                    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                    style={{
                      "--radix-accordion-content-height": "var(--radix-collapsible-content-height)", 
                      "--radix-accordion-content-width": "var(--radix-collapsible-content-width)", 
                      "transitionDuration": "0s", 
                      "animationName": "none"
                    } as React.CSSProperties}
                    hidden={openItem !== `item-${index}`}
                  >
                    <div className="pb-4 pt-0">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const faqs = [
  {
    question: "这用的是什么模型？",
    answer: "现在用的是 ChatGPT 4o 模型"
  },
  {
    question: "普通版和高级版模型有什么区别？",
    answer: "高级版模型稳定性更好，资源占用相应更多，但是高级版跟普通版使用的是同一个模型，都是 ChatGPT 4o 的最新模型"
  },
  {
    question: "网站是免费的吗？",
    answer: "由于每次制图都要支付给服务商 api 的费用，所以为了保证长期稳定的运营，网站是收费的。但是我们给每个新注册的用户准备了免费试用的积分"
  },
  {
    question: "怎么使用？",
    answer: "先选择风格，后上传图片或填写提示词，点击生成后即可开始"
  },
  {
    question: "生成图片怎么这么慢？",
    answer: "目前生成一张图大概需要 1-3 分钟左右，也有一定概率失败，这跟 ChatGPT 官方体验是一致的，请耐心等待"
  },
  {
    question: "生成图片失败了会扣积分吗？",
    answer: "生成失败不会扣积分，可以点击再次生成来重试"
  },
  {
    question: "怎样查看历史记录？",
    answer: "点击导航栏顶部的'我的'即可查看历史生成的图片，如果比较满意的图片请一定要注意保存备份"
  }
]; 