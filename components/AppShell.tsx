"use client";

import HeaderNav from "@/components/HeaderNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b1220] text-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-[#0b1220]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">猫</span>
            <h1 className="text-lg font-semibold">逗猫 · 控制台</h1>
          </div>
          <HeaderNav />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[240px_1fr] gap-6 px-4 py-6">
        <aside className="rounded-lg border border-gray-700 bg-[#0b1220] p-3 text-sm text-gray-200">
          <nav className="space-y-2">
            {[
              { label: "仪表盘", href: "/dashboard" },
              { label: "供电账单", href: "#" },
              { label: "购买订阅", href: "#" },
              { label: "订单状态", href: "#" },
              { label: "我的订单", href: "#" },
              { label: "我的评价", href: "#" },
              { label: "提取订单", href: "#" },
              { label: "个人中心", href: "#" },
            ].map((item) => (
              <a
                key={item.label}
                className="block rounded-md px-3 py-2 hover:bg-[#111827]"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-400">
        <small>© {new Date().getFullYear()} yanghao0075</small>
      </footer>
    </div>
  );
}