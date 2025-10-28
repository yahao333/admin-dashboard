import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 允许构建在存在 ESLint 错误时继续，避免生产构建失败
    ignoreDuringBuilds: true,
  },
  // 使用可配置的后端地址作为代理目标（Vercel 上设置 API_PROXY_TARGET）
  // 开发环境默认指向本地后端 http://localhost:38080
  async rewrites() {
    const API_PROXY_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:38080'
    return [
      {
        source: '/api/:path*',
        destination: `${API_PROXY_TARGET}/api/:path*`
      }
    ]
  }
};

export default nextConfig;