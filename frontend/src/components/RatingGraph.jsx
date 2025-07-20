import { useMemo } from 'react';
import Chart from 'react-apexcharts';

const colorSchemes = {
  light: {
    card: 'bg-gray-200',
    text: 'text-black',
    border: 'border-gray-300',
    title: 'text-blue-700',
    bgGradient: 'from-gray-100 to-gray-200'
  },
  dark: {
    card: 'bg-gray-800',
    text: 'text-gray-100',
    border: 'border-gray-700',
    title: 'text-blue-400',
    bgGradient: 'from-gray-800 to-gray-900'
  }
};

const RatingGraph = ({ stats }) => {
  const contestHistory = stats?.contestHistory || [];

  // Detect dark mode
  const isDark = typeof window !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;
  const scheme = isDark ? colorSchemes.dark : colorSchemes.light;

  if (!contestHistory.length) {
    return (
      <div className={`${scheme.card} p-6 rounded-xl backdrop-blur text-center shadow-lg`}>
        <p className={`${scheme.text}`}>No contest history found</p>
      </div>
    );
  }

  const currentRating = stats?.rating || contestHistory.at(-1)?.rating || 'N/A';
  const bestRating = Math.max(...contestHistory.map(c => c.rating));
  const bestRank = Math.min(...contestHistory.map(c => c.ranking));
  const lastContest = contestHistory.at(-1);

  // Prepare data for ApexCharts
  const series = [
    {
      name: 'Rating',
      data: contestHistory.map((c, i) => ({
        x: c.date || `Contest ${i + 1}`,
        y: c.rating,
        contest: c.contest?.title,
        rank: c.ranking,
      })),
    },
  ];

  // Memoize options for performance
  const options = useMemo(() => ({
    chart: {
      type: 'area',
      height: 300,
      zoom: { enabled: true },
      toolbar: { show: true },
      background: 'transparent',
      animations: { enabled: true },
      foreColor: isDark ? '#d1d5db' : '#374151',
    },
    colors: [isDark ? '#fbbf24' : '#3B82F6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
        colorStops: [],
      },
    },
    xaxis: {
      type: 'category',
      labels: {
        rotate: -45,
        style: { colors: isDark ? '#d1d5db' : '#374151', fontSize: '12px' },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { colors: isDark ? '#d1d5db' : '#374151', fontSize: '12px' },
      },
      forceNiceScale: true,
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const point = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        return `
          <div style="padding:8px;min-width:160px">
            <div style="font-weight:bold">${point.contest || ''}</div>
            <div>Date: ${point.x}</div>
            <div>Rating: ${point.y}</div>
            <div>Rank: ${point.rank}</div>
          </div>
        `;
      },
      theme: isDark ? 'dark' : 'light',
    },
    grid: {
      borderColor: isDark ? 'rgba(156, 163, 175, 0.2)' : 'rgba(55, 65, 81, 0.1)',
      strokeDashArray: 4,
    },
    markers: {
      size: 5,
      colors: [isDark ? '#fff' : '#fff'],
      strokeColors: isDark ? '#fbbf24' : '#3B82F6',
      strokeWidth: 2,
      hover: { size: 7 },
    },
  }), [contestHistory, isDark]);

  return (
    <div className={`bg-gradient-to-br ${scheme.bgGradient} p-6 rounded-2xl shadow-xl`}>
      <div className="mb-4">
        <h2 className={`text-3xl font-semibold ${scheme.text}`}>{currentRating}</h2>
        <p className="text-gray-400 text-sm">
          {lastContest?.date} | {lastContest?.contest?.title} | Rank: {lastContest?.ranking}
        </p>
      </div>
      <Chart
        options={options}
        series={series}
        type="area"
        height={350}
      />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-gray-400 text-sm">Best Rating</p>
          <p className={`text-xl font-bold ${scheme.text}`}>{bestRating}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Best Rank</p>
          <p className={`text-xl font-bold ${scheme.text}`}>{bestRank}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Contests</p>
          <p className={`text-xl font-bold ${scheme.text}`}>{contestHistory.length}</p>
        </div>
      </div>
    </div>
  );
};

export default RatingGraph;