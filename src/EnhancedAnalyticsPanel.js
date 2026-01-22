import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { trackEvent } from './analytics';

const GA_ID = 'G-KDC8ZMMCJN';
const API_BASE = process.env.REACT_APP_API_URL || '';

console.log("EnhancedAnalyticsPanel module loaded!");

// Chart types
const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
};

// Metrics available for selection
const METRICS = [
  { id: 'totalUsers', label: 'Total Users' },
  { id: 'newUsers', label: 'New Users' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'avgSessionDuration', label: 'Avg. Session Duration' },
  { id: 'pageViews', label: 'Page Views' },
  { id: 'bounceRate', label: 'Bounce Rate' },
  { id: 'conversionRate', label: 'Conversion Rate' },
];

// Date range presets
const DATE_RANGES = [
  { id: '7daysAgo', label: 'Last 7 Days' },
  { id: '14daysAgo', label: 'Last 14 Days' },
  { id: '30daysAgo', label: 'Last 30 Days' },
  { id: '90daysAgo', label: 'Last 90 Days' },
  { id: 'custom', label: 'Custom Range' },
];

// View modes
const VIEW_MODES = {
  SUMMARY: 'summary',
  CHART: 'chart',
  DETAILED: 'detailed',
};

export default function EnhancedAnalyticsPanel({ className = '', onDataLoad }) {
  console.log("EnhancedAnalyticsPanel rendered!");  // Debug log to confirm component is mounted
  
  // State for tracking and configuration
  const [enabled, setEnabled] = useState(() => localStorage.getItem('fidga_ga_enabled') !== 'false');
  const [gaData, setGaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // UI state
  const [dateRange, setDateRange] = useState('7daysAgo');
  const [customStartDate, setCustomStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [customEndDate, setCustomEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState(VIEW_MODES.SUMMARY);
  const [chartType, setChartType] = useState(CHART_TYPES.LINE);
  const [selectedMetrics, setSelectedMetrics] = useState(['totalUsers', 'pageViews']);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [showTopPages, setShowTopPages] = useState(true);
  
  // Track analytics enabled/disabled
  useEffect(() => {
    localStorage.setItem('fidga_ga_enabled', enabled);
    if (window.gtag) {
      if (enabled) {
        window.gtag('config', GA_ID);
        window['ga-disable-' + GA_ID] = false;
      } else {
        window['ga-disable-' + GA_ID] = true;
      }
    }
  }, [enabled]);

  // When date range changes to custom, show custom inputs
  useEffect(() => {
    if (dateRange === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
    }
  }, [dateRange]);
  
  // Function to fetch analytics data with the specified parameters
  const fetchAnalyticsData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError('');
    
    // Build the query parameters
    const params = new URLSearchParams();
    
    if (dateRange === 'custom') {
      params.append('startDate', customStartDate);
      params.append('endDate', customEndDate);
    } else {
      params.append('dateRange', dateRange);
    }
    
    // Add selected metrics
    if (selectedMetrics.length > 0) {
      params.append('metrics', selectedMetrics.join(','));
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/ga-traffic?${params.toString()}`);
      const result = await response.json();
      console.log("API response:", result);  // Debug log of API response
      
      if (result.success && result.data) {
        setGaData(result.data);
        if (onDataLoad) onDataLoad(result.data);
        
        // Track successful analytics load
        trackEvent({ 
          category: 'Analytics', 
          action: 'data_loaded', 
          label: dateRange === 'custom' ? 'custom_range' : dateRange 
        });
      } else {
        setError(result.error || 'Failed to load analytics data.');
      }
    } catch (err) {
      setError('Failed to load analytics data.');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled, dateRange, customStartDate, customEndDate, selectedMetrics, onDataLoad]);
  
  // Fetch data on initial load and when dependencies change
  useEffect(() => {
    console.log("Fetching analytics data...");
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);
  
  // Format data for charts
  const chartData = useMemo(() => {
    if (!gaData || !gaData.dailyData || !Array.isArray(gaData.dailyData)) {
      console.log("Missing daily data for charts:", gaData);
      return null;
    }
    
    // Generate chart data based on selected metrics
    let datasets = [];
    
    // Color palette for chart lines/bars
    const colors = [
      { border: 'rgba(59, 130, 246, 1)', bg: 'rgba(59, 130, 246, 0.2)' }, // Blue
      { border: 'rgba(239, 68, 68, 1)', bg: 'rgba(239, 68, 68, 0.2)' },   // Red
      { border: 'rgba(16, 185, 129, 1)', bg: 'rgba(16, 185, 129, 0.2)' }, // Green
      { border: 'rgba(245, 158, 11, 1)', bg: 'rgba(245, 158, 11, 0.2)' }, // Amber
      { border: 'rgba(139, 92, 246, 1)', bg: 'rgba(139, 92, 246, 0.2)' }, // Purple
    ];
    
    // Create datasets for selected metrics
    selectedMetrics.forEach((metricId, index) => {
      const metric = METRICS.find(m => m.id === metricId);
      
      if (metric && gaData.dailyData.some(day => day[metricId] !== undefined)) {
        datasets.push({
          label: metric.label,
          data: gaData.dailyData.map(day => day[metricId] || 0),
          borderColor: colors[index % colors.length].border,
          backgroundColor: colors[index % colors.length].bg,
          tension: 0.4,
          fill: true,
        });
      }
    });
    
    // If there's no daily data but we have summary metrics
    if (datasets.length === 0 && selectedMetrics.length > 0) {
      // Create pie/doughnut chart data from summary metrics
      const labels = [];
      const data = [];
      const backgroundColors = [];
      
      selectedMetrics.forEach((metricId, index) => {
        const metric = METRICS.find(m => m.id === metricId);
        if (metric && gaData[metricId] !== undefined) {
          labels.push(metric.label);
          data.push(gaData[metricId]);
          backgroundColors.push(colors[index % colors.length].border);
        }
      });
      
      if (labels.length > 0) {
        return {
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
            }
          ]
        };
      }
      
      return null;
    }
    
    return {
      labels: gaData.dailyData.map(day => day.date),
      datasets
    };
  }, [gaData, selectedMetrics]);

  // Chart options
  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true, 
          position: 'top',
          labels: {
            color: '#cbd5e1',
            font: {
              size: 12
            }
          }
        },
        tooltip: { 
          mode: 'index', 
          intersect: false,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          titleColor: '#fff',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 1,
        },
      },
      scales: chartType !== CHART_TYPES.PIE && chartType !== CHART_TYPES.DOUGHNUT 
        ? {
          x: { 
            ticks: { color: '#cbd5e1' }, 
            grid: { color: 'rgba(51, 65, 85, 0.4)' } 
          },
          y: { 
            ticks: { color: '#cbd5e1' }, 
            grid: { color: 'rgba(51, 65, 85, 0.4)' } 
          },
        } 
        : {}
    };
  }, [chartType]);

  // Toggle a metric in the selection
  const toggleMetric = (metricId) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        return prev.filter(id => id !== metricId);
      } else {
        return [...prev, metricId];
      }
    });
  };

  // Render chart based on type
  const renderChart = () => {
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
      return <div className="text-gray-400 text-center py-10">No data available for the selected metrics</div>;
    }

    switch (chartType) {
      case CHART_TYPES.BAR:
        return <Bar data={chartData} options={chartOptions} />;
      case CHART_TYPES.PIE:
        return <Pie data={chartData} options={chartOptions} />;
      case CHART_TYPES.DOUGHNUT:
        return <Doughnut data={chartData} options={chartOptions} />;
      case CHART_TYPES.LINE:
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  // Renders a button with active state
  const renderButton = (label, value, currentValue, setter, extraClasses = '') => (
    <button
      className={`px-3 py-1 rounded text-sm ${value === currentValue 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} ${extraClasses}`}
      onClick={() => setter(value)}
    >
      {label}
    </button>
  );

  // Render the panel UI
  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-200 text-lg">Google Analytics</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ga-toggle"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="ga-toggle" className="text-gray-400 text-sm">
              {enabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>
        
        {enabled && (
          <div className="flex flex-wrap gap-2">
            {renderButton('Summary', VIEW_MODES.SUMMARY, viewMode, setViewMode)}
            {renderButton('Chart', VIEW_MODES.CHART, viewMode, setViewMode)}
            {renderButton('Detailed', VIEW_MODES.DETAILED, viewMode, setViewMode)}
          </div>
        )}
      </div>

      {enabled && !loading && !error && (
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <label className="text-gray-400 text-sm">Date Range:</label>
            <div className="flex flex-wrap gap-2">
              {DATE_RANGES.map(range => (
                <button
                  key={range.id}
                  className={`px-2 py-1 text-xs rounded ${dateRange === range.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => setDateRange(range.id)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          {showCustomRange && (
            <div className="flex flex-wrap gap-4 mb-3 bg-gray-700/30 p-2 rounded">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Start Date:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={e => setCustomStartDate(e.target.value)}
                  className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm w-full"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">End Date:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={e => setCustomEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm w-full"
                />
              </div>
              <div className="flex items-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  onClick={fetchAnalyticsData}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {enabled && viewMode === VIEW_MODES.CHART && !loading && !error && gaData && (
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 text-sm">Chart Type:</label>
              <div className="flex gap-2">
                {renderButton('Line', CHART_TYPES.LINE, chartType, setChartType, 'text-xs')}
                {renderButton('Bar', CHART_TYPES.BAR, chartType, setChartType, 'text-xs')}
                {renderButton('Pie', CHART_TYPES.PIE, chartType, setChartType, 'text-xs')}
                {renderButton('Doughnut', CHART_TYPES.DOUGHNUT, chartType, setChartType, 'text-xs')}
              </div>
            </div>

            <div className="flex-1">
              <label className="text-gray-400 text-sm block mb-1">Metrics:</label>
              <div className="flex flex-wrap gap-1">
                {METRICS.map(metric => (
                  <button
                    key={metric.id}
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      selectedMetrics.includes(metric.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => toggleMetric(metric.id)}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-64 md:h-80 mt-4">
            {renderChart()}
          </div>
        </div>
      )}

      {enabled && viewMode === VIEW_MODES.DETAILED && !loading && !error && gaData && gaData.dailyData && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th className="px-3 py-2">Date</th>
                {METRICS.filter(metric => selectedMetrics.includes(metric.id)).map(metric => (
                  <th key={metric.id} className="px-3 py-2">{metric.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gaData.dailyData.map((day, idx) => (
                <tr key={day.date || idx} className="bg-gray-800 border-b border-gray-700">
                  <td className="px-3 py-2 font-medium">{day.date}</td>
                  {METRICS.filter(metric => selectedMetrics.includes(metric.id)).map(metric => (
                    <td key={metric.id} className="px-3 py-2">
                      {day[metric.id] != null ? day[metric.id] : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {enabled && viewMode === VIEW_MODES.SUMMARY && !loading && !error && gaData && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {METRICS.filter(metric => gaData[metric.id] != null).map(metric => (
              <div key={metric.id} className="bg-gray-700/50 p-3 rounded">
                <div className="text-xs text-gray-400">{metric.label}</div>
                <div className="text-xl font-semibold text-gray-200">{gaData[metric.id]}</div>
              </div>
            ))}
          </div>
          
          {gaData.topPages && gaData.topPages.length > 0 && showTopPages && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium text-gray-300">Top Pages</h4>
                <button
                  onClick={() => setShowTopPages(false)}
                  className="text-gray-400 hover:text-gray-300 text-xs"
                >
                  Hide
                </button>
              </div>
              <div className="bg-gray-700/30 rounded p-2">
                <ul className="text-xs text-gray-400 divide-y divide-gray-700">
                  {gaData.topPages.map((p, i) => (
                    <li key={i} className="py-1 flex justify-between">
                      <span title={p.path} className="truncate mr-2">{p.path}</span>
                      <span className="text-gray-300">{p.views} views</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {enabled && loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      )}

      {enabled && !loading && error && (
        <div className="text-red-400 text-sm py-2">{error}</div>
      )}

      <div className="mt-4 flex justify-between">
        {enabled && !loading && (
          <button 
            onClick={fetchAnalyticsData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <span className="transform rotate-90 inline-block">⟳</span> Refresh
          </button>
        )}
        <div className="text-gray-500 text-xs">
          {gaData?.lastUpdated && (
            <span>Last updated: {new Date(gaData.lastUpdated).toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
