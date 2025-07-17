"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState([]); // ✅ Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load items from API
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching items...');
      
      const response = await fetch('/api/items');
      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 API Response data:', data);
        
        // ✅ Handle your API's response structure
        const itemsArray = data.items || data || [];
        console.log('📋 Items array:', itemsArray);
        
        setItems(Array.isArray(itemsArray) ? itemsArray : []);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching items:', error);
      setError(error.message);
      setItems([]); // ✅ Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe array check before using .map()
  if (loading) {
    return (
      <main className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto text-center py-8">
          <div className="text-gray-500">Loading your items...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto text-center py-8">
          <div className="text-red-500">Error: {error}</div>
          <button 
            onClick={fetchItems}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="VoltaHome Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-900">VoltaHome Dashboard</h1>
          </div>
          <button
            onClick={() => router.push('/dashboard/add-item')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            + Add Item
          </button>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-100 p-4 rounded-lg text-sm">
          <strong>Debug Info:</strong><br/>
          Items count: {items.length}<br/>
          Items is array: {Array.isArray(items) ? 'Yes ✅' : 'No ❌'}<br/>
          Sample item: {items[0] ? JSON.stringify(Object.keys(items[0])) : 'None'}
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Items</h2>
          
          {/* ✅ Safe check before mapping */}
          {!Array.isArray(items) ? (
            <div className="text-red-500">
              Error: Items is not an array. Type: {typeof items}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">📦</div>
              <p className="text-gray-500">No items tracked yet</p>
              <button
                onClick={() => router.push('/dashboard/add-item')}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item, index) => (
                <div key={item._id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Room: {item.room || 'Not specified'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Category: {item.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: {item.statusColor || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}