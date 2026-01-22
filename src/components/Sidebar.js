import React from 'react';
import { FaTachometerAlt, FaChartLine, FaBullhorn, FaChartBar, FaMagic, FaCommentDots, FaQuestionCircle, FaCog } from 'react-icons/fa';

const Sidebar = ({ activeModule, setActiveModule }) => (
  <aside className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen p-4 shadow-lg hidden md:block md:w-64 md:p-4 sm:w-20 sm:p-2 sm:block">
    <nav>
      <ul className="space-y-3">
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'dashboard' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('dashboard')} title="Dashboard Overview">
            <FaTachometerAlt className="mr-3 text-lg" title="Dashboard Overview" />
            <span className="hidden sm:inline" title="Dashboard Overview">Dashboard Overview</span>
          </button>
        </li>
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'market-intelligence' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('market-intelligence')} title="Market Intelligence">
            <FaChartLine className="mr-3 text-lg" title="Market Intelligence" />
            <span className="hidden sm:inline" title="Market Intelligence">Market Intelligence</span>
          </button>
        </li>
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'campaign-management' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('campaign-management')} title="Campaign Management">
            <FaBullhorn className="mr-3 text-lg" title="Campaign Management" />
            <span className="hidden sm:inline" title="Campaign Management">Campaign Management</span>
          </button>
        </li>
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'content-generation' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('content-generation')} title="Content Generation">
            <FaMagic className="mr-3 text-lg" title="Content Generation" />
            <span className="hidden sm:inline" title="Content Generation">Content Generation</span>
          </button>
        </li>
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'dco' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('dco')} title="Dynamic Creative Optimization">
            <FaMagic className="mr-3 text-lg" title="Dynamic Creative Optimization" />
            <span className="hidden sm:inline" title="Dynamic Creative Optimization">Dynamic Creative Optimization</span>
          </button>
        </li>
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'performance-monitoring' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('performance-monitoring')} title="Performance Monitoring">
            <FaChartBar className="mr-3 text-lg" title="Performance Monitoring" />
            <span className="hidden sm:inline" title="Performance Monitoring">Performance Monitoring</span>
          </button>
        </li>
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'feedback' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('feedback')} title="Feedback">
            <FaCommentDots className="mr-3 text-lg" title="Feedback" />
            <span className="hidden sm:inline" title="Feedback">Feedback</span>
          </button>
        </li>
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'help-documentation' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('help-documentation')} title="Help & Documentation">
            <FaQuestionCircle className="mr-3 text-lg" title="Help & Documentation" />
            <span className="hidden sm:inline" title="Help & Documentation">Help & Documentation</span>
          </button>
        </li>
        <li>
          <button className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 text-lg font-medium hover-lift ${activeModule === 'api-testing' ? 'bg-gray-700 border-gray-500 shadow-md' : 'border-transparent hover:bg-gray-800'}`} onClick={() => setActiveModule('api-testing')} title="API Testing Dashboard">
            <FaCog className="mr-3 text-lg" title="API Testing Dashboard" />
            <span className="hidden sm:inline" title="API Testing Dashboard">API Testing</span>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
