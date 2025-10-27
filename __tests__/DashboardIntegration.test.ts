import { jest, describe, it, expect, beforeAll } from '@jest/globals'

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_BASE = 'http://localhost:38080'
  jest.resetModules()
})

describe('Dashboard Integration (FE -> BE)', () => {
  it('register → saveToken → getDashboard returns sections', async () => {
    const { register, getDashboard } = await import('@/lib/api')
    const { saveToken } = await import('@/lib/auth')

    const email = `test_${Date.now()}@example.com`
    const res = await register({ email, password: 'secret' })
    expect(res?.token).toBeTruthy()
    saveToken(res.token)

    const data = await getDashboard()
    expect(data?.announce?.title).toBeTruthy()
    expect(data?.plan?.name).toBeTruthy()
    expect(Array.isArray(data?.quick)).toBe(true)
  })
})