import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
export default async function Dashboard() {
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

        {/* Battery Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Battery Item - we'll replace this with real data later */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">TV Remote</h3>
                <p className="text-sm text-gray-500">AA Batteries</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Good
              </span>
            </div>
            
            <div className="mb-4">
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">📱 Device Photo</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>Last changed: <span className="font-medium">45 days ago</span></p>
              <p>Expected life: <span className="font-medium">180 days</span></p>
            </div>
            
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200">
              ✅ Changed Batteries
            </button>
          </div>

          {/* Warning Example */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Game Controller</h3>
                <p className="text-sm text-gray-500">AA Batteries</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Warning
              </span>
            </div>
            
            <div className="mb-4">
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">🎮 Device Photo</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>Last changed: <span className="font-medium">125 days ago</span></p>
              <p>Expected life: <span className="font-medium">180 days</span></p>
            </div>
            
            <button className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded-md transition-colors duration-200">
              ⚠️ Consider Changing
            </button>
          </div>

          {/* Critical Example */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Smoke Detector</h3>
                <p className="text-sm text-gray-500">9V Battery</p>
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Replace!
              </span>
            </div>
            
            <div className="mb-4">
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">🚨 Device Photo</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>Last changed: <span className="font-medium">320 days ago</span></p>
              <p>Expected life: <span className="font-medium">365 days</span></p>
            </div>
            
            <button className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors duration-200">
              🔴 CHANGE NOW!
            </button>
          </div>
        </div>

        {/* Empty State (show when no items) */}
        <div className="text-center py-12 hidden">
          <div className="text-6xl mb-4">🔋</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No devices tracked yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first battery-powered device</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200">
            Add Your First Device
          </button>
        </div>
      </section>
    </main>
  );
}