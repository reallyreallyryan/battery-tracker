"use client";

import { useState, useEffect } from "react";
import ButtonAccount from "@/components/ButtonAccount";
import InstallPWA from "@/components/InstallPWA";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  // Category definitions for display
  const categories = {
    battery: {
      name: "🔋 Batteries & Power",
      color: "emerald"
    },
    hvac: {
      name: "🌬️ HVAC & Air Quality", 
      color: "blue"
    },
    appliance: {
      name: "🏠 Appliance Maintenance",
      color: "purple"
    }
  };

  // Fetch items on component mount
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

  // Handle "maintenance completed" button click
  const handleMaintenanceCompleted = async (itemId) => {
    try {
      const response = await fetch('/api/items', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          action: 'batteryChanged' // Keep same action for backwards compatibility
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      alert('Maintenance date updated!');
      fetchItems();
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Error updating item');
    }
  };

  // Handle delete button click
  const handleDeleteClick = (item) => {
    setDeleteModal({ open: true, item });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleting(true);
      const response = await fetch('/api/items', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: deleteModal.item._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setDeleteModal({ open: false, item: null });
      fetchItems();
      alert('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item');
    } finally {
      setDeleting(false);
    }
  };

  // Close delete modal
  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, item: null });
  };

  // Get category info for an item
  const getCategoryInfo = (item) => {
    const category = item.category || 'battery'; // Default to battery for backwards compatibility
    return categories[category] || categories.battery;
  };

  // Get maintenance type display
  const getMaintenanceType = (item) => {
    if (item.category === 'battery' || !item.category) {
      return item.batteryType || item.itemType || 'Unknown';
    }
    return item.maintenanceType || item.itemType || 'Unknown';
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
          buttonText: '✅ Maintenance Done',
          label: 'Good'
        };
      case 'warning':
        return {
          color: 'border-amber-500',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          buttonColor: 'bg-amber-100 hover:bg-amber-200 text-amber-800',
          buttonText: '⚠️ Consider Servicing',
          label: 'Check Soon'
        };
      case 'replace':
        return {
          color: 'border-rose-500',
          bgColor: 'bg-rose-100',
          textColor: 'text-rose-800',
          buttonColor: 'bg-rose-100 hover:bg-rose-200 text-rose-800',
          buttonText: '🔴 SERVICE NOW!',
          label: 'Service!'
        };
      default:
        return {
          color: 'border-gray-500',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          buttonColor: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
          buttonText: '✅ Maintenance Done',
          label: 'Unknown'
        };
    }
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'battery';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <main className="min-h-screen p-6 pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <section className="max-w-6xl mx-auto space-y-8">
        {/* Header with account button */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="VoltaHome Logo" className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                VoltaHome
              </h1>
            </div>
            <p className="text-gray-600">
              Keep track of maintenance across your entire home
            </p>
          </div>
          <ButtonAccount />
        </div>

        {/* Add New Item Button */}
        <div className="flex justify-center">
          <a href="/dashboard/add-item" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-3 hover:shadow-xl">
            <span className="text-xl">📷</span>
            Add New Item
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-2xl text-gray-600">⚡ Loading your items...</div>
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

        {/* Items Grid by Category */}
        {!loading && !error && (
          <>
            {Object.keys(groupedItems).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedItems).map(([categoryKey, categoryItems]) => {
                  const categoryInfo = categories[categoryKey] || categories.battery;
                  
                  return (
                    <div key={categoryKey}>
                      {/* Category Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {categoryInfo.name}
                        </h2>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                          {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Category Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryItems.map((item) => {
                          const statusInfo = getStatusInfo(item);
                          const maintenanceType = getMaintenanceType(item);
                          
                          return (
                            <div 
                              key={item._id} 
                              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border-l-4 ${statusInfo.color} border border-gray-100 relative`}
                            >
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteClick(item)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete item"
                              >
                                🗑️
                              </button>

                              <div className="flex justify-between items-start mb-4 pr-8">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {maintenanceType}
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
                                  Last serviced: <span className="font-medium text-gray-900">{item.daysSinceChange} days ago</span>
                                </p>
                                <p>
                                  Expected interval: <span className="font-medium text-gray-900">{item.expectedDuration} days</span>
                                </p>
                                <p>
                                  Time elapsed: <span className="font-medium text-gray-900">{item.percentUsed}%</span>
                                </p>
                              </div>
                              
                              <button 
                                onClick={() => handleMaintenanceCompleted(item._id)}
                                className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${statusInfo.buttonColor}`}
                              >
                                {statusInfo.buttonText}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                  <div className="text-6xl mb-6">🏠</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No items tracked yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start building your home maintenance inventory by adding your first item
                  </p>
                  <a 
                    href="/dashboard/add-item"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 inline-flex items-center gap-3 hover:shadow-xl"
                  >
                    <span className="text-xl">📷</span>
                    Add Your First Item
                  </a>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* PWA Install Button */}
        <InstallPWA />
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Item?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deleteModal.item?.name}</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}