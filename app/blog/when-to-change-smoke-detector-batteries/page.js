export const metadata = {
  title: "VoltaHome Blog | Battery & Home Safety Guides",
  description: "Learn when to change batteries, how to track device maintenance, and keep your home safe with our comprehensive battery and home safety guides.",
  keywords: "battery tracking, home maintenance, smoke detector batteries, home safety, AC filter replacement",
}

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <a href="/" className="flex items-center gap-2 text-gray-900 hover:text-indigo-600 transition-colors">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold">VoltaHome</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="text-center max-w-4xl mx-auto mt-12 mb-16 px-6">
        <h1 className="font-extrabold text-4xl lg:text-5xl tracking-tight mb-6 text-gray-900">
          Battery & Home Safety Guides
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Learn when to change batteries, track device maintenance, and keep your home safe. 
          Never get caught with dead batteries again.
        </p>
      </section>

      {/* Articles */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Article 1: Smoke Detector Guide */}
          <article className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                🚨 Safety Guide
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              <a href="/blog/when-to-change-smoke-detector-batteries" className="hover:text-indigo-600 transition-colors">
                When to Change Smoke Detector Batteries: Complete Safety Guide
              </a>
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Learn exactly when and how to change smoke detector batteries. Includes testing schedule, 
              battery types, and safety tips to keep your family protected.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-xs">VT</span>
                </span>
                <span>VoltaHome Team</span>
                <span>•</span>
                <span>Jan 15, 2025</span>
              </div>
              
              <a href="/blog/when-to-change-smoke-detector-batteries" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Read Guide →
              </a>
            </div>
          </article>

          {/* Placeholder for Article 2 */}
          <article className="bg-gray-50 border border-gray-200 rounded-lg p-8 opacity-60">
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                🏠 Home Maintenance
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              Complete Home Maintenance Schedule
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              The ultimate checklist for keeping your home safe and efficient. Monthly, seasonal, 
              and annual tasks to prevent costly repairs.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-xs">VT</span>
                </span>
                <span>VoltaHome Team</span>
                <span>•</span>
                <span>Coming Soon</span>
              </div>
              
              <span className="text-gray-400 font-medium">
                Coming Soon
              </span>
            </div>
          </article>

          {/* Placeholder for Article 3 */}
          <article className="bg-gray-50 border border-gray-200 rounded-lg p-8 opacity-60">
            <div className="mb-4">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                ❄️ HVAC Guide
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              When to Change Your AC Filter
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Save money and improve air quality by changing your AC filter at the right time. 
              Complete guide with filter types and replacement schedules.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-xs">VT</span>
                </span>
                <span>VoltaHome Team</span>
                <span>•</span>
                <span>Coming Soon</span>
              </div>
              
              <span className="text-gray-400 font-medium">
                Coming Soon
              </span>
            </div>
          </article>

          {/* Placeholder for Article 4 */}
          <article className="bg-gray-50 border border-gray-200 rounded-lg p-8 opacity-60">
            <div className="mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                🔧 Appliance Care
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              How to Clean Your Dishwasher Filter
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Keep your dishwasher running efficiently with proper filter maintenance. 
              Step-by-step cleaning guide and maintenance schedule.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-xs">VT</span>
                </span>
                <span>VoltaHome Team</span>
                <span>•</span>
                <span>Coming Soon</span>
              </div>
              
              <span className="text-gray-400 font-medium">
                Coming Soon
              </span>
            </div>
          </article>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Track Your Home Maintenance?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Stop forgetting battery changes and maintenance tasks. VoltaHome keeps everything organized.
          </p>
          <a href="/" className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block">
            Start Tracking Your Home →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold">VoltaHome</span>
          </div>
          <p className="text-gray-400 mb-4">
            Keep your home safe, efficient, and well-maintained
          </p>
          <div className="text-sm text-gray-500">
            Built for organized homeowners everywhere
          </div>
        </div>
      </footer>
    </div>
  );
}