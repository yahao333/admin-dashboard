'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useGlobal'
import { useFormValidation, validationRules } from '@/hooks/useFormValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { api } from '@/services/api'

export default function Register() {
  const router = useRouter()
  const { register } = useAuth()
  const { showError, showSuccess } = useNotifications()
  
  // 使用表单验证hook
  const {
    formState,
    isSubmitting,
    setFieldValue,
    validateForm,
    getFieldError,
    setSubmitting
  } = useFormValidation(
    { email: '', password: '', name: '', verifyCode: '' },
    { 
      email: validationRules.email, 
      password: validationRules.password,
      name: validationRules.username,
      verifyCode: validationRules.verifyCode
    }
  )

  const [countdown, setCountdown] = useState(0)

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async () => {
    // 验证邮箱
    const emailError = validationRules.email.required && (!formState.email.value || formState.email.value.trim() === '')
      ? '请输入邮箱'
      : validationRules.email.pattern && !validationRules.email.pattern.test(formState.email.value)
      ? '邮箱格式不正确'
      : null

    if (emailError) {
      showError('发送验证码失败', emailError)
      console.error('Email validation error:', emailError)
      return
    }
    
    try {
      const response = await api.auth.sendEmailVerification(formState.email.value)
      if (response.error) {
        throw new Error(response.error)
      }
      
      showSuccess('发送成功', '验证码已发送到您的邮箱')
      setCountdown(60)
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || '发送验证码失败'
      showError('发送验证码失败', errorMessage)
      console.error('Send code failed:', errorMessage)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    
    try {
      await register(
        formState.email.value, 
        formState.password.value, 
        formState.name.value, 
        formState.verifyCode.value
      )
      showSuccess('注册成功', '账户创建成功，即将跳转到仪表板')
      // 注册成功后重定向到仪表板
      router.push('/dashboard')
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || '注册失败，请重试'
      showError('注册失败', errorMessage)
      console.error('Registration failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">SaaS管理平台</h2>
          <p className="text-center text-gray-500">创建您的账户</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名字段 */}
            <div>
              <Input
                type="text"
                placeholder="用户名"
                value={formState.name.value}
                onChange={(e) => setFieldValue('name', e.target.value)}
                disabled={isSubmitting}
                className={getFieldError('name') ? 'border-red-500' : ''}
              />
              {getFieldError('name') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
              )}
            </div>
            
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
                placeholder="密码（至少6个字符）"
                value={formState.password.value}
                onChange={(e) => setFieldValue('password', e.target.value)}
                disabled={isSubmitting}
                className={getFieldError('password') ? 'border-red-500' : ''}
              />
              {getFieldError('password') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('password')}</p>
              )}
            </div>
            
            {/* 验证码字段 */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="验证码"
                value={formState.verifyCode.value}
                onChange={(e) => setFieldValue('verifyCode', e.target.value)}
                disabled={isSubmitting}
                className={getFieldError('verifyCode') ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendCode}
                disabled={countdown > 0 || isSubmitting}
              >
                {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
              </Button>
            </div>
            {getFieldError('verifyCode') && (
              <p className="text-red-500 text-sm">{getFieldError('verifyCode')}</p>
            )}
            
            {/* 提交按钮 */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? '注册中...' : '注册'}
            </Button>
            
            {/* 链接 */}
            <div className="text-center text-sm">
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
                已有账户？立即登录
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}