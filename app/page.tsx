import { redirect } from 'next/navigation'

export default function RootRedirect() {
  // 根路径直接跳转到管理页
  redirect('/dashboard')
}