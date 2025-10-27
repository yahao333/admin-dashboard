import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals'

// 为确保 BASE 使用最新的环境变量，需要在导入前设置
beforeAll(() => {
  process.env.NEXT_PUBLIC_API_BASE = 'http://localhost:38080'
  jest.resetModules()
})

describe('Auth Integration (FE -> BE)', () => {
  it('register → saveToken → getMe returns user info', async () => {
    const { register, getMe } = await import('@/lib/api')
    const { saveToken, clearToken } = await import('@/lib/auth')

    // 使用随机邮箱，避免重复
    const email = `test_${Date.now()}@example.com`
    const password = 'secret'

    const reg = await register({ email, password })
    expect(reg?.token).toBeTruthy()
    saveToken(reg.token)

    const me = await getMe()
    expect(me?.email).toBeTruthy()

    // 清理令牌
    clearToken()
  })

  it('getMe without token should fail with unauthorized', async () => {
    const { getMe } = await import('@/lib/api')
    const { clearToken } = await import('@/lib/auth')
    clearToken()

    await expect(getMe()).rejects.toBeTruthy()
  })
})