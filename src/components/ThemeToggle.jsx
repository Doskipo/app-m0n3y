import useDarkMode from "../hooks/useDarkMode";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="text-xl px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
