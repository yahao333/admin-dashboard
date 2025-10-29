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
  Globe,
  Signal,
  Activity,
  Play
} from 'lucide-react'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { AppHeader } from '@/components/ui/app-header'

interface Node {
  name: string
  location: string
  status: 'online' | 'offline' | 'maintenance'
  load: number
  ping: number
  type: 'premium' | 'standard'
}

const nodes: Node[] = [
  {
    name: '香港 01',
    location: '中国香港',
    status: 'online',
    load: 45,
    ping: 88,
    type: 'premium'
  },
  {
    name: '香港 02',
    location: '中国香港',
    status: 'online',
    load: 32,
    ping: 92,
    type: 'standard'
  },
  {
    name: '新加坡 01',
    location: '新加坡',
    status: 'maintenance',
    load: 0,
    ping: 0,
    type: 'premium'
  },
  {
    name: '日本 01',
    location: '东京',
    status: 'online',
    load: 78,
    ping: 125,
    type: 'premium'
  },
  {
    name: '美国 01',
    location: '洛杉矶',
    status: 'online',
    load: 55,
    ping: 198,
    type: 'standard'
  },
  {
    name: '韩国 01',
    location: '首尔',
    status: 'offline',
    load: 0,
    ping: 0,
    type: 'standard'
  }
]

const getStatusColor = (status: Node['status']) => {
  switch (status) {
    case 'online':
      return 'bg-green-500'
    case 'offline':
      return 'bg-red-500'
    case 'maintenance':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}

const getStatusText = (status: Node['status']) => {
  switch (status) {
    case 'online':
      return '在线'
    case 'offline':
      return '离线'
    case 'maintenance':
      return '维护中'
    default:
      return '未知'
  }
}

export default function Nodes() {
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
                <h2 className="text-2xl font-bold tracking-tight">节点状态</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">总节点数</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{nodes.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">在线节点</CardTitle>
                    <Signal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {nodes.filter(node => node.status === 'online').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">平均延迟</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(
                        nodes
                          .filter(node => node.status === 'online')
                          .reduce((acc, node) => acc + node.ping, 0) /
                        nodes.filter(node => node.status === 'online').length
                      )}
                      ms
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {nodes.map((node, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-lg">{node.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{node.location}</p>
                      </div>
                      <Badge variant={node.type === 'premium' ? 'default' : 'secondary'}>
                        {node.type === 'premium' ? '高级节点' : '普通节点'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">状态</span>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getStatusColor(node.status)}`} />
                            <span className="text-sm">{getStatusText(node.status)}</span>
                          </div>
                        </div>
                        {node.status === 'online' && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">负载</span>
                              <span className="text-sm">{node.load}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">延迟</span>
                              <span className="text-sm">{node.ping}ms</span>
                            </div>
                          </>
                        )}
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