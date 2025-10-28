// api.ts - API服务模块
import { User } from '@/contexts/AuthContext'

// API响应类型
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// 积分记录类型
export interface PointsRecord {
  id: number
  points_change: number
  reason: string
  created_at: string
}

// 任务类型
export interface Task {
  id: number
  user_id: number
  name: string
  description: string
  type: string
  trigger_type: string
  cron_expression: string
  active: boolean
  webhook_url: string
  webhook_body: string
  created_at: string
  updated_at: string
}

// HTTP错误类
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

// API配置：默认使用相对路径 '/api'，通过 Next.js 重写代理到后端
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? '/api'
const DEFAULT_TIMEOUT = 10000 // 10秒

// 请求配置
interface RequestConfig {
  timeout?: number
  headers?: Record<string, string>
}

// 通用请求函数
async function request<T>(
  url: string,
  options: RequestInit,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { timeout = DEFAULT_TIMEOUT, headers = {} } = config
  
  // 合并默认headers、传入的headers和options中的headers
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...headers, // config中的headers
    ...options.headers // options中的headers
  }
  
  console.log('Making request with headers:', mergedHeaders); // 调试日志
  
  // 创建带超时的请求
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    console.log(`Making request to: ${API_BASE_URL}${url}`) // 调试日志
    console.log(`API_BASE_URL: '${API_BASE_URL}', url: '${url}'`); // 调试日志
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: mergedHeaders, // 使用合并后的headers
      signal: controller.signal,
      // 纯 JWT 模式，不依赖 cookies
      credentials: 'omit'
    })
    
    clearTimeout(timeoutId)
    
    // 尝试解析JSON响应
    let data: unknown
    try {
      data = await response.json()
    } catch {
      data = { message: response.statusText }
    }
    
    // 检查响应状态
    if (!response.ok) {
      const errorData = data as { error?: string; message?: string }
      // 抛出包含状态码的错误
      throw new HttpError(
        errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText
      )
    }
    
    return { data: data as T, message: (data as { message?: string }).message }
  } catch (error: unknown) {
    clearTimeout(timeoutId)
    console.error('Request failed:', error) // 调试日志
    
    // 处理不同类型的错误
    if ((error as Error).name === 'AbortError') {
      return { error: '请求超时' }
    }
    
    if (error instanceof TypeError) {
      console.error('Network error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return { error: '网络连接失败，请检查网络设置' }
    }
    
    // 如果是HttpError，重新抛出以便上层处理
    if (error instanceof HttpError) {
      throw error
    }
    
    return { error: (error as Error).message || '未知错误' }
  }
}

// 认证相关API
export const authApi = {
  // 登录
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  // 注册
  async register(
    email: string,
    password: string,
    name: string,
    verifyCode: string
  ): Promise<ApiResponse<{ token: string; user: User }>> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, verifyCode }),
    })
  },

  // 登出
  async logout(token: string): Promise<ApiResponse> {
    return request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 检查认证状态
  async checkAuth(token: string): Promise<ApiResponse<User>> {
    return request('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 请求密码重置
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // 确认密码重置
  async confirmPasswordReset(
    email: string,
    code: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return request('/auth/reset-password/confirm', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    })
  },

  // 发送邮箱验证码
  async sendEmailVerification(email: string): Promise<ApiResponse> {
    return request('/auth/email-verify', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }
}

// 用户相关API
export const userApi = {
  // 获取用户信息
  async getUserInfo(token: string): Promise<ApiResponse<User>> {
    return request('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 更新用户信息
  async updateUserInfo(
    token: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    return request('/user/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    })
  },

  // 获取用户积分
  async getUserPoints(token: string): Promise<ApiResponse<{ points: number }>> {
    return request('/auth/points', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 获取用户积分记录
  async getUserPointsRecords(token: string): Promise<ApiResponse<{ records: PointsRecord[] }>> {
    return request('/auth/points-records', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

// 任务相关API
export const taskApi = {
  // 创建任务
  async createTask(
    token: string,
    taskData: {
      name: string;
      description: string;
      type: string;
      trigger_type: string;
      cron_expression: string;
      active: boolean;
      webhook_url: string;
      webhook_body: string;
    }
  ): Promise<ApiResponse<{ task: Task }>> {
    return request('/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData),
    })
  },

  // 获取任务列表
  async getTasks(token: string): Promise<ApiResponse<{ tasks: Task[] }>> {
    return request('/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 获取任务详情
  async getTask(token: string, taskId: number): Promise<ApiResponse<{ task: Task }>> {
    return request(`/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 更新任务
  async updateTask(
    token: string,
    taskId: number,
    taskData: {
      name?: string;
      description?: string;
      type?: string;
      trigger_type?: string;
      cron_expression?: string;
      active?: boolean;
      webhook_url?: string;
      webhook_body?: string;
    }
  ): Promise<ApiResponse<{ task: Task }>> {
    return request(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData),
    })
  },

  // 删除任务
  async deleteTask(token: string, taskId: number): Promise<ApiResponse> {
    return request(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 测试Webhook
  async testWebhook(token: string, taskId: number): Promise<ApiResponse<{ webhook_url: string; webhook_body: string }>> {
    return request(`/tasks/${taskId}/test`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 执行任务
  async executeTask(token: string, taskId: number): Promise<ApiResponse<{ message: string; status_code: number; response_body: string }>> {
    return request(`/tasks/${taskId}/execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

// 导出API实例
export const api = {
  auth: authApi,
  user: userApi,
  task: taskApi
}