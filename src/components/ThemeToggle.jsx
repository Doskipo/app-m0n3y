import useDarkMode from "../hooks/useDarkMode";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useDarkMode();

  const iconSrc = darkMode
    ? "/sol_blanc.png"   // blanc per dark mode
    : "/lluna_blava.png"; // blau per light mode

  const iconAlt = darkMode ? "Sol" : "Lluna";

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Canvia el tema"
    >
      <img src={iconSrc} alt={iconAlt} className="h-8 w-8" />
    </button>
  );
}
