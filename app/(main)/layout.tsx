import HeaderNav from "@/components/HeaderNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <h1 className="site-title">个人项目</h1>
          <HeaderNav />
        </div>
      </header>
      <main className="container">{children}</main>
      <footer className="site-footer container">
        <small>© {new Date().getFullYear()} yanghao0075</small>
      </footer>
    </>
  );
}