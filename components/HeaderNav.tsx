"use client";

import { useEffect, useState } from "react";
import { getToken, clearToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function HeaderNav() {
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    setAuthed(Boolean(getToken()));
  }, []);

  function onLogout() {
    clearToken();
    setAuthed(false);
    window.location.href = "/";
  }

  return (
    <nav className="nav-actions">
      {authed ? (
        <>
          <a className="text-[var(--vpn-fg)] hover:text-[var(--vpn-primary)]" href="/profile">个人中心</a>
          <a className="text-[var(--vpn-fg)] hover:text-[var(--vpn-primary)]" href="/dashboard">Dashboard</a>
          <Button variant="secondary" onClick={onLogout}>登出</Button>
        </>
      ) : (
        <>
          <a className="text-[var(--vpn-fg)] hover:text-[var(--vpn-primary)]" href="/login">登录</a>
          <a className="text-[var(--vpn-fg)] hover:text-[var(--vpn-primary)]" href="/register">注册</a>
        </>
      )}
    </nav>
  );
}