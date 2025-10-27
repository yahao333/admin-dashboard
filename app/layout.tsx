export const metadata = {
  title: "My Projects",
  description: "Personal project showcase and auth",
};

import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="theme-vpn">{children}</body>
    </html>
  );
}