import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { Moon, Sun } from 'lucide-react';

const Headers = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { profileData } = useUserProfile();

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

  const getUserInitial = () => {
    if (!profileData || !profileData.name) {
      return '👤';
    }
    return profileData.name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  // Platform data with connection status
  const platforms = [
    { 
      id: 'leetcode', 
      name: 'LeetCode', 
      connected: !!profileData?.leetcode_username,
      colorConnected: 'bg-green-400',
      colorDisconnected: 'bg-red-400'
    },
    { 
      id: 'codeforces', 
      name: 'Codeforces', 
      connected: !!profileData?.codeforces_username,
      colorConnected: 'bg-green-400',
      colorDisconnected: 'bg-red-400'
    },
    { 
      id: 'codechef', 
      name: 'CodeChef', 
      connected: !!profileData?.codechef_username,
      colorConnected: 'bg-green-400',
      colorDisconnected: 'bg-red-400'
    }
  ];

  return (
    <header className={`fixed top-0 w-full z-20 transition-all duration-300 ${
      scrolled 
        ? "bg-[#fdfcfa] dark:bg-gray-900 shadow-md" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and Title - Now with CFolio branding */}
        <Link to="/dashboard" className="flex items-center space-x-3">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-red-500">CFolio</h1>
          </motion.div>
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-8 relative z-50">
          <Link
            to="/dashboard"
            className={`relative group font-medium transition-all duration-300 ${
              isActive('/dashboard') 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            Dashboard
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:w-full ${
              isActive('/dashboard') ? 'w-full' : ''
            }`}></span>
          </Link>

          {/* Coding Profiles Dropdown */}
          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={() => {
              setIsDropdownOpen(true);
              setIsHoveringDropdown(true);
            }}
            onMouseLeave={() => {
              setIsHoveringDropdown(false);
              setTimeout(() => {
                if (!isHoveringDropdown) setIsDropdownOpen(false);
              }, 300);
            }}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`relative group font-medium transition-all duration-300 flex items-center space-x-1 ${
                isActive('/leetcode') || isActive('/codeforces') || isActive('/codechef') 
                  ? 'text-red-500 dark:text-red-400' 
                  : 'text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <span>Coding Profiles</span>
              <motion.span
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs"
              >
                ▼
              </motion.span>
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:w-full ${
                isActive('/leetcode') || isActive('/codeforces') || isActive('/codechef') ? 'w-full' : ''
              }`}></span>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 mt-3 w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  onMouseEnter={() => setIsHoveringDropdown(true)}
                  onMouseLeave={() => {
                    setIsHoveringDropdown(false);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="p-1">
                    <div className="px-4 py-2 text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">
                      Connected Platforms
                    </div>
                    
                    {platforms.map(platform => (
                      <Link
                        key={platform.id}
                        to={`/${platform.id}`}
                        className={`flex items-center px-4 py-3 text-sm transition-all duration-200 ${
                          platform.connected 
                            ? 'hover:bg-gray-100 dark:hover:bg-gray-700' 
                            : 'opacity-80 hover:opacity-100 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          platform.connected ? platform.colorConnected : platform.colorDisconnected
                        } mr-3`}></div>
                        <span className="flex-1">{platform.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {platform.connected ? 'Connected' : 'Not Connected'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/contest"
            className={`relative group font-medium transition-all duration-300 ${
              isActive('/contest') 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            Contests
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:w-full ${
              isActive('/contest') ? 'w-full' : ''
            }`}></span>
          </Link>
        </nav>

        {/* Right Icons */}
        <motion.div
          className="flex items-center space-x-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          <motion.button
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </motion.button>

          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/profile" 
              className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center shadow-lg text-white font-medium"
            >
              {getUserInitial()}
            </Link>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Headers;