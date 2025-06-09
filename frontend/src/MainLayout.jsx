
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#fdfcfa] text-gray-800 font-sans dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="pt-24">{children}</div>
    </div>
  );
}
