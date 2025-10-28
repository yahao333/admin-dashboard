'use client'

import { useState, useCallback } from 'react'

// 验证规则类型
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

// 验证错误类型
export interface ValidationError {
  field: string
  message: string
}

// 表单字段类型
export interface FormField {
  value: string
  error: string | null
}

// 表单状态类型
export interface FormState {
  [key: string]: FormField
}

// 验证规则配置
export interface ValidationRules {
  [key: string]: ValidationRule
}

/**
 * 表单验证Hook
 * @param initialValues 初始值
 * @param rules 验证规则
 */
export function useFormValidation(
  initialValues: Record<string, string>,
  rules: ValidationRules
) {
  // 初始化表单状态
  const initialFormState: FormState = {}
  Object.keys(initialValues).forEach(key => {
    initialFormState[key] = {
      value: initialValues[key],
      error: null
    }
  })

  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 更新字段值
  const setFieldValue = useCallback((field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        error: null // 清除错误信息
      }
    }))
  }, [])

  // 验证单个字段
  const validateField = useCallback((field: string, value: string): string | null => {
    const rule = rules[field]
    if (!rule) return null

    // 必填验证
    if (rule.required && (!value || value.trim() === '')) {
      return '此字段为必填项'
    }

    // 如果字段为空且非必填，则跳过其他验证
    if (!value || value.trim() === '') {
      return null
    }

    // 最小长度验证
    if (rule.minLength !== undefined && value.length < rule.minLength) {
      return `最少需要${rule.minLength}个字符`
    }

    // 最大长度验证
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      return `最多允许${rule.maxLength}个字符`
    }

    // 正则表达式验证
    if (rule.pattern && !rule.pattern.test(value)) {
      return '格式不正确'
    }

    // 自定义验证
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }, [rules])

  // 验证所有字段
  const validateForm = useCallback((): boolean => {
    let isValid = true
    const newFormState: FormState = {}

    Object.keys(formState).forEach(field => {
      const value = formState[field].value
      const error = validateField(field, value)
      
      newFormState[field] = {
        value,
        error
      }
      
      if (error) {
        isValid = false
      }
    })

    setFormState(newFormState)
    return isValid
  }, [formState, validateField])

  // 获取字段值
  const getFieldValue = useCallback((field: string): string => {
    return formState[field]?.value || ''
  }, [formState])

  // 获取字段错误
  const getFieldError = useCallback((field: string): string | null => {
    return formState[field]?.error || null
  }, [formState])

  // 重置表单
  const resetForm = useCallback(() => {
    const resetState: FormState = {}
    Object.keys(initialValues).forEach(key => {
      resetState[key] = {
        value: initialValues[key],
        error: null
      }
    })
    setFormState(resetState)
    setIsSubmitting(false)
  }, [initialValues])

  // 设置提交状态
  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting)
  }, [])

  return {
    formState,
    isSubmitting,
    setFieldValue,
    validateForm,
    getFieldValue,
    getFieldError,
    resetForm,
    setSubmitting
  }
}

// 常用验证规则
export const validationRules = {
  // 邮箱验证
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value.length > 254) {
        return '邮箱地址过长'
      }
      return null
    }
  },
  
  // 密码验证
  password: {
    required: true,
    minLength: 6,
    maxLength: 128
  },
  
  // 用户名验证
  username: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  },
  
  // 验证码验证
  verifyCode: {
    required: true,
    minLength: 4,
    maxLength: 10
  }
}