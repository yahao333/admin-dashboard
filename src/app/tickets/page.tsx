'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Package2, 
  ClipboardList, 
  Users, 
  MessageSquare,
  Settings,
  Plus,
  Play
} from 'lucide-react'
import { SidebarNav } from '@/components/ui/sidebar-nav'

interface Ticket {
  id: string
  title: string
  status: 'pending' | 'processing' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  lastReply?: string
  category: string
}

const tickets: Ticket[] = [
  {
    id: 'TK-001',
    title: '无法连接香港节点',
    status: 'processing',
    priority: 'high',
    createdAt: '2024-01-15 14:30',
    lastReply: '2024-01-15 15:45',
    category: '节点问题'
  },
  {
    id: 'TK-002',
    title: '订阅续费问题',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-14 09:15',
    category: '支付问题'
  },
  {
    id: 'TK-003',
    title: '客户端无法登录',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-01-13 16:20',
    lastReply: '2024-01-13 17:30',
    category: '账号问题'
  }
]

const getStatusColor = (status: Ticket['status']) => {
  const colors = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    resolved: 'bg-green-500',
    closed: 'bg-gray-500'
  }
  return colors[status]
}

const getStatusText = (status: Ticket['status']) => {
  const text = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭'
  }
  return text[status]
}

const getPriorityColor = (priority: Ticket['priority']) => {
  const colors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }
  return colors[priority]
}

const getPriorityText = (priority: Ticket['priority']) => {
  const text = {
    low: '低',
    medium: '中',
    high: '高'
  }
  return text[priority]
}

export default function Tickets() {
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
                <h2 className="text-2xl font-bold tracking-tight">我的工单</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新建工单
                </Button>
              </div>

              <div className="grid gap-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{ticket.title}</CardTitle>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">工单号：{ticket.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(ticket.status)}`} />
                        <span className="text-sm">{getStatusText(ticket.status)}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">优先级</span>
                            <div className="flex items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(ticket.priority)}`} />
                              <span>{getPriorityText(ticket.priority)}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">创建时间：</span>
                            <span>{ticket.createdAt}</span>
                          </div>
                          {ticket.lastReply && (
                            <div>
                              <span className="text-muted-foreground">最后回复：</span>
                              <span>{ticket.lastReply}</span>
                            </div>
                          )}
                        </div>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}