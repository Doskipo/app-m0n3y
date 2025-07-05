import ThemeToggle from "./ThemeToggle";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
      <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
        <h1 className="text-xl font-bold">necse</h1>
        <ThemeToggle />
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
