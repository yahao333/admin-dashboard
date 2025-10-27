"use client";

import HeaderNav from "@/components/HeaderNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">逗猫 · 控制台</h1>
          </div>
          <HeaderNav />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[240px_1fr] gap-6 px-4 py-6">
        <aside className="rounded-lg border border-zinc-200 bg-white p-3 text-sm">
          <nav className="space-y-2">
            {[
              { label: "仪表盘", href: "/dashboard" },
              { label: "个人中心", href: "/profile" },
              ].map((item) => (
              <a
                key={item.label}
                className="block rounded-md px-3 py-2 hover:bg-zinc-100"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500">
        <small>© {new Date().getFullYear()} yanghao0075</small>
      </footer>
    </div>
  );
}