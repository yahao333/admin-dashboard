"use client";

import AuthGuard from "../../components/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <section>
        <h2>受保护的页面：Dashboard</h2>
        <p className="muted">你已登录，可以访问此内容。</p>
      </section>
    </AuthGuard>
  );
}