'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Home, 
  Package2, 
  ClipboardList, 
  Users, 
  MessageSquare,
  Settings,
  UserCircle,
  Play
} from 'lucide-react'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { MobileNav } from '@/components/ui/mobile-nav'

export default function Profile() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    telegram: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else {
      // 初始化表单数据
      setFormData({
        email: user?.email || '',
        nickname: user?.nickname || '',
        telegram: user?.telegram || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setLoading(false)
    }
  }, [isAuthenticated, user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现更新个人信息的逻辑
    setIsEditing(false)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现更新密码的逻辑
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
      icon: <UserCircle className="h-4 w-4" />,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="w-full bg-white shadow fixed top-0 left-0 right-0 z-40">
        <div className="w-full max-w-[1920px] mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MobileNav items={sidebarNavItems} />
            <h1 className="text-2xl font-bold text-gray-900">SaaS管理平台</h1>
          </div>
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
                <h2 className="text-2xl font-bold tracking-tight">个人中心</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                          id="email"
                          value={formData.email}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nickname">昵称</Label>
                        <Input
                          id="nickname"
                          value={formData.nickname}
                          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telegram">Telegram</Label>
                        <Input
                          id="telegram"
                          value={formData.telegram}
                          onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                          disabled={!isEditing}
                          placeholder="@username"
                        />
                      </div>
                      {!isEditing ? (
                        <Button type="button" onClick={() => setIsEditing(true)}>
                          编辑资料
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button type="submit">保存</Button>
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            取消
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>修改密码</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">当前密码</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">新密码</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">确认新密码</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                      </div>
                      <Button type="submit">
                        更新密码
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>账号安全</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">两步验证</h3>
                      <p className="text-sm text-gray-500">启用两步验证以提高账号安全性</p>
                    </div>
                    <Button variant="outline">设置</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">登录设备管理</h3>
                      <p className="text-sm text-gray-500">查看并管理当前登录的设备</p>
                    </div>
                    <Button variant="outline">查看</Button>
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