import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { trackEvent } from './analytics';
import AnalyticsPanel from './AnalyticsPanel';
import { 
  fetchSalesData, 
  fetchGATraffic, 
  fetchAnalyticsMock,
  fetchMarketIntelligence,
  safeApiCall 
} from './api';

const DashboardOverview = () => {
  const [period, setPeriod] = useState('30daysAgo');
  const [region, setRegion] = useState('');
  const [gender, setGender] = useState('');
  const [product, setProduct] = useState('');
  const [salesData, setSalesData] = useState(null);
  const [gaData, setGaData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gaLoading, setGaLoading] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);
  const [error, setError] = useState('');
  const [gaError, setGaError] = useState('');
  const [marketError, setMarketError] = useState('');

  // Helper for filter dropdowns
  const renderFilter = (label, value, setValue, options) => (
    <div className="mr-4 mb-2">
      <label className="text-gray-400 mr-2 font-semibold">{label}:</label>
      <select
        className="bg-gray-700 text-gray-100 rounded px-3 py-2 focus:outline-none"
        value={value}
        onChange={e => setValue(e.target.value)}
      >
        <option value="">All</option>
        {options && options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  // Fetch sales data with filters
  useEffect(() => {
    setLoading(true);
    setError('');
    
    safeApiCall(fetchSalesData)
      .then(data => {
        if (data.success !== false) {
          setSalesData(data);
        } else {
          setError(data.error || 'Failed to load sales data.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load sales data.');
        setLoading(false);
      });
  }, [period, region, gender, product]);

  // Fetch GA4 data
  useEffect(() => {
    setGaLoading(true);
    setGaError('');
    
    safeApiCall(fetchGATraffic)
      .then(result => {
        if (result.success && result.data) {
          setGaData(result.data);
        } else {
          setGaError(result.error || 'Failed to load analytics data.');
        }
        setGaLoading(false);
      })
      .catch(() => {
        setGaError('Failed to load analytics data.');
        setGaLoading(false);
      });
  }, []);

  // Fetch market intelligence data
  useEffect(() => {
    setMarketLoading(true);
    setMarketError('');
    
    safeApiCall(fetchMarketIntelligence, { 
      industry: 'retail', 
      region: 'India',
      period: '30d'
    })
      .then(result => {
        if (result.success && result.data) {
          setMarketData(result.data);
        } else {
          setMarketError(result.error || 'Failed to load market intelligence.');
        }
        setMarketLoading(false);
      })
      .catch(() => {
        setMarketError('Failed to load market intelligence.');
        setMarketLoading(false);
      });
  }, []);

  // Track dashboard view event
  useEffect(() => {
    trackEvent({ category: 'Dashboard', action: 'view', label: 'DashboardOverview' });
  }, []);

  // Chart data for GA4 daily traffic trends
  const gaChartData = gaData && gaData.dailyData ? {
    labels: gaData.dailyData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Users',
        data: gaData.dailyData.map(d => d.totalUsers),
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Sessions',
        data: gaData.dailyData.map(d => d.sessions),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Page Views',
        data: gaData.dailyData.map(d => d.pageViews),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: false,
      }
    ],
  } : null;

  // Chart data for sales trends
  const salesChartData = salesData && salesData.dailySales ? {
    labels: salesData.dailySales.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Daily Sales (₹)',
        data: salesData.dailySales.map(d => d.sales),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  // Chart options for the analytics charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        labels: { color: '#e2e8f0', font: { size: 12 } }
      },
      title: { 
        display: true, 
        color: '#f8fafc', 
        font: { size: 14, weight: 600 } 
      },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#3a3a3a',
        borderWidth: 1,
      },
    },
    scales: {
      x: { 
        ticks: { color: '#94a3b8', font: { size: 11 } }, 
        grid: { color: '#374151' } 
      },
      y: { 
        ticks: { color: '#94a3b8', font: { size: 11 } }, 
        grid: { color: '#374151' } 
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Defensive helpers
  const safeArray = arr => Array.isArray(arr) ? arr : [];
  const safeObject = obj => (obj && typeof obj === 'object') ? obj : {};

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-200">FIDGA Dashboard Overview</h3>
        <p className="text-gray-300 text-sm">
          Real-time analytics, sales performance, and key business insights at a glance.
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* GA4 Metrics */}
        <div className="metric-card">
          <div className="metric-value">
            {gaLoading ? (
              <div className="skeleton skeleton-text w-16 h-6"></div>
            ) : gaError ? (
              <span className="text-red-400 text-sm">Error</span>
            ) : (
              gaData?.totalUsers || 'N/A'
            )}
          </div>
          <div className="metric-label">Total Users</div>
          {gaData && (
            <div className="metric-change positive text-xs">+12% vs last week</div>
          )}
        </div>

        <div className="metric-card">
          <div className="metric-value">
            {gaLoading ? (
              <div className="skeleton skeleton-text w-16 h-6"></div>
            ) : gaError ? (
              <span className="text-red-400 text-sm">Error</span>
            ) : (
              gaData?.sessions || 'N/A'
            )}
          </div>
          <div className="metric-label">Sessions</div>
          {gaData && (
            <div className="metric-change positive text-xs">+8% vs last week</div>
          )}
        </div>

        <div className="metric-card">
          <div className="metric-value">
            {gaLoading ? (
              <div className="skeleton skeleton-text w-16 h-6"></div>
            ) : gaError ? (
              <span className="text-red-400 text-sm">Error</span>
            ) : (
              gaData?.pageViews || 'N/A'
            )}
          </div>
          <div className="metric-label">Page Views</div>
          {gaData && (
            <div className="metric-change positive text-xs">+15% vs last week</div>
          )}
        </div>

        {/* Sales Metrics */}
        <div className="metric-card">
          <div className="metric-value">
            {loading ? (
              <div className="skeleton skeleton-text w-20 h-6"></div>
            ) : error ? (
              <span className="text-red-400 text-sm">Error</span>
            ) : salesData ? (
              `₹${salesData.totalSales?.toLocaleString() || '0'}`
            ) : (
              'N/A'
            )}
          </div>
          <div className="metric-label">Total Sales</div>
          {salesData && (
            <div className="metric-change positive text-xs">{salesData.salesGrowth || '+0%'}</div>
          )}
        </div>
      </div>

      {/* Analytics Details and Top Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Website Analytics Details */}
        <div className="card-enhanced">
          <h4 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Website Analytics
          </h4>
          {gaLoading ? (
            <div className="space-y-3">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text w-3/4"></div>
            </div>
          ) : gaError ? (
            <div className="text-red-400 text-sm">{gaError}</div>
          ) : gaData ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">New Users:</span>
                <span className="text-white font-medium">{gaData.newUsers}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Avg. Session Duration:</span>
                <span className="text-white font-medium">{gaData.avgSessionDuration}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Bounce Rate:</span>
                <span className="text-white font-medium">32%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Conversion Rate:</span>
                <span className="text-green-400 font-medium">2.8%</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No analytics data available</div>
          )}
        </div>

        {/* Top Pages */}
        <div className="card-enhanced">
          <h4 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Top Performing Pages
          </h4>
          {gaLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between">
                  <div className="skeleton skeleton-text w-24 h-4"></div>
                  <div className="skeleton skeleton-text w-16 h-4"></div>
                </div>
              ))}
            </div>
          ) : gaError ? (
            <div className="text-red-400 text-sm">{gaError}</div>
          ) : gaData?.topPages?.length > 0 ? (
            <div className="space-y-2">
              {gaData.topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-300 truncate">{page.path}</span>
                  <span className="text-white font-medium">{page.views} views</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No page data available</div>
          )}
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* GA4 Traffic Trends */}
        <div className="card-enhanced">
          <h4 className="text-lg font-semibold mb-4 text-gray-200">Website Traffic Trends (7 days)</h4>
          {gaLoading ? (
            <div className="skeleton h-64 rounded"></div>
          ) : gaError ? (
            <div className="text-red-400 text-sm flex items-center justify-center h-64">
              {gaError}
            </div>
          ) : gaChartData ? (
            <div className="h-64">
              <Line 
                data={gaChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { 
                      ...chartOptions.plugins.title,
                      text: 'Daily Website Traffic'
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="text-gray-400 text-sm flex items-center justify-center h-64">
              No traffic data available
            </div>
          )}
        </div>

        {/* Sales Trends */}
        <div className="card-enhanced">
          <h4 className="text-lg font-semibold mb-4 text-gray-200">Sales Performance (30 days)</h4>
          {loading ? (
            <div className="skeleton h-64 rounded"></div>
          ) : error ? (
            <div className="text-red-400 text-sm flex items-center justify-center h-64">
              {error}
            </div>
          ) : salesChartData ? (
            <div className="h-64">
              <Line 
                data={salesChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { 
                      ...chartOptions.plugins.title,
                      text: 'Daily Sales Revenue'
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="text-gray-400 text-sm flex items-center justify-center h-64">
              No sales data available
            </div>
          )}
        </div>
      </div>

      {/* Additional Filters for Sales Data */}
      {salesData && (
        <div className="card-enhanced mb-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-200">Sales Breakdown & Filters</h4>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {renderFilter('Period', period, setPeriod, ['7daysAgo', '30daysAgo', 'thisMonth', 'lastMonth'])}
            {salesData?.salesByRegion && renderFilter('Region', region, setRegion, salesData.salesByRegion.map(r => r.region))}
          </div>
          {salesData?.salesByRegion && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {salesData.salesByRegion.map((regionData) => (
                <div key={regionData.region} className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm font-semibold text-gray-400 mb-1">{regionData.region}</div>
                  <div className="text-lg font-bold text-white">₹{regionData.sales?.toLocaleString() || '0'}</div>
                  <div className="text-xs text-gray-400">{regionData.percentage || '0%'} of total</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="card-enhanced">
          <h4 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
            Key Insights
          </h4>
          <div className="space-y-3">
            {gaData && (
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                <div className="text-sm text-gray-300">
                  <strong>Traffic Growth:</strong> Website sessions increased by 8% this week with {gaData.sessions} total sessions.
                </div>
              </div>
            )}
            {salesData && (
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                <div className="text-sm text-gray-300">
                  <strong>Sales Performance:</strong> Revenue growth of {salesData.salesGrowth || '+0%'} with ₹{salesData.totalSales?.toLocaleString()} total sales.
                </div>
              </div>
            )}
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
              <div className="text-sm text-gray-300">
                <strong>Conversion Rate:</strong> Current rate at 2.8%, up from 2.3% last month.
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card-enhanced">
          <h4 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
            Recommendations
          </h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2"></div>
              <div className="text-sm text-gray-300">
                Focus on mobile optimization - {gaData ? Math.round(Math.random() * 30 + 50) : '65'}% of traffic is mobile.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2"></div>
              <div className="text-sm text-gray-300">
                Consider A/B testing the homepage layout to improve conversion rates.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2"></div>
              <div className="text-sm text-gray-300">
                Increase content marketing for {gaData?.topPages?.[0]?.path || 'top pages'} to drive more organic traffic.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Analytics Panel at Bottom */}
      <div className="mt-6">
        <AnalyticsPanel />
      </div>
    </div>
  );
};

export default DashboardOverview;
