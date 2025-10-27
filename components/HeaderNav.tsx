"use client";

import { useEffect, useState } from "react";
import { getToken, clearToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function HeaderNav() {
  const [authed, setAuthed] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setAuthed(Boolean(getToken()));
  }, []);

  function onLogout() {
    clearToken();
    setAuthed(false);
    window.location.href = "/";
  }

  const linkBase = "rounded-md px-3 py-2 text-sm text-zinc-700 hover:text-blue-600";
  const linkActive = "font-semibold text-blue-600";

  return (
    <nav className="flex items-center gap-3">
      {authed ? (
        <>
          <a
            className={`${linkBase} ${pathname === "/profile" ? linkActive : ""}`}
            href="/profile"
          >
            个人中心
          </a>
          <a
            className={`${linkBase} ${pathname === "/dashboard" ? linkActive : ""}`}
            href="/dashboard"
          >
            仪表盘
          </a>
          <Button variant="secondary" onClick={onLogout}>登出</Button>
        </>
      ) : (
        <>
          <a className={linkBase} href="/login">登录</a>
          <a className={linkBase} href="/register">注册</a>
        </>
      )}
    </nav>
  );
}