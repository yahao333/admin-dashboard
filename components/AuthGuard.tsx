"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      const next = encodeURIComponent(window.location.pathname);
      // 使用客户端路由替换，避免全页刷新导致的 net::ERR_ABORTED 噪音
      router.replace(`/login?next=${next}`);
      return;
    }
    setAuthed(true);
    setReady(true);
  }, [router]);

  if (!ready) return <p className="muted">正在检查登录状态…</p>;
  if (!authed) return null;
  return <>{children}</>;
}