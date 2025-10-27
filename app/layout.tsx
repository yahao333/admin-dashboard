export const metadata = {
  title: "My Projects",
  description: "Personal project showcase and auth",
};

import "@/styles/globals.css";
import { GlobalProvider } from "@/contexts/GlobalContext";
import GlobalNotifications from "@/components/GlobalNotifications";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <GlobalProvider>
          {children}
          <GlobalNotifications />
        </GlobalProvider>
      </body>
    </html>
  );
}