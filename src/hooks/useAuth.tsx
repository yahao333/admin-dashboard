'use client'

import { useContext } from 'react'
import { AuthContext, AuthContextType, User } from '@/contexts/AuthContext'

export type { User, AuthContextType }

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}