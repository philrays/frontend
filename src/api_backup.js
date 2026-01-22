// API utility functions for FIDGA Market Intelligence & Trends module
// Place in frontend/src/api.js

export async function fetchShopifySales() {
  const res = await fetch('/api/shopify-sales');
  return res.json();
}

export async function fetchSocialListening() {
  const res = await fetch('/api/social-listening');
  return res.json();
}

export async function fetchCompetitorIntel() {
  const res = await fetch('/api/competitor-intel');
  return res.json();
}

export async function fetchIndustryReports() {
  const res = await fetch('/api/industry-reports');
  return res.json();
}

export async function analyzeAdvancedSentiment(text) {
  const res = await fetch('/api/analyze-advanced-sentiment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return res.json();
}

export async function fetchTrendForecast() {
  const res = await fetch('/api/trend-forecast');
  return res.json();
}

export async function fetchKeywordInsightsAdvanced(keyword) {
  const res = await fetch('/api/keyword-insights-advanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword })
  });
  return res.json();
}

export async function fetchCustomerSegments() {
  const res = await fetch('/api/customer-segments');
  return res.json();
}

export async function fetchCompetitiveStrategy() {
  const res = await fetch('/api/competitive-strategy');
  return res.json();
}

export async function fetchActionableRecommendations() {
  const res = await fetch('/api/actionable-recommendations');
  return res.json();
}

export async function submitEnhancedFeedback(data) {
  const res = await fetch('/api/feedback-enhanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
  return res.json();
}

export async function fetchCompetitiveStrategy() {
  const res = await fetch(`${API_BASE}/api/competitive-strategy`);
  return res.json();
}

export async function fetchActionableRecommendations() {
  const res = await fetch(`${API_BASE}/api/actionable-recommendations`);
  return res.json();
}

export async function submitEnhancedFeedback(data) {
  const res = await fetch(`${API_BASE}/api/feedback-enhanced`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Campaign Management API ===

export async function createCampaign(data) {
  const res = await fetch(`${API_BASE}/api/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function listCampaigns() {
  const res = await fetch(`${API_BASE}/api/campaigns`);
  return res.json();
}

export async function getCampaign(id) {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}`);
  return res.json();
}

export async function updateCampaign(id, data) {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getCampaignRecommendations(id) {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}/recommendations`);
  return res.json();
}

export async function getCampaignAlerts(id) {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}/alerts`);
  return res.json();
}

// === LLM-powered Campaign Management ===
export async function generateCampaignBrief(prompt) {
  const res = await fetch(`${API_BASE}/api/campaigns/brief`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return res.json();
}

export async function getLLMSegments(campaignId) {
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/llm-segments`);
  return res.json();
}

export async function getLLMABTests(campaignId) {
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/llm-abtests`);
  return res.json();
}

export async function getLLMBudget(campaignId) {
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/llm-budget`);
  return res.json();
}

export async function getLLMCampaignSummary(campaignId) {
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/llm-summary`);
  return res.json();
}

// === LLM-powered Performance Monitoring ===
export async function getPerformanceSummary() {
  const res = await fetch(`${API_BASE}/api/performance/summary`);
  return res.json();
}

export async function getPerformanceAnomalies() {
  const res = await fetch(`${API_BASE}/api/performance/anomalies`);
  return res.json();
}

export async function getPerformanceForecast() {
  const res = await fetch(`${API_BASE}/api/performance/forecast`);
  return res.json();
}

// === LLM-powered Content Generation ===
export async function generateContentLLM(data) {
  const res = await fetch(`${API_BASE}/api/content/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function scoreContentLLM(data) {
  const res = await fetch(`${API_BASE}/api/content/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function bulkGenerateContentLLM(data) {
  const res = await fetch(`${API_BASE}/api/content/bulk-generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === LLM-powered Decision Support ===
export async function askLLM(question) {
  const res = await fetch(`${API_BASE}/api/ask-llm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  return res.json();
}

export async function getLlmOpportunities() {
  const res = await fetch(`${API_BASE}/api/opportunities/llm`);
  return res.json();
}

export async function getLlmReport(data) {
  const res = await fetch(`${API_BASE}/api/reports/llm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getImageCaption({ imageData, mimeType }) {
  const res = await fetch(`${API_BASE}/api/image-caption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData, mimeType })
  });
  return res.json();
}

// === Google Analytics API Functions ===

export async function fetchGATraffic() {
  const res = await fetch(`${API_BASE}/api/ga-traffic`);
  return res.json();
}

export async function fetchGAAudienceDemographics() {
  const res = await fetch(`${API_BASE}/api/ga-audience-demographics`);  
  return res.json();
}

export async function fetchGACampaignPerformance() {
  const res = await fetch(`${API_BASE}/api/ga-campaign-performance`);
  return res.json();
}

export async function fetchGAContentPerformance() {
  const res = await fetch(`${API_BASE}/api/ga-content-performance`);
  return res.json();
}

export async function fetchAnalyticsMock() {
  const res = await fetch(`${API_BASE}/api/analytics/mock`);
  return res.json();
}

// === Gemini AI Content Generation ===

export async function generateGeminiContent(data) {
  const res = await fetch(`${API_BASE}/api/gemini-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function generatePersonalizedContent(data) {
  const res = await fetch(`${API_BASE}/api/generate-personalized-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Market Intelligence API ===

export async function fetchMarketIntelligence(data) {
  const res = await fetch(`${API_BASE}/api/market-intelligence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Indian Languages AI Agent ===

export async function fetchIndianLanguagesAI() {
  const res = await fetch(`${API_BASE}/api/ai-agent/indian-languages`);
  return res.json();
}

export async function processIndianLanguagesContent(data) {
  const res = await fetch(`${API_BASE}/api/ai-agent/indian-languages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Campaign Automation ===

export async function deleteCampaign(id) {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function automateCampaignStatus(data) {
  const res = await fetch(`${API_BASE}/api/campaigns/automate-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function automateCampaign(data) {
  const response = await fetch('/api/automate-campaign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function translateText(data) {
  const response = await fetch('/api/ai-agent/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// === Sales Data API ===

export async function fetchSalesData() {
  const res = await fetch(`${API_BASE}/api/sales`);
  return res.json();
}

// === Basic Feedback API ===

export async function submitFeedback(data) {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Health Check API ===

export async function checkAPIHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function checkAPIStatus() {
  const res = await fetch(`${API_BASE}/api/status`);
  return res.json();
}

// === Alternative Endpoint Names (for backward compatibility) ===

export async function fetchCompetitorIntelligence() {
  const res = await fetch(`${API_BASE}/api/competitor-intelligence`);
  return res.json();
}

// === Error Handling Utility ===

export async function handleApiError(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// === Enhanced API Wrapper with Error Handling ===

export async function safeApiCall(apiFunction, ...args) {
  try {
    return await apiFunction(...args);
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      success: false, 
      error: error.message || 'API call failed',
      timestamp: new Date().toISOString()
    };
  }
}
