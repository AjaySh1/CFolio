import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import ContestCard from '../components/ContestCard';
import PlatformFilter from '../components/PlatformFilter';
import Header from '../components/Header';
import ContestCalendar from '../components/ContestCalendar';

const Contest = () => {
  const [contests, setContests] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [hoveredStat, setHoveredStat] = useState(null);

  const parseDuration = (duration) => {
    const [time, unit] = duration.split(' ');
    const timeValue = parseFloat(time);
    return unit.includes('hour') ? Math.round(timeValue * 60) : timeValue;
  };

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/contests/upcoming`);
        const data = await response.json();
        if (data.success) {
          const transformed = data.contests.map(c => ({
            id: `${c.name}-${c.startTime}`,
            title: c.name,
            platform: c.platform.toLowerCase(),
            startTime: c.startTime,
            endTime: c.endTime,
            duration: parseDuration(c.duration),
            url: c.url,
          }));
          setContests(transformed);
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [API_BASE]);

  const filteredContests = contests.filter(c => {
    const matchPlatform = selectedPlatform === 'all' || c.platform === selectedPlatform;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPlatform && matchSearch;
  });

  const PlatformTooltip = ({ visible, contests }) => {
    const platformCounts = useMemo(() => ({
      leetcode: contests.filter(c => c.platform === 'leetcode').length,
      codechef: contests.filter(c => c.platform === 'codechef').length,
      codeforces: contests.filter(c => c.platform === 'codeforces').length,
    }), [contests]);

    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full right-0 bg-gray-200 dark:bg-gray-800 backdrop-blur-sm p-2 rounded-lg shadow-lg z-10 min-w-[120px]"
          >
            <div className="text-xs space-y-1 text-gray-800 dark:text-gray-200">
              {Object.entries(platformCounts).map(([platform, count]) => (
                count > 0 && (
                  <div key={platform} className="flex justify-between items-center gap-4">
                    <span className="capitalize">{platform}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mt-6 mb-8 px-4">
          <h1 className="text-2xl font-semibold border-b pb-2 border-gray-300 dark:border-gray-600">
            🗓️ Upcoming Contests
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PlatformFilter selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />
            <input
              type="text"
              placeholder="🔍 Search contests"
              className="px-3 py-2 rounded-xl w-[53%] bg-gray-200 dark:bg-white/10 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-300 outline-none border border-gray-300 dark:border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="bg-gray-200 dark:bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-gray-300 dark:border-white/10 shadow-xl max-h-[39rem] overflow-y-auto space-y-4 scrollbar-thin">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-24 bg-gray-300 dark:bg-white/5 rounded-xl backdrop-blur-sm animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))
              ) : (
                <AnimatePresence>
                  {filteredContests.length > 0 ? (
                    filteredContests.map((contest) => (
                      <ContestCard key={contest.id} contest={contest} />
                    ))
                  ) : (
                    <motion.div
                      className="text-center py-12 bg-gray-300 dark:bg-white/5 rounded-xl backdrop-blur-sm border border-gray-300 dark:border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-gray-600 dark:text-gray-400">No contests found matching your criteria</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-14 bg-gray-200 dark:bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-gray-300 dark:border-white/10 shadow-xl space-y-4 py-6"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ChartPieIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Contest Stats
              </h2>

              <div className="space-y-3">
                {['total', 'upcoming', 'ongoing'].map((type) => {
                  const label = {
                    total: 'Total Contests',
                    upcoming: 'Upcoming',
                    ongoing: 'Ongoing'
                  }[type];

                  const filtered = type === 'total'
                    ? contests
                    : type === 'upcoming'
                    ? contests.filter(c => new Date(c.startTime) > new Date())
                    : contests.filter(c => new Date() > new Date(c.startTime) && new Date() < new Date(c.endTime));

                  return (
                    <div key={type} className="flex justify-between items-center relative">
                      <span className="text-gray-600 dark:text-gray-400">{label}</span>
                      <div
                        className={`relative group font-medium ${type === 'upcoming' ? 'text-green-600' : type === 'ongoing' ? 'text-yellow-500' : 'text-gray-800 dark:text-white'}`}
                        onMouseEnter={() => setHoveredStat(type)}
                        onMouseLeave={() => setHoveredStat(null)}
                      >
                        {filtered.length}
                        <PlatformTooltip visible={hoveredStat === type} contests={filtered} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <ContestCalendar contests={filteredContests} />
          </div>
        </div>

        <div className="mt-6 mb-4 px-4">
          <h1 className="text-2xl font-semibold border-b pb-2 border-gray-300 dark:border-gray-600">
            🏁 Previous Contests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">under progress..</p>
        </div>
      </main>
    </div>
  );
};

export default Contest;
