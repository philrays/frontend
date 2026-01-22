import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// Main documentation topics for FIDGA Help & Documentation
const documentationTopics = [
	{
		title: 'Complete FIDGA User Guide',
		content: `
# FIDGA Platform User Guide

## Welcome to FIDGA Marketing Intelligence Platform

FIDGA is a comprehensive marketing intelligence platform that provides real-time analytics, campaign management, and business insights to help you make data-driven marketing decisions.

## Quick Start Guide

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for real-time data
- Minimum screen resolution: 1024x768

### Navigation Basics
- **Sidebar Menu**: Click any module to switch between different sections
- **Admin Panel Button**: Click "Admin Panel" (blue button) in header to open backend admin in new tab
- **API Docs Button**: Click "API Docs" (green button) in header to open API documentation in new tab
- **Module Cards**: Interactive cards showing key metrics and data
- **Charts**: Hover over charts for detailed data points

## Dashboard Overview

Your central hub for monitoring key performance indicators:

### Key Metrics
- **Total Users**: Unique visitors to your properties
- **New Users**: First-time visitors  
- **Sessions**: Total browsing sessions
- **Page Views**: Total pages viewed
- **Conversion Rate**: Goal completion percentage
- **Sales Data**: Revenue, transactions, top products

### Using the Dashboard
1. **Real-time Data**: Metrics update automatically
2. **Chart Interactions**: Hover over chart points for details
3. **Growth Indicators**: Green arrows show positive growth, red show decline

## Market Intelligence

Deep insights into industry trends and competitor analysis:

### Features
- **Industry Trends**: Current and emerging trends with growth percentages
- **Competitive Analysis**: Competitor performance and positioning
- **Keyword Insights**: SEO opportunities and performance
- **Content Recommendations**: AI-generated content suggestions

### How to Use
1. Navigate to "Market Intelligence" in the sidebar
2. Review trends dashboard for current market conditions
3. Click individual trends for detailed analysis
4. Use competitor data to benchmark performance

## Campaign Management

Create and manage marketing campaigns:

### Campaign Creation
1. Click "Campaign Management" in sidebar
2. Select "Create New Campaign"
3. Fill in campaign details (name, budget, dates, audience)
4. Save and activate campaign

### Monitoring Features
- **Performance Metrics**: Real-time campaign performance
- **Budget Tracking**: Spend vs. allocated budget
- **Conversion Tracking**: Goal completions and ROI
- **Optimization Recommendations**: AI-powered suggestions

## Performance Monitoring

Track marketing performance across all channels:

### Key Features
- **Real-time Analytics**: Live performance data
- **Multi-channel Tracking**: Performance across platforms
- **Alert System**: Automated performance alerts
- **Historical Analysis**: Trend analysis over time

### Setting Up Alerts
1. Navigate to Performance Monitoring
2. Click "Set Alerts"
3. Define alert conditions and thresholds
4. Save configurations

## Content Generation

AI-powered content creation:

### Content Types
- **Social Media Posts**: Platform-optimized content
- **Email Marketing**: Subject lines and body content
- **Ad Copy**: Advertisement text and headlines
- **Blog Posts**: SEO-optimized articles

### Best Practices
- Provide detailed context for better results
- Review and edit generated content
- Maintain brand consistency
- Test different variations

## Dynamic Creative Optimization

Automatically optimize creative assets:

### Features
- **Automated Testing**: A/B test creative variations
- **Performance Optimization**: Real-time adjustments
- **Audience Personalization**: Customized creatives per segment
- **Learning Algorithm**: Continuous improvement

## Admin Features

Administrative tools for platform management:

### Backend Admin Panel
Access the comprehensive backend admin dashboard by clicking the "Admin Panel" button in the header:
- **Real-time System Monitoring**: Server health, uptime, database connection status
- **API Endpoint Testing**: Interactive testing of all API endpoints with live results
- **System Logs**: Real-time monitoring of system activity and errors
- **Performance Metrics**: Response times, server load, and system performance
- **Database Status**: MongoDB connection health and statistics
- **Quick Actions**: Server management and maintenance tools

### API Documentation Interface
Access interactive API documentation by clicking the "API Docs" button in the header:
- **Interactive Testing**: Test all endpoints directly from the browser
- **Request/Response Examples**: Complete API usage examples with sample data
- **Authentication Guide**: Detailed implementation instructions
- **Integration Examples**: Code samples for common use cases
- **Endpoint Reference**: Complete list of available API endpoints

### How to Access Admin Tools
1. **Backend Admin**: Click the blue "Admin Panel" button in the top-right header
2. **API Documentation**: Click the green "API Docs" button in the top-right header
3. **New Tab Access**: Both admin tools open in separate tabs for seamless workflow
4. **Direct URLs**: 
   - Admin Panel: http://localhost:5050/admin
   - API Docs: http://localhost:5050/docs

## Troubleshooting

### Common Issues
- **Dashboard Not Loading**: Check internet, clear cache, try different browser
- **Data Not Updating**: Refresh page, check data sources, verify permissions
- **Slow Performance**: Close unused tabs, check network speed
- **Login Issues**: Verify credentials, clear browser data

### Getting Help
- Use the feedback system for questions
- Check system status in admin dashboard
- Review API documentation for technical issues

## API Integration

For developers integrating with FIDGA:

### Base URL
\`\`\`
http://localhost:5050/api
\`\`\`

### Key Endpoints
- \`GET /api/analytics/mock\` - Analytics data
- \`GET /api/sales\` - Sales performance  
- \`POST /api/market-intelligence\` - Market insights
- \`GET /api/campaigns\` - Campaign data
- \`GET /api/status\` - System status

### Response Format
\`\`\`json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message",
  "error": null
}
\`\`\`

## Support

### Getting Help
- **Platform Feedback**: Use built-in feedback system
- **Technical Issues**: Contact through admin dashboard
- **Feature Requests**: Submit through feedback module

*Complete documentation available at: http://localhost:5050/docs*
		`,
	},
	{
		title: 'Getting Started with FIDGA',
		content: `
FIDGA is an AI-powered marketing intelligence platform that helps you analyze trends, manage campaigns, generate content, and gain actionable insights. Use the sidebar to navigate between Dashboard, Market Intelligence, Campaign Management, Content Generation, Performance Monitoring, Feedback, and Help.

**Key Features:**

- Unified dashboard for all marketing data
- AI-powered campaign and content generation
- Real-time market and competitor intelligence
- Automated performance monitoring and anomaly detection
- Integrated feedback and AI suggestions
- Secure, privacy-compliant data handling

![Dashboard Screenshot](/help-screenshots/dashboard-placeholder.png)
	`,
	},
	{
		title: 'Daily End-of-Day Documentation Update Process',
		content: `
To ensure the Help & Documentation section remains current, FIDGA runs an automated end-of-day (EOD) update process:
1. All new features, bug fixes, and user feedback from the day are summarized.
2. The documentationTopics array is programmatically updated with new or revised topics.
3. AI reviews recent support tickets and user questions to suggest new help topics.
4. The Help & Documentation UI is refreshed to reflect the latest guidance.

This process ensures users always have access to the most up-to-date information and actionable guidance.
    `,
	},
	{
		title: 'Campaign Integration Guide',
		content: `
To integrate your campaigns:
1. Go to the Campaign Management page.
2. Click 'Add Campaign' and enter campaign details.
3. Optionally upload an image and set your goal, audience, and budget.
4. Use the Automated Campaign Creation card to generate campaign ideas and assets with AI.
5. Review and add generated campaigns to your list.

Advanced Integration:
- Connect Google Ads, Meta Ads, or Shopify accounts (coming soon)
- Import/export campaign data in CSV/JSON
- Use campaign templates for rapid setup
    `,
	},
	{
		title: 'Campaign Calendar & Scheduling',
		content: `
# Campaign Calendar & Scheduling

FIDGA provides powerful calendar-based campaign management tools to help you visualize, schedule, and preview your marketing campaigns.

## 📅 **Campaign Calendar Features**

### **Interactive Calendar View**
- **Multiple Views**: Month, week, and day views for different planning perspectives
- **Color-Coded Campaigns**: 
  - 🟢 **Green**: Active campaigns
  - 🟡 **Yellow**: Paused campaigns  
  - ⚪ **Gray**: Completed campaigns
  - 🔵 **Blue**: Draft campaigns
- **Drag & Drop**: Easy campaign rescheduling (coming soon)
- **Quick Creation**: Click and drag to create new campaigns on specific dates

### **How to Use the Calendar**
1. **Access**: Navigate to Campaign Management → Click "Show Calendar"
2. **View Campaigns**: All scheduled campaigns appear as colored blocks
3. **Click Events**: Click any campaign event to open the preview panel
4. **Create New**: Select dates on the calendar to quickly create campaigns with pre-filled dates
5. **Navigation**: Use arrows and view toggles to navigate different time periods

## 👁️ **Campaign Preview System**

### **Detailed Campaign Preview**
When you click on a calendar event or campaign, the preview panel shows:
- **Campaign Overview**: Name, status, budget, and timeline
- **Visual Assets**: Campaign images and creative materials
- **Performance Metrics**: Status indicators and progress tracking
- **Action Buttons**: Quick access to edit, analyze, or delete campaigns

### **Preview Panel Features**
- **Status Badges**: Color-coded status indicators with clear labels
- **Budget Display**: Financial information formatted in Indian Rupees (₹)
- **Date Range**: Clear start and end date visibility
- **Description**: Full campaign description and objectives
- **Action Menu**: Edit, view analytics, or delete options

## 🛠️ **Calendar Management**

### **Campaign Status Automation**
- **Auto-Activation**: Draft campaigns automatically become Active on their start date
- **Auto-Completion**: Active campaigns automatically mark as Completed after their end date
- **Manual Updates**: Use "Automate Status" button to update all campaigns at once

### **Calendar Integration Tips**
1. **Planning**: Use month view for strategic planning and resource allocation
2. **Daily Management**: Switch to day/week view for detailed daily operations
3. **Overlap Detection**: Easily spot campaign conflicts or synergies
4. **Resource Planning**: Visualize budget allocation across time periods

## 📊 **Campaign Analytics Integration**

### **Performance Tracking**
- **Calendar Metrics**: View campaign performance directly from calendar events
- **Timeline Analysis**: Track performance changes over campaign duration
- **Comparative View**: Compare multiple campaigns running simultaneously

### **Reporting Features**
- **Campaign Reports**: Generate reports for specific date ranges
- **Performance Summaries**: Get insights on campaign effectiveness over time
- **Export Options**: Download calendar data for external analysis

## 🎯 **Best Practices**

### **Campaign Scheduling**
1. **Buffer Time**: Leave gaps between major campaigns for analysis and optimization
2. **Seasonal Planning**: Use calendar to align campaigns with festivals and shopping seasons
3. **Resource Allocation**: Spread high-budget campaigns to avoid resource conflicts
4. **Testing Windows**: Schedule A/B tests with sufficient duration

### **Calendar Organization**
- **Naming Convention**: Use clear, descriptive campaign names for easy identification
- **Status Management**: Regularly update campaign statuses for accurate calendar view
- **Archive Completed**: Keep calendar clean by archiving old completed campaigns
- **Team Coordination**: Use calendar for team alignment and deadline tracking

## 🔧 **Keyboard Shortcuts**

- **M**: Switch to Month view
- **W**: Switch to Week view  
- **D**: Switch to Day view
- **T**: Go to Today
- **←/→**: Navigate previous/next time period
- **Esc**: Close preview panel

## 📱 **Mobile Calendar Access**

The campaign calendar is fully responsive and optimized for mobile devices:
- **Touch Navigation**: Swipe to navigate between months/weeks
- **Tap to Preview**: Single tap to open campaign previews
- **Mobile Actions**: All calendar functions available on mobile devices
- **Offline Mode**: Basic calendar viewing available offline

## 🔄 **Calendar Sync (Coming Soon)**

Future updates will include:
- **Google Calendar Integration**: Sync with your Google Calendar
- **iCal Export**: Export campaigns to external calendar applications
- **Team Sharing**: Share campaign calendars with team members
- **Notification System**: Automated reminders for campaign milestones

For assistance with calendar features, use the Feedback form or refer to the troubleshooting section below.

### **Troubleshooting Calendar Issues**
- **Calendar not loading**: Refresh the page and ensure internet connectivity
- **Events not showing**: Check campaign date formats and status settings
- **Preview not opening**: Clear browser cache and try again
- **Mobile display issues**: Update your browser to the latest version
    `,
	},
	{
		title: 'Market Intelligence Overview',
		content: `
The Market Intelligence Dashboard provides:
- Trend Analysis: Discover emerging trends and keywords, visualized with interactive graphs.
- Competitor Intelligence: See competitor campaigns, ad spend, and market share.
- Sentiment Analysis: Understand public sentiment with real-time pie charts.
- Recommendations: Get AI-powered suggestions for your next move.
- Keyword Insights, Customer Segments, and Competitive Strategy tabs for deeper analysis.

Tips:
- Use filters to drill down by date, region, or topic.
- Hover over graphs for detailed data points.
    `,
	},
	{
		title: 'Enhanced Market Intelligence - Non-GA4 Data Sources',
		content: `
# FIDGA's Enhanced Market Intelligence System

FIDGA's Market Intelligence goes beyond traditional Google Analytics data by integrating multiple external data sources to provide comprehensive business insights.

## 📊 **Data Sources & Capabilities**

### **Social Media Listening**
- **Platforms Monitored**: Instagram, Twitter/X, Facebook, LinkedIn, YouTube
- **Data Collected**: 
  - Brand mentions and sentiment analysis
  - Engagement metrics (likes, shares, reach)
  - Trending hashtags and social conversations
  - Emotion detection (joy, anger, surprise, etc.)
- **Benefits**: Real-time brand monitoring, customer feedback analysis, and trend identification

### **Competitor Intelligence**
- **Data Sources**: SEMrush/SimilarWeb equivalent APIs, social media analytics
- **Insights Available**:
  - Market share analysis across 4+ major competitors
  - Ad spend tracking and budget analysis
  - Pricing intelligence and positioning
  - SEO keyword strategies
  - Social media performance metrics
  - Customer ratings and review analysis
- **Use Cases**: Competitive benchmarking, market gap identification, pricing strategy optimization

### **Industry Reports & Market Research**
- **Sources**: Market research APIs, industry associations, trade publications
- **Content Includes**:
  - Market size and growth projections
  - Regional market analysis (focus on South India)
  - Technology adoption trends
  - Consumer behavior studies
  - Sustainability and eco-friendly trends
- **Value**: Strategic planning, market opportunity assessment, trend forecasting

### **Advanced Analytics Features**
- **Trend Forecasting**: Time-series analysis with anomaly detection
- **Customer Segmentation**: 4 distinct segments identified (Eco-Conscious Millennials, Budget-Conscious Families, etc.)
- **Regional Insights**: Customized data for Indian market preferences
- **Keyword Intelligence**: Search volume, competition analysis, and trending terms

## 🎯 **How to Use Market Intelligence**

### **Accessing Data**
1. Navigate to **Market Intelligence** from the main sidebar
2. Use the tab navigation to explore different data categories:
   - **Trends**: Market trend analysis with growth charts
   - **Competitors**: Detailed competitor comparison
   - **Sentiment**: Social media sentiment breakdown
   - **Keywords**: Search trend and keyword analysis
   - **Segments**: Customer segmentation insights
   - **Strategy**: Competitive strategy recommendations

### **Understanding the Dashboard**
- **Interactive Charts**: Hover over data points for detailed metrics
- **Color-Coded Insights**: 
  - Green: Positive trends/sentiment
  - Yellow: Neutral or cautionary data
  - Red: Negative trends or areas needing attention
- **Real-time Updates**: Data refreshes automatically with latest insights

### **Actionable Recommendations**
The system provides specific, data-driven recommendations such as:
- Mobile-first experience optimization (62% user preference)
- Sustainable packaging marketing (28% growth trend)
- Target demographic focusing (25-34 age group priority)
- Regional customization opportunities (South India +25% growth)

## 📈 **Key Metrics & KPIs**

### **Social Listening Metrics**
- Sentiment distribution (Positive/Neutral/Negative percentages)
- Mention volume across platforms
- Engagement rates and reach metrics
- Trending hashtags and conversation themes

### **Competitor Analysis**
- Average market share: 20.75%
- Average ad spend: $217,500
- Average pricing: ₹412
- Market positioning and strategy insights

### **Market Trends**
- Growth rates by category (Sustainable: +28%, Mobile Commerce: +48%)
- Regional performance variations
- Consumer preference shifts
- Technology adoption rates

## 🔧 **API Endpoints for Developers**

Advanced users can access individual data sources via API:
- \`/api/social-listening\` - Social media data
- \`/api/competitor-intelligence\` - Competitor analysis
- \`/api/industry-reports\` - Market research data
- \`/api/trend-forecast\` - Predictive analytics

## 💡 **Best Practices**

### **Data Interpretation**
- Compare trends over time periods (7-day, 30-day views)
- Cross-reference multiple data sources for validation
- Focus on actionable insights rather than vanity metrics
- Consider regional and cultural context for Indian market

### **Strategic Application**
1. **Product Development**: Use trend data to guide product roadmap
2. **Marketing Strategy**: Leverage sentiment analysis for campaign messaging
3. **Pricing Strategy**: Apply competitor intelligence for positioning
4. **Market Entry**: Utilize regional insights for expansion planning

## 📋 **Troubleshooting**

### **Common Issues**
- **No data showing**: Check internet connection and refresh the page
- **Outdated information**: Data updates every 15 minutes; wait for next refresh
- **Missing competitors**: System focuses on top 4 competitors; smaller players may not appear

### **Data Quality Notes**
- Social media data represents sample mentions, not exhaustive coverage
- Competitor data estimated from public sources and APIs
- Industry reports combine multiple research sources for accuracy
- All pricing data in Indian Rupees (₹) for local relevance

## 🔄 **Updates & Maintenance**

- **Data Freshness**: Updated every 15 minutes during business hours
- **New Features**: Monthly releases with additional data sources
- **Accuracy Improvements**: Continuous machine learning model updates
- **Regional Expansion**: Additional markets beyond India coming soon

For technical support or feature requests related to Market Intelligence, use the Feedback form or contact support@fidga.ai.
    `,
	},
	{
		title: 'Performance Monitoring & Analytics',
		content: `
Monitor your marketing performance with:
- Traffic & Engagement: Users, sessions, bounce rate, page views.
- Conversion & Funnel: Conversion rate, goal completions, funnel drop-off.
- Acquisition & Channel: Top channels, CPA, ROAS, CTR.
- Ad & Campaign Analytics: Ad spend, clicks, conversions, CPM, CPC.
- E-commerce Metrics: Sales volume, revenue, refunds, cart abandonment.
- User Behavior: Heatmaps, session recordings, user flows.

Set up alerts for anomalies and review AI-generated forecasts and recommendations. Visualize KPIs with interactive charts.
    `,
	},
	{
		title: 'Content Generation with AI',
		content: `
Use the Content Generation module to:
- Generate ad copy, headlines, and creative ideas with Google Gemini or Abacus.AI.
- Upload images and let the AI suggest campaign text and visuals.
- Review, edit, and export generated content for your campaigns.
- Use brand voice presets for consistent messaging.

All content is generated using advanced LLMs and can be customized for your brand voice.
    `,
	},
	{
		title: 'Feedback & AI Suggestions',
		content: `
Share your feedback using the Feedback & Suggestions form:
- Select a topic (General, Campaign, System, Feature Request, Bug Report).
- Optionally select a campaign and sub-campaign.
- Enter your feedback and submit.
- Click 'Get AI Suggestions' to see how the AI would improve your feedback or suggest next steps.

Your feedback helps us improve FIDGA for everyone! The most common feedback topics are automatically added to this documentation during the EOD update.
    `,
	},
	{
		title: 'Using the FIDGA AI Agent',
		content: `
The FIDGA AI Agent can:
- Answer marketing questions and provide recommendations.
- Translate content and suggest campaign improvements.
- Remember your previous queries for context-aware help.
- Summarize documentation and provide step-by-step guides.

Access the AI Agent from the Content Generation or Help & Documentation pages.
    `,
	},
	{
		title: 'Help & Documentation Search',
		content: `
Use the search box to quickly find help topics. If you need more detailed assistance, use the 'Ask AI' input to get LLM-powered answers tailored to your question. The search and AI help are updated daily with new topics and answers.
    `,
	},
	{
		title: 'Troubleshooting & Support',
		content: `
If you encounter issues:
- Check your internet connection and refresh the page.
- Review error messages for details.
- Use the Feedback form to report bugs or request features.
- For urgent support, contact the FIDGA team at support@fidga.ai.

Support topics and solutions are updated daily based on user reports and AI analysis.
    `,
	},
	{
		title: 'Release Notes & What’s New',
		content: `
Stay up to date with the latest FIDGA features, improvements, and bug fixes. This section is updated automatically at the end of each day with a summary of all changes deployed to the platform.
    `,
	},
	{
		title: 'Security & Privacy',
		content: `
FIDGA is committed to protecting your data:
- All data is encrypted in transit and at rest.
- We comply with GDPR, CCPA, and other privacy regulations.
- User data is never shared with third parties without consent.
- Security documentation is reviewed and updated daily as part of the EOD process.
    `,
	},
	{
		title: 'API Reference & Developer Resources',
		content: `
# FIDGA API Reference

FIDGA provides comprehensive REST APIs for developers to integrate market intelligence and campaign management features into their own applications.

## 🔑 **API Authentication**

Currently, FIDGA APIs are open for development use. In production environments, API key authentication will be required:

\`\`\`javascript
// Future API key usage
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
\`\`\`

## 📊 **Market Intelligence APIs**

### **Comprehensive Market Intelligence**
\`\`\`
POST /api/market-intelligence
Content-Type: application/json

{
  "filters": {
    "region": "India",
    "timeframe": "30d"
  }
}
\`\`\`

**Response includes:**
- Market trends and growth data
- Competitor intelligence
- Sentiment analysis
- Consumer behavior insights
- Actionable recommendations
- Keyword insights
- Customer segments
- Competitive strategy data

### **Social Media Listening**
\`\`\`
GET /api/social-listening
\`\`\`

**Returns:**
- Social media mentions across platforms
- Sentiment trends over time
- Top hashtags and engagement metrics
- Platform-specific insights

### **Competitor Intelligence**
\`\`\`
GET /api/competitor-intelligence
\`\`\`

**Provides:**
- Detailed competitor profiles
- Market share analysis
- Pricing intelligence
- Ad spend tracking
- SEO keyword strategies

### **Industry Reports**
\`\`\`
GET /api/industry-reports
\`\`\`

**Includes:**
- Latest market research
- Industry trend analysis
- Growth projections
- Regional insights

### **Trend Forecasting**
\`\`\`
GET /api/trend-forecast
\`\`\`

**Features:**
- Predictive analytics
- Anomaly detection
- Growth forecasting
- Trend analysis

## 🎯 **Campaign Management APIs**

### **Campaign CRUD Operations**

#### **Create Campaign**
\`\`\`
POST /api/campaigns
Content-Type: application/json

{
  "name": "Summer Campaign 2025",
  "budget": 50000,
  "startDate": "2025-07-01",
  "endDate": "2025-08-31",
  "status": "Draft",
  "description": "Eco-friendly summer footwear campaign",
  "image": "data:image/jpeg;base64,..."
}
\`\`\`

#### **Get All Campaigns**
\`\`\`
GET /api/campaigns
\`\`\`

#### **Get Campaign by ID**
\`\`\`
GET /api/campaigns/{id}
\`\`\`

#### **Update Campaign**
\`\`\`
PUT /api/campaigns/{id}
Content-Type: application/json

{
  "status": "Active",
  "budget": 60000
}
\`\`\`

#### **Delete Campaign**
\`\`\`
DELETE /api/campaigns/{id}
\`\`\`

### **Automated Campaign Features**

#### **AI Campaign Generation**
\`\`\`
POST /api/automate-campaign
Content-Type: application/json

{
  "goal": "Launch new product",
  "audience": "Young adults, India",
  "budget": 75000,
  "imageData": "base64_encoded_image",
  "mimeType": "image/jpeg"
}
\`\`\`

#### **Campaign Status Automation**
\`\`\`
POST /api/campaigns/automate-status
\`\`\`

Automatically updates campaign statuses based on start/end dates.

## 🤖 **AI & Content Generation APIs**

### **Content Generation**
\`\`\`
POST /api/gemini-content
Content-Type: application/json

{
  "prompt": "Create ad copy for eco-friendly footwear targeting millennials"
}
\`\`\`

### **Trend Expansion (AI-Powered)**
\`\`\`
POST /api/gemini-trend-expansion
Content-Type: application/json

{
  "trend": "Sustainable Packaging"
}
\`\`\`

## 📈 **Analytics & Reporting APIs**

### **Google Analytics Integration**
\`\`\`
GET /api/ga-traffic
\`\`\`

**Returns:**
- Total users and new users
- Session data
- Page views
- Top performing pages
- Engagement metrics

### **Feedback Collection**
\`\`\`
POST /api/feedback
Content-Type: application/json

{
  "user": "john@example.com",
  "message": "Great platform!",
  "rating": 5
}
\`\`\`

## 🔧 **Response Format**

All FIDGA APIs return responses in a consistent format:

\`\`\`json
{
  "success": true,
  "data": {
    // Response payload
  },
  "message": "Operation completed successfully",
  "error": null
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": "Detailed error information"
}
\`\`\`

## 📝 **Code Examples**

### **JavaScript/Node.js**
\`\`\`javascript
// Fetch market intelligence
const response = await fetch('/api/market-intelligence', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
});

const data = await response.json();
if (data.success) {
  console.log('Market trends:', data.data.trends);
}
\`\`\`

### **Python**
\`\`\`python
import requests

# Get social listening data
response = requests.get('http://localhost:5050/api/social-listening')
data = response.json()

if data['success']:
    mentions = data['data']['mentions']
    print(f"Found {len(mentions)} social mentions")
\`\`\`

### **cURL**
\`\`\`bash
# Create a new campaign
curl -X POST http://localhost:5050/api/campaigns \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test Campaign",
    "budget": 25000,
    "startDate": "2025-07-01",
    "endDate": "2025-07-31"
  }'
\`\`\`

## 🚀 **Rate Limits & Best Practices**

### **Current Limits**
- **Development**: No rate limits
- **Production**: 1000 requests/hour per API key (coming soon)

### **Best Practices**
1. **Caching**: Cache market intelligence data for up to 15 minutes
2. **Error Handling**: Always check the \`success\` field in responses
3. **Batch Operations**: Use bulk APIs when available
4. **Pagination**: Implement pagination for large datasets
5. **Timeouts**: Set appropriate request timeouts (30 seconds recommended)

## 🔍 **API Testing**

### **Development Server**
- **Base URL**: \`http://localhost:5050\`
- **Available during**: Local development only

### **Testing Tools**
- **Postman Collection**: Available for download (coming soon)
- **API Documentation**: Interactive docs at \`/api/docs\` (coming soon)
- **SDK Libraries**: JavaScript and Python SDKs in development

## 📞 **Developer Support**

For API-related questions and support:
- **Documentation**: This help section
- **Issues**: Use the Feedback form for bug reports
- **Feature Requests**: Submit via the platform feedback system
- **Email**: developers@fidga.ai (coming soon)

## 🔄 **API Versioning**

- **Current Version**: v1 (implicit)
- **Versioning Strategy**: URL-based versioning (e.g., \`/api/v2/campaigns\`)
- **Backward Compatibility**: Maintained for at least 12 months
- **Deprecation Notice**: 90 days advance notice for breaking changes

Stay updated with API changes through our changelog and developer newsletter (coming soon).
    `,
	},
	{
		title: 'AI-Powered Image Captioning',
		content: `
FIDGA provides an AI-powered image captioning tool to help you generate descriptive, relevant captions for your campaign images. This feature leverages advanced AI models to analyze your uploaded images and suggest high-quality captions, saving you time and improving creative performance.

How to Use Image Captioning:
1. Navigate to the Content Generation module from the sidebar.
2. Find the "AI Powered Image Captioning" card within the Content Generation page.
3. Upload an image by clicking the upload button or dragging an image file onto the card.
4. Preview your image and click the "Generate Caption" button.
5. The AI will analyze your image and display a suggested caption below.
6. Copy or edit the caption as needed for your campaign assets.

Use Cases:
- Quickly generate creative captions for new ad creatives.
- Improve accessibility by providing descriptive alt text.
- Brainstorm ideas for social media or campaign content.

Note: All image processing is performed securely. No images are stored after captioning.

![Image Captioning Screenshot](/help-screenshots/image-captioning-placeholder.png)
	`,
	},
	{
		title: 'Google Analytics Integration',
		content: `
FIDGA now supports Google Analytics (GA4) integration for real-time tracking of user activity and engagement.

**How it works:**
- All page views and navigation events are automatically tracked.
- Data is sent to your Google Analytics property (ID: G-KDC8ZMMCJN).
- You can view analytics in your Google Analytics dashboard.

**Privacy:**
- No personally identifiable information is sent.
- Tracking is only enabled if you opt in below.

**Enable/Disable Analytics Tracking:**
- Use the toggle below to enable or disable Google Analytics tracking for your session.
`,
	},
];

