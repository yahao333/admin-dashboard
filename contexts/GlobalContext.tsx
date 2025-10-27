'use client'

import { createContext, useState, ReactNode, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface GlobalContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    const newNotification: Notification = {
      id,
      ...notification,
      duration: notification.duration !== undefined ? notification.duration : 5000,
    }
    setNotifications(prev => [...prev, newNotification])
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => removeNotification(id), newNotification.duration)
    }
  }, [removeNotification])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <GlobalContext.Provider value={{ notifications, addNotification, removeNotification, clearNotifications }}>
      {children}
    </GlobalContext.Provider>
  )
}