import { subMonths, startOfDay, format } from 'date-fns';
import Chart from 'react-apexcharts';

// Color schemes for both modes
const colorSchemes = {
  light: {
    card: 'bg-gray-200',
    text: 'text-black',
    border: 'border-gray-300',
    title: 'text-blue-700'
  },
  dark: {
    card: 'bg-gray-800',
    text: 'text-gray-100',
    border: 'border-gray-700',
    title: 'text-blue-400'
  }
};

const RatingChart = ({ ratingHistory }) => {
  // Detect dark mode
  const isDark = typeof window !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;
  const scheme = isDark ? colorSchemes.dark : colorSchemes.light;

  const sixMonthsAgo = startOfDay(subMonths(new Date(), 6)).getTime();
  const filteredData = ratingHistory
    .filter(contest => contest.ratingUpdateTimeSeconds * 1000 >= sixMonthsAgo)
    .map(contest => ({
      x: contest.ratingUpdateTimeSeconds * 1000,
      y: contest.newRating,
      rank: contest.rank
    }));

  const options = {
    chart: {
      type: 'area',
      height: 400,
      foreColor: isDark ? '#d1d5db' : '#374151',
      toolbar: { show: true },
      zoom: { enabled: false },
      background: 'transparent'
    },
    colors: ['#3B82F6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    xaxis: {
      type: 'datetime',
      min: sixMonthsAgo,
      max: new Date().getTime(),
      labels: {
        style: { colors: isDark ? '#d1d5db' : '#374151' },
        format: 'MMM dd',
        rotate: -45
      },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { 
        style: { colors: isDark ? '#d1d5db' : '#374151' } 
      },
      forceNiceScale: true
    },
    annotations: {
      points: filteredData.map((contest, idx) => ({
        x: contest.x,
        y: contest.y,
        marker: {
          size: 6,
          fillColor: '#fff',
          strokeColor: '#3B82F6',
          radius: 2
        },
        label: {
          text: `#${contest.rank}`,
          style: {
            color: '#fff',
            background: '#3B82F6',
            fontSize: '12px',
            padding: { left: 5, right: 5, top: 2, bottom: 2 }
          }
        }
      }))
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      x: {
        formatter: (val) => format(new Date(val), 'MMM dd, yyyy HH:mm')
      }
    },
    grid: {
      borderColor: isDark ? 'rgba(156, 163, 175, 0.2)' : 'rgba(55, 65, 81, 0.1)',
      strokeDashArray: 4
    }
  };

  const series = [{
    name: 'Rating',
    data: filteredData
  }];

  return (
    <div className={`${scheme.card} rounded-xl shadow-lg ${scheme.border} border p-6`}>
      <h3 className={`text-xl font-semibold mb-4 ${scheme.title}`}>
        Rating History (Last 6 Months)
      </h3>
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={400} 
      />
    </div>
  );
};

export default RatingChart;