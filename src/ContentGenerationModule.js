import React, { useState, useEffect, useRef } from 'react';
import { 
  generateContentLLM,
  generateGeminiContent,
  generatePersonalizedContent,
  scoreContentLLM,
  bulkGenerateContentLLM,
  processIndianLanguagesContent,
  fetchIndianLanguagesAI,
  getImageCaption,
  translateText,
  automateCampaign,
  fetchGAContentPerformance,
  safeApiCall
} from './api';
import MultiChannelPersonalization from './components/MultiChannelPersonalization';

const cardClass =
  'bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-4 mb-8 border border-gray-600';

const mockProducts = [
  { id: '1', name: 'Eco Floped', price: '₹499', color: 'Green', feature: 'Sustainable' },
  { id: '2', name: 'Kids Chappal', price: '₹299', color: 'Blue', feature: 'Waterproof' },
  { id: '3', name: 'Classic Doohickey', price: '₹399', color: 'Black', feature: 'Comfort' },
];

const defaultTemplates = {
  headline: [
    'Buy {{name}} for just {{price}}!',
    'New: {{feature}} {{name}}',
  ],
  description: [
    'Get your {{color}} {{name}} today.',
    'Perfect for all ages. Only {{price}}.'
  ],
  cta: [
    'Shop Now',
    'Learn More'
  ]
};

// Utility: Safe template rendering (replaces {{key}} with values from data object)
function renderTemplate(template, data) {
  if (typeof template !== 'string' || typeof data !== 'object' || !data) return template;
  // Only replace placeholders with string values from data, never evaluate
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    // Defensive: only replace if key exists directly on data and is not undefined/null
    return Object.prototype.hasOwnProperty.call(data, key) && data[key] != null ? String(data[key]) : '';
  });
}

