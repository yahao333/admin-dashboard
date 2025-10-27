import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { jest, describe, it, expect, beforeEach } from '@jest/globals'
// 避免在测试中触发真实的 AuthGuard 逻辑（使用别名路径与页面导入保持一致）
jest.mock('@/components/AuthGuard', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}))

// 注意：避免在定义 mocks 前加载页面，使用动态导入

// 保证通过 AuthGuard
jest.mock('@/lib/auth', () => ({
  getToken: () => 'dev-token',
}))

// mock next/navigation 以避免在测试环境调用真实 router
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}))
// 某些 Next/Jest 版本会解析到源码路径，补充一层别名 mock
// 保留对 next/navigation 的基础 mock 即可

// mock API 数据
type Me = { email: string; language?: string }
type DashboardData = {
  announce: { title: string; content: string; date: string }
  plan: { name: string; created_at: string; days_remaining: number }
  usage: { used_gb: number; total_gb: number; percent: number }
  quick: { title: string; description: string }[]
}
const getMeMock = jest.fn<Promise<Me>, []>()
const getDashboardMock = jest.fn<Promise<DashboardData>, []>()
jest.mock('@/lib/api', () => ({
  getMe: () => getMeMock(),
  getDashboard: () => getDashboardMock(),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    getMeMock.mockResolvedValue({ email: 'yanghao0075@outlook.com', language: '简体中文' })
    getDashboardMock.mockResolvedValue({
      announce: { title: '公告', content: '关于产品价格……', date: '2025-07-08' },
      plan: { name: '中转套餐-50G-新增', created_at: '2025-11-08 13:48:06', days_remaining: 12 },
      usage: { used_gb: 25.4908, total_gb: 50, percent: 50.98 },
      quick: [
        { title: '套餐解读', description: '新套餐使用说明与限制' },
        { title: '续订须知', description: '续订流程和注意事项' },
      ],
    })
  })

  it('renders dashboard sections with fetched data', async () => {
    const { default: DashboardPage } = await import('../app/(main)/dashboard/page')
    render(<DashboardPage />)

    // 顶部信息与主要内容
    expect(await screen.findByText('简体中文')).toBeInTheDocument()
    expect(await screen.findByText('yanghao0075@outlook.com')).toBeInTheDocument()
    expect(await screen.findByText('中转套餐-50G-新增')).toBeInTheDocument()
    expect(await screen.findByText('套餐解读')).toBeInTheDocument()
  })
})