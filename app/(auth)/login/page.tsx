"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useGlobal";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notify = useNotifications();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    try {
      const res = await login({ email, password });
      if (res?.token) {
        saveToken(res.token);
        setOk(true);
        notify.success("登录成功");
        const next = searchParams.get("next") || "/dashboard";
        router.replace(next);
      } else {
        setError("登录失败，未返回令牌");
        notify.error("登录失败，未返回令牌");
      }
    } catch (err: any) {
      setError(err?.message ?? "登录失败");
      notify.error(err?.message ?? "登录失败");
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-lg shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">逅猫</CardTitle>
          <CardDescription className="text-zinc-500">给您稳定优质的服务体验</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-1">
              <label htmlFor="email" className="sr-only">邮箱</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="邮箱"
                  className="w-full rounded-md border border-zinc-300 bg-white pl-10 pr-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {/* email icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="grid gap-1">
              <label htmlFor="password" className="sr-only">密码</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="密码"
                  className="w-full rounded-md border border-zinc-300 bg-white pl-10 pr-10 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {/* lock icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <button
                  type="button"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {/* eye icon */}
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.77-1.79 2-3.35 3.5-4.64M9.9 4.24A10.93 10.93 0 0 1 12 4c5 0 9.27 3.89 11 8-1.02 2.37-2.64 4.39-4.62 5.76M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <path d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="mt-2 h-10">登录</Button>
          </form>
          {/* 移除本地假令牌按钮，统一走真实后端登录 */}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {ok && <p className="text-sm text-green-500">登录成功</p>}
          <div className="text-xs text-zinc-500">
            <a className="text-blue-600 hover:underline" href="/register">注册</a>
            <span className="mx-2">|</span>
            <a className="text-blue-600 hover:underline" href="#">忘记密码</a>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}