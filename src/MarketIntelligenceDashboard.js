import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  fetchTrendForecast,
  fetchMarketIntelligence,
  fetchSocialListening,
  fetchCompetitorIntel,
  fetchIndustryReports,
  fetchKeywordInsightsAdvanced,
  fetchCustomerSegments,
  fetchCompetitiveStrategy,
  safeApiCall
} from './api';
import { trackEvent } from './analytics';
import AnalyticsPanel from './AnalyticsPanel';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const MarketIntelligenceDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('trends');
  const [trendForecast, setTrendForecast] = useState(null);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState('');
  const [expandedInsights, setExpandedInsights] = useState({});
  const [expanding, setExpanding] = useState({});
  const [socialData, setSocialData] = useState(null);
  const [competitorData, setCompetitorData] = useState(null);
  const [industryData, setIndustryData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [audienceData, setAudienceData] = useState(null);
  const [contentPerformance, setContentPerformance] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    
    safeApiCall(fetchMarketIntelligence, {
      industry: 'retail',
      region: 'India',
      period: '30d'
    })
      .then(res => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message || 'Failed to load market intelligence.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load market intelligence.');
        setLoading(false);
      });
  }, []);

  // Fetch trend forecast when trend expansion tab is active
  useEffect(() => {
    if (activeTab === 'trendExpansion') {
      setTrendLoading(true);
      setTrendError('');
      fetchTrendForecast()
        .then(res => {
          if (res && res.data) {
            setTrendForecast(res.data);
          } else {
            setTrendError(res.message || 'Failed to load trend forecast.');
          }
          setTrendLoading(false);
        })
        .catch(() => {
          setTrendError('Failed to load trend forecast.');
          setTrendLoading(false);
        });
    }
  }, [activeTab]);

  const handleExpandInsight = async (trendName) => {
    setExpanding(prev => ({ ...prev, [trendName]: true }));
    try {
      const res = await fetch('/api/gemini-trend-expansion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trend: trendName })
      });
      const data = await res.json();
      setExpandedInsights(prev => ({ ...prev, [trendName]: data?.data?.expandedInsight || 'No insight available.' }));
    } catch {
      setExpandedInsights(prev => ({ ...prev, [trendName]: 'Failed to fetch insight.' }));
    }
    setExpanding(prev => ({ ...prev, [trendName]: false }));
  };

  // Fetch detailed data from individual endpoints
  const fetchDetailedData = async (endpoint, setter, key) => {
    setLoadingDetails(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`/api/${endpoint}`);
      const result = await res.json();
      if (result.success && result.data) {
        setter(result.data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    }
    setLoadingDetails(prev => ({ ...prev, [key]: false }));
  };

  // Load detailed data when specific tabs are accessed
  useEffect(() => {
    if (activeTab === 'socialDetails' && !socialData) {
      fetchDetailedData('social-listening', setSocialData, 'social');
    } else if (activeTab === 'industry' && !industryData) {
      fetchDetailedData('industry-reports', setIndustryData, 'industry');
    } else if (activeTab === 'competitors' && !competitorData) {
      fetchDetailedData('competitor-intelligence', setCompetitorData, 'competitor');
    } else if (activeTab === 'audienceDemographics' && !audienceData) {
      fetchDetailedData('ga-audience-demographics', setAudienceData, 'audience');
    } else if (activeTab === 'contentPerformance' && !contentPerformance) {
      fetchDetailedData('ga-content-performance', setContentPerformance, 'content');
    }
  }, [activeTab, socialData, industryData, competitorData, audienceData, contentPerformance]);

  useEffect(() => {
    trackEvent({ category: 'Market Intelligence', action: 'view', label: 'MarketIntelligenceDashboard' });
  }, []);

  // Track tab changes
  useEffect(() => {
    trackEvent({ category: 'Market Intelligence', action: 'tab_change', label: activeTab });
  }, [activeTab]);

  if (loading) return <div className="p-8 text-gray-400">Loading market intelligence...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  const additionalTabs = [
    { key: 'trendExpansion', label: 'Trend Expansion' },
    { key: 'keywords', label: 'Keyword Insights' },
    { key: 'segments', label: 'Customer Segments' },
    { key: 'strategy', label: 'Competitive Strategy' },
    { key: 'industry', label: 'Industry Reports' },
    { key: 'socialDetails', label: 'Social Analytics' },
    { key: 'consumerBehavior', label: 'Consumer Behavior' },
    { key: 'audienceDemographics', label: 'Audience Demographics (GA4)' },
    { key: 'contentPerformance', label: 'Content Performance (GA4)' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-900 rounded-xl shadow-lg animate-fade-in">
      <AnalyticsPanel />
      <h2 className="text-2xl font-bold mb-6 text-gray-100 animate-pulse-slow">Market Intelligence</h2>
      <div className="flex gap-4 mb-6 flex-wrap">
        <button className={`px-4 py-2 rounded font-semibold transition-all duration-200 shadow-md ${activeTab === 'trends' ? 'bg-gray-700 text-white border border-gray-400 scale-105' : 'bg-gray-200 text-gray-800'}`} onClick={() => setActiveTab('trends')}>Trends</button>
        <button className={`px-4 py-2 rounded font-semibold transition-all duration-200 shadow-md ${activeTab === 'competitors' ? 'bg-gray-700 text-white border border-gray-400 scale-105' : 'bg-gray-200 text-gray-800'}`} onClick={() => setActiveTab('competitors')}>Competitors</button>
        <button className={`px-4 py-2 rounded font-semibold transition-all duration-200 shadow-md ${activeTab === 'sentiment' ? 'bg-gray-700 text-white border border-gray-400 scale-105' : 'bg-gray-200 text-gray-800'}`} onClick={() => setActiveTab('sentiment')}>Sentiment</button>
        <button className={`px-4 py-2 rounded font-semibold transition-all duration-200 shadow-md ${activeTab === 'recommendations' ? 'bg-gray-700 text-white border border-gray-400 scale-105' : 'bg-gray-200 text-gray-800'}`} onClick={() => setActiveTab('recommendations')}>Recommendations</button>
        <button className={`px-4 py-2 rounded font-semibold transition-all duration-200 shadow-md ${activeTab === 'sources' ? 'bg-gray-700 text-white border border-gray-400 scale-105' : 'bg-gray-200 text-gray-800'}`} onClick={() => setActiveTab('sources')}>Sources</button>
        {additionalTabs.map(tab => (
          <button key={tab.key} className={`px-4 py-2 rounded font-semibold transition-all duration-200 shadow-md ${activeTab === tab.key ? 'bg-gray-700 text-white border border-gray-400 scale-105' : 'bg-gray-200 text-gray-800'}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
        ))}
      </div>
      {/* Trends Tab with Enhanced Visualization */}
      {activeTab === 'trends' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Market Trends Analysis</h3>
          {data?.trends?.length ? (
            <>
              {/* Trends Growth Chart */}
              <div className="mb-6">
                <Line
                  data={{
                    labels: data.trends.map(t => t.name),
                    datasets: [{
                      label: 'Growth Rate',
                      data: data.trends.map(t => parseFloat(t.growth?.replace('%', '').replace('+', '') || 0)),
                      fill: true,
                      backgroundColor: 'rgba(156,163,175,0.2)',
                      borderColor: '#d1d5db',
                      pointBackgroundColor: '#fff',
                      tension: 0.4
                    }]
                  }}
                  options={{
                    plugins: { 
                      legend: { labels: { color: '#f3f4f6' } },
                      title: { display: true, text: 'Market Trend Growth Rates', color: '#f3f4f6' }
                    },
                    scales: { 
                      x: { ticks: { color: '#d1d5db' } }, 
                      y: { 
                        ticks: { color: '#d1d5db' },
                        title: { display: true, text: 'Growth %', color: '#d1d5db' }
                      } 
                    }
                  }}
                  className="animate-pulse-slow"
                />
              </div>
              
              {/* Detailed Trend Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.trends.map((trend, i) => (
                  <div key={i} className="bg-gray-700 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-base font-bold text-gray-100">{trend.name}</h4>
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                        {trend.growth}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {trend.region && (
                        <div className="flex items-center">
                          <span className="text-blue-400 font-semibold">Region:</span>
                          <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">{trend.region}</span>
                        </div>
                      )}
                      {trend.sentiment && (
                        <div className="flex items-center">
                          <span className="text-yellow-400 font-semibold">Sentiment:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            trend.sentiment === 'Positive' ? 'bg-green-600 text-white' :
                            trend.sentiment === 'Negative' ? 'bg-red-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {trend.sentiment}
                          </span>
                        </div>
                      )}
                      {trend.sources && (
                        <div>
                          <span className="text-purple-400 font-semibold">Data Sources:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {trend.sources.map((source, idx) => (
                              <span key={idx} className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div>No trends available.</div>}
        </div>
      )}
      {/* Competitors Tab with Enhanced Data */}
      {activeTab === 'competitors' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Competitor Intelligence</h3>
          {data?.competitors?.length ? (
            <>
              {/* Market Share Chart */}
              <div className="mb-6">
                <Bar
                  data={{
                    labels: data.competitors.map(c => c.name),
                    datasets: [{
                      label: 'Market Share (%)',
                      data: data.competitors.map(c => parseFloat(c.marketShare?.replace('%', '') || 0)),
                      backgroundColor: 'rgba(209,213,219,0.5)',
                      borderColor: '#d1d5db',
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    plugins: { legend: { labels: { color: '#f3f4f6' } } },
                    scales: { x: { ticks: { color: '#d1d5db' } }, y: { ticks: { color: '#d1d5db' } } }
                  }}
                  className="animate-bounce-slow"
                />
              </div>
              
              {/* Detailed Competitor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.competitors.map((competitor, i) => (
                  <div key={i} className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-base font-bold text-gray-100 mb-2">{competitor.name}</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Market Share:</span>
                        <span className="text-gray-100 font-semibold">{competitor.marketShare}</span>
                      </div>
                      {competitor.pricing && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Avg. Pricing:</span>
                          <span className="text-gray-100">₹{competitor.pricing}</span>
                        </div>
                      )}
                      {competitor.adSpend && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Ad Spend:</span>
                          <span className="text-gray-100">₹{competitor.adSpend.toLocaleString()}</span>
                        </div>
                      )}
                      {competitor.strengths && (
                        <div>
                          <span className="text-green-400 font-semibold">Strengths:</span>
                          <ul className="list-disc list-inside text-gray-300 ml-2">
                            {competitor.strengths.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {competitor.weaknesses && (
                        <div>
                          <span className="text-red-400 font-semibold">Weaknesses:</span>
                          <ul className="list-disc list-inside text-gray-300 ml-2">
                            {competitor.weaknesses.map((weakness, idx) => (
                              <li key={idx}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {competitor.topKeywords && (
                        <div>
                          <span className="text-blue-400 font-semibold">Top Keywords:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {competitor.topKeywords.map((keyword, idx) => (
                              <span key={idx} className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div>No competitor data available.</div>}
        </div>
      )}
      {/* Sentiment Tab with Pie Chart */}
      {activeTab === 'sentiment' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Sentiment Analysis</h3>
          {data?.sentiment ? (
            <>
              <Pie
                data={{
                  labels: ['Positive', 'Neutral', 'Negative'],
                  datasets: [{
                    data: [data.sentiment.positive, data.sentiment.neutral, data.sentiment.negative],
                    backgroundColor: ['#a3e635', '#d1d5db', '#f87171'],
                    borderColor: ['#a3e635', '#d1d5db', '#f87171'],
                  }]
                }}
                options={{
                  plugins: { legend: { labels: { color: '#f3f4f6' } } }
                }}
                className="mb-6 animate-pulse-slow"
              />
              <ul className="list-disc ml-6 text-gray-300">
                <li>Positive: <span className="text-green-400 font-bold">{data.sentiment.positive}%</span></li>
                <li>Neutral: <span className="text-gray-400 font-bold">{data.sentiment.neutral}%</span></li>
                <li>Negative: <span className="text-red-400 font-bold">{data.sentiment.negative}%</span></li>
              </ul>
            </>
          ) : <div>No sentiment data available.</div>}
        </div>
      )}
      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Actionable Recommendations</h3>
          <ul className="list-disc ml-6 text-gray-300">
            {data?.recommendations?.length ? data.recommendations.map((r, i) => (
              <li key={i}>{typeof r === 'string' ? r : r.action || r.suggestion}</li>
            )) : <li>No recommendations available.</li>}
          </ul>
        </div>
      )}
      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Data Sources</h3>
          <ul className="list-disc ml-6 text-gray-300">
            {data?.sources?.length ? data.sources.map((s, i) => (
              <li key={i}>{s}</li>
            )) : <li>No sources listed.</li>}
          </ul>
        </div>
      )}
      {/* Additional Tabs */}
      {activeTab === 'keywords' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Keyword Insights & Search Trends</h3>
          {data?.keywords?.length ? (
            <>
              {/* Search Volume Chart */}
              <div className="mb-6">
                <Bar
                  data={{
                    labels: data.keywords.map(k => k.keyword),
                    datasets: [{
                      label: 'Search Volume',
                      data: data.keywords.map(k => k.volume),
                      backgroundColor: 'rgba(34, 197, 94, 0.5)',
                      borderColor: '#22c55e',
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    plugins: { 
                      legend: { labels: { color: '#f3f4f6' } },
                      title: { display: true, text: 'Monthly Search Volume', color: '#f3f4f6' }
                    },
                    scales: { 
                      x: { ticks: { color: '#d1d5db' } }, 
                      y: { 
                        ticks: { color: '#d1d5db' },
                        title: { display: true, text: 'Search Volume', color: '#d1d5db' }
                      } 
                    }
                  }}
                  className="animate-bounce-slow"
                />
              </div>
              
              {/* Detailed Keyword Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.keywords.map((keyword, i) => (
                  <div key={i} className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-base font-bold text-gray-100 mb-2">{keyword.keyword}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Monthly Volume:</span>
                        <span className="text-green-400 font-bold">{keyword.volume?.toLocaleString()}</span>
                      </div>
                      {keyword.competition && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Competition:</span>
                          <span className={`font-bold ${
                            keyword.competition === 'High' ? 'text-red-400' :
                            keyword.competition === 'Medium' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {keyword.competition}
                          </span>
                        </div>
                      )}
                      {keyword.trend && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Trend:</span>
                          <span className={`font-bold ${
                            keyword.trend.startsWith('+') ? 'text-green-400' : 
                            keyword.trend.startsWith('-') ? 'text-red-400' : 
                            'text-gray-400'
                          }`}>
                            {keyword.trend}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div>No keyword insights available.</div>}
        </div>
      )}
      {activeTab === 'segments' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Customer Segments</h3>
          {data?.segments?.length ? (
            <ul className="list-disc ml-6 text-gray-300">
              {data.segments.map((s, i) => (
                <li key={i}><span className="font-bold text-gray-100">{s.segment}</span>: {s.description}</li>
              ))}
            </ul>
          ) : <div>No customer segments available.</div>}
        </div>
      )}
      {activeTab === 'strategy' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Competitive Strategy</h3>
          {data?.strategy?.length ? (
            <ul className="list-disc ml-6 text-gray-300">
              {data.strategy.map((s, i) => (
                <li key={i}><span className="font-bold text-gray-100">{s.title}</span>: {s.detail}</li>
              ))}
            </ul>
          ) : <div>No strategy data available.</div>}
        </div>
      )}
      {/* Trend Expansion Tab */}
      {activeTab === 'trendExpansion' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Trend Expansion (AI-powered)</h3>
          {trendLoading ? (
            <div className="text-gray-400">Loading trend forecast...</div>
          ) : trendError ? (
            <div className="text-red-400">{trendError}</div>
          ) : trendForecast && Array.isArray(trendForecast) && trendForecast.length > 0 ? (
            <table className="min-w-full text-xs mb-4">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 text-gray-200">Trend</th>
                  <th className="p-2 text-gray-200">Current</th>
                  <th className="p-2 text-gray-200">Forecast</th>
                  <th className="p-2 text-gray-200">Anomaly</th>
                  <th className="p-2 text-gray-200">AI Insight</th>
                </tr>
              </thead>
              <tbody>
                {trendForecast.map((trend, i) => (
                  <tr key={trend.name} className="border-b border-gray-700">
                    <td className="p-2 text-gray-100 font-semibold">{trend.name}</td>
                    <td className="p-2 text-gray-100">{trend.current}</td>
                    <td className="p-2 text-gray-100">{trend.forecast}</td>
                    <td className="p-2 text-gray-100">{trend.anomaly ? <span className="text-red-400 font-bold">Yes{trend.reason ? `: ${trend.reason}` : ''}</span> : <span className="text-green-400">No</span>}</td>
                    <td className="p-2 text-gray-100">
                      <button
                        className="bg-gray-700 text-gray-100 px-3 py-1 rounded hover:bg-gray-600 text-xs mr-2"
                        onClick={() => handleExpandInsight(trend.name)}
                        disabled={expanding[trend.name]}
                        title="Get AI-powered expanded insight"
                      >
                        {expanding[trend.name] ? 'Loading...' : 'Expand Insight'}
                      </button>
                      {expandedInsights[trend.name] && (
                        <div className="mt-2 text-gray-300 bg-gray-900 p-2 rounded shadow text-xs max-w-xs">{expandedInsights[trend.name]}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-400">No trend forecast data available.</div>
          )}
        </div>
      )}
      
      {/* Industry Reports Tab */}
      {activeTab === 'industry' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Industry Reports & Analysis</h3>
          {loadingDetails.industry ? (
            <div className="text-gray-400">Loading industry reports...</div>
          ) : industryData?.reports?.length ? (
            <div className="space-y-4">
              {industryData.reports.map((report, i) => (
                <div key={i} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-base font-bold text-gray-100">{report.title}</h4>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{report.category}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{report.summary}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-blue-400 font-semibold">Market Size:</span>
                      <span className="text-gray-200 ml-2">{report.marketSize}</span>
                    </div>
                    <div>
                      <span className="text-green-400 font-semibold">Growth Rate:</span>
                      <span className="text-gray-200 ml-2">{report.growthRate}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-yellow-400 font-semibold">Key Findings:</span>
                    <ul className="list-disc list-inside text-gray-300 ml-2 mt-1">
                      {report.keyFindings?.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                    <span>Source: {report.source}</span>
                    <span>Published: {new Date(report.publishDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {industryData.summary && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-base font-bold text-gray-100 mb-2">Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{industryData.summary.totalReports}</div>
                      <div className="text-gray-300">Reports</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">{industryData.summary.avgGrowthRate}</div>
                      <div className="text-gray-300">Avg Growth</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">Latest</div>
                      <div className="text-gray-300">Updated</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">No industry reports available.</div>
          )}
        </div>
      )}
      
      {/* Social Analytics Tab */}
      {activeTab === 'socialDetails' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Social Media Analytics</h3>
          {loadingDetails.social ? (
            <div className="text-gray-400">Loading social analytics...</div>
          ) : socialData ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              {socialData.summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{socialData.summary.totalMentions}</div>
                    <div className="text-gray-300">Total Mentions</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">{socialData.summary.platforms?.length || 0}</div>
                    <div className="text-gray-300">Platforms</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">{socialData.summary.timeRange}</div>
                    <div className="text-gray-300">Time Range</div>
                  </div>
                </div>
              )}
              
              {/* Top Hashtags */}
              {socialData.topHashtags?.length && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-base font-bold text-gray-100 mb-3">Top Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {socialData.topHashtags.map((hashtag, i) => (
                      <span key={i} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                        {hashtag.tag} ({hashtag.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recent Mentions */}
              {socialData.mentions?.length && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-base font-bold text-gray-100 mb-3">Recent Mentions</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {socialData.mentions.slice(0, 10).map((mention, i) => (
                      <div key={i} className="bg-gray-600 p-3 rounded border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-gray-500 text-gray-200 px-2 py-1 rounded text-xs">{mention.platform}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            mention.sentiment === 'positive' ? 'bg-green-600 text-white' :
                            mention.sentiment === 'negative' ? 'bg-red-600 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {mention.sentiment}
                          </span>
                        </div>
                        <p className="text-gray-200 text-xs mb-2">{mention.text}</p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>Engagement: {mention.engagement} | Reach: {mention.reach}</span>
                          <span>{new Date(mention.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">No social analytics data available.</div>
          )}
        </div>
      )}
      
      {/* Consumer Behavior Tab */}
      {activeTab === 'consumerBehavior' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Consumer Behavior Analysis</h3>
          {data?.consumerBehavior ? (
            <div className="space-y-6">
              {/* Demographics */}
              {data.consumerBehavior.demographics && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-base font-bold text-gray-100 mb-3">Demographics</h4>
                  <Bar
                    data={{
                      labels: data.consumerBehavior.demographics.map(d => d.group),
                      datasets: [{
                        label: 'Market Share (%)',
                        data: data.consumerBehavior.demographics.map(d => parseFloat(d.share.replace('%', ''))),
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: '#3b82f6',
                        borderWidth: 1
                      }]
                    }}
                    options={{
                      plugins: { legend: { labels: { color: '#f3f4f6' } } },
                      scales: { x: { ticks: { color: '#d1d5db' } }, y: { ticks: { color: '#d1d5db' } } }
                    }}
                    className="mb-4"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {data.consumerBehavior.demographics.map((demo, i) => (
                      <div key={i} className="text-center">
                        <div className="text-gray-200 font-semibold">{demo.group}</div>
                        <div className="text-gray-400">{demo.share} ({demo.growth})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Channels */}
              {data.consumerBehavior.channels && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-base font-bold text-gray-100 mb-3">Shopping Channels</h4>
                  <Pie
                    data={{
                      labels: data.consumerBehavior.channels.map(c => c.channel),
                      datasets: [{
                        data: data.consumerBehavior.channels.map(c => parseFloat(c.share.replace('%', ''))),
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                        borderColor: ['#3b82f6', '#10b981', '#f59e0b'],
                      }]
                    }}
                    options={{
                      plugins: { legend: { labels: { color: '#f3f4f6' } } }
                    }}
                    className="mb-4"
                  />
                </div>
              )}
              
              {/* Preferences */}
              {data.consumerBehavior.preferences && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-base font-bold text-gray-100 mb-3">Consumer Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.consumerBehavior.preferences.map((pref, i) => (
                      <span key={i} className="bg-green-600 text-white px-3 py-2 rounded-lg">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">No consumer behavior data available.</div>
          )}
        </div>
      )}

      {/* GA4 Audience Demographics Tab */}
      {activeTab === 'audienceDemographics' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">
            Audience Demographics (Google Analytics 4)
          </h3>
          {loadingDetails.audience ? (
            <div className="text-gray-400">Loading audience demographics...</div>
          ) : audienceData ? (
            <div className="space-y-6">
              {/* Age Groups */}
              {audienceData.ageGroups && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-base font-bold text-gray-100 mb-3">Age Distribution</h4>
                  <Bar
                    data={{
                      labels: audienceData.ageGroups.map(d => d.age),
                      datasets: [{
                        label: 'Users',
                        data: audienceData.ageGroups.map(d => d.users),
                        backgroundColor: 'rgba(96, 165, 250, 0.5)',
                        borderColor: '#60a5fa',
                        borderWidth: 1
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: { 
                        legend: { labels: { color: '#f3f4f6' } },
                        title: { display: true, text: 'User Age Distribution', color: '#f8fafc' }
                      },
                      scales: { 
                        x: { ticks: { color: '#d1d5db' } }, 
                        y: { ticks: { color: '#d1d5db' } } 
                      }
                    }}
                  />
                </div>
              )}

              {/* Gender Distribution */}
              {audienceData.genderData && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-100 mb-3">Gender Distribution</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Pie
                      data={{
                        labels: audienceData.genderData.map(d => d.gender),
                        datasets: [{
                          data: audienceData.genderData.map(d => d.users),
                          backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
                          borderColor: ['#3b82f6', '#8b5cf6', '#10b981'],
                        }]
                      }}
                      options={{
                        plugins: { 
                          legend: { labels: { color: '#f3f4f6' } },
                          title: { display: true, text: 'Gender Split', color: '#f8fafc' }
                        }
                      }}
                    />
                    <div className="space-y-2">
                      {audienceData.genderData.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-gray-200 capitalize">{item.gender}</span>
                          <span className="text-gray-400">{item.users.toLocaleString()} users</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Geographic Distribution */}
              {audienceData.countries && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-100 mb-3">Top Countries</h4>
                  <div className="space-y-2">
                    {audienceData.countries.slice(0, 10).map((country, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-600">
                        <span className="text-gray-200">{country.country}</span>
                        <span className="text-gray-400">{country.users.toLocaleString()} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Device Distribution */}
              {audienceData.devices && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-100 mb-3">Device Categories</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Doughnut
                      data={{
                        labels: audienceData.devices.map(d => d.device),
                        datasets: [{
                          data: audienceData.devices.map(d => d.users),
                          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                          borderColor: ['#10b981', '#f59e0b', '#ef4444'],
                        }]
                      }}
                      options={{
                        plugins: { 
                          legend: { labels: { color: '#f3f4f6' } },
                          title: { display: true, text: 'Device Usage', color: '#f8fafc' }
                        }
                      }}
                    />
                    <div className="space-y-2">
                      {audienceData.devices.map((device, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-gray-200 capitalize">{device.device}</span>
                          <span className="text-gray-400">{device.users.toLocaleString()} users</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">No audience demographics data available.</div>
          )}
        </div>
      )}

      {/* GA4 Content Performance Tab */}
      {activeTab === 'contentPerformance' && (
        <div className="bg-gray-800 p-6 rounded mb-4 animate-fade-in">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">
            Content Performance (Google Analytics 4)
          </h3>
          {loadingDetails.content ? (
            <div className="text-gray-400">Loading content performance...</div>
          ) : contentPerformance ? (
            <div className="space-y-6">
              {/* Top Performing Content */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold text-gray-100 mb-3">Top Performing Pages</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 text-gray-200">Page</th>
                        <th className="text-right py-2 text-gray-200">Page Views</th>
                        <th className="text-right py-2 text-gray-200">Avg. Duration (s)</th>
                        <th className="text-right py-2 text-gray-200">Engagement Rate</th>
                        <th className="text-right py-2 text-gray-200">Bounce Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contentPerformance.slice(0, 10).map((content, i) => (
                        <tr key={i} className="border-b border-gray-700">
                          <td className="py-2 text-gray-300">
                            <div className="max-w-xs truncate">{content.title || content.path}</div>
                            <div className="text-xs text-gray-500">{content.path}</div>
                          </td>
                          <td className="text-right py-2 text-gray-400">{content.pageViews.toLocaleString()}</td>
                          <td className="text-right py-2 text-gray-400">{Math.round(content.avgSessionDuration)}</td>
                          <td className="text-right py-2 text-gray-400">{(content.engagementRate * 100).toFixed(1)}%</td>
                          <td className="text-right py-2 text-gray-400">{(content.bounceRate * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Content Performance Chart */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold text-gray-100 mb-3">Content Engagement Overview</h4>
                <Bar
                  data={{
                    labels: contentPerformance.slice(0, 8).map(c => c.path.split('/').pop() || 'Home'),
                    datasets: [
                      {
                        label: 'Page Views',
                        data: contentPerformance.slice(0, 8).map(c => c.pageViews),
                        backgroundColor: 'rgba(96, 165, 250, 0.5)',
                        borderColor: '#60a5fa',
                        borderWidth: 1,
                        yAxisID: 'y'
                      },
                      {
                        label: 'Engagement Rate (%)',
                        data: contentPerformance.slice(0, 8).map(c => c.engagementRate * 100),
                        backgroundColor: 'rgba(16, 185, 129, 0.5)',
                        borderColor: '#10b981',
                        borderWidth: 1,
                        yAxisID: 'y1'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: { 
                      legend: { labels: { color: '#f3f4f6' } },
                      title: { display: true, text: 'Content Performance Metrics', color: '#f8fafc' }
                    },
                    scales: { 
                      x: { ticks: { color: '#d1d5db' } },
                      y: { 
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: { color: '#d1d5db' }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: { color: '#d1d5db' },
                        grid: { drawOnChartArea: false }
                      }
                    }
                  }}
                />
              </div>

              {/* Content Insights */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold text-gray-100 mb-3">Content Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-600 p-3 rounded">
                    <div className="text-gray-400 text-xs">Best Performing Content</div>
                    <div className="text-gray-200 font-semibold">
                      {contentPerformance[0]?.title || contentPerformance[0]?.path || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {contentPerformance[0]?.pageViews?.toLocaleString()} views
                    </div>
                  </div>
                  <div className="bg-gray-600 p-3 rounded">
                    <div className="text-gray-400 text-xs">Highest Engagement</div>
                    <div className="text-gray-200 font-semibold">
                      {contentPerformance.reduce((best, current) => 
                        current.engagementRate > best.engagementRate ? current : best, contentPerformance[0] || {})?.title || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((contentPerformance.reduce((best, current) => 
                        current.engagementRate > best.engagementRate ? current : best, contentPerformance[0] || {})?.engagementRate || 0) * 100).toFixed(1)}% engagement
                    </div>
                  </div>
                  <div className="bg-gray-600 p-3 rounded">
                    <div className="text-gray-400 text-xs">Longest Session</div>
                    <div className="text-gray-200 font-semibold">
                      {contentPerformance.reduce((best, current) => 
                        current.avgSessionDuration > best.avgSessionDuration ? current : best, contentPerformance[0] || {})?.title || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(contentPerformance.reduce((best, current) => 
                        current.avgSessionDuration > best.avgSessionDuration ? current : best, contentPerformance[0] || {})?.avgSessionDuration || 0)}s avg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">No content performance data available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketIntelligenceDashboard;
