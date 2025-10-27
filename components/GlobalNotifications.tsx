'use client'

import { useEffect, useState } from 'react'
import { useGlobal } from '@/hooks/useGlobal'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function GlobalNotifications() {
  const { notifications, removeNotification } = useGlobal()
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([])

  useEffect(() => {
    const ids = notifications.map(n => n.id)
    setVisibleNotifications(prev => {
      const existing = prev.filter(id => ids.includes(id))
      const newIds = ids.filter(id => !prev.includes(id))
      return [...existing, ...newIds]
    })
  }, [notifications])

  const handleClose = (id: string) => {
    setVisibleNotifications(prev => prev.filter(nid => nid !== id))
    setTimeout(() => removeNotification(id), 300)
  }

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
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
      {notifications
        .filter(n => visibleNotifications.includes(n.id))
        .map(n => (
          <div
            key={n.id}
            className={`transition-all duration-300 ease-in-out ${
              visibleNotifications.includes(n.id) ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
          >
            <Alert className={`${getNotificationClasses(n.type)} relative`}>
              <div className="flex items-start justify-between">
                <div>
                  <AlertTitle>{n.title}</AlertTitle>
                  <AlertDescription>{n.message}</AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 w-6 p-0 text-lg"
                  onClick={() => handleClose(n.id)}
                  aria-label="关闭"
                >
                  ×
                </Button>
              </div>
            </Alert>
          </div>
        ))}
    </div>
  )
}