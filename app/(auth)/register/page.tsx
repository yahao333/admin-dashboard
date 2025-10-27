"use client";

import { FormEvent, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useGlobal";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notify = useNotifications();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  // 密码强度：至少8位，包含字母和数字
  const isStrongPassword = useMemo(() => {
    const pwd = password;
    if (!pwd) return false;
    const hasMinLen = pwd.length >= 8;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    return hasMinLen && hasLetter && hasNumber;
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (!password) return "";
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return "弱";
    if (score === 2) return "中";
    return "强";
  }, [password]);

  const canSubmit = email.trim().length > 0 && isStrongPassword;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    if (!isStrongPassword) {
      const msg = "密码过弱：至少8位，需包含字母和数字";
      setError(msg);
      notify.error(msg);
      return;
    }
    try {
      const res = await register({ email, password });
      if (res?.token) {
        saveToken(res.token);
        setOk(true);
        notify.success("注册成功");
        const next = searchParams.get("next") || "/dashboard";
        router.replace(next);
      } else {
        setError("注册失败，未返回令牌");
        notify.error("注册失败，未返回令牌");
      }
    } catch (err: any) {
      setError(err?.message ?? "注册失败");
      notify.error(err?.message ?? "注册失败");
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-lg shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">管理后台</CardTitle>
          <CardDescription className="text-zinc-500">欢迎加入，体验稳定优质的服务</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-1">
              <label htmlFor="reg-email" className="sr-only">邮箱</label>
              <div className="relative">
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="邮箱"
                  className="w-full rounded-md border border-zinc-300 bg-white pl-10 pr-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vpn-muted)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="grid gap-1">
              <label htmlFor="reg-password" className="sr-only">密码</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="密码"
                  className="w-full rounded-md border border-zinc-300 bg-white pl-10 pr-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
              <p className="text-xs text-zinc-500 mt-1">至少8位，需包含字母和数字。建议加入大小写与符号提升强度。</p>
              {password && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-600">密码强度：</span>
                  <span className={`text-xs font-medium ${strengthLabel === "弱" ? "text-red-600" : strengthLabel === "中" ? "text-yellow-600" : "text-green-600"}`}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <Button type="submit" disabled={!canSubmit} className={`mt-2 h-10 ${!canSubmit ? "bg-zinc-300 text-zinc-500 hover:bg-zinc-300 cursor-not-allowed" : ""}`}>注册</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {ok && <p className="text-sm text-green-500">注册成功</p>}
          <div className="text-xs text-zinc-500">
            <a className="text-blue-600 hover:underline" href="/login">已有账号？前往登录</a>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">加载中...</div>}>
      <RegisterForm />
    </Suspense>
  );
}