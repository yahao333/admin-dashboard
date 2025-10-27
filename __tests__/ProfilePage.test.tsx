import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { jest, describe, it, expect } from '@jest/globals'

// 在测试中绕过 AuthGuard 的真实重定向逻辑
jest.mock('@/components/AuthGuard', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}))

// mock API 返回的用户信息
type Me = { email: string; language?: string }
const getMeMock = jest.fn<Promise<Me>, []>()
jest.mock('@/lib/api', () => ({
  getMe: () => getMeMock(),
}))

describe('ProfilePage', () => {
  it('renders user email and language', async () => {
    getMeMock.mockResolvedValue({ email: 'yanghao0075@outlook.com', language: '简体中文' })
    const { default: ProfilePage } = await import('../app/(main)/profile/page')
    render(<ProfilePage />)

    expect(await screen.findByText('个人中心')).toBeInTheDocument()
    const langs = await screen.findAllByText('简体中文')
    expect(langs.length).toBeGreaterThan(0)
    const emails = await screen.findAllByText('yanghao0075@outlook.com')
    expect(emails.length).toBeGreaterThan(0)
  })
})