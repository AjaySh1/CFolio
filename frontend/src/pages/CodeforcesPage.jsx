import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../components/codeforces/ProfileCard';
import RatingChart from '../components/codeforces/RatingChart';
import RecentContests from '../components/codeforces/RecentContests';
import CalendarHeatmap from '../components/codeforces/CalendarHeatmap';
import Header from '../components/Header';
import { useUserProfile } from '../context/UserProfileContext';

// Color schemes for both modes
const colorSchemes = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-gray-200',
    text: 'text-black',
    accent: 'text-blue-700',
    border: 'border-gray-300'
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    accent: 'text-blue-400',
    border: 'border-gray-700'
  }
};

const CodeforcesPage = () => {
  const { profileData, loading: profileLoading, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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

  // Get username from profile data
  useEffect(() => {
    if (profileData?.codeforces_username) {
      setUsername(profileData.codeforces_username);
    }
  }, [profileData]);

  // Fetch Codeforces data when username changes
  useEffect(() => {
    if (!username) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setFetchError('');
        const response = await fetch(`${API_BASE}/api/codeforces/profile/${username}?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data received from API');
        }
        setUserData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setFetchError(err.message || 'Failed to load profile data');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
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
      <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <motion.div
          layout
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {username ? (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : fetchError ? (
                <motion.div
                  className={`${scheme.card} ${scheme.text} ${scheme.border} border rounded-xl p-6 mb-6`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className={`text-xl font-bold mb-2 ${scheme.accent}`}>Error Loading Codeforces Data</h2>
                  <p className="text-red-500">{fetchError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition text-white"
                  >
                    Retry
                  </button>
                </motion.div>
              ) : userData ? (
                <>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <ProfileCard user={userData} />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`${scheme.card} rounded-xl shadow-lg ${scheme.text} ${scheme.border} border p-6`}
                  >
                    <h2 className={`text-xl font-bold mb-4 ${scheme.accent}`}>Performance Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg`}>
                        <h3 className={`${isDark ? 'text-blue-300' : 'text-blue-700'} text-sm`}>Current Rating</h3>
                        <p className="text-2xl font-bold">{userData.rating || '-'}</p>
                      </div>
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg`}>
                        <h3 className={`${isDark ? 'text-blue-300' : 'text-blue-700'} text-sm`}>Max Rating</h3>
                        <p className="text-2xl font-bold">{userData.maxRating || '-'}</p>
                      </div>
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg`}>
                        <h3 className={`${isDark ? 'text-blue-300' : 'text-blue-700'} text-sm`}>Contests</h3>
                        <p className="text-2xl font-bold">{userData.contests || 0}</p>
                      </div>
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg`}>
                        <h3 className={`${isDark ? 'text-blue-300' : 'text-blue-700'} text-sm`}>Problems Solved</h3>
                        <p className="text-2xl font-bold">{userData.totalProblemsSolved || 0}</p>
                      </div>
                    </div>
                  </motion.div>

                  {userData.submissionCalendar && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <CalendarHeatmap submissionCalendar={userData.submissionCalendar} />
                    </motion.div>
                  )}

                  {userData.recentContests && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <RecentContests contests={userData.recentContests} />
                    </motion.div>
                  )}

                  {userData.ratingHistory && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <RatingChart ratingHistory={userData.ratingHistory} />
                    </motion.div>
                  )}
                </>
              ) : (
                <div className={`${scheme.card} ${scheme.text} ${scheme.border} border rounded-xl p-6 mb-6`}>
                  <h2 className={`text-xl font-bold mb-2 ${scheme.accent}`}>No Data Found</h2>
                  <p className="text-red-500">Could not retrieve Codeforces data for this username.</p>
                </div>
              )}
            </>
          ) : (
            <motion.div
              className={`${scheme.card} ${scheme.text} rounded-xl p-8 shadow-lg text-center ${scheme.border} border`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-20 h-20 mb-6 mx-auto ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded-full flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">No Codeforces Username Found</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Please add your Codeforces username to your profile to view statistics.</p>
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full max-w-xs mx-auto text-white"
                onClick={() => window.location.href = '/profile'}
              >
                Go to Profile
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CodeforcesPage;