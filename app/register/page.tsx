"use client";

import { FormEvent, useState } from "react";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    try {
      const res = await register({ email, password });
      if (res?.success) {
        setOk(true);
      } else {
        setError("注册失败");
      }
    } catch (err: any) {
      setError(err?.message ?? "注册失败");
    }
  }

  return (
    <section>
      <h2>注册</h2>
      <form onSubmit={onSubmit} className="form">
        <label className="form-row">
          <span>邮箱</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="form-row">
          <span>密码</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="btn" type="submit">注册</button>
      </form>
      {error && <p className="error">{error}</p>}
      {ok && <p className="success">注册成功</p>}
    </section>
  );
}