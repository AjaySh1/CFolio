import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import GoogleCalendarButton from './GoogleCalendarButton';

const platformColors = {
  leetcode: 'bg-orange-500/20 text-orange-600 dark:text-orange-300',
  codeforces: 'bg-blue-500/20 text-blue-600 dark:text-blue-300',
  codechef: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300',
  gfg: 'bg-green-500/20 text-green-600 dark:text-green-300',
};

const platformGradients = {
  leetcode: 'from-orange-100 to-orange-200 dark:from-orange-500/30 dark:to-orange-600/20',
  codeforces: 'from-blue-100 to-blue-200 dark:from-blue-500/30 dark:to-blue-600/20',
  codechef: 'from-yellow-100 to-yellow-200 dark:from-yellow-500/30 dark:to-yellow-600/20',
  gfg: 'from-green-100 to-green-200 dark:from-green-500/30 dark:to-green-600/20',
};

const ContestCard = ({ contest }) => {
  const startDate = new Date(contest.startTime);
  const endDate = new Date(contest.endTime);

  return (
    <motion.div
      className={`
        bg-gradient-to-br ${platformGradients[contest.platform]} 
        rounded-xl backdrop-blur-sm border border-white/10 
        overflow-hidden shadow-lg hover:shadow-xl transition-all
        text-black dark:text-white
      `}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-5 bg-gray-100 dark:bg-white/10 transition-colors duration-300 rounded-xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-2 py-1 rounded-full ${platformColors[contest.platform]} backdrop-blur-sm`}>
                {contest.platform}
              </span>
              <h3 className="text-lg font-semibold">{contest.title}</h3>
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{format(startDate, 'MMM d, yyyy h:mm a')}</span>
              </span>
              <span className="flex items-center space-x-1 mt-1">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>{contest.duration} minutes</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(startDate, { addSuffix: true })}
            </span>
          </div>
        </div>

        <GoogleCalendarButton contest={contest} />

        <div className="mt-4 flex justify-end">
          <motion.a 
            href={contest.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-300 hover:underline text-sm font-medium flex items-center"
            whileHover={{ x: 3 }}
          >
            Visit Contest
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestCard;
