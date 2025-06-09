import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeetCodeStats from '../components/LeetCodeStats';
import Header from '../components/Header';
import { useUserProfile } from '../context/UserProfileContext';
import { useNavigate } from 'react-router-dom';

const NoUserNameFound = ({ service = "LeetCode", redirectPath = "/profile" }) => {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate(redirectPath);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-6 mb-6 shadow-inner">
        <svg
          className="w-12 h-12 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2" d="M9 15c.83.67 1.94 1 3 1s2.17-.33 3-1" />
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="15" cy="9" r="1.5" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        No {service} Username Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Please add your {service} username to your profile to view your statistics.
      </p>

      <button
        onClick={handleGoToProfile}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors w-64"
      >
        Go to Profile
      </button>
    </div>
  );
};

const LeetcodePage = () => {
  const { profileData, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (profileData && profileData.leetcode_username) {
      setUsername(profileData.leetcode_username);
    } else {
      setUsername(null);
    }
  }, [profileData]);

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 dark:text-red-400">
        <p>Error loading profile: {profileError}</p>
      </div>
    );
  }

  return (
    <div className="  pt-20 min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <motion.div
          layout
          className="mb-8 max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            LeetCode Stats
          </h2>
          {username ? (
            <LeetCodeStats username={username} />
          ) : (
            <NoUserNameFound service="LeetCode" redirectPath="/profile" />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LeetcodePage;
