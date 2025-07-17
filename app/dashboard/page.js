"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRooms, setExpandedRooms] = useState({});

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
    other: '📍 Other'
  };

  // Load items from API
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate item status based on expected duration
  const calculateStatus = (item) => {
    const lastChanged = new Date(item.dateLastChanged);
    const now = new Date();
    const daysSinceChanged = Math.floor((now - lastChanged) / (1000 * 60 * 60 * 24));
    const expectedDuration = item.expectedDuration || 180;
    
    const percentUsed = (daysSinceChanged / expectedDuration) * 100;
    
    if (percentUsed >= 100) return { status: 'red', label: 'Change Now', daysOverdue: daysSinceChanged - expectedDuration };
    if (percentUsed >= 80) return { status: 'yellow', label: 'Check Soon', daysLeft: expectedDuration - daysSinceChanged };
    return { status: 'green', label: 'Good', daysLeft: expectedDuration - daysSinceChanged };
  };

  // Get items that need attention (red or yellow)
  const getUrgentItems = () => {
    return items
      .map(item => ({ ...item, statusInfo: calculateStatus(item) }))
      .filter(item => item.statusInfo.status === 'red' || item.statusInfo.status === 'yellow')
      .sort((a, b) => {
        // Red items first, then yellow
        if (a.statusInfo.status === 'red' && b.statusInfo.status === 'yellow') return -1;
        if (a.statusInfo.status === 'yellow' && b.statusInfo.status === 'red') return 1;
        return 0;
      });
  };

  // Group items by room
  const getItemsByRoom = () => {
    const grouped = {};
    items.forEach(item => {
      const room = item.room || 'other';
      if (!grouped[room]) {
        grouped[room] = [];
      }
      grouped[room].push({ ...item, statusInfo: calculateStatus(item) });
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
    const red = roomItems.filter(item => calculateStatus(item).status === 'red').length;
    const yellow = roomItems.filter(item => calculateStatus(item).status === 'yellow').length;
    return { red, yellow, total: roomItems.length };
  };

  const urgentItems = getUrgentItems();
  const itemsByRoom = getItemsByRoom();

  if (loading) {
    return (
      <main className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="text-gray-500">Loading your items...</div>
          </div>
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

        {/* Urgent Items Section */}
        {urgentItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                ⚠️ Needs Attention ({urgentItems.length} items)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {urgentItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {roomLabels[item.room] || 'Unknown Room'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-block w-3 h-3 rounded-full ${
                          item.statusInfo.status === 'red' ? 'bg-red-500' :
                          item.statusInfo.status === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></span>
                        <span className="text-sm font-medium">
                          {item.statusInfo.status === 'red' ? 
                            `${item.statusInfo.daysOverdue} days overdue` :
                            `${item.statusInfo.daysLeft} days left`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Mark Changed
                  </button>
                </div>
              ))}
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
                          {roomItems.map(item => (
                            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-24 object-cover rounded-lg mb-3"
                              />
                              <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${
                                  item.statusInfo.status === 'red' ? 'bg-red-500' :
                                  item.statusInfo.status === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></span>
                                <span className="text-xs text-gray-600">
                                  {item.statusInfo.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {item.category === 'battery' ? item.batteryType : 
                                 item.maintenanceType || 'Maintenance'}
                              </p>
                            </div>
                          ))}
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
                  {items.filter(item => calculateStatus(item).status === 'red').length}
                </div>
                <div className="text-sm text-gray-600">Need Action</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {items.filter(item => calculateStatus(item).status === 'green').length}
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