import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  fetchShopifySales,
  fetchSocialListening,
  fetchCompetitorIntel,
  fetchIndustryReports,
  analyzeAdvancedSentiment,
  fetchTrendForecast,
  fetchKeywordInsightsAdvanced,
  fetchCustomerSegments,
  fetchCompetitiveStrategy,
  fetchActionableRecommendations,
  createCampaign,
  listCampaigns,
  getCampaign,
  updateCampaign,
  getCampaignRecommendations,
  getCampaignAlerts
} from './api';
import ReactMarkdown from 'react-markdown';
import integrationGuide from './help-campaign-integration.md';
import marketIntelligenceGuide from './help-market-intelligence.md';
import performanceMonitoringGuide from './help-performance-monitoring.md';
import ContentGenerationModule from './ContentGenerationModule';
import CampaignManagementModule from './CampaignManagementModule';
import FeedbackForm from './FeedbackForm';
import HelpDocumentation from './HelpDocumentation';
import DashboardOverview from './DashboardOverview';
import MarketIntelligenceDashboard from './MarketIntelligenceDashboard';
import Sidebar from './components/Sidebar';
import PerformanceMonitoringModule from './PerformanceMonitoringModule';
import DynamicCreativeOptimizationPage from './DynamicCreativeOptimizationPage';
import APITestingDashboard from './components/APITestingDashboard';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// === Feedback Form Component ===
// (REMOVED: FeedbackFormComponent definition, now imported from './FeedbackForm')

// === Documentation Data and HelpDocumentation Component ===
// (REMOVED: documentationTopics and HelpDocumentation definition, now imported from './HelpDocumentation')

// === Sales Data and DashboardOverview Component ===
// (REMOVED: DashboardOverview definition, now imported from './DashboardOverview')

// === Market Intelligence Dashboard Component ===
// (REMOVED: MarketIntelligenceDashboard definition, now imported from './MarketIntelligenceDashboard')

// === Admin Dashboard Component ===
const API_BASE = process.env.REACT_APP_API_URL || '';

function FeedbackTable({ onBack }) {
  const [feedbacks, setFeedbacks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/feedback`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => { setFeedbacks(data); setLoading(false); })
      .catch(err => { setError('Failed to load feedback'); setLoading(false); });
  }, []);

  if (loading) return <div className="p-4 text-gray-400">Loading feedback...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 rounded shadow" title="Feedback entries table">
      <button onClick={onBack} className="mb-4 text-gray-300 hover:underline" title="Back to Admin Dashboard">&larr; Back to Admin Dashboard</button>
      <h2 className="text-xl font-bold mb-4 text-gray-200" title="Feedback Entries">Feedback Entries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm" title="Feedback table">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border text-gray-200" title="User who submitted feedback">User</th>
              <th className="p-2 border text-gray-200" title="Feedback message">Message</th>
              <th className="p-2 border text-gray-200" title="User rating">Rating</th>
              <th className="p-2 border text-gray-200" title="Submission time">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(feedbacks) && feedbacks.length > 0 ? feedbacks.map(fb => (
              <tr key={fb._id} title="Feedback entry row">
                <td className="p-2 border text-gray-200" title="User name">{fb.user || '-'}</td>
                <td className="p-2 border text-gray-200" title="Feedback message">{fb.message}</td>
                <td className="p-2 border text-center text-gray-200" title="Rating value">{fb.rating}</td>
                <td className="p-2 border text-gray-200" title="Timestamp">{fb.timestamp ? new Date(fb.timestamp).toLocaleString() : '-'}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="p-2 text-center text-gray-400" title="No feedback found">No feedback found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDashboard({ onShowFeedback }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/overview`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => { setError('Failed to load admin stats'); setLoading(false); });
  }, []);

  if (loading) return <div className="p-4 text-gray-400">Loading admin dashboard...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800 rounded shadow" title="Admin dashboard overview">
      <h2 className="text-xl font-bold mb-4 text-gray-200" title="Admin Dashboard">Admin Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg hover-lift" title="Total feedback count">
          <div className="text-sm font-semibold text-gray-200">Feedback</div>
          <div className="text-xl text-gray-200">{stats?.feedbackCount ?? '-'}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg hover-lift" title="Market logs count">
          <div className="text-sm font-semibold text-gray-200">Market Logs</div>
          <div className="text-xl text-gray-200">{stats?.marketLogCount ?? '-'}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg hover-lift" title="A/B assignments count">
          <div className="text-sm font-semibold text-gray-200">A/B Assignments</div>
          <div className="text-xl text-gray-200">{stats?.abAssignCount ?? '-'}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg hover-lift" title="A/B outcomes count">
          <div className="text-sm font-semibold text-gray-200">A/B Outcomes</div>
          <div className="text-xl text-gray-200">{stats?.abOutcomeCount ?? '-'}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={onShowFeedback} className="text-gray-300 hover:underline text-left" title="View all feedback entries">View Feedback</button>
        <a href="#" className="text-gray-300 hover:underline" title="View market logs">View Market Logs</a>
        <a href="#" className="text-gray-300 hover:underline" title="View A/B assignments">View A/B Assignments</a>
        <a href="#" className="text-gray-300 hover:underline" title="View A/B outcomes">View A/B Outcomes</a>
      </div>
    </div>
  );
}

