import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  createCampaign,
  listCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  automateCampaign,
  automateCampaignStatus,
  fetchGACampaignPerformance,
  generateCampaignBrief,
  getLLMSegments,
  getLLMABTests,
  getLLMBudget,
  getLLMCampaignSummary,
  safeApiCall
} from './api';

const CampaignManagementModule = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    budget: '',
    startDate: '',
    endDate: '',
    status: 'Draft',
  });
  const [createMsg, setCreateMsg] = useState('');

  // Automated Campaign Creation (LLM)
  const [autoGoal, setAutoGoal] = useState('');
  const [autoAudience, setAutoAudience] = useState('');
  const [autoBudget, setAutoBudget] = useState('');
  const [autoImage, setAutoImage] = useState(null);
  const [autoImagePreview, setAutoImagePreview] = useState('');
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoResult, setAutoResult] = useState(null);
  const [autoError, setAutoError] = useState('');

  // Campaign status automation
  const [autoStatusMsg, setAutoStatusMsg] = useState('');

  // Calendar and Preview state
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [gaPerformanceData, setGaPerformanceData] = useState(null);
  const [gaPerformanceLoading, setGaPerformanceLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchGAPerformanceData();
  }, []); 

  useEffect(() => {
    // Update calendar events when campaigns change
    const events = campaigns.map(campaign => ({
      id: campaign._id || campaign.id,
      title: campaign.name,
      start: campaign.startDate,
      end: campaign.endDate,
      backgroundColor: campaign.status === 'Active' ? '#10b981' : 
                     campaign.status === 'Paused' ? '#f59e0b' : 
                     campaign.status === 'Completed' ? '#6b7280' : '#3b82f6',
      extendedProps: {
        budget: campaign.budget,
        status: campaign.status,
        description: campaign.description
      }
    }));
    setCalendarEvents(events);
  }, [campaigns]);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    
    const result = await safeApiCall(listCampaigns);
    if (result.success && result.data && Array.isArray(result.data.campaigns)) {
      setCampaigns(result.data.campaigns);
    } else {
      setError(result.error || 'Failed to load campaigns.');
    }
    setLoading(false);
  };

  const fetchGAPerformanceData = async () => {
    setGaPerformanceLoading(true);
    
    const result = await safeApiCall(fetchGACampaignPerformance);
    if (result.success && result.data) {
      setGaPerformanceData(result.data);
    }
    setGaPerformanceLoading(false);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCreateMsg('');
    
    const result = await safeApiCall(createCampaign, newCampaign);
    if (result.success) {
      setCreateMsg('Campaign created successfully!');
      setShowCreate(false);
      setNewCampaign({ name: '', budget: '', startDate: '', endDate: '', status: 'Draft' });
      fetchCampaigns();
    } else {
      setCreateMsg(result.error || 'Failed to create campaign.');
    }
  };

  // Handle image upload
  const handleAutoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAutoImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setAutoImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAutoImage(null);
      setAutoImagePreview('');
    }
  };

  // Automated Campaign Creation handler (with image)
  const handleAutoCampaign = async (e) => {
    e.preventDefault();
    setAutoLoading(true);
    setAutoError('');
    setAutoResult(null);
    try {
      let imageData = null;
      let mimeType = null;
      
      if (autoImage) {
        const base64 = autoImagePreview.split(',')[1];
        imageData = base64;
        mimeType = autoImage.type;
      }

      const result = await safeApiCall(automateCampaign, {
        goal: autoGoal,
        audience: autoAudience,
        budget: autoBudget,
        imageData,
        mimeType
      });

      if (result.success && result.data) {
        setAutoResult(result.data);
      } else {
        setAutoError(result.error || 'Failed to generate campaign.');
      }
    } catch (err) {
      setAutoError(err.message || 'Failed to generate campaign.');
    }
    setAutoLoading(false);
  };

  const handleAddAutoCampaign = async () => {
    if (!autoResult) return;
    setCreateMsg('');
    setLoading(true);
    try {
      const result = await safeApiCall(() => 
        createCampaign({
          name: autoResult.name,
          budget: autoResult.budget,
          startDate: autoResult.startDate,
          endDate: autoResult.endDate,
          status: 'Draft',
          description: autoResult.text,
          image: autoResult.image
        })
      );
      if (result.success) {
        setCreateMsg('Automated campaign added!');
        fetchCampaigns();
        setAutoResult(null);
        setAutoGoal('');
        setAutoAudience('');
        setAutoBudget('');
      } else {
        setCreateMsg('Failed to add campaign.');
      }
    } catch {
      setCreateMsg('Failed to add campaign.');
    }
    setLoading(false);
  };

  // Calendar event click handler
  const handleEventClick = (clickInfo) => {
    const campaign = campaigns.find(c => (c._id || c.id) === clickInfo.event.id);
    if (campaign) {
      setSelectedCampaign(campaign);
      setShowPreview(true);
    }
  };

  // Calendar date select handler for new campaigns
  const handleDateSelect = (selectInfo) => {
    const start = selectInfo.start.toISOString().split('T')[0];
    const end = selectInfo.end ? selectInfo.end.toISOString().split('T')[0] : start;
    setNewCampaign(prev => ({
      ...prev,
      startDate: start,
      endDate: end
    }));
    setShowCreate(true);
    setShowCalendar(false);
  };

  const handleAutomateStatus = async () => {
    setAutoStatusMsg('');
    try {
      const result = await safeApiCall(automateCampaignStatus);
      if (result.success) {
        setAutoStatusMsg('Campaign statuses updated!');
        fetchCampaigns();
      } else {
        setAutoStatusMsg('Failed to update campaign statuses.');
      }
    } catch {
      setAutoStatusMsg('Failed to update campaign statuses.');
    }
  };

  return (
    <div className="bg-black p-8 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-200">Campaign Management</h3>
      {/* Automated Campaign Creation Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 mb-8">
        <h4 className="text-xl font-semibold mb-4 text-gray-100">Automated Campaign Creation (AI)</h4>
        <form onSubmit={handleAutoCampaign} className="flex flex-wrap gap-4 mb-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-semibold">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAutoImageChange}
              className="p-2 rounded bg-gray-700 text-gray-100"
            />
            {autoImagePreview && (
              <img src={autoImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2 border border-gray-600" />
            )}
          </div>
          <input
            type="text"
            placeholder="Campaign Goal (e.g. Launch new product)"
            value={autoGoal}
            onChange={e => setAutoGoal(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Target Audience (e.g. Young adults, India)"
            value={autoAudience}
            onChange={e => setAutoAudience(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            required
          />
          <input
            type="number"
            placeholder="Budget (₹)"
            value={autoBudget}
            onChange={e => setAutoBudget(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-gray-100 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-200"
            disabled={autoLoading}
          >
            {autoLoading ? 'Generating...' : 'Generate Campaign'}
          </button>
        </form>
        {autoError && <div className="text-red-400 mb-2">{autoError}</div>}
        {autoResult && (
          <div className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-6 items-center">
            {autoResult.image && (
              <img src={autoResult.image} alt="Generated" className="w-40 h-40 object-cover rounded mb-4 md:mb-0" />
            )}
            <div className="flex-1">
              <h5 className="text-lg font-bold text-gray-100 mb-2">{autoResult.name || 'AI Campaign'}</h5>
              <div className="text-gray-300 mb-2">{autoResult.text || autoResult.descriptions || 'No description generated.'}</div>
              <div className="text-gray-400 text-sm mb-2">Budget: ₹{autoResult.budget} | Audience: {autoResult.audience}</div>
              <button
                className="bg-gray-100 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gray-200 mt-2"
                onClick={handleAddAutoCampaign}
              >
                Add to Campaigns
              </button>
            </div>
          </div>
        )}
        {createMsg && <div className="mt-2 text-green-400">{createMsg}</div>}
      </div>

      {/* Calendar Scheduling Card */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl font-semibold text-gray-100">Campaign Calendar</h4>
          <button
            className="bg-blue-100 text-blue-900 px-4 py-2 rounded font-semibold hover:bg-blue-200"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>
        {showCalendar && (
          <div className="bg-white rounded-lg p-4" style={{
            '--fc-border-color': '#e5e7eb',
            '--fc-button-bg-color': '#3b82f6',
            '--fc-button-border-color': '#3b82f6',
            '--fc-button-hover-bg-color': '#2563eb',
            '--fc-button-active-bg-color': '#1d4ed8'
          }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              events={calendarEvents}
              eventClick={handleEventClick}
              select={handleDateSelect}
              height="auto"
              eventDisplay="block"
              eventTextColor="#ffffff"
            />
          </div>
        )}
        <div className="text-gray-300 text-sm mt-4">
          Click on events to preview campaigns, or drag to select dates for new campaigns.
        </div>
      </div>

      {/* Campaign Preview Card */}
      {selectedCampaign && showPreview && (
        <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-2xl font-semibold text-gray-100">Campaign Preview</h4>
            <button
              className="bg-purple-100 text-purple-900 px-4 py-2 rounded font-semibold hover:bg-purple-200"
              onClick={() => setShowPreview(false)}
            >
              Close Preview
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {selectedCampaign.image && (
                <div className="flex-shrink-0">
                  <img 
                    src={selectedCampaign.image} 
                    alt={selectedCampaign.name}
                    className="w-48 h-48 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}
              <div className="flex-1">
                <h5 className="text-2xl font-bold text-gray-100 mb-3">{selectedCampaign.name}</h5>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">Status:</span>
                    <div className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedCampaign.status === 'Active' ? 'bg-green-600 text-white' :
                      selectedCampaign.status === 'Paused' ? 'bg-yellow-600 text-white' :
                      selectedCampaign.status === 'Completed' ? 'bg-gray-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {selectedCampaign.status}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Budget:</span>
                    <span className="text-gray-100 ml-2 font-semibold">₹{selectedCampaign.budget}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Start Date:</span>
                    <span className="text-gray-100 ml-2">{selectedCampaign.startDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">End Date:</span>
                    <span className="text-gray-100 ml-2">{selectedCampaign.endDate}</span>
                  </div>
                </div>
                {selectedCampaign.description && (
                  <div className="mb-4">
                    <span className="text-gray-400 text-sm">Description:</span>
                    <p className="text-gray-300 mt-1">{selectedCampaign.description}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button className="bg-purple-100 text-purple-900 px-4 py-2 rounded font-semibold hover:bg-purple-200">
                    Edit Campaign
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700">
                    View Analytics
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700">
                    Delete Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <span className="text-gray-300">Manage all your marketing campaigns, view analytics, and create new campaigns.</span>
        <div className="flex gap-2">
          <button
            className="bg-gray-100 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gray-200"
            onClick={() => setShowCreate(v => !v)}
          >
            {showCreate ? 'Cancel' : 'Create Campaign'}
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
            onClick={handleAutomateStatus}
            title="Update campaign statuses based on schedule"
          >
            Automate Status
          </button>
        </div>
      </div>
      {autoStatusMsg && <div className="mb-4 text-green-400">{autoStatusMsg}</div>}
      {showCreate && (
        <form onSubmit={handleCreateCampaign} className="bg-gray-800 p-6 rounded-lg mb-6 shadow-md space-y-4">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              name="name"
              value={newCampaign.name}
              onChange={handleInputChange}
              placeholder="Campaign Name"
              className="flex-1 p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
              required
            />
            <input
              type="number"
              name="budget"
              value={newCampaign.budget}
              onChange={handleInputChange}
              placeholder="Budget (₹)"
              className="flex-1 p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
              required
            />
            <input
              type="date"
              name="startDate"
              value={newCampaign.startDate}
              onChange={handleInputChange}
              className="flex-1 p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
              required
            />
            <input
              type="date"
              name="endDate"
              value={newCampaign.endDate}
              onChange={handleInputChange}
              className="flex-1 p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
              required
            />
            <select
              name="status"
              value={newCampaign.status}
              onChange={handleInputChange}
              className="flex-1 p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-gray-100 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-200"
          >
            Create
          </button>
          {createMsg && <div className="mt-2 text-green-400">{createMsg}</div>}
        </form>
      )}
      {loading && <div className="text-gray-400">Loading campaigns...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(c => (
          <div key={c._id || c.id} className="bg-gray-700 p-6 rounded-lg shadow-md mb-4">
            <h4 className="text-xl font-semibold mb-2 text-gray-200">{c.name}</h4>
            <div className="text-gray-300 text-sm mb-2">Status: {c.status}</div>
            <div className="text-gray-400 text-xs mb-2">Start: {c.startDate} | End: {c.endDate}</div>
            <div className="text-gray-200 text-sm">Budget: ₹{c.budget}</div>
            {c.description && <div className="text-gray-400 text-xs mt-2">{c.description}</div>}
            {c.image && <img src={c.image} alt="Campaign" className="w-32 h-32 object-cover rounded mt-2" />}
          </div>
        ))}
      </div>
      {campaigns.length === 0 && !loading && !error && (
        <div className="text-gray-400">No campaigns found.</div>
      )}

      {/* GA4 Campaign Performance Section */}
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl shadow-lg p-6 mt-8">
        <h4 className="text-2xl font-semibold text-gray-100 mb-4">Campaign Performance Analytics (GA4)</h4>
        {gaPerformanceLoading ? (
          <div className="text-gray-400">Loading campaign performance data...</div>
        ) : gaPerformanceData && gaPerformanceData.length > 0 ? (
          <div className="space-y-6">
            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Total Campaign Sessions</div>
                <div className="text-2xl font-bold text-gray-100">
                  {gaPerformanceData.reduce((sum, campaign) => sum + campaign.sessions, 0).toLocaleString()}
                </div>
                <div className="text-green-400 text-sm">
                  From {gaPerformanceData.length} active campaigns
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Avg. Engagement Rate</div>
                <div className="text-2xl font-bold text-gray-100">
                  {((gaPerformanceData.reduce((sum, campaign) => sum + campaign.engagementRate, 0) / gaPerformanceData.length) * 100).toFixed(1)}%
                </div>
                <div className="text-blue-400 text-sm">
                  Across all campaigns
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Best Performing Campaign</div>
                <div className="text-lg font-bold text-gray-100">
                  {gaPerformanceData.reduce((best, current) => 
                    current.engagementRate > best.engagementRate ? current : best, gaPerformanceData[0])?.campaignName || 'N/A'}
                </div>
                <div className="text-yellow-400 text-sm">
                  {((gaPerformanceData.reduce((best, current) => 
                    current.engagementRate > best.engagementRate ? current : best, gaPerformanceData[0])?.engagementRate || 0) * 100).toFixed(1)}% engagement
                </div>
              </div>
            </div>

            {/* Campaign Performance Table */}
            <div className="bg-gray-700 p-4 rounded-lg overflow-x-auto">
              <h5 className="text-lg font-semibold text-gray-100 mb-3">Campaign Performance Details</h5>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2 text-gray-200">Campaign</th>
                    <th className="text-left py-2 text-gray-200">Source</th>
                    <th className="text-left py-2 text-gray-200">Medium</th>
                    <th className="text-right py-2 text-gray-200">Sessions</th>
                    <th className="text-right py-2 text-gray-200">Users</th>
                    <th className="text-right py-2 text-gray-200">Engagement</th>
                    <th className="text-right py-2 text-gray-200">Avg. Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {gaPerformanceData.map((campaign, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-2 text-gray-300 font-medium">{campaign.campaignName}</td>
                      <td className="py-2 text-gray-400">{campaign.source}</td>
                      <td className="py-2 text-gray-400">{campaign.medium}</td>
                      <td className="text-right py-2 text-gray-300">{campaign.sessions.toLocaleString()}</td>
                      <td className="text-right py-2 text-gray-300">{campaign.users.toLocaleString()}</td>
                      <td className="text-right py-2 text-gray-300">{(campaign.engagementRate * 100).toFixed(1)}%</td>
                      <td className="text-right py-2 text-gray-300">{Math.round(campaign.avgSessionDuration)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Performance Insights */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h5 className="text-lg font-semibold text-gray-100 mb-3">Campaign Insights</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Top Performing Source:</div>
                  <div className="text-gray-200 font-semibold">
                    {gaPerformanceData.reduce((best, current) => 
                      current.sessions > best.sessions ? current : best, gaPerformanceData[0])?.source || 'N/A'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Most Engaging Medium:</div>
                  <div className="text-gray-200 font-semibold">
                    {gaPerformanceData.reduce((best, current) => 
                      current.engagementRate > best.engagementRate ? current : best, gaPerformanceData[0])?.medium || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-600 rounded">
                <div className="text-gray-300 text-sm">
                  <strong>Recommendation:</strong> Focus budget on campaigns with engagement rates above{' '}
                  {((gaPerformanceData.reduce((sum, campaign) => sum + campaign.engagementRate, 0) / gaPerformanceData.length) * 100).toFixed(0)}% 
                  for optimal ROI.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">
            No campaign performance data available. Campaign tracking data will appear here once campaigns with UTM parameters are active.
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManagementModule;
