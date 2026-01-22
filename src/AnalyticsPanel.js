import React, { useEffect, useState } from 'react';
import { 
  fetchGATraffic, 
  fetchGAAudienceDemographics, 
  fetchGACampaignPerformance, 
  fetchGAContentPerformance,
  fetchAnalyticsMock,
  safeApiCall 
} from './api';

const GA_ID = 'G-KDC8ZMMCJN';

export default function AnalyticsPanel() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('fidga_ga_enabled') !== 'false');
  const [gaData, setGaData] = useState(null);
  const [audienceData, setAudienceData] = useState(null);
  const [campaignData, setCampaignData] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('traffic');

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

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    
    // Load all analytics data
    Promise.all([
      safeApiCall(fetchGATraffic),
      safeApiCall(fetchGAAudienceDemographics),
      safeApiCall(fetchGACampaignPerformance),
      safeApiCall(fetchGAContentPerformance)
    ]).then(([traffic, audience, campaigns, content]) => {
      if (traffic.success && traffic.data) setGaData(traffic.data);
      if (audience.success && audience.data) setAudienceData(audience.data);
      if (campaigns.success && campaigns.data) setCampaignData(campaigns.data);
      if (content.success && content.data) setContentData(content.data);
      
      if (!traffic.success && !audience.success && !campaigns.success && !content.success) {
        setError('Failed to load analytics data.');
      }
      setLoading(false);
    }).catch(() => {
      setError('Failed to load analytics data.');
      setLoading(false);
    });
  }, [enabled]);

  const renderTabContent = () => {
    if (loading) return <div className="text-gray-400">Loading analytics...</div>;
    if (error) return <div className="text-red-400">{error}</div>;
    
    switch (activeTab) {
      case 'traffic':
        return gaData ? (
          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-200 mb-2">Traffic Overview (Last 7 Days)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-xl font-bold text-blue-400">{gaData.totalUsers}</div>
                  <div className="text-sm text-gray-300">Total Users</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-xl font-bold text-green-400">{gaData.newUsers}</div>
                  <div className="text-sm text-gray-300">New Users</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-xl font-bold text-purple-400">{gaData.sessions}</div>
                  <div className="text-sm text-gray-300">Sessions</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-xl font-bold text-yellow-400">{gaData.avgSessionDuration}s</div>
                  <div className="text-sm text-gray-300">Avg. Duration</div>
                </div>
              </div>
              {gaData.topPages && (
                <div>
                  <h5 className="font-medium text-gray-300 mb-2">Top Pages</h5>
                  <div className="space-y-1">
                    {gaData.topPages.map((p, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-300">{p.path}</span>
                        <span className="text-gray-400">{p.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : <div className="text-gray-400">No traffic data available</div>;
        
      case 'audience':
        return audienceData ? (
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Audience Demographics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {audienceData.demographics && (
                <div>
                  <h5 className="font-medium text-gray-300 mb-2">Age Groups</h5>
                  <div className="space-y-2">
                    {audienceData.demographics.age?.map((age, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-300">{age.range}</span>
                        <span className="text-gray-400">{age.users} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {audienceData.locations && (
                <div>
                  <h5 className="font-medium text-gray-300 mb-2">Top Locations</h5>
                  <div className="space-y-2">
                    {audienceData.locations.map((loc, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-300">{loc.country}</span>
                        <span className="text-gray-400">{loc.users} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : <div className="text-gray-400">No audience data available</div>;
        
      case 'campaigns':
        return campaignData ? (
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Campaign Performance</h4>
            <div className="space-y-4">
              {campaignData.campaigns?.map((campaign, i) => (
                <div key={i} className="bg-gray-700 p-4 rounded">
                  <h5 className="font-medium text-gray-200 mb-2">{campaign.name}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Clicks: </span>
                      <span className="text-gray-200">{campaign.clicks}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Impressions: </span>
                      <span className="text-gray-200">{campaign.impressions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">CTR: </span>
                      <span className="text-gray-200">{campaign.ctr}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cost: </span>
                      <span className="text-gray-200">${campaign.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="text-gray-400">No campaign data available</div>;
        
      case 'content':
        return contentData ? (
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Content Performance</h4>
            <div className="space-y-3">
              {contentData.pages?.map((page, i) => (
                <div key={i} className="bg-gray-700 p-3 rounded">
                  <div className="font-medium text-gray-200 mb-1">{page.title}</div>
                  <div className="text-sm text-gray-400 mb-2">{page.path}</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Views: </span>
                      <span className="text-gray-200">{page.views}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Bounce Rate: </span>
                      <span className="text-gray-200">{page.bounceRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Avg. Time: </span>
                      <span className="text-gray-200">{page.avgTime}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="text-gray-400">No content data available</div>;
        
      default:
        return <div className="text-gray-400">Select a tab to view analytics</div>;
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
      <div className="flex items-center gap-4 mb-4">
        <span className="font-semibold text-gray-200">Google Analytics Dashboard</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
          className="w-5 h-5 accent-blue-500"
        />
        <span className="text-gray-400 text-sm">{enabled ? 'Enabled' : 'Disabled'}</span>
      </div>
      
      {enabled ? (
        <div>
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-4 bg-gray-700 p-1 rounded">
            {[
              { id: 'traffic', label: 'Traffic' },
              { id: 'audience', label: 'Audience' },
              { id: 'campaigns', label: 'Campaigns' },
              { id: 'content', label: 'Content' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="min-h-[200px]">
            {renderTabContent()}
          </div>
        </div>
      ) : (
        <div className="text-gray-300 text-sm">
          Analytics tracking is disabled. Enable to view dashboard data.
        </div>
      )}
    </div>
  );
}
