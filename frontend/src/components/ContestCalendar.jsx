// src/components/ContestCalendar.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';

const ContestCalendar = ({ contests }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarEvents = useMemo(() => {
    const events = {};
    contests.forEach(contest => {
      const date = new Date(contest.startTime);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!events[key]) events[key] = [];
      events[key].push(contest);
    });
    return events;
  }, [contests]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay();
  const today = new Date();

  const calendarDays = Array.from({ length: startDayOfWeek + daysInMonth }, (_, i) => {
    if (i < startDayOfWeek) return <div key={`empty-${i}`} />;
    const day = i - startDayOfWeek + 1;
    const key = `${year}-${month}-${day}`;
    const hasEvents = calendarEvents[key];
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    return (
      <motion.div
        key={day}
        className={`relative aspect-square p-1 text-sm cursor-pointer rounded-lg transition-all
          ${isToday ? 'bg-purple-100 text-black dark:bg-purple-500/20 dark:text-white' : ''}
          ${hasEvents ? 'hover:bg-purple-200 dark:hover:bg-purple-500/20' : 'opacity-60'}
        `}
        whileHover={{ scale: 1.05 }}
        onClick={() => hasEvents && setSelectedDate({ day, key })}
      >
        <div className={`text-center font-medium ${hasEvents ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {day}
        </div>
        {hasEvents && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {calendarEvents[key].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
            ))}
          </div>
        )}
      </motion.div>
    );
  });

  const handleMonthChange = (dir) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  };

  return (
    <motion.div className="bg-white dark:bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-gray-300 dark:border-white/10 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-black dark:text-white">
          <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Contest Calendar
        </h2>
        <div className="flex gap-2">
          <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-black dark:text-white">
            ◀
          </button>
          <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-black dark:text-white">
            ▶
          </button>
        </div>
      </div>

      <div className="text-center text-lg font-medium text-black dark:text-white mb-2">
        {currentMonth.toLocaleString('default', { month: 'long' })} {year}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 p-1 font-medium">
            {day}
          </div>
        ))}
        {calendarDays}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl w-3/4 max-w-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Contests on {selectedDate.day} {currentMonth.toLocaleString('default', { month: 'long' })}
              </h3>
              <div className="space-y-2">
                {calendarEvents[selectedDate.key].map(contest => (
                  <a
                    key={contest.id}
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/60 transition-colors"
                  >
                    <div className="font-medium text-black dark:text-white">{contest.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(contest.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContestCalendar;
