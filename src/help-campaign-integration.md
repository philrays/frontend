# AI-Powered Image Captioning

FIDGA provides an AI-powered image captioning tool to help you generate descriptive, relevant captions for your campaign images. This feature leverages advanced AI models to analyze your uploaded images and suggest high-quality captions, saving you time and improving creative performance.

**How to Use Image Captioning:**
1. Navigate to the Content Generation module from the sidebar.
2. Find the "AI Powered Image Captioning" card within the Content Generation page.
3. Upload an image by clicking the upload button or dragging an image file onto the card.
4. Preview your image and click the "Generate Caption" button.
5. The AI will analyze your image and display a suggested caption below.
6. Copy or edit the caption as needed for your campaign assets.

**Use Cases:**
- Quickly generate creative captions for new ad creatives.
- Improve accessibility by providing descriptive alt text.
- Brainstorm ideas for social media or campaign content.

> **Note:** All image processing is performed securely. No images are stored after captioning.

---

# Integrating Campaigns with Google Ads and Social Media Channels

This guide outlines the process for integrating the FIDGA Campaign Management module with real ad platforms such as Google Ads and social media channels (Facebook, Instagram, etc.).

## 1. Prerequisites
- Obtain API credentials for each platform (Google Ads, Facebook/Meta, etc.).
- Set up OAuth2 authentication for secure access.
- Review each platform's API documentation:
  - [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
  - [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis/)

## 2. Backend Service Changes
- Update `services/campaignManagementService.js` to:
  - Add functions for creating, updating, and monitoring campaigns via each platform's API.
  - Store platform-specific campaign IDs and statuses.
- Add new environment variables for API keys, secrets, and callback URLs in `.env`.

## 3. Campaign Creation Flow
1. **User creates a campaign in the FIDGA UI.**
2. **Backend receives the request** and determines which platforms to target (Google Ads, Facebook, etc.).
3. **Backend authenticates** with the selected platform(s) using OAuth2.
4. **Backend sends a campaign creation request** to the platform's API, mapping FIDGA campaign fields to the required API fields.
5. **Backend stores the external campaign ID** and status in the FIDGA database.
6. **Backend returns the result** to the frontend, including any errors or platform-specific info.

## 4. Monitoring & Reporting
- Implement periodic sync jobs to fetch campaign performance and status from each platform.
- Display real-time status and analytics in the FIDGA dashboard.

## 5. Example: Google Ads Integration
- Use the [google-ads-api](https://www.npmjs.com/package/google-ads-api) npm package or direct REST/gRPC calls.
- Authenticate using a service account or OAuth2.
- Create a campaign using the API, passing targeting, budget, creatives, etc.
- Store the returned Google Ads campaign ID.

## 6. Example: Facebook/Instagram Integration
- Use the [facebook-nodejs-business-sdk](https://www.npmjs.com/package/facebook-nodejs-business-sdk).
- Authenticate with OAuth2.
- Create a campaign, ad set, and ads using the API.
- Store the returned campaign/ad IDs.

## 7. Security & Compliance
- Never store user credentials directly.
- Use secure storage for API keys and secrets.
- Follow each platform's compliance and review policies.

## 8. Error Handling
- Log and surface errors from external APIs to the user in a clear way.
- Allow retrying failed campaign creations.

## 9. Next Steps
- Implement platform selection in the campaign creation UI.
- Build backend service modules for each ad platform.
- Test with sandbox/test accounts before going live.

---

# FIDGA Help & Documentation

Welcome to the FIDGA Marketing Intelligence Platform! This page provides an overview of all modules, features, and how to use them. For more details, see the in-app tooltips and module-specific guides.

---

## Main Modules & Features

### 1. Dashboard Overview
- View high-level KPIs, campaign performance, and actionable insights.
- Access quick links to all modules from the sidebar.

### 2. Market Intelligence
- Analyze Shopify sales, social listening, competitor intelligence, and industry reports.
- Use trend forecasting and keyword insights to inform your marketing strategy.
- Endpoints: `/api/shopify-sales`, `/api/social-listening`, `/api/competitor-intel`, `/api/industry-reports`, `/api/trend-forecast`, `/api/keyword-insights-advanced`, `/api/customer-segments`, `/api/competitive-strategy`, `/api/actionable-recommendations`.

### 3. Campaign Management
- Create, update, and manage campaigns and sub-campaigns/ad groups.
- View campaign recommendations and alerts.
- Endpoints: `/api/campaigns`, `/api/campaigns/:id/recommendations`, `/api/campaigns/:id/alerts`.

### 4. Content Generation
- Generate marketing content using AI (LLM), chat with the AI agent, and get structured recommendations.
- Translate marketing content into multiple languages.
- Automated campaign creation: upload an image, enter ad copy, and select a platform to generate campaign assets.
- Endpoints: `/api/content/generate`, `/api/ai-agent/chat`, `/api/ai-agent/structured-recommend`, `/api/ai-agent/translate`, `/api/image-caption`, `/api/automate-campaign`.

### 5. Dynamic Creative Optimization (DCO)
- Generate ad creative variations by combining product data with creative templates.
- Use the dedicated DCO page from the sidebar.
- Endpoint: `/api/dco/generate`.

### 6. Performance Monitoring
- Monitor campaign performance, detect anomalies, and view forecasts.
- Endpoints: `/api/performance/summary`, `/api/performance/anomalies`, `/api/performance/forecast`.

### 7. Feedback & Suggestions
- Submit feedback, feature requests, or report issues.
- Attach files and provide contact info for follow-up.
- Admins can view all feedback and stats in the Admin Dashboard.
- Endpoints: `/api/admin/feedback`, `/api/admin/overview`.

### 8. Help & Documentation
- Access this help page anytime from the sidebar.
- For detailed guides, see the module-specific markdown files:
  - Campaign Integration: `help-campaign-integration.md`
  - Market Intelligence: `help-market-intelligence.md`
  - Performance Monitoring: `help-performance-monitoring.md`

---

## Tips & Best Practices
- Use the sidebar to navigate between modules.
- Hover over tooltips and info icons for extra guidance.
- For campaign-related feedback, select the campaign and sub-campaign for more targeted support.
- Use the DCO page for advanced creative automation.
- Admins can switch between user and admin views using the header button.

---

## Need More Help?
- Contact your FIDGA admin or support team for further assistance.
- For technical issues, check the browser console for errors and report them via the Feedback module.

---

*This documentation is kept up to date with the latest features and modules. For more details, see the in-app guides or contact support.*
