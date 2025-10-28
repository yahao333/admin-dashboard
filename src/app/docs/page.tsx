'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Home, 
  Package2, 
  ClipboardList, 
  Users, 
  MessageSquare,
  Settings,
  BookOpen,
  Play
} from 'lucide-react'
import { SidebarNav } from '@/components/ui/sidebar-nav'

export default function Docs() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const docs = [
    {
      title: "Windows 使用教程",
      content: [
        "1. 下载并安装最新版本的客户端",
        "2. 打开客户端，输入您的账号密码登录",
        "3. 选择合适的节点连接",
        "4. 连接成功后即可开始使用"
      ]
    },
    {
      title: "MacOS 使用教程",
      content: [
        "1. 从 App Store 下载客户端",
        "2. 安装完成后打开应用",
        "3. 使用您的账号登录",
        "4. 选择节点并连接"
      ]
    },
    {
      title: "iOS 使用教程",
      content: [
        "1. 在 App Store 搜索并下载客户端",
        "2. 打开应用并登录",
        "3. 点击节点列表选择合适的节点",
        "4. 点击连接按钮开始使用"
      ]
    },
    {
      title: "Android 使用教程",
      content: [
        "1. 在 Google Play 下载安装客户端",
        "2. 登录您的账号",
        "3. 在节点列表中选择节点",
        "4. 点击连接即可使用"
      ]
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const sidebarNavItems = [
    {
      title: "首页",
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "节点",
      href: "/nodes",
      icon: <Package2 className="h-4 w-4" />,
    },
    {
      title: "订阅",
      href: "/subscribe",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      title: "工单",
      href: "/tickets",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "邀请",
      href: "/invites",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "订单",
      href: "/orders",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      title: "积分记录",
      href: "/points-history",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      title: "n8n任务",
      href: "/n8n",
      icon: <Play className="h-4 w-4" />,
    },
    {
      title: "文档",
      href: "/docs",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: "个人资料",
      href: "/profile",
      icon: <Settings className="h-4 w-4" />,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="w-full bg-white shadow fixed top-0 left-0 right-0 z-40">
        <div className="w-full max-w-[1920px] mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SaaS管理平台</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </div>
      </header>
      <div className="flex pt-[73px]">
        <aside className="hidden lg:block fixed z-30 inset-y-0 left-0 top-[73px] w-64 bg-white border-r px-4 py-6">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1 lg:pl-64">
          <div className="w-full max-w-[1920px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">使用文档</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {docs.map((doc, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2">
                        {doc.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-600">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>常见问题</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Q: 连接不上节点怎么办？</h3>
                    <p className="text-gray-600 mt-1">
                      A: 请检查网络连接是否正常，尝试切换其他节点。如果问题仍然存在，请提交工单联系客服。
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Q: 流量不够用怎么办？</h3>
                    <p className="text-gray-600 mt-1">
                      A: 可以升级到更高套餐，或者等待下个月流量重置。也可以购买流量包增加流量。
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Q: 如何取消订阅？</h3>
                    <p className="text-gray-600 mt-1">
                      A: 在个人中心的订阅管理页面可以取消自动续费。当前订阅周期结束后将不再续费。
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Q: 忘记密码怎么办？</h3>
                    <p className="text-gray-600 mt-1">
                      A: 在登录页面点击&quot;忘记密码&quot;，输入邮箱接收重置链接即可重置密码。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}