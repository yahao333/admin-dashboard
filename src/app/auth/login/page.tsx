'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useGlobal'
import { useFormValidation, validationRules } from '@/hooks/useFormValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const { showError } = useNotifications()
  
  // 使用表单验证hook
  const {
    formState,
    isSubmitting,
    setFieldValue,
    validateForm,
    getFieldError,
    setSubmitting
  } = useFormValidation(
    { email: '', password: '' },
    { 
      email: validationRules.email, 
      password: validationRules.password 
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    
    try {
      await login(formState.email.value, formState.password.value)
      
      // 登录成功后重定向到仪表板
      router.push('/dashboard')
    } catch (err: unknown) {
      // 使用全局通知显示错误
      const errorMessage = (err as Error).message || '登录失败，请重试'
      showError('登录失败', errorMessage)
      console.error('Login failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">SaaS管理平台</h2>
          <p className="text-center text-gray-500">现代化的SaaS管理解决方案</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 邮箱字段 */}
            <div>
              <Input
                type="email"
                placeholder="邮箱"
                value={formState.email.value}
                onChange={(e) => setFieldValue('email', e.target.value)}
                disabled={isSubmitting}
                className={getFieldError('email') ? 'border-red-500' : ''}
              />
              {getFieldError('email') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
              )}
            </div>
            
            {/* 密码字段 */}
            <div>
              <Input
                type="password"
                placeholder="密码"
                value={formState.password.value}
                onChange={(e) => setFieldValue('password', e.target.value)}
                disabled={isSubmitting}
                className={getFieldError('password') ? 'border-red-500' : ''}
              />
              {getFieldError('password') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('password')}</p>
              )}
            </div>
            
            {/* 提交按钮 */}
            <Button 
              type="submit" 
              className="w-full py-3 rounded-lg bg-[#344F8D] hover:bg-[#2d4379] text-white font-medium shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登录中...
                </span>
              ) : '立即登录'}
            </Button>
            <div className="flex justify-between text-sm">
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-800">
                注册
              </Link>
              <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800">
                忘记密码?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}