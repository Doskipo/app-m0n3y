import ThemeToggle from "./ThemeToggle";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
      <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <img
            src="\necse\Logo_Necse_WhiteTheme_1024x1024.png"
            alt="Logo"
            className="h-8 block dark:hidden"
          />
          <img
            src="\necse\Logo_Necse_BlackTheme_1024x1024.png"
            alt="Logo"
            className="h-8 hidden dark:block"
          />
        </div>
        <ThemeToggle />
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
