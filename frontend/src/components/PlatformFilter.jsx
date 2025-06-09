// src/components/PlatformFilter.jsx
import { motion } from 'framer-motion';

const platforms = [
  { id: 'all', name: 'All Platforms' },
  { id: 'leetcode', name: 'LeetCode' },
  { id: 'codeforces', name: 'Codeforces' },
  { id: 'codechef', name: 'CodeChef' },
];

const PlatformFilter = ({ selectedPlatform, setSelectedPlatform }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <motion.button
          key={platform.id}
          onClick={() => setSelectedPlatform(platform.id)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border
            ${selectedPlatform === platform.id
              ? 'bg-purple-300 text-black dark:bg-purple-500 dark:text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {platform.name}
        </motion.button>
      ))}
    </div>
  );
};

export default PlatformFilter;
