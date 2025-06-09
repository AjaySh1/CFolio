import { motion } from 'framer-motion';

// Color schemes for both modes
const colorSchemes = {
  light: {
    card: 'bg-gray-200',
    text: 'text-black',
    border: 'border-gray-300',
    title: 'text-blue-700',
    statBg: 'bg-gray-100',
    statText: 'text-blue-700'
  },
  dark: {
    card: 'bg-gray-800',
    text: 'text-gray-100',
    border: 'border-gray-700',
    title: 'text-blue-400',
    statBg: 'bg-gray-700/50',
    statText: 'text-blue-400'
  }
};

const RecentContests = ({ contests = [] }) => {
  const isDark = typeof window !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;
  const scheme = isDark ? colorSchemes.dark : colorSchemes.light;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${scheme.card} rounded-xl shadow-lg ${scheme.border} border p-6`}
    >
      <h3 className={`text-xl font-semibold mb-4 ${scheme.title}`}>Recent Contests</h3>
      <div className="space-y-3">
        {contests.map((contest, idx) => (
          <motion.div
            key={contest.contestId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`${scheme.statBg} flex justify-between items-center p-4 rounded-lg hover:bg-gray-700 transition-colors`}
          >
            <div>
              <h4 className={`font-medium ${scheme.text}`}>{contest.contestName}</h4>
              <p className="text-sm text-gray-400">
                {new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-400">Rank: {contest.rank}</p>
              <p className={`${contest.newRating > contest.oldRating ? 'text-green-400' : 'text-red-400'}`}>
                {contest.newRating - contest.oldRating} points
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentContests;