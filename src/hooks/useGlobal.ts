'use client'

import { useContext } from 'react'
import { GlobalContext, Notification } from '../contexts/GlobalContext'

export function useGlobal() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}

// 便捷函数用于添加不同类型的通知
export const useNotifications = () => {
  const { addNotification } = useGlobal()
  
  const showSuccess = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration })
  }
  
  const showError = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration })
  }
  
  const showWarning = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration })
  }
  
  const showInfo = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration })
  }
  
  return { showSuccess, showError, showWarning, showInfo }
}