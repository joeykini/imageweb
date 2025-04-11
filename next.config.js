/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'img.clerk.com', 
      'images.clerk.dev', 
      'uploadthing.com', 
      'placehold.co', 
      'dalleprodsec.blob.core.windows.net'
    ],
  },
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
};

module.exports = nextConfig; 