import { render, screen } from '@testing-library/react'
import AuthGuard from '@/components/AuthGuard'

// mock router.replace 捕获重定向
const replaceMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}))

// mock getToken 控制鉴权
const getTokenMock = jest.fn()
jest.mock('@/lib/auth', () => ({
  getToken: () => getTokenMock(),
}))

describe('AuthGuard', () => {
  beforeEach(() => {
    replaceMock.mockReset()
    getTokenMock.mockReset()
  })

  it('redirects to /login when not authenticated', () => {
    getTokenMock.mockReturnValue(null)

    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    )

    // 未登录不应显示子元素
    expect(screen.queryByText('Protected')).toBeNull()
    // 触发重定向到登录页
    expect(replaceMock).toHaveBeenCalled()
    const url = replaceMock.mock.calls[0][0] as string
    expect(url.startsWith('/login?next=%2F')).toBe(true)
  })

  it('renders children when authenticated', () => {
    getTokenMock.mockReturnValue('dev-token')
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    )
    expect(screen.getByText('Protected')).toBeInTheDocument()
  })
})