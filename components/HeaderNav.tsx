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
          <a className="nav-link" href="/dashboard">Dashboard</a>
          <Button variant="secondary" onClick={onLogout}>登出</Button>
        </>
      ) : (
        <>
          <a className="nav-link" href="/login">登录</a>
          <a className="nav-link" href="/register">注册</a>
        </>
      )}
    </nav>
  );
}