export default function ContentGenerationModule() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [structured, setStructured] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translationInput, setTranslationInput] = useState('');
  const [translationResult, setTranslationResult] = useState('');
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('');
  const [translating, setTranslating] = useState(false);
  const [autoImage, setAutoImage] = useState(null);
  const [autoImagePreview, setAutoImagePreview] = useState('');
  const [autoAdCopy, setAutoAdCopy] = useState('');
  const [autoPlatform, setAutoPlatform] = useState('');
  const [autoResult, setAutoResult] = useState(null);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState('');
  const [products, setProducts] = useState(mockProducts);
  const [templates, setTemplates] = useState(defaultTemplates);
  const [generated, setGenerated] = useState([]);
  const fileInputRef = useRef();

  // === AI-powered Image Captioning ===
  const [captionImage, setCaptionImage] = useState(null);
  const [captionImagePreview, setCaptionImagePreview] = useState('');
  const [captionResult, setCaptionResult] = useState('');
  const [captionLoading, setCaptionLoading] = useState(false);
  const [captionError, setCaptionError] = useState('');
  const [contentPerformanceData, setContentPerformanceData] = useState(null);
  const [contentPerformanceLoading, setContentPerformanceLoading] = useState(false);

  // Fetch supported Indian languages on mount
  useEffect(() => {
    safeApiCall(fetchIndianLanguagesAI)
      .then(result => {
        if (result.success && result.data && Array.isArray(result.data.supportedLanguages)) {
          setLanguages(result.data.supportedLanguages);
        }
      })
      .catch(err => console.error('Failed to fetch languages:', err));
    
    // Fetch content performance data for optimization insights
    fetchContentPerformanceData();
  }, []);

  // Fetch content performance data for optimization insights
  const fetchContentPerformanceData = () => {
    setContentPerformanceLoading(true);
    safeApiCall(fetchGAContentPerformance)
      .then(result => {
        if (result.success && result.data) {
          setContentPerformanceData(result.data);
        }
        setContentPerformanceLoading(false);
      })
      .catch(() => {
        setContentPerformanceLoading(false);
      });
  };

  // Chat with the advanced AI agent
  const handleChat = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const result = await safeApiCall(generateGeminiContent, { prompt: input });
      if (result.success && result.data && result.data.generatedText) {
        setChatHistory(h => [...h, { role: 'user', content: input }, { role: 'ai', content: result.data.generatedText }]);
        setOutput(result.data.generatedText);
      } else {
        setOutput('No answer generated.');
      }
    } catch (err) {
      setError('Failed to get AI chat response.');
    }
    setLoading(false);
  };

  // Request structured recommendations
  const handleStructured = async () => {
    setLoading(true);
    setError('');
    setStructured(null);
    try {
      const result = await safeApiCall(generateGeminiContent, { 
        prompt: `Provide structured marketing recommendations for: ${input}. Format as JSON with sections for strategy, tactics, and metrics.`
      });
      if (result.success && result.data && result.data.generatedText) {
        // Mock structured data based on response
        setStructured({
          strategy: result.data.generatedText.substring(0, 200) + '...',
          tactics: ['Content Marketing', 'Social Media', 'SEO Optimization'],
          metrics: ['Engagement Rate', 'Conversion Rate', 'Brand Awareness']
        });
      } else {
        setStructured({ error: 'No structured data returned.' });
      }
    } catch (err) {
      setError('Failed to get structured recommendations.');
    }
    setLoading(false);
  };

  // Legacy: Content generation (LLM)
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await generateContentLLM({ prompt: input });
      if (res.success && res.data && res.data.generatedText) {
        setOutput(res.data.generatedText);
      } else if (res.data && res.data.content) {
        setOutput(res.data.content);
      } else {
        setOutput('No content generated.');
      }
    } catch (err) {
      setError('Failed to generate content.');
    }
    setLoading(false);
  };

  // Clear chat history
  const handleClearChat = () => {
    setChatHistory([]);
    setOutput('');
    setStructured(null);
  };

  // Translation handler
  const handleTranslate = async () => {
    setTranslating(true);
    setTranslationResult('');
    try {
      const result = await safeApiCall(() => 
        translateText({ text: translationInput, targetLang: selectedLang })
      );
      if (result.success && result.data && result.data.translation) {
        setTranslationResult(result.data.translation);
      } else {
        setTranslationResult('No translation returned.');
      }
    } catch (err) {
      setTranslationResult('Translation failed.');
    }
    setTranslating(false);
  };

  // Handle image upload and preview
  const handleAutoImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAutoImage(file);
      const reader = new FileReader();
      reader.onload = ev => setAutoImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setAutoImage(null);
      setAutoImagePreview('');
    }
  };

  // Handle automated campaign creation
  const handleAutomateCampaign = async () => {
    setAutoLoading(true);
    setAutoError('');
    setAutoResult(null);
    try {
      if (!autoImage) throw new Error('Please upload an image.');
      if (!autoAdCopy.trim()) throw new Error('Please enter ad copy.');
      if (!autoPlatform.trim()) throw new Error('Please select a platform.');
      // Convert image to base64 (strip data URL prefix)
      const base64 = autoImagePreview.split(',')[1];
      const mimeType = autoImage.type;
      
      const result = await safeApiCall(() => 
        automateCampaign({
          imageData: base64,
          mimeType,
          adCopy: autoAdCopy,
          platform: autoPlatform
        })
      );
      
      if (result.success && result.data) {
        setAutoResult(result.data);
      } else if (result.campaignData) {
        setAutoResult(result.campaignData);
      } else {
        setAutoError(result.error || 'No campaign data returned.');
      }
    } catch (err) {
      setAutoError(err.message || 'Failed to automate campaign creation.');
    }
    setAutoLoading(false);
  };

  // AI-powered image captioning handlers
  const handleCaptionImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setCaptionImage(file);
      const reader = new FileReader();
      reader.onload = ev => setCaptionImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setCaptionImage(null);
      setCaptionImagePreview('');
    }
    setCaptionResult('');
    setCaptionError('');
  };

  const handleGenerateCaption = async () => {
    setCaptionLoading(true);
    setCaptionError('');
    setCaptionResult('');
    try {
      if (!captionImage) throw new Error('Please upload an image.');
      // Convert image to base64 (strip data URL prefix)
      const base64 = captionImagePreview.split(',')[1];
      const mimeType = captionImage.type;
      const res = await import('./api').then(api => api.getImageCaption({ imageData: base64, mimeType }));
      if (res.success && res.data && res.data.caption) {
        setCaptionResult(res.data.caption);
      } else {
        setCaptionError(res.message || 'No caption generated.');
      }
    } catch (err) {
      setCaptionError(err.message || 'Failed to generate caption.');
    }
    setCaptionLoading(false);
  };

  const handleTemplateChange = (type, idx, value) => {
    setTemplates(t => ({
      ...t,
      [type]: t[type].map((v, i) => (i === idx ? value : v))
    }));
  };
  const handleAddTemplate = type => {
    setTemplates(t => ({ ...t, [type]: [...t[type], ''] }));
  };
  const handleRemoveTemplate = (type, idx) => {
    setTemplates(t => ({ ...t, [type]: t[type].filter((_, i) => i !== idx) }));
  };

  const handleGenerateDCO = async () => {
    setLoading(true); setError(''); setGenerated([]);
    try {
      const res = await fetch('/api/dco/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, templates })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setGenerated(data.data);
      else setError(data.error || 'Failed to generate creatives.');
    } catch (e) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* AI Powered Image Captioning Card */}
      <div className={cardClass + " md:flex md:flex-row md:items-start md:gap-8"}>
        <div className="md:w-2/3 w-full flex flex-col items-start">
          <h3 className="text-xl font-semibold text-gray-100 mb-2 w-full">AI Powered Image Captioning</h3>
          <p className="mb-4 text-gray-300 text-left w-full">
            Upload an image to generate an AI-powered caption or descriptive paragraph for your creative or campaign.
          </p>
          <div className="w-full flex justify-center">
            <button
              className="bg-gray-700 text-gray-100 px-4 py-2 rounded hover:bg-gray-600 mb-2"
              onClick={handleGenerateCaption}
              disabled={captionLoading || !captionImage}
            >
              {captionLoading ? 'Generating Caption...' : 'Generate Caption/Paragraph'}
            </button>
          </div>
          {captionError && <div className="mt-2 text-red-400">{captionError}</div>}
          {captionResult && (
            <div className="mt-4 bg-gray-900 p-3 rounded text-gray-200 w-full">
              <strong>AI Caption/Paragraph:</strong>
              <div className="mt-2 whitespace-pre-line">{captionResult}</div>
            </div>
          )}
        </div>
        <div className="md:w-1/3 w-full flex flex-col items-end justify-start mt-4 md:mt-0">
          <input
            type="file"
            accept="image/*"
            onChange={handleCaptionImageChange}
            className="mb-2"
          />
          {captionImagePreview && (
            <img src={captionImagePreview} alt="Preview" className="max-h-32 mb-2 rounded shadow" />
          )}
        </div>
      </div>
      {/* Card 1: Content & AI Agent */}
      <div className={`${cardClass} md:col-span-2`}>
        <h2 className="text-3xl font-bold mb-6 text-gray-200">Content & AI Agent</h2>
        <input
          className="w-full p-3 rounded bg-gray-800 text-white mb-4"
          placeholder="Enter prompt, question, or topic..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={handleChat}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Thinking...' : 'Chat with AI Agent'}
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={handleStructured}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Analyzing...' : 'Structured Recommendations'}
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={handleClearChat}
            disabled={loading}
          >
            Clear
          </button>
        </div>
        {error && <div className="mt-4 text-lightgray">{error}</div>}
        {/* Chat history display */}
        {chatHistory.length > 0 && (
          <div className="mt-6 bg-gray-800 p-4 rounded text-gray-200 max-h-64 overflow-y-auto">
            <strong>Conversation:</strong>
            <div className="mt-2 space-y-2">
              {chatHistory.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'text-lightgray' : 'text-lightgray'}>
                  <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AI'}:</span> {msg.content}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Output display */}
        {output && (
          <div className="mt-6 bg-gray-800 p-4 rounded text-gray-200">
            <strong>Output:</strong>
            <div>{output}</div>
          </div>
        )}
        {/* Structured output display */}
        {structured && (
          <div className="mt-6 bg-gray-800 p-4 rounded text-gray-200">
            <strong>Structured Output:</strong>
            <pre className="whitespace-pre-wrap text-xs mt-2 bg-gray-900 p-2 rounded overflow-x-auto">{JSON.stringify(structured, null, 2)}</pre>
          </div>
        )}
      </div>
      {/* Card 2: Translation */}
      <div className={cardClass}>
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Translate Marketing Content</h3>
        <textarea
          className="w-full p-3 rounded bg-gray-800 text-white mb-2"
          placeholder="Enter text to translate..."
          value={translationInput}
          onChange={e => setTranslationInput(e.target.value)}
          rows={3}
        />
        <div className="flex items-center gap-4 mb-2">
          <select
            className="bg-gray-900 text-white p-2 rounded"
            value={selectedLang}
            onChange={e => setSelectedLang(e.target.value)}
          >
            <option value="">Select language</option>
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={handleTranslate}
            disabled={translating || !translationInput.trim() || !selectedLang}
          >
            {translating ? 'Translating...' : 'Translate'}
          </button>
        </div>
        {translationResult && (
          <div className="mt-4 bg-gray-900 p-3 rounded text-gray-200">
            <strong>Translation:</strong>
            <div className="mt-2 whitespace-pre-line">{translationResult}</div>
          </div>
        )}
      </div>
      {/* Card 3: Automated Campaign Creation */}
      <div className={cardClass}>
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Automated Content Generation</h3>
        <div className="mb-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAutoImageChange}
            className="mb-2"
          />
          {autoImagePreview && (
            <img src={autoImagePreview} alt="Preview" className="max-h-32 mb-2 rounded shadow" />
          )}
        </div>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white mb-2"
          placeholder="Enter ad copy..."
          value={autoAdCopy}
          onChange={e => setAutoAdCopy(e.target.value)}
        />
        <select
          className="w-full p-2 rounded bg-gray-800 text-white mb-2"
          value={autoPlatform}
          onChange={e => setAutoPlatform(e.target.value)}
        >
          <option value="">Select platform</option>
          <option value="Meta">Meta (Facebook/Instagram)</option>
          <option value="Google Ads">Google Ads</option>
          <option value="YouTube">YouTube</option>
          <option value="Amazon">Amazon</option>
          <option value="Other">Other</option>
        </select>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={handleAutomateCampaign}
          disabled={autoLoading}
        >
          {autoLoading ? 'Generating...' : 'Automate Campaign'}
        </button>
        {autoError && <div className="mt-2 text-lightgray">{autoError}</div>}
        {autoResult && (
          <div className="mt-4 bg-gray-900 p-3 rounded text-gray-200">
            <strong>Generated Campaign Assets:</strong>
            <ul className="mt-2 space-y-1">
              <li><span className="font-semibold text-pink-200">Headlines:</span> {autoResult.headlines}</li>
              <li><span className="font-semibold text-pink-200">Descriptions:</span> {autoResult.descriptions}</li>
              <li><span className="font-semibold text-pink-200">Calls to Action:</span> {autoResult.callsToAction}</li>
              <li><span className="font-semibold text-pink-200">Target Audience:</span> {autoResult.targetAudience}</li>
              <li><span className="font-semibold text-pink-200">Keywords:</span> {autoResult.keywords}</li>
            </ul>
          </div>
        )}
      </div>

      {/* GA4 Content Performance Insights Section */}
      <div className={cardClass + ' mt-8'}>
        <h3 className="text-2xl font-semibold text-gray-100 mb-4">Content Performance Insights (GA4)</h3>
        {contentPerformanceLoading ? (
          <div className="text-gray-400">Loading content performance data...</div>
        ) : contentPerformanceData && contentPerformanceData.length > 0 ? (
          <div className="space-y-6">
            {/* Top Performing Content */}
            <div className="bg-gray-600 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-100 mb-3">Top Performing Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-gray-400 text-sm">Most Viewed Page</div>
                  <div className="text-gray-100 font-semibold text-sm">
                    {contentPerformanceData[0]?.title || contentPerformanceData[0]?.path || 'N/A'}
                  </div>
                  <div className="text-green-400 text-xs">
                    {contentPerformanceData[0]?.pageViews?.toLocaleString()} views
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-gray-400 text-sm">Highest Engagement</div>
                  <div className="text-gray-100 font-semibold text-sm">
                    {contentPerformanceData.reduce((best, current) => 
                      current.engagementRate > best.engagementRate ? current : best, contentPerformanceData[0])?.title || 'N/A'}
                  </div>
                  <div className="text-blue-400 text-xs">
                    {((contentPerformanceData.reduce((best, current) => 
                      current.engagementRate > best.engagementRate ? current : best, contentPerformanceData[0])?.engagementRate || 0) * 100).toFixed(1)}% engagement
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-gray-400 text-sm">Longest Session</div>
                  <div className="text-gray-100 font-semibold text-sm">
                    {contentPerformanceData.reduce((best, current) => 
                      current.avgSessionDuration > best.avgSessionDuration ? current : best, contentPerformanceData[0])?.title || 'N/A'}
                  </div>
                  <div className="text-yellow-400 text-xs">
                    {Math.round(contentPerformanceData.reduce((best, current) => 
                      current.avgSessionDuration > best.avgSessionDuration ? current : best, contentPerformanceData[0])?.avgSessionDuration || 0)}s avg
                  </div>
                </div>
              </div>
            </div>

            {/* Content Optimization Recommendations */}
            <div className="bg-gray-600 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-100 mb-3">Content Optimization Recommendations</h4>
              <div className="space-y-3">
                {contentPerformanceData.slice(0, 3).map((content, i) => (
                  <div key={i} className="bg-gray-700 p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-gray-200 font-medium text-sm">
                        {content.title || content.path}
                      </div>
                      <div className="text-xs text-gray-400">
                        {content.pageViews.toLocaleString()} views
                      </div>
                    </div>
                    <div className="text-gray-300 text-xs">
                      <strong>Recommendation:</strong> {
                        content.bounceRate > 0.7 
                          ? "High bounce rate - consider improving content relevance and page load speed"
                          : content.engagementRate < 0.5
                          ? "Low engagement - add more interactive elements and clear calls-to-action"
                          : content.avgSessionDuration < 60
                          ? "Short session duration - consider adding related content and internal links"
                          : "Great performance! Use this content style as a template for future content"
                      }
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-gray-400">
                        Engagement: {(content.engagementRate * 100).toFixed(1)}%
                      </span>
                      <span className="text-gray-400">
                        Bounce: {(content.bounceRate * 100).toFixed(1)}%
                      </span>
                      <span className="text-gray-400">
                        Duration: {Math.round(content.avgSessionDuration)}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Strategy Insights */}
            <div className="bg-gray-600 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-100 mb-3">Content Strategy Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Content with Best Engagement:</div>
                  <div className="text-gray-200 text-sm">
                    {contentPerformanceData
                      .filter(c => c.engagementRate > 0.6)
                      .map(c => c.path.split('/').pop() || 'Home')
                      .join(', ') || 'Focus on interactive content'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Content Needing Improvement:</div>
                  <div className="text-gray-200 text-sm">
                    {contentPerformanceData
                      .filter(c => c.bounceRate > 0.7)
                      .slice(0, 3)
                      .map(c => c.path.split('/').pop() || 'Home')
                      .join(', ') || 'All content performing well'}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <div className="text-gray-300 text-sm">
                  <strong>AI Content Generation Tip:</strong> Based on your analytics, content with{' '}
                  {contentPerformanceData.reduce((sum, c) => sum + c.avgSessionDuration, 0) / contentPerformanceData.length > 120
                    ? 'longer format and detailed explanations'
                    : 'concise, scannable format'} performs best with your audience.
                  Consider this when generating new content.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">
            No content performance data available. Analytics data will appear here once your website has traffic.
          </div>
        )}
      </div>

      {/* Multi-Channel Personalization Component */}
      <MultiChannelPersonalization />
    </div>
  );
}
