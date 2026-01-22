import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || '';

function FeedbackTable({ onBack }) {
  const [feedbacks, setFeedbacks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/feedback`)
      .then(res => res.json())
      .then(data => { setFeedbacks(data); setLoading(false); })
      .catch(err => { setError('Failed to load feedback'); setLoading(false); });
  }, []);

  if (loading) return <div className="p-4">Loading feedback...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">&larr; Back to Admin Dashboard</button>
      <h2 className="text-2xl font-bold mb-4">Feedback Entries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">User</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks && feedbacks.length > 0 ? feedbacks.map(fb => (
              <tr key={fb._id}>
                <td className="p-2 border">{fb.user || '-'}</td>
                <td className="p-2 border">{fb.message}</td>
                <td className="p-2 border text-center">{fb.rating}</td>
                <td className="p-2 border">{new Date(fb.timestamp).toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="p-2 text-center">No feedback found.</td></tr>
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
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => { setError('Failed to load admin stats'); setLoading(false); });
  }, []);

  if (loading) return <div className="p-4">Loading admin dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-lg font-semibold">Feedback</div>
          <div className="text-2xl">{stats.feedbackCount}</div>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-lg font-semibold">Market Logs</div>
          <div className="text-2xl">{stats.marketLogCount}</div>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-lg font-semibold">A/B Assignments</div>
          <div className="text-2xl">{stats.abAssignCount}</div>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-lg font-semibold">A/B Outcomes</div>
          <div className="text-2xl">{stats.abOutcomeCount}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={onShowFeedback} className="text-blue-600 hover:underline text-left">View Feedback</button>
        <a href="#" className="text-blue-600 hover:underline">View Market Logs</a>
        <a href="#" className="text-blue-600 hover:underline">View A/B Assignments</a>
        <a href="#" className="text-blue-600 hover:underline">View A/B Outcomes</a>
      </div>
    </div>
  );
}

function AdminApp() {
  const [adminView, setAdminView] = useState('dashboard'); // 'dashboard' or 'feedback'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FIDGA Admin Dashboard</h1>
      </header>
      {adminView === 'dashboard' ?
        <AdminDashboard onShowFeedback={() => setAdminView('feedback')} /> :
        <FeedbackTable onBack={() => setAdminView('dashboard')} />
      }
    </div>
  );
}

export default AdminApp;
