"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getMe } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Me = { email: string; language?: string };

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const m = await getMe();
        if (!alive) return;
        setMe(m);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "加载失败");
      }
    })();
    return () => { alive = false };
  }, []);

  return (
    <AuthGuard>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">个人中心</h2>
          {me && (
            <div className="text-sm text-zinc-500">
              <span className="mr-4">{me.language ?? "简体中文"}</span>
              <span>{me.email}</span>
            </div>
          )}
        </header>

        <Card className="rounded-lg border border-zinc-200">
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
            <CardDescription className="text-zinc-600">查看你的登录邮箱与偏好语言</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs text-zinc-500">登录邮箱</div>
                <div className="text-sm font-medium text-zinc-900">{me?.email ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">偏好语言</div>
                <div className="text-sm font-medium text-zinc-900">{me?.language ?? "简体中文"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-zinc-200">
          <CardHeader>
            <CardTitle>安全设置</CardTitle>
            <CardDescription className="text-zinc-600">修改登录密码以保护账户安全</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href={`/change-password?email=${encodeURIComponent(me?.email ?? "")}`}>修改密码</a>
            </Button>
            <p className="mt-2 text-xs text-zinc-500">建议使用至少8位，包含字母和数字的强密码。</p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}