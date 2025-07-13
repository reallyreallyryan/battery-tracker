"use client";

import { useState, useEffect } from "react";
import ButtonAccount from "@/components/ButtonAccount";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch battery items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle "battery changed" button click
  const handleBatteryChanged = async (itemId) => {
    try {
      const response = await fetch('/api/items', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          action: 'batteryChanged'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      alert('Battery change date updated!');
      // Refresh the items list
      fetchItems();
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Error updating item');
    }
  };

  // Get status info for display
  const getStatusInfo = (item) => {
    switch (item.status) {
      case 'good':
        return {
          color: 'border-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          buttonColor: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
          buttonText: '✅ Changed Batteries',
          label: 'Good'
        };
      case 'warning':
        return {
          color: 'border-yellow-500',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          buttonColor: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
          buttonText: '⚠️ Consider Changing',
          label: 'Warning'
        };
      case 'replace':
        return {
          color: 'border-red-500',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          buttonColor: 'bg-red-100 hover:bg-red-200 text-red-800',
          buttonText: '🔴 CHANGE NOW!',
          label: 'Replace!'
        };
      default:
        return {
          color: 'border-gray-500',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          buttonColor: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
          buttonText: '✅ Changed Batteries',
          label: 'Unknown'
        };
    }
  };

  return (
    <main className="min-h-screen p-8 pb-24 bg-gray-50">
      <section className="max-w-4xl mx-auto space-y-8">
        {/* Header with account button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              🔋 My Batteries
            </h1>
            <p className="text-gray-600 mt-2">
              Track when you last changed batteries in your devices
            </p>
          </div>
          <ButtonAccount />
        </div>

        {/* Add New Item Button */}
        <div className="flex justify-center">
          <a href="/dashboard/add-item" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2">
            <span className="text-xl">📷</span>
            Add New Device
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-2xl">🔄 Loading your devices...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 text-xl">❌ Error: {error}</div>
            <button 
              onClick={fetchItems}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Battery Items Grid */}
        {!loading && !error && (
          <>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const statusInfo = getStatusInfo(item);
                  return (
                    <div 
                      key={item._id} 
                      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${statusInfo.color}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.batteryType} Batteries
                          </p>
                        </div>
                        <span className={`${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 rounded-lg object-cover"
                        />
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-4">
                        <p>
                          Last changed: <span className="font-medium">{item.daysSinceChange} days ago</span>
                        </p>
                        <p>
                          Expected life: <span className="font-medium">{item.expectedDuration} days</span>
                        </p>
                        <p>
                          Battery life used: <span className="font-medium">{item.percentUsed}%</span>
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => handleBatteryChanged(item._id)}
                        className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 ${statusInfo.buttonColor}`}
                      >
                        {statusInfo.buttonText}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔋</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No devices tracked yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first battery-powered device</p>
                <a 
                  href="/dashboard/add-item"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200"
                >
                  Add Your First Device
                </a>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}