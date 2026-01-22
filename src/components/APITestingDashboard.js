import React, { useState, useEffect } from 'react';
import {
  // GA4 APIs
  fetchGATraffic,
  fetchGAAudienceDemographics,
  fetchGACampaignPerformance,
  fetchGAContentPerformance,
  fetchAnalyticsMock,
  
  // Content Generation APIs
  generateGeminiContent,
  generatePersonalizedContent,
  
  // Market Intelligence APIs
  fetchMarketIntelligence,
  fetchSocialListening,
  fetchCompetitorIntel,
  fetchIndustryReports,
  fetchTrendForecast,
  fetchKeywordInsightsAdvanced,
  fetchCustomerSegments,
  fetchCompetitiveStrategy,
  fetchActionableRecommendations,
  
  // Campaign APIs
  listCampaigns,
  automateCampaignStatus,
  
  // Sales & Indian Language APIs
  fetchSalesData,
  fetchIndianLanguagesAI,
  processIndianLanguagesContent,
  
  // Health Check APIs
  checkAPIHealth,
  checkAPIStatus,
  
  // Utility
  safeApiCall
} from '../api';

const APITestingDashboard = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [selectedTest, setSelectedTest] = useState('all');

  const apiTests = [
    // GA4 Analytics Tests
    { name: 'GA Traffic', func: fetchGATraffic, category: 'Analytics' },
    { name: 'GA Audience Demographics', func: fetchGAAudienceDemographics, category: 'Analytics' },
    { name: 'GA Campaign Performance', func: fetchGACampaignPerformance, category: 'Analytics' },
    { name: 'GA Content Performance', func: fetchGAContentPerformance, category: 'Analytics' },
    { name: 'Analytics Mock Data', func: fetchAnalyticsMock, category: 'Analytics' },
    
    // Content Generation Tests
    { 
      name: 'Gemini Content Generation', 
      func: () => generateGeminiContent({ prompt: 'Generate a marketing headline for eco-friendly footwear' }),
      category: 'Content' 
    },
    { 
      name: 'Personalized Content Generation', 
      func: () => generatePersonalizedContent({ 
        segmentName: 'Eco-Conscious Millennials', 
        channel: 'social_media_post', 
        baseTopic: 'sustainable footwear' 
      }),
      category: 'Content' 
    },
    
    // Market Intelligence Tests
    { 
      name: 'Market Intelligence', 
      func: () => fetchMarketIntelligence({ industry: 'retail', region: 'India' }),
      category: 'Market Intelligence' 
    },
    { name: 'Social Listening', func: fetchSocialListening, category: 'Market Intelligence' },
    { name: 'Competitor Intelligence', func: fetchCompetitorIntel, category: 'Market Intelligence' },
    { name: 'Industry Reports', func: fetchIndustryReports, category: 'Market Intelligence' },
    { name: 'Trend Forecast', func: fetchTrendForecast, category: 'Market Intelligence' },
    { 
      name: 'Keyword Insights', 
      func: () => fetchKeywordInsightsAdvanced('sustainable footwear'),
      category: 'Market Intelligence' 
    },
    { name: 'Customer Segments', func: fetchCustomerSegments, category: 'Market Intelligence' },
    { name: 'Competitive Strategy', func: fetchCompetitiveStrategy, category: 'Market Intelligence' },
    { name: 'Actionable Recommendations', func: fetchActionableRecommendations, category: 'Market Intelligence' },
    
    // Campaign Tests
    { name: 'List Campaigns', func: listCampaigns, category: 'Campaigns' },
    { name: 'Automate Campaign Status', func: () => automateCampaignStatus({}), category: 'Campaigns' },
    
    // Sales & Languages Tests
    { name: 'Sales Data', func: fetchSalesData, category: 'Business Data' },
    { name: 'Indian Languages AI', func: fetchIndianLanguagesAI, category: 'AI Services' },
    { 
      name: 'Process Indian Languages', 
      func: () => processIndianLanguagesContent({ 
        text: 'Welcome to our store', 
        targetLanguage: 'hi',
        context: 'marketing' 
      }),
      category: 'AI Services' 
    },
    
    // Health Tests
    { name: 'API Health Check', func: checkAPIHealth, category: 'System' },
    { name: 'API Status Check', func: checkAPIStatus, category: 'System' }
  ];

  const runSingleTest = async (test) => {
    setTestResults(prev => ({
      ...prev,
      [test.name]: { status: 'running', data: null, error: null, duration: null }
    }));

    const startTime = Date.now();
    try {
      const result = await safeApiCall(test.func);
      const duration = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [test.name]: {
          status: result.success !== false ? 'success' : 'error',
          data: result,
          error: result.success === false ? result.error : null,
          duration
        }
      }));
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => ({
        ...prev,
        [test.name]: {
          status: 'error',
          data: null,
          error: error.message,
          duration
        }
      }));
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults({});
    
    for (const test of apiTests) {
      await runSingleTest(test);
      // Add small delay between tests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTesting(false);
  };

  const runCategoryTests = async (category) => {
    setTesting(true);
    const categoryTests = apiTests.filter(test => test.category === category);
    
    for (const test of categoryTests) {
      await runSingleTest(test);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTesting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const categories = [...new Set(apiTests.map(test => test.category))];
  const testsByCategory = categories.reduce((acc, category) => {
    acc[category] = apiTests.filter(test => test.category === category);
    return acc;
  }, {});

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">API Integration Testing Dashboard</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={runAllTests}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test All APIs'}
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => runCategoryTests(category)}
              disabled={testing}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm disabled:opacity-50"
            >
              Test {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(testResults).length > 0 && (
            <>
              <div className="bg-gray-800 p-4 rounded">
                <h3 className="font-semibold text-green-400 mb-2">Success</h3>
                <div className="text-2xl font-bold">
                  {Object.values(testResults).filter(r => r.status === 'success').length}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <h3 className="font-semibold text-red-400 mb-2">Errors</h3>
                <div className="text-2xl font-bold">
                  {Object.values(testResults).filter(r => r.status === 'error').length}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <h3 className="font-semibold text-yellow-400 mb-2">Running</h3>
                <div className="text-2xl font-bold">
                  {Object.values(testResults).filter(r => r.status === 'running').length}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Test Results by Category */}
      <div className="space-y-6">
        {Object.entries(testsByCategory).map(([category, tests]) => (
          <div key={category} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">{category} APIs</h3>
            <div className="space-y-2">
              {tests.map(test => {
                const result = testResults[test.name];
                return (
                  <div key={test.name} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getStatusIcon(result?.status)}</span>
                      <span className="font-medium">{test.name}</span>
                      {result?.duration && (
                        <span className="text-xs text-gray-400">({result.duration}ms)</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getStatusColor(result?.status)}`}>
                        {result?.status || 'pending'}
                      </span>
                      <button
                        onClick={() => runSingleTest(test)}
                        disabled={testing}
                        className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs disabled:opacity-50"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Detailed Results</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="bg-gray-800 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getStatusIcon(result.status)}</span>
                  <span className="font-medium">{testName}</span>
                  {result.duration && (
                    <span className="text-xs text-gray-400">({result.duration}ms)</span>
                  )}
                </div>
                
                {result.error && (
                  <div className="text-red-400 text-sm mb-2">
                    Error: {result.error}
                  </div>
                )}
                
                {result.data && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-200">
                      View Response Data
                    </summary>
                    <pre className="mt-2 bg-gray-900 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APITestingDashboard;
