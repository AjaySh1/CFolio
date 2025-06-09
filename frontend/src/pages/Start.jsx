import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Clock,
  BarChart3,
  UserCheck,
  Github,
  Moon,
  Sun
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 }
  }
};

const item = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 }
  }
};

export default function CFolioHome() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const cards = [
    {
      icon: <UserCheck className="h-6 w-6 text-red-500" />,
      title: "Centralized Profiles",
      description:
        "View all your coding accounts on a single screen. No need to juggle tabs anymore."
    },
    {
      icon: <Clock className="h-6 w-6 text-red-500" />,
      title: "Upcoming Events",
      description:
        "See all coding contests in one timeline. Stay on track and never miss a beat."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-red-500" />,
      title: "Insightful Stats",
      description:
        "Analyze your growth, strengths, and patterns to continuously improve."
    },
    {
      icon: <Trophy className="h-6 w-6 text-red-500" />,
      title: "Track Achievements",
      description:
        "Celebrate milestones and badges earned across platforms in one place."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfcfa] text-gray-800 font-sans dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-20 px-6 py-4 transition-all duration-300 ${
          scrolled ? "bg-[#fdfcfa] dark:bg-gray-900 shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">CFolio</h1>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-red-500 font-medium hidden md:block">
              Home
            </a>
            <a href="#features" className="hover:text-red-500 font-medium hidden md:block">
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

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="text-4xl font-bold sm:text-5xl"
          >
            Organize Your <span className="text-red-500">Coding Journey</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            CFolio brings all your competitive coding profiles under one clean
            dashboard and keeps you informed, analyzed, and prepared.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <a
              href="/profile"
              className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition duration-300"
            >
              Launch Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#f7f7f5] dark:bg-gray-800 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Why CFolio?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-16">
            Built for coders who care about clarity, growth, and staying ahead in contests.
          </p>
          <motion.div
            className="grid gap-10 sm:grid-cols-2 md:grid-cols-2"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                className="p-6 bg-[#f7f7f5]
 dark:bg-gray-700 rounded-lg border border-red-200 dark:border-none shadow-sm hover:shadow-md transition-shadow duration-300 text-left"
                variants={item}
              >
                <div className="mb-4">{card.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center space-y-4">
          <a
            href="https://github.com/suveerprasad/cp-tracker"
            className="hover:text-red-400 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-6 h-6" />
          </a>
          <p className="text-sm">© 2025 CFolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
