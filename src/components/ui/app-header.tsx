"use client"

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/ui/mobile-nav"
import { useAuth } from "@/hooks/useAuth"

type AppHeaderProps = {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function AppHeader({ items }: AppHeaderProps) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      // 让页面路由器自行处理跳转（各页面内已有逻辑）
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="w-full bg-white shadow fixed top-0 left-0 right-0 z-40" style={{ height: 'var(--header-h)' }}>
      <div className="w-full max-w-[1920px] mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MobileNav items={items} />
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
  )
}