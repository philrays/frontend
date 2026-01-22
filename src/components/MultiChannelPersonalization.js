import React, { useState } from 'react';

const MultiChannelPersonalization = () => {
  const [formData, setFormData] = useState({
    segmentName: '',
    channel: '',
    baseTopic: ''
  });
  const [personalizedContent, setPersonalizedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Predefined customer segments
  const customerSegments = [
    'Eco-Conscious Millennials',
    'Budget-Conscious Families',
    'Premium Quality Seekers',
    'Comfort-First Professionals',
    'Fashion-Forward Youth',
    'Health & Wellness Enthusiasts',
    'Traditional Value Buyers',
    'Tech-Savvy Urban Dwellers'
  ];

  // Available marketing channels
  const marketingChannels = [
    'website_hero_banner',
    'email',
    'push_notification', 
    'social_media_post',
    'sms',
    'whatsapp_message',
    'google_ads',
    'facebook_ads',
    'instagram_story',
    'youtube_ad'
  ];

  // Base topics for Flopeds footwear
  const baseTopics = [
    'Comfort & Support',
    'Sustainable Materials',
    'Durability & Quality',
    'Style & Fashion',
    'Affordability',
    'Indian Craftsmanship',
    'Weather Resistance',
    'Health Benefits',
    'Versatile Design',
    'Cultural Heritage'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.segmentName || !formData.channel || !formData.baseTopic) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setPersonalizedContent('');

    try {
      const response = await fetch('/api/generate-personalized-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setPersonalizedContent(data.data.personalizedContent);
      } else {
        setError(data.error || 'Failed to generate personalized content');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
      console.error('MCP Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(personalizedContent);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center">
        🎯 Multi-Channel Personalization (MCP)
      </h3>
      <p className="text-gray-300 mb-6 text-sm">
        Generate personalized marketing content tailored for specific customer segments and marketing channels
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Segment Selection */}
        <div>
          <label htmlFor="segmentName" className="block text-sm font-medium text-gray-200 mb-2">
            Customer Segment
          </label>
          <select
            id="segmentName"
            name="segmentName"
            value={formData.segmentName}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a customer segment</option>
            {customerSegments.map((segment, index) => (
              <option key={index} value={segment}>{segment}</option>
            ))}
          </select>
        </div>

        {/* Marketing Channel Selection */}
        <div>
          <label htmlFor="channel" className="block text-sm font-medium text-gray-200 mb-2">
            Marketing Channel
          </label>
          <select
            id="channel"
            name="channel"
            value={formData.channel}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a marketing channel</option>
            {marketingChannels.map((channel, index) => (
              <option key={index} value={channel}>
                {channel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Base Topic Selection */}
        <div>
          <label htmlFor="baseTopic" className="block text-sm font-medium text-gray-200 mb-2">
            Base Topic/Theme
          </label>
          <select
            id="baseTopic"
            name="baseTopic"
            value={formData.baseTopic}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a base topic</option>
            {baseTopics.map((topic, index) => (
              <option key={index} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Generating...' : '🚀 Generate Personalized Content'}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
          <p className="text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Generated Content Display */}
      {personalizedContent && (
        <div className="mt-6 space-y-4">
          <div className="border-t border-gray-600 pt-4">
            <h4 className="text-lg font-semibold text-white mb-2">
              📝 Generated Personalized Content
            </h4>
            <div className="bg-gray-800 p-4 rounded-md border border-gray-600">
              <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">
                {personalizedContent}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={copyToClipboard}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={() => setPersonalizedContent('')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-md">
        <h5 className="text-sm font-semibold text-blue-200 mb-2">💡 How MCP Works:</h5>
        <ul className="text-xs text-blue-100 space-y-1">
          <li>• Select your target customer segment</li>
          <li>• Choose the marketing channel for content delivery</li>
          <li>• Pick a base topic that aligns with your campaign goals</li>
          <li>• AI generates personalized content optimized for that specific combination</li>
          <li>• Content is tailored for Indian market preferences and Flopeds brand</li>
        </ul>
      </div>
    </div>
  );
};

export default MultiChannelPersonalization;
