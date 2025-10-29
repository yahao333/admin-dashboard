'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { AppHeader } from '@/components/ui/app-header'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Package2, 
  ClipboardList, 
  Users, 
  MessageSquare,
  Settings,
  Play
} from 'lucide-react'
import { api } from '@/services/api'

interface PointsRecord {
  id: number
  points_change: number
  reason: string
  created_at: string
}

export default function PointsHistory() {
  const router = useRouter()
  const { isAuthenticated, user, logout, authChecked } = useAuth()
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<PointsRecord[]>([])
  const [recordsLoading, setRecordsLoading] = useState(true)

  useEffect(() => {
    // 等待认证检查完成
    if (!authChecked) {
      return
    }
    
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else {
      setLoading(false)
      fetchPointsRecords()
    }
  }, [isAuthenticated, authChecked, router])

  const fetchPointsRecords = async () => {
    try {
      setRecordsLoading(true)
      // 使用useAuth hook中的token而不是直接从localStorage获取
      // const token = localStorage.getItem('token')
      // 修复：使用正确的API服务调用方式
      if (user?.id) {  // 确保用户已认证
        const response = await api.user.getUserPointsRecords(localStorage.getItem('token') || '')
        if (response.data?.records) {
          setRecords(response.data.records)
        }
      }
    } catch (error) {
      console.error('Failed to fetch points records:', error)
    } finally {
      setRecordsLoading(false)
    }
  }

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
                <h2 className="text-2xl font-bold tracking-tight">积分记录</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>积分变动记录</CardTitle>
                </CardHeader>
                <CardContent>
                  {recordsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : records.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      暂无积分记录
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {records.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">
                              {record.reason}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.created_at}
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${record.points_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {record.points_change > 0 ? '+' : ''}{record.points_change}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}