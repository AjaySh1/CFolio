import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown, Award, Star, Code, TrendingUp } from 'lucide-react';
import { IoStarSharp } from "react-icons/io5";

// Color schemes for both modes
const colorSchemes = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-gray-200', // darker card bg for contrast
    text: 'text-black',   // black text for readability
    accent: 'text-yellow-600',
    border: 'border-gray-300',
    tableHead: 'bg-gray-300',
    tableText: 'text-black'
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    accent: 'text-yellow-400',
    border: 'border-gray-700',
    tableHead: 'bg-gray-700',
    tableText: 'text-gray-200'
  }
};

const CodeChefStats = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    analysis: true,
    heatmap: true,
    contest: true
  });

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scheme = isDark ? colorSchemes.dark : colorSchemes.light;

  if (!data) {
    return (
      <div className={`flex justify-center items-center h-64 ${scheme.card} ${scheme.text} rounded-lg border ${scheme.border}`}>
        <div className="text-xl text-red-400">No profile data available</div>
      </div>
    );
  }

  const { profileInfo, analysis, submissionHeatmap, contestGraph } = data;

  // Format contest history data for chart
  const chartData = contestGraph.contestHistory.map(contest => ({
    name: contest.contestName.replace('Starters ', 'S').replace(' (Rated)', '').replace(' (rated)', ''),
    rating: parseInt(contest.rating),
    date: contest.date
  }));

  // Function to render stars based on count
  const renderStars = (count) => {
    return (
      <div className="flex justify-center mb-2">
        {Array.from({ length: count }).map((_, i) => (
          <IoStarSharp key={i} className="text-yellow-400 text-4xl mx-0.5" />
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${scheme.background} ${scheme.text} transition-colors duration-300`}>
      {/* Profile Header Section - Centered */}
      <div className={`${scheme.card} rounded-lg shadow-lg p-6 ${scheme.text} ${scheme.border} border text-center`}>
        <div className="flex flex-col items-center">
          {/* Rating Display - Centered */}
          <div className="flex flex-col items-center mb-4">
            {profileInfo.stars && renderStars(profileInfo.stars)}
            <div className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{profileInfo.rating}</div>
            <div className="flex items-center gap-1 text-gray-400">
              <span>Highest: {profileInfo.highestRating}</span>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-md mx-auto">
            <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-lg border ${scheme.border}`}>
              <div className="text-gray-400 text-sm">Global Rank</div>
              <div className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>#{profileInfo.ranks.global}</div>
            </div>
            <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-lg border ${scheme.border}`}>
              <div className="text-gray-400 text-sm">Country Rank</div>
              <div className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>#{profileInfo.ranks.country}</div>
            </div>
            <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-lg border ${scheme.border}`}>
              <div className="text-gray-400 text-sm">Problems Solved</div>
              <div className={`text-xl font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>{profileInfo.problemsSolved}</div>
            </div>
            <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-lg border ${scheme.border}`}>
              <div className="text-gray-400 text-sm">Active Days</div>
              <div className={`text-xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>{submissionHeatmap.activeDays}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className={`${scheme.card} rounded-lg shadow-lg overflow-hidden ${scheme.text} ${scheme.border} border`}>
        <div 
          className={`flex items-center justify-between p-4 cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
          onClick={() => toggleSection('analysis')}
        >
          <h2 className="text-xl font-semibold flex items-center">
            <Award className="mr-2 text-blue-400" /> Performance Analysis
          </h2>
          {expandedSections.analysis ? 
            <ChevronUp className="text-blue-400" /> : 
            <ChevronDown className="text-blue-400" />
          }
        </div>
        
        {expandedSections.analysis && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg border ${scheme.border}`}>
                <h3 className="text-lg font-medium text-blue-300">Activity Stats</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Days:</span>
                    <span className="font-medium">{analysis.summary.activeDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Activity Rate:</span>
                    <span className="font-medium">{(parseFloat(analysis.summary.activityRate) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Submissions:</span>
                    <span className="font-medium">{submissionHeatmap.totalSubmissions}</span>
                  </div>
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg border ${scheme.border}`}>
                <h3 className="text-lg font-medium text-blue-300">Contest Performance</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contests:</span>
                    <span className="font-medium">{analysis.summary.contestsParticipated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Highest Rating:</span>
                    <span className="font-medium">{analysis.summary.highestRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Rank:</span>
                    <span className="font-medium">{analysis.summary.bestRank}</span>
                  </div>
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg border ${scheme.border}`}>
                <h3 className="text-lg font-medium text-blue-300">Progress</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating Trend:</span>
                    <span className={`font-medium flex items-center ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      +{analysis.summary.ratingTrend} <TrendingUp size={16} className="ml-1" />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Rating:</span>
                    <span className={`font-medium ${isDark ? 'text-black' : 'text-black'}`}>{profileInfo.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contest Performance Graph */}
      <div className={`${scheme.card} rounded-lg shadow-lg overflow-hidden ${scheme.text} ${scheme.border} border`}>
        <div 
          className={`flex items-center justify-between p-4 cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
          onClick={() => toggleSection('contest')}
        >
          <h2 className="text-xl font-semibold flex items-center">
            <Star className="mr-2 text-blue-400" /> Contest Performance
          </h2>
          {expandedSections.contest ? 
            <ChevronUp className="text-blue-400" /> : 
            <ChevronDown className="text-blue-400" />
          }
        </div>
        
        {expandedSections.contest && (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap gap-3">
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} ${isDark ? 'text-gray-200' : 'text-black'} px-3 py-1 rounded-full text-sm border ${scheme.border}`}>
                Contests: {contestGraph.contestsParticipated}
              </div>
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} ${isDark ? 'text-gray-200' : 'text-black'} px-3 py-1 rounded-full text-sm border ${scheme.border}`}>
                Highest Rating: {contestGraph.highestRating}
              </div>
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} ${isDark ? 'text-gray-200' : 'text-black'} px-3 py-1 rounded-full text-sm border ${scheme.border}`}>
                Best Rank: {contestGraph.bestRank}
              </div>
            </div>
            
            <div className={`w-full h-64 md:h-80 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg p-4 border ${scheme.border}`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4b5563" : "#e5e7eb"} opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: isDark ? '#d1d5db' : '#374151' }} 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                    stroke={isDark ? "#4b5563" : "#e5e7eb"}
                  />
                  <YAxis 
                    domain={['dataMin - 100', 'dataMax + 100']} 
                    tick={{ fill: isDark ? '#d1d5db' : '#374151' }}
                    stroke={isDark ? "#4b5563" : "#e5e7eb"}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Rating']}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return `${label} (${item?.date})`;
                    }}
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1f2937' : '#fff', 
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, 
                      color: isDark ? '#d1d5db' : '#374151', 
                      borderRadius: '0.375rem' 
                    }}
                  />
                  <Legend wrapperStyle={{ color: isDark ? '#d1d5db' : '#374151' }} />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#f59e42" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#f59e42' }}
                    activeDot={{ r: 6, fill: '#fde68a' }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent Contests Table */}
      <div className={`${scheme.card} rounded-lg shadow-lg overflow-hidden ${scheme.text} ${scheme.border} border`}>
        <div className={`${scheme.tableHead} p-4`}>
          <h2 className="text-xl font-semibold flex items-center">
            <Code className="mr-2 text-blue-400" /> Recent Contests
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={scheme.tableHead}>
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contest</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {contestGraph.contestHistory.slice(0, 5).map((contest, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className={`py-3 px-4 text-sm ${scheme.tableText}`}>{contest.contestName}</td>
                  <td className={`py-3 px-4 text-sm text-gray-400`}>{contest.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/50 text-yellow-100 border border-yellow-700/50">
                      {contest.rating}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-sm text-gray-400`}>#{contest.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CodeChefStats;