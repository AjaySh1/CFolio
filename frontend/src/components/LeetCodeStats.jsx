import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingGraph from './RatingGraph';
import { UserAuth } from '../context/AuthContext';

// Color schemes for both modes
const colorSchemes = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-800',
    accent: 'text-blue-600',
    progressBg: 'bg-gray-200',
    divider: 'border-gray-200'
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    accent: 'text-blue-400',
    progressBg: 'bg-gray-700',
    divider: 'border-gray-700'
  }
};

const difficultyColors = {
  easy: {
    light: 'text-green-600 bg-green-100',
    dark: 'text-green-400 bg-green-900/30'
  },
  medium: {
    light: 'text-yellow-600 bg-yellow-100',
    dark: 'text-yellow-400 bg-yellow-900/30'
  },
  hard: {
    light: 'text-red-600 bg-red-100',
    dark: 'text-red-400 bg-red-900/30'
  }
};

const progressVariants = {
  hidden: { width: 0 },
  show: { width: '100%', transition: { duration: 1.5, ease: "easeOut" } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const topicContainerVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      when: "afterChildren"
    }
  }
};

const LeetcodeStats = ({ username }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState(false);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const { session } = UserAuth();

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

  // Fetch stats logic (unchanged)
  const fetchStats = async () => {
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `${API_BASE}/api/leetcode/stats/${username}/`;
      const response = await fetch(apiUrl);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('API did not return JSON. Check your backend or username.');
      }

      if (!response.ok) {
        const text = await response.text();
        if (response.status === 404) {
          throw new Error(`User "${username}" not found on LeetCode`);
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error(`Failed to fetch LeetCode stats (${response.status})`);
        }
      }

      const responseData = await response.json();
      if (!responseData || !responseData.data || Object.keys(responseData.data).length === 0) {
        throw new Error('No data available for this user');
      }

      const data = responseData.data;

      const formattedStats = {
        username: data.username,
        avatar: data.profile?.profile?.userAvatar,
        realName: data.profile?.profile?.realName,
        aboutMe: data.profile?.profile?.aboutMe,
        company: data.profile?.profile?.company,
        school: data.profile?.profile?.school,
        countryName: data.profile?.profile?.countryName,

        // Problem solving stats
        totalSolved: data.problemsSolved?.solvedStats?.submitStatsGlobal?.acSubmissionNum?.find(item => item.difficulty === 'All')?.count || 0,
        easySolved: data.problemsSolved?.solvedStats?.submitStatsGlobal?.acSubmissionNum?.find(item => item.difficulty === 'Easy')?.count || 0,
        mediumSolved: data.problemsSolved?.solvedStats?.submitStatsGlobal?.acSubmissionNum?.find(item => item.difficulty === 'Medium')?.count || 0,
        hardSolved: data.problemsSolved?.solvedStats?.submitStatsGlobal?.acSubmissionNum?.find(item => item.difficulty === 'Hard')?.count || 0,
        totalEasy: 740,
        totalMedium: 1560,
        totalHard: 700,

        ranking: data.profile?.profile?.ranking,
        rating: data.contestRanking?.rating?.toFixed(2) || 'N/A',
        totalContestsAttended: data.contestRanking?.attendedContestsCount || 0,

        languages: data.languageStats || [],

        topicStats: {
          fundamental: data.tagProblemCounts?.fundamental || [],
          intermediate: data.tagProblemCounts?.intermediate || [],
          advanced: data.tagProblemCounts?.advanced || []
        },

        contestHistory: data.contestHistory || [],

        streak: data.streakCount || 0,
        totalActiveDays: data.calendar?.totalActiveDays || 0,

        recentSubmissions: data.recentSubmissions?.map(submission => ({
          problemName: submission.title,
          status: 'Accepted',
          problemSlug: submission.titleSlug
        })) || [],
      };

      setStats(formattedStats);
      if (session) {
        await upsertLeetCodeData(formattedStats);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
      setLoading(false);
    }
  };

  const upsertLeetCodeData = async (leetcodeData) => {
    try {
      // Prepare contest ranking data
      const contestRankingData = {
        leetcode_recent_contest_rating: parseFloat(leetcodeData.rating) || 0,
        leetcode_max_contest_rating: parseFloat(leetcodeData.rating) || 0,
      };

      // Prepare total questions data
      const totalQuestionsData = {
        leetcode_easy: leetcodeData.easySolved || 0,
        leetcode_medium: leetcodeData.mediumSolved || 0,
        leetcode_hard: leetcodeData.hardSolved || 0,
        leetcode_total: leetcodeData.totalSolved || 0,
      };

      // Upsert both data sets
      const upsertPromises = [
        fetch(`${API_BASE}/api/dashboard/${session.user.id}/contest-ranking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(contestRankingData)
        }),
        fetch(`${API_BASE}/api/dashboard/${session.user.id}/total-questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(totalQuestionsData)
        })
      ];

      await Promise.all(upsertPromises);
    } catch (err) {
      // Silent fail
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, [username]);

  const retryFetch = () => {
    fetchStats();
  };

  // Helper functions for topics
  const getTopTopics = () => {
    if (!stats) return [];
    const allTopics = [
      ...(stats.topicStats.fundamental || []),
      ...(stats.topicStats.intermediate || []),
      ...(stats.topicStats.advanced || [])
    ];
    return allTopics.sort((a, b) => b.problemsSolved - a.problemsSolved);
  };

  const topTopics = getTopTopics();

  const getTopicsByCategory = () => {
    if (!stats) return { fundamental: [], intermediate: [], advanced: [] };
    return {
      fundamental: stats.topicStats.fundamental?.sort((a, b) => b.problemsSolved - a.problemsSolved) || [],
      intermediate: stats.topicStats.intermediate?.sort((a, b) => b.problemsSolved - a.problemsSolved) || [],
      advanced: stats.topicStats.advanced?.sort((a, b) => b.problemsSolved - a.problemsSolved) || []
    };
  };

  const topicsByCategory = getTopicsByCategory();

  // Choose color scheme
  const scheme = isDark ? colorSchemes.dark : colorSchemes.light;

  if (loading) {
    return (
      <div className={`${scheme.card} rounded-xl p-8 shadow-lg ${scheme.text} transition-colors duration-300`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className={`mt-4 ${scheme.accent}`}>Loading LeetCode stats for {username}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className={`${scheme.card} rounded-xl p-8 shadow-lg ${scheme.text} transition-colors duration-300`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Stats</h2>
          <p className="text-red-500 dark:text-red-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full text-white"
              onClick={retryFetch}
            >
              Try Again
            </button>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mt-4`}>
              <p className="mb-2">Possible solutions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check if the username "{username}" is correct</li>
                <li>Verify your internet connection</li>
                <li>The LeetCode API might be temporarily unavailable</li>
                <li>Try again in a few moments</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!stats) return null;

  return (
    <motion.div
      className={`${scheme.background} rounded-xl p-6 shadow-lg ${scheme.text} transition-colors duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with username */}
      <motion.div className="flex items-center mb-6">
        <h3 className={`text-xl font-bold ${scheme.accent}`}>
          {stats.realName || stats.username}
        </h3>
        {stats.ranking && (
          <span className="ml-2 px-2 py-1 text-xs bg-blue-900/50 text-blue-400 rounded-full">
            #{stats.ranking}
          </span>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'Ranking', value: stats.ranking || 'N/A' },
          { title: 'Rating', value: stats.rating || 'N/A' },
          { title: 'Contests Attended', value: stats.totalContestsAttended || 0 }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className={`${scheme.card} p-4 rounded-lg border ${scheme.divider}`}
            variants={itemVariants}
          >
            <h3 className={`text-sm ${scheme.accent}`}>{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Problem Solving Stats */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-4 ${scheme.accent}`}>Problem Solving Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <div key={difficulty}>
                <div className="flex justify-between mb-1">
                  <span className={`text-sm capitalize ${scheme.accent}`}>{difficulty}</span>
                  <span className={`text-sm ${isDark ? difficultyColors[difficulty].dark : difficultyColors[difficulty].light}`}>
                    {stats[`${difficulty}Solved`] || 0}/{stats[`total${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`] || 0}
                  </span>
                </div>
                <div className={`w-full ${scheme.progressBg} rounded-full h-2.5`}>
                  <motion.div
                    className={`h-2.5 rounded-full ${difficulty === 'easy' ? 'bg-green-400' : difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${(stats[`${difficulty}Solved`] / stats[`total${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`]) * 100 || 0}%` }}
                    variants={progressVariants}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Circular progress chart */}
          <div className="flex items-center justify-center">
            <motion.div
              className="relative w-40 h-40"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke={isDark ? "#374151" : "#e5e7eb"} strokeWidth="8" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="8"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{
                    strokeDashoffset: stats.totalSolved
                      ? 283 - (283 * stats.totalSolved / 3000)
                      : 283
                  }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-3xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 1 }}
                >
                  {stats.totalSolved || 0}
                </motion.span>
                <span className={`text-sm ${scheme.accent}`}>solved</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Topic Analysis Section */}
      <div className="mb-8">
        <div className={`${scheme.card} rounded-xl overflow-hidden shadow-lg border ${scheme.divider}`}>
          <div
            className={`flex justify-between items-center p-4 ${scheme.card} cursor-pointer`}
            onClick={() => setExpandedTopics(!expandedTopics)}
          >
            <h2 className={`text-xl font-bold ${scheme.accent}`}>Topic Analysis</h2>
            <motion.div
              animate={{ rotate: expandedTopics ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={scheme.accent}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
          <AnimatePresence>
            {expandedTopics && (
              <motion.div
                variants={topicContainerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className={`p-6 ${scheme.card}`}
              >
                {/* Top Topics Overview */}
                <div className="mb-6">
                  <h3 className={`${scheme.accent} text-lg mb-3`}>Top Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topTopics.slice(0, 4).map((topic, index) => (
                      <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-lg`}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${scheme.accent}`}>{topic.tagName}</span>
                          <span className={`text-sm ${scheme.accent}`}>
                            {topic.problemsSolved} solved
                          </span>
                        </div>
                        <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2.5`}>
                          <motion.div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${Math.min(100, (topic.problemsSolved / 100) * 100)}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (topic.problemsSolved / 100) * 100)}%` }}
                            transition={{ duration: 1, delay: 0.1 * index }}
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Detailed Categories */}
                <div className="space-y-6">
                  {/* Fundamental Topics */}
                  {topicsByCategory.fundamental.length > 0 && (
                    <div>
                      <h3 className="text-green-400 text-lg mb-3">Fundamental Topics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topicsByCategory.fundamental.slice(0, 6).map((topic, index) => (
                          <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-lg`}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-green-400">{topic.tagName}</span>
                              <span className="text-sm text-green-400">
                                {topic.problemsSolved} solved
                              </span>
                            </div>
                            <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
                              <motion.div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${Math.min(100, (topic.problemsSolved / 50) * 100)}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (topic.problemsSolved / 50) * 100)}%` }}
                                transition={{ duration: 1, delay: 0.1 * index }}
                              ></motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Intermediate Topics */}
                  {topicsByCategory.intermediate.length > 0 && (
                    <div>
                      <h3 className="text-yellow-400 text-lg mb-3">Intermediate Topics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topicsByCategory.intermediate.slice(0, 6).map((topic, index) => (
                          <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-lg`}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-yellow-400">{topic.tagName}</span>
                              <span className="text-sm text-yellow-400">
                                {topic.problemsSolved} solved
                              </span>
                            </div>
                            <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
                              <motion.div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${Math.min(100, (topic.problemsSolved / 50) * 100)}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (topic.problemsSolved / 50) * 100)}%` }}
                                transition={{ duration: 1, delay: 0.1 * index }}
                              ></motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Advanced Topics */}
                  {topicsByCategory.advanced.length > 0 && (
                    <div>
                      <h3 className="text-red-400 text-lg mb-3">Advanced Topics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topicsByCategory.advanced.slice(0, 6).map((topic, index) => (
                          <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-lg`}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-red-400">{topic.tagName}</span>
                              <span className="text-sm text-red-400">
                                {topic.problemsSolved} solved
                              </span>
                            </div>
                            <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
                              <motion.div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${Math.min(100, (topic.problemsSolved / 50) * 100)}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (topic.problemsSolved / 50) * 100)}%` }}
                                transition={{ duration: 1, delay: 0.1 * index }}
                              ></motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {(!topTopics || topTopics.length === 0) && (
            <div className={`p-6 ${scheme.card} text-center`}>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>No topic data found</p>
            </div>
          )}
        </div>
      </div>

      {/* Programming Languages Section */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-4 ${scheme.accent}`}>Programming Languages</h2>
        {stats.languages && stats.languages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.languages.map((lang, index) => (
              <div key={index} className={`${scheme.card} p-4 rounded-lg`}>
                <h3 className={`${scheme.accent} text-sm`}>{lang.languageName}</h3>
                <p className="text-xl font-bold">{lang.problemsSolved}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${scheme.card} p-6 rounded-lg text-center`}>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>No language data found</p>
          </div>
        )}
      </div>

      {/* Contest History Section */}
      <RatingGraph stats={stats} />

      {/* Activity Stats */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-4 ${scheme.accent}`}>Activity Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${scheme.card} p-4 rounded-lg`}>
            <h3 className={`${scheme.accent} text-sm`}>Current Streak</h3>
            <p className="text-xl font-bold">{stats.streak || 0} days</p>
          </div>
          <div className={`${scheme.card} p-4 rounded-lg`}>
            <h3 className={`${scheme.accent} text-sm`}>Total Active Days</h3>
            <p className="text-xl font-bold">{stats.totalActiveDays || 0}</p>
          </div>
          <div className={`${scheme.card} p-4 rounded-lg`}>
            <h3 className={`${scheme.accent} text-sm`}>Recent Contest Rating</h3>
            <p className="text-xl font-bold">{stats.rating || 'N/A'}</p>
          </div>
          <div className={`${scheme.card} p-4 rounded-lg`}>
            <h3 className={`${scheme.accent} text-sm`}>Global Ranking</h3>
            <p className="text-xl font-bold">{stats.ranking || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <div className="w-full max-w-3xl mx-auto">
          <h2 className={`text-xl font-semibold mb-4 ${scheme.accent}`}>Recent Activity</h2>
          <ul className={`${scheme.card} rounded-xl divide-y ${scheme.divider} overflow-hidden shadow-lg`}>
            {stats.recentSubmissions.slice(0, 5).map((submission, index) => (
              <li
                key={index}
                className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
              >
                <div>
                  <p className="font-medium text-base">{submission.problemName}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-400/40">
                  Accepted
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default LeetcodeStats;