'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">SaaS管理平台</h1>
          <div className="flex space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">登录</Button>
            </Link>
            <Link href="/auth/register">
              <Button>注册</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                现代化的SaaS管理解决方案
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                为您提供高效、安全、可靠的SaaS管理服务
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/auth/register">
                  <Button size="lg">立即注册</Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg">了解更多</Button>
                </Link>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">高效管理</h3>
                <p className="text-gray-600">
                  我们提供高效的管理工具，帮助您轻松管理业务。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">安全保障</h3>
                <p className="text-gray-600">
                  采用先进的安全技术，确保您的数据安全可靠。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">实时监控</h3>
                <p className="text-gray-600">
                  提供实时监控功能，让您随时了解业务状态。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold mb-4">SaaS管理平台</h3>
              <p className="text-gray-300 mb-4">
                我们致力于为企业提供最优质的SaaS管理解决方案，帮助您提升业务效率，降低运营成本。
              </p>
              <p className="text-gray-300">
                © 2025 SaaS管理平台. 保留所有权利。
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">产品</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-300 hover:text-white">功能特性</Link></li>
                <li><Link href="/pricing" className="text-gray-300 hover:text-white">价格方案</Link></li>
                <li><Link href="/docs" className="text-gray-300 hover:text-white">文档中心</Link></li>
                <li><Link href="/api" className="text-gray-300 hover:text-white">API文档</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">支持</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-300 hover:text-white">帮助中心</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">联系我们</Link></li>
                <li><Link href="/status" className="text-gray-300 hover:text-white">服务状态</Link></li>
                <li><Link href="/feedback" className="text-gray-300 hover:text-white">意见反馈</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <ul className="flex space-x-6">
                <li><Link href="/terms" className="text-gray-300 hover:text-white">服务条款</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white">隐私政策</Link></li>
                <li><Link href="/security" className="text-gray-300 hover:text-white">安全中心</Link></li>
              </ul>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}