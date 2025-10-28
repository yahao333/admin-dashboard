'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import { api, HttpError } from '@/services/api'

// 用户类型定义
export interface User {
  id: string
  email: string
  name: string
  points: number
  avatar?: string
  nickname?: string
  telegram?: string
}

// 认证上下文类型
export interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  authChecked: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string, verifyCode: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (token) {
        checkAuth(token)
      } else {
        setLoading(false)
        setAuthChecked(true) // 即使没有token，也标记为已检查
      }
    }, [])

    const checkAuth = async (token: string) => {
      console.log('Checking auth with token:', token); // 调试日志
      setLoading(true)
      try {
        const response = await api.auth.checkAuth(token)
        console.log('Check auth response:', response); // 调试日志
        if (response.data) {
          setUser(response.data)
          setIsAuthenticated(true)
        } else {
          // 明确认证失败，移除token
          localStorage.removeItem('token')
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error: unknown) {
        console.error('Auth check failed:', error)
        // 检查是否是明确的认证失败（401或403错误）
        if (error instanceof HttpError) {
          if (error.status === 401 || error.status === 403) {
            // 确实是认证失败，移除token
            localStorage.removeItem('token')
            setIsAuthenticated(false)
            setUser(null)
          }
          // 对于其他HTTP错误，保持当前状态
        }
        // 对于网络错误或其他未知错误，保持当前状态
      } finally {
        setLoading(false)
        setAuthChecked(true) // 标记认证检查已完成
      }
    }

    const login = async (email: string, password: string) => {
      try {
        const response = await api.auth.login(email, password)
        if (response.error) {
          throw new Error(response.error)
        }
        
        if (response.data) {
          localStorage.setItem('token', response.data.token)
          setIsAuthenticated(true)
          setUser(response.data.user)
        }
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    }

    const register = async (
      email: string,
      password: string,
      name: string,
      verifyCode: string
    ) => {
      try {
        const response = await api.auth.register(email, password, name, verifyCode)
        if (response.error) {
          throw new Error(response.error)
        }
        
        if (response.data) {
          localStorage.setItem('token', response.data.token)
          setIsAuthenticated(true)
          setUser(response.data.user)
        }
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    }

    const resetPassword = async (email: string) => {
      try {
        const response = await api.auth.requestPasswordReset(email)
        if (response.error) {
          throw new Error(response.error)
        }
      } catch (error) {
        console.error('Password reset failed:', error)
        throw error
      }
    }

    const logout = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          await api.auth.logout(token)
        }
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    return (
      <AuthContext.Provider 
        value={{ 
          isAuthenticated, 
          user, 
          loading,
          authChecked,
          login, 
          logout,
          register,
          resetPassword
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }