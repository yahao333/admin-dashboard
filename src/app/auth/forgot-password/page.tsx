'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useGlobal'
import { useFormValidation, validationRules } from '@/hooks/useFormValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { api } from '@/services/api'

export default function ForgotPassword() {
  const router = useRouter()
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
    { email: '', verifyCode: '', newPassword: '' },
    { 
      email: validationRules.email, 
      verifyCode: validationRules.verifyCode,
      newPassword: validationRules.password
    }
  )

  const [step, setStep] = useState(1)
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

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证邮箱
    if (!formState.email.value || formState.email.value.trim() === '') {
      showError('请求失败', '请输入邮箱')
      return
    }
    
    if (validationRules.email.pattern && !validationRules.email.pattern.test(formState.email.value)) {
      showError('请求失败', '邮箱格式不正确')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await api.auth.requestPasswordReset(formState.email.value)
      if (response.error) {
        throw new Error(response.error)
      }
      
      showSuccess('请求成功', '验证码已发送到您的邮箱')
      setStep(2)
      setCountdown(60)
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || '密码重置请求失败'
      showError('请求失败', errorMessage)
      console.error('Password reset request failed:', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await api.auth.confirmPasswordReset(
        formState.email.value, 
        formState.verifyCode.value, 
        formState.newPassword.value
      )
      if (response.error) {
        throw new Error(response.error)
      }
      
      showSuccess('重置成功', '密码已重置，即将跳转到登录页面')
      // 重置成功，导航到登录页面
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || '密码重置失败'
      showError('重置失败', errorMessage)
      console.error('Password reset failed:', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">SaaS管理平台</h2>
          <p className="text-center text-gray-500">重置密码</p>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              {/* 邮箱字段 */}
              <div>
                <Input
                  type="email"
                  placeholder="邮箱"
                  value={formState.email.value}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              {/* 提交按钮 */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '发送中...' : '发送验证码'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-4">
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
                  onClick={handleRequestReset}
                  disabled={countdown > 0 || isSubmitting}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '重新发送'}
                </Button>
              </div>
              {getFieldError('verifyCode') && (
                <p className="text-red-500 text-sm">{getFieldError('verifyCode')}</p>
              )}
              
              {/* 新密码字段 */}
              <div>
                <Input
                  type="password"
                  placeholder="新密码"
                  value={formState.newPassword.value}
                  onChange={(e) => setFieldValue('newPassword', e.target.value)}
                  disabled={isSubmitting}
                  className={getFieldError('newPassword') ? 'border-red-500' : ''}
                />
                {getFieldError('newPassword') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('newPassword')}</p>
                )}
              </div>
              
              {/* 提交按钮 */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '重置中...' : '重置密码'}
              </Button>
            </form>
          )}
          
          {/* 链接 */}
          <div className="text-center mt-4">
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
              返回登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}