// === Content Generation Module ===

// Footer component
const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 text-center py-4" title="FIDGA Dashboard Footer">
    &copy; {new Date().getFullYear()} FIDGA. All rights reserved.
  </footer>
);

function FeedbackAndSuggestions({ onSubmitFeedback }) {
  const [feedback, setFeedback] = useState('');
  const [topic, setTopic] = useState('General');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [subCampaigns, setSubCampaigns] = useState([]);
  const [selectedSubCampaign, setSelectedSubCampaign] = useState('');
  const [campaignSearch, setCampaignSearch] = useState('');
  const [rating, setRating] = useState(0);
  const [urgency, setUrgency] = useState('Normal');
  const [contact, setContact] = useState('');
  const [attachFile, setAttachFile] = useState(null);
  const feedbackRef = useRef();

  useEffect(() => {
    if (topic === 'Campaign' || topic === 'campaign-management' || topic === 'promotion') {
      listCampaigns().then(data => {
        if (data && data.data && Array.isArray(data.data.campaigns)) {
          setCampaigns(data.data.campaigns);
        } else {
          setCampaigns([]);
        }
      }).catch(() => setCampaigns([]));
    } else {
      setCampaigns([]);
      setSelectedCampaign('');
      setSubCampaigns([]);
      setSelectedSubCampaign('');
    }
  }, [topic]);

  useEffect(() => {
    if (selectedCampaign) {
      const campaign = campaigns.find(c => c.id === selectedCampaign || c._id === selectedCampaign);
      if (campaign && Array.isArray(campaign.subCampaigns)) {
        setSubCampaigns(campaign.subCampaigns);
      } else {
        setSubCampaigns([]);
      }
      setSelectedSubCampaign('');
    } else {
      setSubCampaigns([]);
      setSelectedSubCampaign('');
    }
  }, [selectedCampaign, campaigns]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);
    if (!feedback.trim()) {
      setFormError('Please enter your feedback.');
      return;
    }
    // Simulate file upload and contact info
    try {
      await onSubmitFeedback({
        message: feedback,
        topic,
        campaignId: selectedCampaign,
        subCampaignId: selectedSubCampaign,
        rating,
        urgency,
        contact,
        attachFile
      });
      setFormSuccess(true);
      setFeedback('');
      setSelectedCampaign('');
      setSelectedSubCampaign('');
      setRating(0);
      setUrgency('Normal');
      setContact('');
      setAttachFile(null);
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      setFormError('Failed to submit feedback.');
    }
  };

  const handleAISuggestions = async () => {
    setAiLoading(true);
    setAiError('');
    setAiSuggestions(null);
    try {
      const res = await fetch(`/api/ai/feedback-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, topic })
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data.success && data.suggestions) {
        setAiSuggestions(data.suggestions);
      } else if (data.data && data.data.suggestions) {
        setAiSuggestions(data.data.suggestions);
      } else {
        setAiError('No suggestions generated.');
      }
    } catch (err) {
      setAiError('Failed to get AI suggestions.');
    }
    setAiLoading(false);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(campaignSearch.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg animate-fade-in" title="Submit feedback, suggestions, or issues to help improve FIDGA">
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400" title="Feedback & Suggestions">Feedback & Suggestions</h2>
      <form onSubmit={handleFormSubmit} className="space-y-6" title="Feedback and Suggestions Form">
        {/* Feedback Topic Dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" htmlFor="topic" title="Select the topic for your feedback">Feedback Topic</label>
          <select
            id="topic"
            name="topic"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            title="Choose the main topic for your feedback"
          >
            <option value="General">General</option>
            <option value="Campaign">Campaign</option>
            <option value="System">System</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Bug Report">Bug Report</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Performance">Performance</option>
            <option value="Integration">Integration</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Campaign dropdowns if topic is campaign-related */}
        {(topic === 'Campaign' || topic === 'campaign-management' || topic === 'promotion') && (
          <div title="Select a campaign and sub-campaign for feedback">
            <label className="block text-sm font-semibold mb-2 text-gray-300">Select Campaign</label>
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 focus:outline-none"
              value={campaignSearch || ''}
              onChange={e => setCampaignSearch(e.target.value)}
              title="Search for a campaign by name"
            />
            <select
              className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
              value={selectedCampaign}
              onChange={e => setSelectedCampaign(e.target.value)}
              title="Select a campaign to provide feedback on"
            >
              <option value="">-- Select Campaign --</option>
              {filteredCampaigns.map(c => (
                <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
              ))}
            </select>
            {subCampaigns.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Select Sub-Campaign / Ad Group</label>
                <select
                  className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
                  value={selectedSubCampaign}
                  onChange={e => setSelectedSubCampaign(e.target.value)}
                  title="Select a sub-campaign or ad group"
                >
                  <option value="">-- Select Sub-Campaign --</option>
                  {subCampaigns.map(sc => (
                    <option key={sc.id || sc._id} value={sc.id || sc._id}>{sc.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        {/* Feedback Textarea */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" htmlFor="feedback" title="Describe your feedback">Your Feedback</label>
          <textarea
            id="feedback"
            ref={feedbackRef}
            className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            rows={4}
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Share your thoughts, suggestions, or issues..."
            title="Enter your feedback, suggestion, or issue here"
          />
        </div>
        {/* Rating Selector */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" title="Rate your experience from 1 to 5 stars">Rating</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(star => (
              <button
                type="button"
                key={star}
                className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-500'}`}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-gray-400">{rating ? `${rating} / 5` : 'No rating'}</span>
          </div>
        </div>
        {/* Urgency Selector */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" title="How urgent is this feedback?">Urgency</label>
          <select
            className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            value={urgency}
            onChange={e => setUrgency(e.target.value)}
            title="Select the urgency level for your feedback"
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        {/* Contact Info */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" title="Optional: Enter your email for follow-up">Contact (optional)</label>
          <input
            type="email"
            className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            placeholder="Your email for follow-up (optional)"
            value={contact}
            onChange={e => setContact(e.target.value)}
            title="Enter your email address for follow-up (optional)"
          />
        </div>
        {/* File Attachment */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" title="Optional: Attach a file">Attach File (optional)</label>
          <input
            type="file"
            className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            onChange={e => setAttachFile(e.target.files[0])}
            title="Attach a file to your feedback (optional)"
          />
          {attachFile && <div className="text-gray-400 mt-1">Selected: {attachFile.name}</div>}
        </div>
        {formError && <div className="text-red-400 mb-2" title="Form error message">{formError}</div>}
        <button
          type="submit"
          className="bg-gray-100 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-200 mx-auto block"
          title="Submit your feedback"
        >
          Submit Feedback
        </button>
        {formSuccess && <span className="ml-4 text-green-400" title="Feedback submitted confirmation">Thank you for your feedback!</span>}
      </form>
      {/* AI Suggestions Section */}
      <div className="mt-8" title="Get AI-powered suggestions for your feedback">
        <button
          className="bg-gray-700 text-gray-100 px-4 py-2 rounded font-semibold hover:bg-gray-600"
          onClick={handleAISuggestions}
          disabled={aiLoading || !feedback.trim()}
          title="Get AI suggestions for your feedback"
        >
          {aiLoading ? 'Analyzing with AI...' : 'Get AI Suggestions'}
        </button>
        {aiError && <div className="text-red-400 mt-2" title="AI error message">{aiError}</div>}
        {aiSuggestions && (
          <div className="bg-gray-900 p-4 rounded-lg mt-4" title="AI-generated recommendations">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Recommendations</h3>
            <ul className="list-disc ml-6 text-gray-300">
              {Array.isArray(aiSuggestions)
                ? aiSuggestions.map((s, i) => <li key={i} title="AI suggestion">{s}</li>)
                : <li title="AI suggestion">{aiSuggestions}</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = async (feedbackData) => {
    // Simulate API call
    setTimeout(() => {
      console.log('Feedback submitted:', feedbackData);
      setShowFeedbackSuccess(true);
      setTimeout(() => setShowFeedbackSuccess(false), 3000);
    }, 1000);
  };

  const renderModule = () => {
    try {
      switch (activeModule) {
        case 'dashboard':
          return <DashboardOverview />;
        case 'market-intelligence':
          return <MarketIntelligenceDashboard />;
        case 'campaign-management':
          return <CampaignManagementModule />;
        case 'content-generation':
          return typeof ContentGenerationModule !== 'undefined' ? <ContentGenerationModule /> : <div className="text-red-400 p-4">Content Generation module not available.</div>;
        case 'performance-monitoring':
          return <PerformanceMonitoringModule />;
        case 'dco':
          return <DynamicCreativeOptimizationPage />;
        case 'feedback':
          return <FeedbackAndSuggestions onSubmitFeedback={handleFeedbackSubmit} />;
        case 'help-documentation':
          return <HelpDocumentation />;
        case 'api-testing':
          return <APITestingDashboard />;
        default:
          return <DashboardOverview />;
      }
    } catch (err) {
      return <div className="text-red-400 p-4">An error occurred while rendering this module.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900" title="FIDGA Marketing Intelligence Platform">
      <header className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 p-4 flex justify-between items-center shadow-md" style={{ minHeight: 'unset', height: '3.5rem' }} title="FIDGA Dashboard Header">
        <h1 className="text-lg font-bold" title="FIDGA Dashboard Home">FIDGA Dashboard</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 hover-lift text-sm font-medium transition-all duration-200"
            onClick={() => window.open('http://localhost:5050/admin', '_blank')}
            title="Open Backend Admin Panel"
          >
            Admin Panel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 hover-lift text-sm font-medium transition-all duration-200"
            onClick={() => window.open('http://localhost:5050/docs', '_blank')}
            title="Open API Documentation"
          >
            API Docs
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} title="Main navigation sidebar. Use to switch between modules." />
        <main className="flex-1 p-0" title="Main content area">
          {renderModule()}
          {showFeedbackSuccess && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg" title="Feedback submitted confirmation">
              Feedback submitted successfully!
            </div>
          )}
        </main>
      </div>
      <Footer title="FIDGA Dashboard Footer" />
    </div>
  );
}

// === Global Error Boundary ===
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Optionally log error to an external service here
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-red-300 p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <pre className="bg-gray-800 p-4 rounded mb-2 overflow-x-auto max-w-xl text-sm">
            {this.state.error && this.state.error.toString()}
          </pre>
          {this.state.errorInfo && (
            <details className="whitespace-pre-wrap text-gray-400">
              {this.state.errorInfo.componentStack}
            </details>
          )}
          <button className="mt-6 px-4 py-2 bg-gray-700 text-gray-100 rounded" onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrap App in ErrorBoundary for export
export default function WrappedApp(props) {
  return <ErrorBoundary><App {...props} /></ErrorBoundary>;
}
