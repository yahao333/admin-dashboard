"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Menu, X } from "lucide-react"

type MobileNavProps = {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        aria-label="打开菜单"
        variant="outline"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed left-0 right-0 top-[73px] bottom-0 z-50 lg:hidden">
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* 侧边抽屉 */}
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white border-r shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">导航</span>
              <Button
                aria-label="关闭菜单"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarNav items={items} />
          </div>
        </div>
      )}
    </>
  )
}