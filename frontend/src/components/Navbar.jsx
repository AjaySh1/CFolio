
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar({ darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-20 px-6 py-4 transition-all duration-300 ${
        scrolled ? "bg-[#fdfcfa] dark:bg-gray-900 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-500">CFolio</h1>
        <div className="flex items-center space-x-6">
          <a href="/" className="hover:text-red-500 font-medium hidden md:block">
            Home
          </a>
          <a href="/#features" className="hover:text-red-500 font-medium hidden md:block">
            Features
          </a>
          <a href="/login" className="hover:text-red-500 font-medium hidden md:block">
            Login
          </a>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
