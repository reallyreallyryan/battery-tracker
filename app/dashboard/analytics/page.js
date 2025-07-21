"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AnalyticsDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7); // days
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setAccessDenied(false);
      
      const response = await fetch(`/api/analytics/detection?days=${dateRange}`);
      
      if (response.status === 403) {
        setAccessDenied(true);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
            <p className="text-gray-600 mb-4">
              Only administrators can access analytics data.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading analytics: {error}</p>
            <button 
              onClick={fetchAnalytics}
              className="mt-2 text-sm text-red-600 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <span>←</span> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">📊 AI Detection Analytics</h1>
          <div></div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Detections"
            value={analytics?.summary?.totalDetections || 0}
            subtitle={analytics?.summary?.dateRange}
            icon="📷"
          />
          <MetricCard
            title="AI Success Rate"
            value={`${analytics?.summary?.aiSuccessRate || 0}%`}
            subtitle="When AI suggestions matched user choice"
            icon="🎯"
            color={analytics?.summary?.aiSuccessRate > 70 ? 'green' : 'yellow'}
          />
          <MetricCard
            title="Avg Detection Time"
            value={`${analytics?.summary?.avgInferenceTime || 0}ms`}
            subtitle="Time to analyze photos"
            icon="⚡"
          />
        </div>

        {/* Device Types Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">📱 Most Common Devices</h2>
          {analytics?.deviceTypes?.length > 0 ? (
            <div className="space-y-3">
              {analytics.deviceTypes.map((device, idx) => (
                <DeviceBar
                  key={device.type || idx}
                  device={device}
                  maxCount={analytics.deviceTypes[0].count}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No device data yet</p>
          )}
        </div>

        {/* COCO Detection Results */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">🤖 What AI Detected</h2>
          {analytics?.cocoClasses?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {analytics.cocoClasses.map((item, idx) => (
                <div key={item.class || idx} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-gray-900">{item.class}</div>
                  <div className="text-sm text-gray-600">
                    {item.count} detections
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.avgConfidence}% avg confidence
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No detection data yet</p>
          )}
        </div>

        {/* Analytics Notice */}
        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
          <p className="font-medium mb-1">📊 About Analytics</p>
          <p>This data helps improve AI detection accuracy. Analytics are collected anonymously and never impact app performance.</p>
        </div>
      </div>
    </main>
  );
}

// Metric Card Component
function MetricCard({ title, value, subtitle, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// Device Bar Chart Component
function DeviceBar({ device, maxCount }) {
  const percentage = (device.count / maxCount) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">
          {device.label || device.type || 'Unknown'}
        </span>
        <span className="text-gray-500">{device.count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}