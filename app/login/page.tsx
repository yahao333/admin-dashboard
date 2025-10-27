"use client";

import { FormEvent, useState } from "react";
import { login } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      } else {
        setError("登录失败，未返回令牌");
      }
    } catch (err: any) {
      setError(err?.message ?? "登录失败");
    }
  }

  return (
    <section>
      <h2>登录</h2>
      <form onSubmit={onSubmit} className="form">
        <label className="form-row">
          <span>邮箱</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="form-row">
          <span>密码</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="btn" type="submit">登录</button>
      </form>
      {process.env.NODE_ENV !== "production" && (
        <p>
          <button
            className="btn"
            onClick={() => {
              saveToken("dev-token");
              setOk(true);
            }}
            style={{ marginTop: 12 }}
          >
            本地调试：使用假令牌登录
          </button>
        </p>
      )}
      {error && <p className="error">{error}</p>}
      {ok && <p className="success">登录成功</p>}
    </section>
  );
}