import React, { useState, useEffect, useRef } from 'react';

const FEEDBACK_TOPICS = [
  { value: '', label: 'Select a topic' },
  { value: 'system', label: 'FIDGA System (overall)' },
  { value: 'dashboard', label: 'Dashboard Overview' },
  { value: 'market-intelligence', label: 'Market Intelligence' },
  { value: 'campaign-management', label: 'Campaign Management' },
  { value: 'performance-monitoring', label: 'Performance Monitoring' },
  { value: 'content-generation', label: 'Content Generation' },
  { value: 'promotion', label: 'Specific Campaign/Promotion' }
];

const FeedbackForm = ({ onSubmitFeedback }) => {
  const [formData, setFormData] = useState({
    userId: '',
    module: '',
    topic: '',
    campaignId: '',
    rating: 0,
    feedback: '',
    improvements: '',
    contactEmail: '',
    urgency: 'Normal',
    attachFile: null
  });
  const [campaigns, setCampaigns] = useState([]);
  const [subCampaigns, setSubCampaigns] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const feedbackRef = useRef();
  const [campaignSearch, setCampaignSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedSubCampaign, setSelectedSubCampaign] = useState('');

  useEffect(() => {
    if (formData.topic === 'campaign-management' || formData.topic === 'promotion') {
      fetch('/api/campaigns')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && Array.isArray(data.data.campaigns)) {
            setCampaigns(data.data.campaigns);
          } else {
            setCampaigns([]);
          }
        })
        .catch(() => setCampaigns([]));
    } else {
      setCampaigns([]);
      setFormData(prev => ({ ...prev, campaignId: '' }));
    }
  }, [formData.topic]);

  // Update campaignId when selectedCampaign changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, campaignId: selectedCampaign }));
  }, [selectedCampaign]);

  // Update subCampaigns when selectedCampaign changes
  useEffect(() => {
    const campaign = campaigns.find(c => c.id === selectedCampaign || c._id === selectedCampaign);
    if (campaign && Array.isArray(campaign.subCampaigns)) {
      setSubCampaigns(campaign.subCampaigns);
    } else {
      setSubCampaigns([]);
    }
    setSelectedSubCampaign('');
  }, [selectedCampaign, campaigns]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({ ...prevData, attachFile: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleRating = (star) => {
    setFormData((prevData) => ({ ...prevData, rating: star }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);
    if (!formData.feedback.trim()) {
      setFormError('Please enter your feedback.');
      return;
    }
    onSubmitFeedback(formData);
    setFormSuccess(true);
    setFormData({
      userId: '',
      module: '',
      topic: '',
      campaignId: '',
      rating: 0,
      feedback: '',
      improvements: '',
      contactEmail: '',
      urgency: 'Normal',
      attachFile: null
    });
    setSelectedCampaign('');
    setSelectedSubCampaign('');
    setTimeout(() => setFormSuccess(false), 3000);
    if (formData.feedback || formData.improvements) {
      try {
        await fetch('/api/llm/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: formData.topic,
            campaignId: formData.campaignId,
            feedback: formData.feedback,
            improvements: formData.improvements,
            rating: formData.rating
          })
        });
      } catch {
        // Handle error if needed
      }
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
        body: JSON.stringify({ feedback: formData.feedback, topic: formData.topic })
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

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
        Feedback & Suggestions
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6" title="Feedback and Suggestions Form">
        {/* Feedback Topic Dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" htmlFor="topic" title="Select the topic for your feedback">Feedback Topic</label>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
            title="Choose the main topic for your feedback"
          >
            {FEEDBACK_TOPICS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Campaign dropdowns if topic is campaign-related */}
        {(formData.topic === 'Campaign' || formData.topic === 'campaign-management' || formData.topic === 'promotion') && (
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
              {/* ...options... */}
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
                  {/* ...options... */}
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
            value={formData.feedback}
            onChange={e => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
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
                className={`text-2xl ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-500'}`}
                onClick={() => handleRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-gray-400">{formData.rating ? `${formData.rating} / 5` : 'No rating'}</span>
          </div>
        </div>
        {/* Urgency Selector */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" title="How urgent is this feedback?">Urgency</label>
          <select
            className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            value={formData.urgency}
            onChange={e => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
            title="Select the urgency level for your feedback"
          >
            {/* ...options... */}
          </select>
        </div>
        {/* Contact Info */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" title="Optional: Enter your email for follow-up">Contact (optional)</label>
          <input
            type="email"
            className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            placeholder="Your email for follow-up (optional)"
            value={formData.contactEmail}
            onChange={e => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
            title="Enter your email address for follow-up (optional)"
          />
        </div>
        {/* File Attachment */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300" title="Optional: Attach a file">Attach File (optional)</label>
          <input
            type="file"
            className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none"
            onChange={e => setFormData(prev => ({ ...prev, attachFile: e.target.files[0] }))}
            title="Attach a file to your feedback (optional)"
          />
          {formData.attachFile && <div className="text-gray-400 mt-1">Selected: {formData.attachFile.name}</div>}
        </div>
        {formError && <div className="text-red-400 mb-2" title="Form error message">{formError}</div>}
        <button
          type="submit"
          className="bg-gray-100 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-200"
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
          disabled={aiLoading || !formData.feedback.trim()}
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
};

export default FeedbackForm;
