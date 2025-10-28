'use client'

import { createContext, useState, ReactNode, useCallback } from 'react'

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number // 持续时间，毫秒
}

// 全局上下文类型
interface GlobalContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

// 创建全局上下文
export const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

interface GlobalProviderProps {
  children: ReactNode
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // 移除通知
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  // 添加通知
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      ...notification,
      duration: notification.duration !== undefined ? notification.duration : 5000 // 默认5秒
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // 自动移除通知
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }, [removeNotification])

  // 清除所有通知
  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <GlobalContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification, 
        clearNotifications 
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
