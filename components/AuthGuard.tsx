"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      const next = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?next=${next}`;
      return;
    }
    setAuthed(true);
    setReady(true);
  }, []);

  if (!ready) return <p className="muted">正在检查登录状态…</p>;
  if (!authed) return null;
  return <>{children}</>;
}