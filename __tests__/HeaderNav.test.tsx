import { render, screen, fireEvent } from '@testing-library/react'
import HeaderNav from '@/components/HeaderNav'

// 简单的 localStorage mock，配合 auth.ts 的 getToken/clearToken
const storage: Record<string, string> = {}
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (k: string) => storage[k] ?? null,
    setItem: (k: string, v: string) => { storage[k] = v },
    removeItem: (k: string) => { delete storage[k] },
    clear: () => { for (const k in storage) delete storage[k] },
    key: (i: number) => Object.keys(storage)[i] ?? null,
    length: 0,
  },
})

describe('HeaderNav', () => {
  it('shows login/register when not authenticated', () => {
    window.localStorage.clear()
    render(<HeaderNav />)
    expect(screen.getByText('登录')).toBeInTheDocument()
    expect(screen.getByText('注册')).toBeInTheDocument()
  })

  it('shows dashboard and logout when authenticated', async () => {
    window.localStorage.setItem('jwt', 'dev-token')
    render(<HeaderNav />)
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
    const logoutBtn = await screen.findByRole('button', { name: '登出' })
    expect(logoutBtn).toBeInTheDocument()
    fireEvent.click(logoutBtn)
  })
})