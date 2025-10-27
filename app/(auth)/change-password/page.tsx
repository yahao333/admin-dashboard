"use client";

import { FormEvent, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { changePassword } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useGlobal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notify = useNotifications();
  const email = decodeURIComponent(searchParams.get("email") || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const isStrongPassword = useMemo(() => {
    const pwd = newPassword;
    if (!pwd) return false;
    const hasMinLen = pwd.length >= 8;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    return hasMinLen && hasLetter && hasNumber;
  }, [newPassword]);

  const canSubmit = !!email && oldPassword.length > 0 && isStrongPassword && newPassword === confirm;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    if (!isStrongPassword) {
      const msg = "新密码过弱：至少8位，需包含字母和数字";
      setError(msg);
      notify.error(msg);
      return;
    }
    if (newPassword !== confirm) {
      const msg = "两次输入的新密码不一致";
      setError(msg);
      notify.error(msg);
      return;
    }
    try {
      const res = await changePassword({ email, old_password: oldPassword, new_password: newPassword });
      if (res?.ok) {
        setOk(true);
        notify.success("密码修改成功，请妥善保管");
        router.replace("/dashboard");
      } else {
        setError("修改失败");
        notify.error("修改失败");
      }
    } catch (err: any) {
      let msg = err?.message ?? "修改失败";
      try {
        const obj = JSON.parse(msg);
        if (obj?.error) msg = obj.error;
      } catch {}
      if (msg === "invalid_credentials") msg = "原密码错误";
      if (msg === "weak_password") msg = "新密码过弱";
      if (msg === "same_as_default_password") msg = "新密码不能与默认密码相同";
      setError(msg);
      notify.error(msg);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-lg shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">修改密码</CardTitle>
          <CardDescription className="text-zinc-500">默认帐号首次登录需完成密码修改</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="email" className="sr-only">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className="bg-zinc-100"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="old" className="sr-only">原密码</Label>
              <div className="relative">
                <Input
                  id="old"
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  placeholder="原密码"
                  className="pl-3 pr-10 py-2"
                />
                <button type="button" aria-label={showOld ? "隐藏" : "显示"} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700" onClick={() => setShowOld(v => !v)}>
                  {showOld ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="new" className="sr-only">新密码</Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="新密码（至少8位，需包含字母和数字）"
                  className="pl-3 pr-10 py-2"
                />
                <button type="button" aria-label={showNew ? "隐藏" : "显示"} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700" onClick={() => setShowNew(v => !v)}>
                  {showNew ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-1">建议加入大小写与符号提升强度。</p>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="confirm" className="sr-only">确认新密码</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="确认新密码"
                className="pl-3 pr-3 py-2"
              />
            </div>
            <Button type="submit" disabled={!canSubmit} className={`mt-2 h-10 ${!canSubmit ? "bg-zinc-300 text-zinc-500 hover:bg-zinc-300 cursor-not-allowed" : ""}`}>确认修改</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {ok && <p className="text-sm text-green-500">修改成功</p>}
        </CardFooter>
      </Card>
    </section>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">加载中...</div>}>
      <ChangePasswordForm />
    </Suspense>
  );
}