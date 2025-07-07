import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeChefStats from '../components/CodechefStats';
import Header from '../components/Header';
import { useUserProfile } from '../context/UserProfileContext';

// Color schemes for both modes
const colorSchemes = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-800',
    accent: 'text-yellow-600',
    border: 'border-gray-200',
    tableHead: 'bg-gray-100',
    tableText: 'text-gray-700'
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    accent: 'text-yellow-400',
    border: 'border-gray-700',
    tableHead: 'bg-gray-700',
    tableText: 'text-gray-200'
  }
};

const CodechefPage = () => {
  const { profileData, loading: profileLoading, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Detect dark mode
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const scheme = isDark ? colorSchemes.dark : colorSchemes.light;

  useEffect(() => {
    if (profileData?.codechef_username) {
      setUsername(profileData.codechef_username);
    }
  }, [profileData]);

  useEffect(() => {
    if (!username) {
      setStatsData(null);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/codechef/profile/${username}/?t=${Date.now()}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('User not found on CodeChef');
          } else if (res.status >= 500) {
            throw new Error('Server is currently busy. Please try again later.');
          } else {
            throw new Error(`Failed to fetch CodeChef stats (${res.status})`);
          }
        }
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error('No data found for this user');
        }
        setStatsData(data);
      } catch (err) {
        setError(err.message);
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchStats, 300);
    return () => clearTimeout(timer);
  }, [username, API_BASE]);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        <p>Error loading profile: {profileError}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${scheme.background} ${scheme.text} transition-colors duration-300`}>
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          className={`max-w-4xl mx-auto p-6 ${scheme.card} rounded-2xl shadow-lg border ${scheme.border} ${scheme.text}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className={`text-2xl font-bold mb-4 ${scheme.accent}`}>CodeChef Stats</h2>

          {!username ? (
            <div className="text-center p-8">
              <div className={`w-20 h-20 mb-6 mx-auto ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">No CodeChef Username Found</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Please add your CodeChef username to your profile.</p>
              <a
                href="/profile"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-block text-white"
              >
                Go to Profile
              </a>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className={`${scheme.accent} mt-4`}>Loading CodeChef stats...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <div className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'} rounded-full flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">We encountered an issue</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
              >
                Try Again
              </button>
            </div>
          ) : (
            <CodeChefStats data={statsData} />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CodechefPage;