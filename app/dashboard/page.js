"use client";

import { useState, useEffect } from "react";
import ButtonAccount from "@/components/ButtonAccount";
import InstallPWA from "@/components/InstallPWA";

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
          color: 'border-emerald-500',
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800',
          buttonColor: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
          buttonText: '✅ Batteries Changed',
          label: 'Good'
        };
      case 'warning':
        return {
          color: 'border-amber-500',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          buttonColor: 'bg-amber-100 hover:bg-amber-200 text-amber-800',
          buttonText: '⚠️ Consider Changing',
          label: 'Check Soon'
        };
      case 'replace':
        return {
          color: 'border-rose-500',
          bgColor: 'bg-rose-100',
          textColor: 'text-rose-800',
          buttonColor: 'bg-rose-100 hover:bg-rose-200 text-rose-800',
          buttonText: '🔴 CHANGE NOW!',
          label: 'Replace!'
        };
      default:
        return {
          color: 'border-gray-500',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          buttonColor: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
          buttonText: '✅ Batteries Changed',
          label: 'Unknown'
        };
    }
  };

  return (
    <main className="min-h-screen p-6 pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <section className="max-w-6xl mx-auto space-y-8">
        {/* Header with account button */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⚡</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Home Devices
              </h1>
            </div>
            <p className="text-gray-600">
              Keep track of battery changes across your home
            </p>
          </div>
          <ButtonAccount />
        </div>

        {/* Add New Item Button */}
        <div className="flex justify-center">
          <a href="/dashboard/add-item" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-3 hover:shadow-xl">
            <span className="text-xl">📷</span>
            Add New Device
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-2xl text-gray-600">⚡ Loading your devices...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-rose-600 text-xl mb-4">❌ Error: {error}</div>
            <button 
              onClick={fetchItems}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
                      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border-l-4 ${statusInfo.color} border border-gray-100`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.batteryType} Batteries
                          </p>
                        </div>
                        <span className={`${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-medium px-3 py-1 rounded-full`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-36 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-4 space-y-1">
                        <p>
                          Last changed: <span className="font-medium text-gray-900">{item.daysSinceChange} days ago</span>
                        </p>
                        <p>
                          Expected life: <span className="font-medium text-gray-900">{item.expectedDuration} days</span>
                        </p>
                        <p>
                          Power used: <span className="font-medium text-gray-900">{item.percentUsed}%</span>
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => handleBatteryChanged(item._id)}
                        className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${statusInfo.buttonColor}`}
                      >
                        {statusInfo.buttonText}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                  <div className="text-6xl mb-6">🏠</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No devices tracked yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start building your home device inventory by adding your first battery-powered device
                  </p>
                  <a 
                    href="/dashboard/add-item"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 inline-flex items-center gap-3 hover:shadow-xl"
                  >
                    <span className="text-xl">📷</span>
                    Add Your First Device
                  </a>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* PWA Install Button */}
        <InstallPWA />
      </section>
    </main>
  );
}