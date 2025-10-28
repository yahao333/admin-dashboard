'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { 
  Home, 
  Package2, 
  ClipboardList, 
  Users, 
  MessageSquare,
  Settings,
  Check,
  Play
} from 'lucide-react'
import { SidebarNav } from '@/components/ui/sidebar-nav'

const plans = [
  {
    name: "基础套餐",
    price: "19.9",
    duration: "月",
    features: [
      "100GB 月流量",
      "2个 在线设备",
      "基础节点访问",
      "标准客服支持"
    ]
  },
  {
    name: "进阶套餐",
    price: "39.9",
    duration: "月",
    popular: true,
    features: [
      "500GB 月流量",
      "5个 在线设备",
      "高级节点访问",
      "优先客服支持",
      "专属IP地址"
    ]
  },
  {
    name: "专业套餐",
    price: "99.9",
    duration: "月",
    features: [
      "不限流量",
      "10个 在线设备",
      "全部节点访问",
      "24/7 客服支持",
      "专属IP地址",
      "企业级别加密"
    ]
  }
]

export default function Subscribe() {
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
      icon: <ClipboardList className="h-4 w-4" />,
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
                <h2 className="text-2xl font-bold tracking-tight">购买订阅</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan, index) => (
                  <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                          最受欢迎
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">¥{plan.price}</span>
                        <span className="text-gray-500">/{plan.duration}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        立即购买
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>订阅说明</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-600">
                    • 所有套餐均支持自动续费，可随时取消
                  </p>
                  <p className="text-gray-600">
                    • 流量每月初自动重置
                  </p>
                  <p className="text-gray-600">
                    • 支持支付宝、微信支付等多种支付方式
                  </p>
                  <p className="text-gray-600">
                    • 如有任何问题，请联系客服
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}