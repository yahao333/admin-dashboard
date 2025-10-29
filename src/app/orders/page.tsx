'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Package2, 
  ClipboardList, 
  Users, 
  MessageSquare,
  Settings,
  Play
} from 'lucide-react'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { AppHeader } from '@/components/ui/app-header'

// 订单状态映射
const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-800' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-800' },
}

// 模拟订单数据
const orders = [
  {
    id: 'ORD001',
    plan: '基础套餐',
    price: '19.90',
    date: '2024-03-15',
    status: 'completed',
    payMethod: '支付宝'
  },
  {
    id: 'ORD002',
    plan: '进阶套餐',
    price: '39.90',
    date: '2024-03-10',
    status: 'pending',
    payMethod: '微信支付'
  },
  {
    id: 'ORD003',
    plan: '专业套餐',
    price: '99.90',
    date: '2024-03-05',
    status: 'processing',
    payMethod: '支付宝'
  }
]

export default function Orders() {
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
      <AppHeader items={sidebarNavItems} />
      <div className="flex pt-[var(--header-h)]">
        <aside className="hidden lg:block fixed z-30 inset-y-0 left-0 top-[var(--header-h)] w-64 bg-white border-r px-4 py-6">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1 lg:pl-64">
          <div className="w-full max-w-[1920px] mx-auto px-4 pt-2 pb-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">我的订单</h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>订单记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单号</TableHead>
                        <TableHead>套餐</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>下单时间</TableHead>
                        <TableHead>支付方式</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.plan}</TableCell>
                          <TableCell>¥{order.price}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.payMethod}</TableCell>
                          <TableCell>
                            <Badge 
                              className={`${statusMap[order.status].color} border-0`}
                            >
                              {statusMap[order.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              查看详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>订单说明</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-600">
                    • 订单支付成功后，服务将立即生效
                  </p>
                  <p className="text-gray-600">
                    • 如需开具发票，请联系客服处理
                  </p>
                  <p className="text-gray-600">
                    • 订单相关问题请提交工单咨询
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