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

// === Campaign Management API ===

export async function createCampaign(data) {
  const res = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function listCampaigns() {
  const res = await fetch('/api/campaigns');
  return res.json();
}

export async function getCampaign(id) {
  const res = await fetch(`/api/campaigns/${id}`);
  return res.json();
}

export async function updateCampaign(id, data) {
  const res = await fetch(`/api/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getCampaignRecommendations(id) {
  const res = await fetch(`/api/campaigns/${id}/recommendations`);
  return res.json();
}

export async function getCampaignAlerts(id) {
  const res = await fetch(`/api/campaigns/${id}/alerts`);
  return res.json();
}

export async function generateCampaignBrief(data) {
  const res = await fetch('/api/campaigns/brief', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getCampaignSegments(campaignId) {
  const res = await fetch(`/api/campaigns/${campaignId}/llm-segments`);
  return res.json();
}

export async function getCampaignABTests(campaignId) {
  const res = await fetch(`/api/campaigns/${campaignId}/llm-abtests`);
  return res.json();
}

export async function getCampaignBudgetOptimization(campaignId) {
  const res = await fetch(`/api/campaigns/${campaignId}/llm-budget`);
  return res.json();
}

export async function getCampaignSummary(campaignId) {
  const res = await fetch(`/api/campaigns/${campaignId}/llm-summary`);
  return res.json();
}

// === Performance Monitoring API ===

export async function getPerformanceSummary() {
  const res = await fetch('/api/performance/summary');
  return res.json();
}

export async function getPerformanceAnomalies() {
  const res = await fetch('/api/performance/anomalies');
  return res.json();
}

export async function getPerformanceForecast() {
  const res = await fetch('/api/performance/forecast');
  return res.json();
}

// === Content Generation API ===

export async function generateContentLLM(data) {
  const res = await fetch('/api/content/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function scoreContentLLM(data) {
  const res = await fetch('/api/content/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function bulkGenerateContentLLM(data) {
  const res = await fetch('/api/content/bulk-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === LLM Chat/Ask API ===

export async function askLLM(data) {
  const res = await fetch('/api/ask-llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getOpportunitiesLLM() {
  const res = await fetch('/api/opportunities/llm');
  return res.json();
}

export async function generateReportLLM(data) {
  const res = await fetch('/api/reports/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Image Analysis API ===

export async function getImageCaption(data) {
  const res = await fetch('/api/image-caption', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Google Analytics API ===

export async function fetchGATraffic() {
  const res = await fetch('/api/ga-traffic');
  return res.json();
}

export async function fetchGAAudienceDemographics() {
  const res = await fetch('/api/ga-audience-demographics');  
  return res.json();
}

export async function fetchGACampaignPerformance() {
  const res = await fetch('/api/ga-campaign-performance');
  return res.json();
}

export async function fetchGAContentPerformance() {
  const res = await fetch('/api/ga-content-performance');
  return res.json();
}

export async function fetchAnalyticsMock() {
  const res = await fetch('/api/analytics/mock');
  return res.json();
}

// === Gemini AI API ===

export async function generateGeminiContent(data) {
  const res = await fetch('/api/gemini-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function generatePersonalizedContent(data) {
  const res = await fetch('/api/generate-personalized-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Market Intelligence API ===

export async function fetchMarketIntelligence(data) {
  const res = await fetch('/api/market-intelligence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Indian Languages AI Agent API ===

export async function fetchIndianLanguagesAI() {
  const res = await fetch('/api/ai-agent/indian-languages');
  return res.json();
}

export async function processIndianLanguagesContent(data) {
  const res = await fetch('/api/ai-agent/indian-languages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === Campaign Management Extended API ===

export async function deleteCampaign(id) {
  const res = await fetch(`/api/campaigns/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function automateCampaignStatus() {
  const res = await fetch('/api/campaigns/automate-status', {
    method: 'POST'
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
  const res = await fetch('/api/sales');
  return res.json();
}

// === Basic Feedback API ===

export async function submitFeedback(data) {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// === System Health API ===

export async function getHealthCheck() {
  const res = await fetch('/health');
  return res.json();
}

export async function getSystemStatus() {
  const res = await fetch('/api/status');
  return res.json();
}

// === Additional APIs ===

export async function fetchCompetitorIntelligence() {
  const res = await fetch('/api/competitor-intelligence');
  return res.json();
}

// === API Testing Functions ===

export async function checkAPIHealth() {
  return getHealthCheck();
}

export async function checkAPIStatus() {
  return getSystemStatus();
}

// Utility function to safely call API functions with error handling
export async function safeApiCall(apiFunction, ...args) {
  try {
    const result = await apiFunction(...args);
    if (result && result.success !== undefined) {
      return result;
    }
    // If no success field, assume success
    return { success: true, data: result };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      success: false, 
      error: error.message || 'API call failed',
      data: null 
    };
  }
}
