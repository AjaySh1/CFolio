import { Tooltip } from 'react-tooltip';
import { format, eachDayOfInterval, subMonths, startOfMonth, lastDayOfMonth } from 'date-fns';
import { motion } from 'framer-motion';

const colorSchemes = {
  light: {
    card: 'bg-gray-200',
    text: 'text-black',
    border: 'border-gray-300',
    heatmapBg: 'bg-gray-200',
    tooltipBg: '!bg-gray-200',
    tooltipText: '!text-black',
    tooltipBorder: '!border-gray-300'
  },
  dark: {
    card: 'bg-gray-800',
    text: 'text-gray-100',
    border: 'border-gray-700',
    heatmapBg: 'bg-gray-800',
    tooltipBg: '!bg-gray-800',
    tooltipText: '!text-white',
    tooltipBorder: '!border-gray-700'
  }
};

const CalendarHeatmap = ({ submissionCalendar }) => {
  const isDark = typeof window !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;
  const scheme = isDark ? colorSchemes.dark : colorSchemes.light;

  const startDate = subMonths(new Date(), 6);
  const endDate = lastDayOfMonth(new Date());
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days into weeks (columns)
  const weeks = [];
  let week = [];
  allDays.forEach((day, idx) => {
    week.push(day);
    if (week.length === 7 || idx === allDays.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  // Group weeks by month for proper label alignment
  const monthSpans = [];
  let currentMonth = format(weeks[0][0], 'MMM');
  let startIdx = 0;
  weeks.forEach((week, idx) => {
    const weekMonth = format(week[0], 'MMM');
    if (weekMonth !== currentMonth) {
      monthSpans.push({ name: currentMonth, start: startIdx, end: idx });
      currentMonth = weekMonth;
      startIdx = idx;
    }
    if (idx === weeks.length - 1) {
      monthSpans.push({ name: currentMonth, start: startIdx, end: weeks.length });
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${scheme.card} rounded-xl shadow-lg ${scheme.border} border p-6 relative transition-colors duration-300`}
    >
      <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>6-Month Activity</h3>

      {/* Month Labels */}
      <div className="flex mb-2 ml-10">
        {monthSpans.map((month, i) => (
          <div
            key={month.name + month.start}
            className="text-xs text-gray-400 font-medium text-center"
            style={{ width: `${(month.end - month.start) * 16}px`, minWidth: '16px' }}
          >
            {month.name}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* Weekday Labels */}
        <div className="flex flex-col gap-1 text-xs text-gray-400 mr-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-4 w-8 flex items-center justify-end pr-1">
              {day}
            </div>
          ))}
        </div>
        {/* Heatmap Grid */}
        <div className="flex gap-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => {
                const dateString = format(day, 'yyyy-MM-dd');
                const count = submissionCalendar[dateString] || 0;
                return (
                  <div
                    key={dateString}
                    data-tooltip-id="heatmap-tooltip"
                    data-tooltip-content={`${format(day, 'MMM dd, yyyy')} - ${count} submission${count !== 1 ? 's' : ''}`}
                    className={`h-4 w-4 rounded-sm transition-all ${
                      count === 0 ? (isDark ? 'bg-gray-700' : 'bg-gray-300') :
                      count < 3 ? (isDark ? 'bg-blue-400' : 'bg-blue-300') :
                      count < 5 ? (isDark ? 'bg-blue-500' : 'bg-blue-400') : (isDark ? 'bg-blue-600' : 'bg-blue-500')
                    } hover:scale-110 cursor-pointer`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Tooltip
        id="heatmap-tooltip"
        className={`${scheme.tooltipBg} ${scheme.tooltipText} !rounded-lg !px-3 !py-2 !text-sm ${scheme.tooltipBorder}`}
        place="top"
      />
    </motion.div>
  );
};

export default CalendarHeatmap;