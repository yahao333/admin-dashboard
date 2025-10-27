'use client'

import { useContext } from 'react'
import { GlobalContext } from '@/contexts/GlobalContext'

export function useGlobal() {
  const ctx = useContext(GlobalContext)
  if (!ctx) throw new Error('useGlobal must be used within a GlobalProvider')
  return ctx
}

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
  // 兼容别名：允许仅传入 title（message 可选）
  const success = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'success', title, message: message ?? '', duration })
  }
  const error = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'error', title, message: message ?? '', duration })
  }
  const warning = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'warning', title, message: message ?? '', duration })
  }
  const info = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'info', title, message: message ?? '', duration })
  }
  return { showSuccess, showError, showWarning, showInfo, success, error, warning, info }
}