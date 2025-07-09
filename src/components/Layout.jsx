import { Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
      <header className="relative flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
        {/* Logo de text "necse" a l'esquerra */}
        <div className="flex items-center gap-4">
          <img
            src="/necse/Logo_Necse_WhiteTheme_1024x1024.png"
            alt="Logo text Necse"
            className="h-16 block dark:hidden"
          />
          <img
            src="/necse/Logo_Necse_BlackTheme_1024x1024.png"
            alt="Logo text Necse"
            className="h-16 hidden dark:block"
          />
        </div>

        {/* Icona al centre */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src="/necse/Icon_Necse_WhiteTheme_512x512.png"
            alt="Icona Necse"
            className="h-10 block dark:hidden"
          />
          <img
            src="/necse/Icon_Necse_BlackTheme_512x512.png"
            alt="Icona Necse"
            className="h-10 hidden dark:block"
          />
        </div>

        {/* Botó de tema a la dreta */}
        <ThemeToggle />
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
