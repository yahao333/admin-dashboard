'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useGlobal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Home, 
  Package2, 
  ClipboardList, 
  Users, 
  MessageSquare,
  Settings,
  Play,
  Clock,
  Send
} from 'lucide-react'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { api } from '@/services/api'

interface Task {
  id: number
  name: string
  description: string
  type: string
  triggerType: 'manual' | 'scheduled'
  cronExpression?: string
  active: boolean
  webhookUrl?: string
  webhookBody?: string
}

// 添加编辑任务的状态
interface EditingTask {
  id: number
  name: string
  description: string
  type: string
  triggerType: 'manual' | 'scheduled'
  cronExpression: string
  active: boolean
  webhookUrl: string
  webhookBody: string
}

export default function N8n() {
  const router = useRouter()
  const { isAuthenticated, user, logout, authChecked } = useAuth()
  const { showError, showSuccess } = useNotifications()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null)
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    type: '默认任务' as '默认任务' | '消息任务',
    triggerType: 'manual' as 'manual' | 'scheduled',
    cronExpression: '',
    active: true,
    webhookUrl: '',
    webhookBody: ''
  })

  useEffect(() => {
    // 等待认证检查完成
    if (!authChecked) {
      return
    }
    
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else {
      setLoading(false)
      // 从API加载任务数据
      loadTasks()
    }
  }, [isAuthenticated, authChecked, router])

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到认证令牌')
      }
      
      const response = await api.task.getTasks(token)
      console.log('Loaded tasks:', response.data)
      if (response.data?.tasks) {
        // 转换后端数据格式为前端格式
        const convertedTasks = response.data.tasks.map(task => ({
          id: task.id,
          name: task.name,
          description: task.description,
          type: task.type,
          triggerType: task.trigger_type as 'manual' | 'scheduled',
          cronExpression: task.cron_expression,
          active: task.active,
          webhookUrl: task.webhook_url,
          webhookBody: task.webhook_body
        }))
        setTasks(convertedTasks)
      }
    } catch (error) {
      console.error('加载任务失败:', error)
      showError('加载失败', '加载任务失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleAddTask = () => {
    setIsAddingTask(true)
  }

  const handleSaveTask = async () => {
    if (newTask.name.trim() === '') {
      showError('输入错误', '请输入任务名称')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到认证令牌')
      }
      
      // 转换前端数据格式为后端格式
      const taskData = {
        name: newTask.name,
        description: newTask.description,
        type: newTask.type,
        trigger_type: newTask.triggerType,
        cron_expression: newTask.cronExpression,
        active: newTask.active,
        webhook_url: newTask.webhookUrl,
        webhook_body: newTask.webhookBody
      }
      
      const response = await api.task.createTask(token, taskData)
      if (response.data?.task) {
        // 转换后端数据格式为前端格式
        const createdTask: Task = {
          id: response.data.task.id,
          name: response.data.task.name,
          description: response.data.task.description,
          type: response.data.task.type,
          triggerType: response.data.task.trigger_type as 'manual' | 'scheduled',
          cronExpression: response.data.task.cron_expression,
          active: response.data.task.active,
          webhookUrl: response.data.task.webhook_url,
          webhookBody: response.data.task.webhook_body
        }
        
        setTasks([...tasks, createdTask])
        setNewTask({
          name: '',
          description: '',
          type: '默认任务',
          triggerType: 'manual',
          cronExpression: '',
          active: true,
          webhookUrl: '',
          webhookBody: ''
        })
        setIsAddingTask(false)
        showSuccess('创建成功', '任务创建成功')
      }
    } catch (error) {
      console.error('创建任务失败:', error)
      showError('创建失败', '创建任务失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  const handleCancelAdd = () => {
    setIsAddingTask(false)
    setNewTask({
      name: '',
      description: '',
      type: '默认任务',
      triggerType: 'manual',
      cronExpression: '',
      active: true,
      webhookUrl: '',
      webhookBody: ''
    })
  }

  const handleTestWebhook = async (taskId: number) => {
    try {
      // 如果是新建任务（ID为0），直接测试而不调用后端接口
      if (taskId === 0) {
        let url = ''
        let body = '{}'
        
        // 根据当前状态确定URL和Body
        if (isAddingTask) {
          url = newTask.webhookUrl
          // 根据任务类型构造不同的请求体
          if (newTask.type === '消息任务') {
            body = JSON.stringify({"data":{"send_message":newTask.webhookBody}})
          } else {
            body = newTask.webhookBody
          }
        } else if (isEditingTask && editingTask) {
          url = editingTask.webhookUrl
          // 根据任务类型构造不同的请求体
          if (editingTask.type === '消息任务') {
            body = JSON.stringify({"data":{"send_message":editingTask.webhookBody}})
          } else {
            body = editingTask.webhookBody
          }
        }
        
        // 验证URL
        if (!url) {
          showError('输入错误', '请输入Webhook URL')
          return
        }
        
        // 验证JSON格式
        let jsonData
        try {
          jsonData = JSON.parse(body)
        } catch (e) {
          showError('格式错误', 'Body内容不是有效的JSON格式')
          return
        }
        
        // 发送测试请求
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData)
        })
        
        if (response.ok) {
          showSuccess('测试成功', '测试成功！')
        } else {
          showError('测试失败', `测试失败：${response.status} ${response.statusText}`)
        }
        return
      }
      
      // 对于已存在的任务，调用后端测试接口
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到认证令牌')
      }
      
      // 调用后端测试接口
      const response = await api.task.testWebhook(token, taskId)
      if (!response.error) {
        // 从后端获取Webhook信息
        const webhookUrl = response.data?.webhook_url
        const webhookBody = response.data?.webhook_body
        
        if (!webhookUrl) {
          showError('配置错误', '任务未配置Webhook URL')
          return
        }
        
        // 验证JSON格式
        let jsonData
        try {
          // 根据任务类型构造不同的请求体
          const task = tasks.find(t => t.id === taskId)
          if (task && task.type === '消息任务') {
            jsonData = {"data":{"send_message":webhookBody || ''}}
          } else {
            jsonData = JSON.parse(webhookBody || '{}')
          }
        } catch (e) {
          showError('格式错误', 'Body内容不是有效的JSON格式')
          return
        }
        
        // 发送测试请求
        const testResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData)
        })
        
        if (testResponse.ok) {
          showSuccess('测试成功', '测试成功！')
        } else {
          showError('测试失败', `测试失败：${testResponse.status} ${testResponse.statusText}`)
        }
      } else {
        showError('获取失败', `获取任务信息失败: ${response.error}`)
      }
    } catch (error: unknown) {
      console.error('测试失败:', error)
      if (error instanceof Error) {
        showError('测试失败', `测试失败：${error.message}`)
      } else {
        showError('测试失败', '测试失败：未知错误')
      }
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask({
      id: task.id,
      name: task.name,
      description: task.description,
      type: task.type as '默认任务' | '消息任务',
      triggerType: task.triggerType,
      cronExpression: task.cronExpression || '',
      active: task.active,
      webhookUrl: task.webhookUrl || '',
      webhookBody: task.webhookBody || ''
    })
    setIsEditingTask(true)
  }

  const handleUpdateTask = async () => {
    if (!editingTask || editingTask.name.trim() === '') {
      showError('输入错误', '请输入任务名称')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到认证令牌')
      }
      
      // 转换前端数据格式为后端格式
      const taskData = {
        name: editingTask.name,
        description: editingTask.description,
        type: editingTask.type,
        trigger_type: editingTask.triggerType,
        cron_expression: editingTask.cronExpression,
        active: editingTask.active,
        webhook_url: editingTask.webhookUrl,
        webhook_body: editingTask.webhookBody
      }

      const response = await api.task.updateTask(token, editingTask.id, taskData)
      if (response.data?.task) {
        // 转换后端数据格式为前端格式
        const updatedTask: Task = {
          id: response.data.task.id,
          name: response.data.task.name,
          description: response.data.task.description,
          type: response.data.task.type,
          triggerType: response.data.task.trigger_type as 'manual' | 'scheduled',
          cronExpression: response.data.task.cron_expression,
          active: response.data.task.active,
          webhookUrl: response.data.task.webhook_url,
          webhookBody: response.data.task.webhook_body
        }

        setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task))
        setIsEditingTask(false)
        setEditingTask(null)
        showSuccess('更新成功', '任务更新成功')
      }
    } catch (error) {
      console.error('更新任务失败:', error)
      showError('更新失败', '更新任务失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  const handleCancelEdit = () => {
    setIsEditingTask(false)
    setEditingTask(null)
  }

  const handleDeleteTask = async (taskId: number) => {
    // 使用更优雅的确认方式替代confirm
    if (!window.confirm('确定要删除这个任务吗？')) {
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到认证令牌')
      }
      
      const response = await api.task.deleteTask(token, taskId)
      if (!response.error) {
        setTasks(tasks.filter(task => task.id !== taskId))
        showSuccess('删除成功', '任务删除成功')
      }
    } catch (error) {
      console.error('删除任务失败:', error)
      showError('删除失败', '删除任务失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  const handleExecuteTask = async (taskId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到认证令牌')
      }
      
      const response = await api.task.executeTask(token, taskId)
      if (!response.error) {
        const statusCode = response.data?.status_code || 'N/A'
        const responseBody = response.data?.response_body || '无响应内容'
        showSuccess('执行成功', `任务执行成功:\n状态码: ${statusCode}\n响应内容: ${JSON.stringify(responseBody, null, 2)}`)
      } else {
        showError('执行失败', `任务执行失败: ${response.error}`)
      }
    } catch (error) {
      console.error('执行任务失败:', error)
      showError('执行失败', '执行任务失败: ' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const sidebarNavItems = [
    {
      title: "首页",
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "节点",
      href: "/nodes",
      icon: <Package2 className="h-4 w-4" />,
    },
    {
      title: "订阅",
      href: "/subscribe",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      title: "工单",
      href: "/tickets",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "邀请",
      href: "/invites",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "订单",
      href: "/orders",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      title: "积分记录",
      href: "/points-history",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      title: "n8n任务",
      href: "/n8n",
      icon: <Play className="h-4 w-4" />,
    },
    {
      title: "文档",
      href: "/docs",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      title: "个人资料",
      href: "/profile",
      icon: <Settings className="h-4 w-4" />,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="w-full bg-white shadow fixed top-0 left-0 right-0 z-40">
        <div className="w-full max-w-[1920px] mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SaaS管理平台</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </div>
      </header>
      <div className="flex pt-[73px]">
        <aside className="hidden lg:block fixed z-30 inset-y-0 left-0 top-[73px] w-64 bg-white border-r px-4 py-6">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1 lg:pl-64">
          <div className="w-full max-w-[1920px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">n8n任务管理</h2>
                <Button onClick={handleAddTask}>添加任务</Button>
              </div>

              {isAddingTask && (
                <Card>
                  <CardHeader>
                    <CardTitle>添加新任务</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">任务名称</Label>
                      <Input
                        id="name"
                        value={newTask.name}
                        onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                        placeholder="请输入任务名称"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">任务描述</Label>
                      <Input
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        placeholder="请输入任务描述"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">任务类型</Label>
                      <select
                        id="type"
                        value={newTask.type}
                        onChange={(e) => setNewTask({...newTask, type: e.target.value as '默认任务' | '消息任务'})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="默认任务">默认任务</option>
                        <option value="消息任务">消息任务</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        checked={newTask.active}
                        onChange={(e) => setNewTask({...newTask, active: e.target.checked})}
                        className="mr-2"
                      />
                      <Label htmlFor="active">激活任务</Label>
                    </div>

                    {newTask.type === '默认任务' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="webhookUrl">Webhook URL</Label>
                          <Input
                            id="webhookUrl"
                            value={newTask.webhookUrl}
                            onChange={(e) => setNewTask({...newTask, webhookUrl: e.target.value})}
                            placeholder="请输入webhook URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="webhookBody">Body (JSON格式)</Label>
                          <textarea
                            id="webhookBody"
                            value={newTask.webhookBody}
                            onChange={(e) => setNewTask({...newTask, webhookBody: e.target.value})}
                            className="w-full h-32 p-2 border border-gray-300 rounded-md"
                            placeholder='请输入JSON格式的body内容，例如：{"key": "value"}'
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleTestWebhook(0)}
                            disabled={!newTask.webhookUrl}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            测试Webhook
                          </Button>
                        </div>

                      </>
                    )}

                    {newTask.type === '消息任务' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="messageWebhookUrl">Webhook URL</Label>
                          <Input
                            id="messageWebhookUrl"
                            value={newTask.webhookUrl}
                            onChange={(e) => setNewTask({...newTask, webhookUrl: e.target.value})}
                            placeholder="请输入webhook URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="messageBody">消息内容</Label>
                          <textarea
                            id="messageBody"
                            value={newTask.webhookBody}
                            onChange={(e) => setNewTask({...newTask, webhookBody: e.target.value})}
                            className="w-full h-32 p-2 border border-gray-300 rounded-md"
                            placeholder="请输入要发送的消息内容"
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          消息任务将发送以下格式的JSON到指定URL: {"{"}"data": {"{"}"send_message": "消息内容"{"}"}{"}"}
                        </p>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label>触发方式</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="triggerType"
                            checked={newTask.triggerType === 'manual'}
                            onChange={() => setNewTask({...newTask, triggerType: 'manual'})}
                            className="mr-2"
                          />
                          手动触发
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="triggerType"
                            checked={newTask.triggerType === 'scheduled'}
                            onChange={() => setNewTask({...newTask, triggerType: 'scheduled'})}
                            className="mr-2"
                          />
                          定时触发
                        </label>
                      </div>
                    </div>
                    
                    {newTask.triggerType === 'scheduled' && (
                      <div className="space-y-2">
                        <Label htmlFor="cronExpression">Cron表达式</Label>
                        <Input
                          id="cronExpression"
                          value={newTask.cronExpression}
                          onChange={(e) => setNewTask({...newTask, cronExpression: e.target.value})}
                          placeholder="请输入cron表达式，例如：0 * * * *"
                        />
                        <p className="text-sm text-gray-500">支持的格式：0 * * * *（每小时）、0 0 * * *（每天）等</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={handleSaveTask}>保存</Button>
                      <Button variant="outline" onClick={handleCancelAdd}>取消</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isEditingTask && editingTask && (
                <Card>
                  <CardHeader>
                    <CardTitle>编辑任务</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">任务名称</Label>
                      <Input
                        id="edit-name"
                        value={editingTask.name}
                        onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                        placeholder="请输入任务名称"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">任务描述</Label>
                      <Input
                        id="edit-description"
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        placeholder="请输入任务描述"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-type">任务类型</Label>
                      <select
                        id="edit-type"
                        value={editingTask.type}
                        onChange={(e) => setEditingTask({...editingTask, type: e.target.value as '默认任务' | '消息任务'})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="默认任务">默认任务</option>
                        <option value="消息任务">消息任务</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="edit-active"
                        checked={editingTask.active}
                        onChange={(e) => setEditingTask({...editingTask, active: e.target.checked})}
                        className="mr-2"
                      />
                      <Label htmlFor="edit-active">激活任务</Label>
                    </div>

                    {editingTask.type === '默认任务' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="edit-webhookUrl">Webhook URL</Label>
                          <Input
                            id="edit-webhookUrl"
                            value={editingTask.webhookUrl}
                            onChange={(e) => setEditingTask({...editingTask, webhookUrl: e.target.value})}
                            placeholder="请输入webhook URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-webhookBody">Body (JSON格式)</Label>
                          <textarea
                            id="edit-webhookBody"
                            value={editingTask.webhookBody}
                            onChange={(e) => setEditingTask({...editingTask, webhookBody: e.target.value})}
                            className="w-full h-32 p-2 border border-gray-300 rounded-md"
                            placeholder='请输入JSON格式的body内容，例如：{"key": "value"}'
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleTestWebhook(0)}
                            disabled={!editingTask?.webhookUrl}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            测试Webhook
                          </Button>
                        </div>
                      </>
                    )}

                    {editingTask.type === '消息任务' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="edit-messageWebhookUrl">Webhook URL</Label>
                          <Input
                            id="edit-messageWebhookUrl"
                            value={editingTask.webhookUrl}
                            onChange={(e) => setEditingTask({...editingTask, webhookUrl: e.target.value})}
                            placeholder="请输入webhook URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-messageBody">消息内容</Label>
                          <textarea
                            id="edit-messageBody"
                            value={editingTask.webhookBody}
                            onChange={(e) => setEditingTask({...editingTask, webhookBody: e.target.value})}
                            className="w-full h-32 p-2 border border-gray-300 rounded-md"
                            placeholder="请输入要发送的消息内容"
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          消息任务将发送以下格式的JSON到指定URL: {"{"}"data": {"{"}"send_message": "消息内容"{"}"}{"}"}
                        </p>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label>触发方式</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="edit-triggerType"
                            checked={editingTask.triggerType === 'manual'}
                            onChange={() => setEditingTask({...editingTask, triggerType: 'manual'})}
                            className="mr-2"
                          />
                          手动触发
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="edit-triggerType"
                            checked={editingTask.triggerType === 'scheduled'}
                            onChange={() => setEditingTask({...editingTask, triggerType: 'scheduled'})}
                            className="mr-2"
                          />
                          定时触发
                        </label>
                      </div>
                    </div>
                    
                    {editingTask.triggerType === 'scheduled' && (
                      <div className="space-y-2">
                        <Label htmlFor="edit-cronExpression">Cron表达式</Label>
                        <Input
                          id="edit-cronExpression"
                          value={editingTask.cronExpression}
                          onChange={(e) => setEditingTask({...editingTask, cronExpression: e.target.value})}
                          placeholder="请输入cron表达式，例如：0 * * * *"
                        />
                        <p className="text-sm text-gray-500">支持的格式：0 * * * *（每小时）、0 0 * * *（每天）等</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={handleUpdateTask}>更新</Button>
                      <Button variant="outline" onClick={handleCancelEdit}>取消</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>任务列表</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      暂无任务
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm text-gray-500">{task.description}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              类型: {task.type} | 触发方式: {task.triggerType === 'manual' ? '手动触发' : '定时触发'}
                              {task.triggerType === 'scheduled' && task.cronExpression && (
                                <span> | Cron: {task.cronExpression}</span>
                              )}
                              <span> | 状态: {task.active ? '激活' : '未激活'}</span>
                            </div>

                          </div>
                          <div className="flex gap-2">
                            <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExecuteTask(task.id)}
                            >
                            手动执行
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditTask(task)}
                            >
                              编辑
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              删除
                            </Button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}