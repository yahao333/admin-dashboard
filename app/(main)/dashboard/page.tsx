"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getMe, getDashboard } from "@/lib/api";

type Me = { email: string; language?: string };
type DashboardData = {
  announce: { title: string; content: string; date: string; image?: string };
  plan: { name: string; created_at: string; days_remaining: number; note?: string };
  usage: { used_gb: number; total_gb: number; percent: number };
  quick: { title: string; description: string }[];
};

export default function DashboardPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [m, d] = await Promise.all([getMe(), getDashboard()]);
        if (!alive) return;
        setMe(m);
        setData(d);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "加载失败");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AuthGuard>
      <div className="space-y-6">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">仪表盘</h2>
            <div className="text-sm text-gray-300">
              <span className="mr-4">{me?.language ?? "简体中文"}</span>
              <span>{me?.email ?? "已登录"}</span>
            </div>
          </header>

          {/* 公告横幅 */}
          {data?.announce && (
            <div className="overflow-hidden rounded-lg border border-[var(--vpn-border)]">
              {data.announce.image ? (
                <div
                  className="h-40 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${data.announce.image})` }}
                />
              ) : (
                <div className="h-32 w-full bg-gradient-to-r from-[var(--vpn-gradient-from)] to-[var(--vpn-gradient-to)]" />
              )}
              <div className="p-4">
                <span className="inline-block rounded bg-red-500 px-2 py-0.5 text-xs text-white">公告</span>
                <p className="mt-2 text-sm text-gray-300">{data.announce.content}</p>
                <p className="mt-1 text-xs text-gray-500">{data.announce.date}</p>
              </div>
            </div>
          )}

          {/* 套餐信息卡片 */}
          {data?.plan && (
            <div className="rounded-lg border border-[var(--vpn-border)] bg-[var(--vpn-card)] p-4">
              <h3 className="text-base font-semibold">{data.plan.name}</h3>
              <p className="mt-1 text-xs text-gray-400">
                创建时间：{data.plan.created_at}，{data.plan.note ?? ""}
              </p>
              {/* 使用情况 */}
              {data?.usage && (
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                    <span>使用情况</span>
                    <span>{data.usage.percent.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 w-full rounded bg-[var(--vpn-muted-bg)]">
                    <div
                      className="h-2 rounded bg-[var(--vpn-primary)]"
                      style={{ width: `${Math.min(100, Math.max(0, data.usage.percent))}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    已用 {data.usage.used_gb.toFixed(4)}G / 总 {data.usage.total_gb.toFixed(3)}G
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 速报折叠 */}
          {data?.quick && (
            <div className="space-y-2">
              {data.quick.map((q) => (
                <details key={q.title} className="rounded-lg border border-[var(--vpn-border)] bg-[var(--vpn-card)] p-3">
                  <summary className="cursor-pointer text-sm font-medium text-[var(--vpn-fg)]">{q.title}</summary>
                  <p className="mt-2 text-xs text-[var(--vpn-muted)]">{q.description}</p>
                </details>
              ))}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">加载失败：{error}</p>
          )}
      </div>
    </AuthGuard>
  );
}