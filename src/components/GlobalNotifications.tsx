'use client'

import { useEffect, useState } from 'react'
import { useGlobal } from '../hooks/useGlobal'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Notification } from '@/contexts/GlobalContext'

export default function GlobalNotifications() {
  const { notifications, removeNotification } = useGlobal()
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([])

  // 当通知列表变化时，更新可见通知列表
  useEffect(() => {
    const notificationIds = notifications.map((n: Notification) => n.id)
    setVisibleNotifications(prev => {
      // 保留仍在通知列表中的通知，添加新的通知
      const existing = prev.filter((id: string) => notificationIds.includes(id))
      const newIds = notificationIds.filter((id: string) => !prev.includes(id))
      return [...existing, ...newIds]
    })
  }, [notifications])

  const handleClose = (id: string) => {
    setVisibleNotifications(prev => prev.filter((notificationId: string) => notificationId !== id))
    // 延迟移除，让动画完成
    setTimeout(() => {
      removeNotification(id)
    }, 300)
  }

  // 获取通知的样式类
  const getNotificationClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50 text-green-800'
      case 'error':
        return 'border-red-500 bg-red-50 text-red-800'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800'
      case 'info':
        return 'border-blue-500 bg-blue-50 text-blue-800'
      default:
        return 'border-gray-500 bg-gray-50 text-gray-800'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {notifications
        .filter((notification: Notification) => visibleNotifications.includes(notification.id))
        .map((notification: Notification) => (
          <div
            key={notification.id}
            className={`transition-all duration-300 ease-in-out ${
              visibleNotifications.includes(notification.id) 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-full opacity-0'
            }`}
          >
            <Alert className={`${getNotificationClasses(notification.type)} relative`}>
              <div className="flex justify-between items-start">
                <div>
                  <AlertTitle>{notification.title}</AlertTitle>
                  <AlertDescription>{notification.message}</AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-2"
                  onClick={() => handleClose(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          </div>
        ))}
    </div>
  )
}