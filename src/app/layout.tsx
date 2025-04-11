import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image AI｜智能图片创作",
  description: "A professional AI-powered image creation and editing platform.",
  openGraph: {
    title: "Image AI｜智能图片创作",
    description: "A professional AI-powered image creation and editing platform.",
    url: "https://image.zhaikr.com",
    images: [{
      url: "https://image.zhaikr.com/og.png",
      width: 1200,
      height: 630,
      alt: "Image AI｜智能图片创作",
    }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@zhaikr",
    title: "Image AI｜智能图片创作",
    description: "A professional AI-powered image creation and editing platform.",
    images: ["https://image.zhaikr.com/og.png"],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png" />
        <script id="microsoft-clarity" dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "mfw57bbfor");
          `
        }} />
      </head>
      <body className={`${inter.className} antialiased sm:pt-16`}>
        <Providers>
          <main>
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
