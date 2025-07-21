"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRooms, setExpandedRooms] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);

  // Room labels mapping
  const roomLabels = {
    kitchen: '🍳 Kitchen',
    living_room: '🛋️ Living Room',
    bedroom: '🛏️ Bedroom',
    bathroom: '🚿 Bathroom',
    basement: '🏠 Basement',
    garage: '🚗 Garage',
    office: '💻 Office',
    dining_room: '🍽️ Dining Room',
    laundry_room: '🧺 Laundry Room',
    attic: '📦 Attic',
    outdoor: '🌳 Outdoor',
    other: '📍 Other',
    unspecified: '❓ Unspecified Room' // For items without room field
  };

  const deviceLabels = {
  // Safety Devices
  'smoke_detector': '🔥 Smoke Detector',
  'carbon_monoxide_detector': '💨 Carbon Monoxide Detector', 
  
  // HVAC & Filters
  'ac_filter': '🌬️ AC Filter',
  'furnace_filter': '🏠 Furnace Filter',
  'air_purifier_filter': '💨 Air Filter',
  
  // Electronics & Remotes  
  'tv_remote': '📺  Remote',
  'wireless_mouse': '🖱️ Wireless Mouse',
  'garage_door_remote': '🚗 Garage Door Remote',
  
  // Appliances
  'dishwasher_filter': '🍽️ Dishwasher Filter',
  'refrigerator_filter': '❄️ Refrigerator Filter', 
  'dryer_vent': '👕 Dryer Vent',
  
  // Other Common Items
  'flashlight': '🔦 Flashlight',
  'other': '📦 Other Device',
  };

  const deviceGuides = {
    // For now, everything points to main blog - super simple!
    'smoke_detector': '/blog',
    'carbon_monoxide_detector': '/blog',
    'ac_filter': '/blog',
    'furnace_filter': '/blog',
    'air_purifier_filter': '/blog',
    'remote': '/blog',
    'wireless_mouse': '/blog',
    'garage_door_remote': '/blog',
    'dishwasher_filter': '/blog',
    'refrigerator_filter': '/blog',
    'dryer_vent': '/blog',
    'flashlight': '/blog',
    'other': '/blog'
  };

  const calculateItemStatus = (item) => {
    if (!item.dateLastChanged) {
      return { daysSinceChange: 0, usagePercentage: 0 };
    }

    const today = new Date();
    const changeDate = new Date(item.dateLastChanged);
    today.setHours(0, 0, 0, 0);
    changeDate.setHours(0, 0, 0, 0);
    const daysSinceChange = Math.floor((today - changeDate) / (1000 * 60 * 60 * 24));

    // Use the expectedDuration that's already saved in the item!
    const expectedLife = item.expectedDuration || 365;
    const usagePercentage = Math.min(Math.round((daysSinceChange / expectedLife) * 100), 100);

    return { daysSinceChange, usagePercentage };
  };

  // Load items from API
  useEffect(() => {
    fetchItems();
    checkAdminStatus();
  }, []);
  
  const checkAdminStatus = async () => {
    try {
      console.log('🔍 Checking admin status...');
      const response = await fetch('/api/auth/check-admin');
      const data = await response.json();
      console.log('📊 Admin check response:', data);
      console.log('🔑 Is Admin:', data.isAdmin);
      console.log('🌍 Analytics enabled:', process.env.NEXT_PUBLIC_ENABLE_ANALYTICS);
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('❌ Admin check failed:', error);
      setIsAdmin(false);
    } finally {
      setAdminCheckLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      if (response.ok) {
        const data = await response.json();
        const itemsArray = data.items || [];
        setItems(itemsArray);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get items that need attention (red or yellow status)
  const getUrgentItems = () => {
    return items.filter(item => 
      item.statusColor === 'red' || item.statusColor === 'yellow'
    ).sort((a, b) => {
      // Red items first, then yellow
      if (a.statusColor === 'red' && b.statusColor === 'yellow') return -1;
      if (a.statusColor === 'yellow' && b.statusColor === 'red') return 1;
      return 0;
    });
  };

  // Group items by room
  const getItemsByRoom = () => {
    const grouped = {};
    
    items.forEach(item => {
      // Handle items without room field (existing items)
      const room = item.room || 'unspecified';
      
      if (!grouped[room]) {
        grouped[room] = [];
      }
      grouped[room].push(item);
    });
    
    return grouped;
  };

  // Toggle room expansion
  const toggleRoom = (roomKey) => {
    setExpandedRooms(prev => ({
      ...prev,
      [roomKey]: !prev[roomKey]
    }));
  };

  // Get room status counts
  const getRoomStatus = (roomItems) => {
    const red = roomItems.filter(item => item.statusColor === 'red').length;
    const yellow = roomItems.filter(item => item.statusColor === 'yellow').length;
    return { red, yellow, total: roomItems.length };
  };

  // Mark item as changed
  const markAsChanged = async (itemId) => {
    try {
      const response = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          action: 'batteryChanged'
        })
      });

      if (response.ok) {
        // Refresh items
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (itemId, itemName) => {
  // Confirm before deleting
  if (!confirm(`Are you sure you want to delete "${itemName}"? This cannot be undone.`)) {
    return;
  }

  try {
    const response = await fetch('/api/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId })
    });

    if (response.ok) {
      // Refresh items after successful delete
      fetchItems();
      alert('Item deleted successfully!');
    } else {
      throw new Error('Failed to delete item');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Error deleting item. Please try again.');
  }
};

  const urgentItems = getUrgentItems();
  const itemsByRoom = getItemsByRoom();

  if (loading) {
    return (
      <main className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto text-center py-8">
          <div className="text-gray-500">Loading your items...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img src="/logo.png" alt="VoltaHome Logo" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              <span className="hidden sm:inline">VoltaHome Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </h1>
            {isAdmin && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded flex-shrink-0">
                Admin
              </span>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && isAdmin && (
              <button
                onClick={() => router.push('/dashboard/analytics')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-sm sm:text-base"
              >
                <span>📊</span>
                <span className="hidden sm:inline ml-1">Analytics</span>
              </button>
            )}
            <button
              onClick={() => router.push('/dashboard/add-item')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-sm sm:text-base"
            >
              <span>+</span>
              <span className="hidden sm:inline ml-1">Add Item</span>
            </button>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-sm sm:text-base"
            >
              <span>↗️</span>
              <span className="hidden sm:inline ml-1">Logout</span>
            </button>
          </div>
        </div>

        {/* Urgent Items Section */}
        {urgentItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                ⚠️ Needs Attention ({urgentItems.length} items)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {urgentItems.map(item => {
                const { daysSinceChange, usagePercentage } = calculateItemStatus(item);
                return (
                  <div key={item._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {roomLabels[item.room] || roomLabels.unspecified}
                      </p>
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Changed {daysSinceChange} days ago</span>
                          <span className="text-xs text-gray-500">{usagePercentage}% used</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              usagePercentage >= 90 ? 'bg-red-500' :
                              usagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => markAsChanged(item._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Mark Changed
                    </button>
                    
                    {/* How-To Guide Button - Links to Blog */}
                    <button 
                      onClick={() => router.push('/blog')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      📖 How-To Guides
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rooms Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">🏠 By Room</h2>
          </div>
          
          {Object.keys(itemsByRoom).length === 0 ? (
            <div className="p-8 text-center">
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
            <div className="divide-y divide-gray-200">
              {Object.entries(itemsByRoom).map(([roomKey, roomItems]) => {
                const roomStatus = getRoomStatus(roomItems);
                const isExpanded = expandedRooms[roomKey];
                
                return (
                  <div key={roomKey}>
                    {/* Room Header */}
                    <button
                      onClick={() => toggleRoom(roomKey)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {isExpanded ? '📂' : '📁'}
                          </span>
                          <span className="font-medium text-gray-900">
                            {roomLabels[roomKey] || roomKey}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({roomStatus.total} items)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {roomStatus.red > 0 && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              {roomStatus.red} urgent
                            </span>
                          )}
                          {roomStatus.yellow > 0 && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              {roomStatus.yellow} soon
                            </span>
                          )}
                          {roomStatus.red === 0 && roomStatus.yellow === 0 && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              All good ✅
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Room Items (Collapsible) */}
                    {isExpanded && (
                      <div className="px-6 pb-4 bg-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                          {roomItems.map(item => {
                            const { daysSinceChange, usagePercentage } = calculateItemStatus(item);
                            return (
                            <div key={item._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
                              
                              {/* Delete Button - Always Visible (Mobile Friendly) */}
                              <button
                                onClick={() => deleteItem(item._id, item.name)}
                                className="absolute bottom-2 right-2 bg-gray-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-gray-600 transition-colors"
                                title="Delete item"
                              >
                                🗑️
                              </button>

                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-24 object-cover rounded-lg mb-3"
                              />
                              <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                                {item.name}
                              </h4>
                              <div className="mb-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-600">{daysSinceChange}d ago</span>
                                  <span className="text-xs text-gray-500">{usagePercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      usagePercentage >= 90 ? 'bg-red-500' :
                                      usagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">
                                {deviceLabels[item.itemType] || deviceLabels[item.batteryType] || deviceLabels[item.maintenanceType] || 'Unknown device'}
                              </p>
                              {/* How-To Guide Link for items that need attention */}
                              {(item.statusColor === 'red' || item.statusColor === 'yellow') && (
                                <button 
                                  onClick={() => router.push('/blog')}
                                  className="w-full bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                                >
                                  📖 How-To Guides
                                </button>
                              )}
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {items.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{items.length}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {items.filter(item => item.statusColor === 'red').length}
                </div>
                <div className="text-sm text-gray-600">Need Action</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {items.filter(item => item.statusColor === 'green').length}
                </div>
                <div className="text-sm text-gray-600">All Good</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}