import { motion } from 'framer-motion';
import { FiStar, FiTrendingUp, FiAward, FiUsers, FiActivity } from 'react-icons/fi';

// Color schemes for both modes
const colorSchemes = {
  light: {
    card: 'bg-gray-200',
    text: 'text-black',
    border: 'border-gray-300',
    statBg: 'bg-gray-100',
    statText: 'text-blue-700',
    label: 'text-gray-500'
  },
  dark: {
    card: 'bg-gray-800',
    text: 'text-gray-100',
    border: 'border-gray-700',
    statBg: 'bg-gray-700/50',
    statText: 'text-blue-400',
    label: 'text-gray-400'
  }
};

const ProfileCard = ({ user }) => {
  // Detect dark mode
  const isDark = typeof window !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;
  const scheme = isDark ? colorSchemes.dark : colorSchemes.light;

  const getInitial = (handle) => handle?.charAt(0)?.toUpperCase() || '?';
  const colorVariants = [
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-green-500 to-green-700',
    'from-orange-500 to-orange-700'
  ];
  const randomColor = colorVariants[Math.floor(Math.random() * colorVariants.length)];

  const stats = [
    { icon: <FiTrendingUp className="h-5 w-5" />, label: 'Current Rating', value: user.rating },
    { icon: <FiStar className="h-5 w-5" />, label: 'Max Rating', value: user.maxRating },
    { icon: <FiUsers className="h-5 w-5" />, label: 'Friends', value: user.friendOfCount || 0 },
    { icon: <FiActivity className="h-5 w-5" />, label: 'Contribution', value: user.contribution || 0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${scheme.card} rounded-xl shadow-lg ${scheme.border} border p-6`}
    >
      <div className="flex flex-col items-center gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold text-white bg-gradient-to-br ${randomColor}`}
        >
          {getInitial(user.handle)}
        </motion.div>

        <div className="text-center">
          <motion.h2 
            className={`text-3xl font-bold ${scheme.text}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {user.handle}
          </motion.h2>
          <motion.p 
            className={`text-lg mt-1 capitalize ${isDark ? 'text-blue-400' : 'text-blue-700'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {user.rank || 'Unranked'}
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`${scheme.statBg} p-4 rounded-lg`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/50 rounded-lg text-blue-400">
                {stat.icon}
              </div>
              <div>
                <p className={`text-sm mb-1 ${scheme.label}`}>{stat.label}</p>
                <p className={`text-xl font-semibold ${scheme.text}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className={`${scheme.statBg} p-4 rounded-lg`}>
          <div className="flex items-center gap-2 text-green-400">
            <FiTrendingUp className="h-5 w-5" />
            <h3 className="font-semibold">Rating Change</h3>
          </div>
          <div className="mt-2">
            <span className={`text-xl font-bold ${user.rating >= user.maxRating ? 'text-green-400' : 'text-red-400'}`}>
              {user.rating - user.maxRating >= 0 ? '+' : ''}
              {user.rating - user.maxRating}
            </span>
            <span className="ml-2 text-sm text-gray-400">
              from peak
            </span>
          </div>
        </div>

        <div className={`${scheme.statBg} p-4 rounded-lg`}>
          <div className="flex items-center gap-2 text-yellow-400">
            <FiAward className="h-5 w-5" />
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <div className="mt-2">
            <span className={`text-xl font-bold ${scheme.text}`}>
              {user.contests || 0}
            </span>
            <span className="ml-2 text-sm text-gray-400">
              contests attended
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default ProfileCard;