// MarkdownRenderer component for rendering markdown with images
const MarkdownRenderer = ({ content }) => (
	<ReactMarkdown>{content}</ReactMarkdown>
);

const HelpDocumentation = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredTopics, setFilteredTopics] = useState(documentationTopics);
	const [selectedTopic, setSelectedTopic] = useState(null);
	const [aiInput, setAiInput] = useState('');
	const [aiResponse, setAiResponse] = useState('');
	const [aiLoading, setAiLoading] = useState(false);
	// Google Analytics opt-in state
	const [gaEnabled, setGaEnabled] = useState(() => {
		const stored = localStorage.getItem('fidga_ga_enabled');
		return stored === null ? true : stored === 'true';
	});

	useEffect(() => {
		localStorage.setItem('fidga_ga_enabled', gaEnabled);
		if (window.gtag) {
			if (gaEnabled) {
				window.gtag('config', 'G-KDC8ZMMCJN');
			} else {
				window['ga-disable-G-KDC8ZMMCJN'] = true;
			}
		}
	}, [gaEnabled]);

	useEffect(() => {
		if (!searchTerm) {
			setFilteredTopics(documentationTopics);
		} else {
			const lower = searchTerm.toLowerCase();
			setFilteredTopics(
				documentationTopics.filter(
					(topic) =>
						topic.title.toLowerCase().includes(lower) ||
						topic.content.toLowerCase().includes(lower)
				)
			);
		}
	}, [searchTerm]);

	const handleTopicClick = (topic) => setSelectedTopic(topic);
	const handleBack = () => setSelectedTopic(null);

	const handleAiAsk = async (e) => {
		e.preventDefault();
		if (!aiInput.trim()) return;
		setAiLoading(true);
		setAiResponse('');
		try {
			// Use the correct backend endpoint for LLM help
			const res = await fetch('/api/ask-llm', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ question: aiInput }),
			});
			const data = await res.json();
			if (data.success && data.data && data.data.answer) {
				setAiResponse(data.data.answer);
			} else if (data.data && data.data.report) {
				setAiResponse(data.data.report.summary || 'AI could not provide an answer.');
			} else if (data.message) {
				setAiResponse(data.message);
			} else {
				setAiResponse('AI could not provide an answer.');
			}
		} catch {
			setAiResponse('Failed to get AI help.');
		}
		setAiLoading(false);
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-black rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
				Help & Documentation
			</h2>
			{/* Search box */}
			<input
				type="text"
				className="w-full p-3 mb-4 rounded bg-gray-800 text-gray-100 focus:outline-none"
				placeholder="Search help topics..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			{/* AI Help */}
			<form onSubmit={handleAiAsk} className="flex gap-2 mb-6">
				<input
					type="text"
					className="flex-1 p-2 rounded bg-gray-800 text-gray-100 focus:outline-none"
					placeholder="Ask AI for help..."
					value={aiInput}
					onChange={(e) => setAiInput(e.target.value)}
				/>
				<button
					type="submit"
					className="bg-gray-700 text-gray-100 px-4 py-2 rounded font-semibold hover:bg-gray-600"
					disabled={aiLoading || !aiInput.trim()}
				>
					{aiLoading ? 'Asking...' : 'Ask AI'}
				</button>
			</form>
			{aiResponse && (
				<div className="bg-gray-900 p-4 rounded mb-4 text-gray-200">
					<strong>AI:</strong> {aiResponse}
				</div>
			)}
			{/* Topic details or list */}
			{selectedTopic ? (
				<div className="bg-gray-900 p-6 rounded-lg">
					<button
						onClick={handleBack}
						className="mb-4 text-gray-400 hover:underline"
					>
						&rarr; Back to Topics
					</button>
					<h3 className="text-xl font-bold mb-2 text-gray-100">
						{selectedTopic.title}
					</h3>
					<div className="prose prose-invert max-w-none text-gray-200 mb-2">
						{/* Render markdown with images */}
						<MarkdownRenderer content={selectedTopic.content} />
					</div>
					{selectedTopic.title === 'Google Analytics Integration' && (
						<div className="my-4 flex items-center gap-3">
							<label className="text-gray-200 font-semibold">
								Enable Google Analytics Tracking
							</label>
							<input
								type="checkbox"
								checked={gaEnabled}
								onChange={(e) => setGaEnabled(e.target.checked)}
								className="w-5 h-5 accent-blue-500"
							/>
							<span className="text-gray-400 text-sm">
								{gaEnabled ? 'Enabled' : 'Disabled'}
							</span>
						</div>
					)}
				</div>
			) : (
				<div>
					{filteredTopics.length === 0 ? (
						<div className="text-gray-400">No topics found.</div>
					) : (
						<ul className="divide-y divide-gray-800">
							{filteredTopics.map((topic, idx) => (
								<li
									key={idx}
									className="py-4 cursor-pointer hover:bg-gray-800 rounded"
									onClick={() => handleTopicClick(topic)}
								>
									<span className="text-lg font-semibold text-gray-100">
										{topic.title}
									</span>
									<div className="text-gray-400 text-sm mt-1 line-clamp-2">
										{topic.content.slice(0, 120)}...
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};

export default HelpDocumentation;
