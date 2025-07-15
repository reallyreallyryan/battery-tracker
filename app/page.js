import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import ButtonSignin from "@/components/ButtonSignin";

export const metadata = {
  title: "VoltaHome: Home Maintenance Tracking App | Never Forget Battery Changes & More",
  description: "Track battery life, AC filters, appliance maintenance, and more with photos and smart alerts. Keep your home safe and running smoothly.",
  keywords: "home maintenance tracker, battery tracker, AC filter reminder, appliance maintenance, smoke detector batteries, home safety",
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold text-gray-900">VoltaHome</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Add blog link here */}
          <a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Blog
          </a>
          
          {session ? (
            <a href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Dashboard
            </a>
          ) : (
            <ButtonSignin />
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            🏠 Complete Home Maintenance Tracking
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Never Forget Home<br />
          <span className="text-indigo-600">Maintenance Again</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Track batteries, AC filters, appliance maintenance, and more with photos and smart alerts. 
          Keep your home safe, efficient, and running smoothly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          {!session ? (
            <>
              <ButtonSignin className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" />
              <div className="text-gray-500">
                ✨ Free to use • 📧 Magic link login
              </div>
            </>
          ) : (
            <a href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
              Open Dashboard →
            </a>
          )}
        </div>

        {/* Demo Preview */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Simple Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">📷 Snap a Photo</h4>
                      <p className="text-gray-600">Take pictures of devices, filters, and equipment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">📝 Set Schedule</h4>
                      <p className="text-gray-600">Track replacement dates and maintenance schedules</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">⏰ Stay Informed</h4>
                      <p className="text-gray-600">Get visual status updates when maintenance is due</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 h-64 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <span className="text-5xl mb-3 block">📱</span>
                  <div className="font-medium">Visual Tracking</div>
                  <div className="text-sm text-gray-500">Point, shoot, schedule</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Track Every Part of Your Home
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From safety devices to HVAC systems - comprehensive home maintenance tracking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety Devices</h3>
              <p className="text-gray-600">
                Smoke detectors, carbon monoxide alarms, and security system batteries.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❄️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">HVAC Systems</h3>
              <p className="text-gray-600">
                AC filters, furnace filters, and seasonal HVAC maintenance schedules.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Appliances</h3>
              <p className="text-gray-600">
                Dishwasher filters, water filters, and regular appliance maintenance.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Battery Devices</h3>
              <p className="text-gray-600">
                Remotes, wireless mice, game controllers, and all battery-powered devices.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Tracking</h3>
              <p className="text-gray-600">
                Color-coded status, photo documentation, and automated reminders.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Schedules</h3>
              <p className="text-gray-600">
                Monthly, seasonal, or annual maintenance - set any schedule you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Stop Playing Home Maintenance Roulette
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-rose-600">😤 The Problem</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Smoke detector beeps at 3am</li>
                <li>• AC filter hasn&apos;t been changed in months</li>
                <li>• Forgot when you last cleaned the dishwasher filter</li>
                <li>• HVAC system running inefficiently</li>
                <li>• Safety devices with dead batteries</li>
                <li>• Appliances breaking down from poor maintenance</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-emerald-600">✅ The Solution</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Proactive maintenance scheduling</li>
                <li>• Visual tracking with photos</li>
                <li>• Smart status monitoring</li>
                <li>• Never caught off guard again</li>
                <li>• Peace of mind for safety devices</li>
                <li>• Efficient, well-maintained home systems</li>
              </ul>
            </div>
          </div>

          {!session && (
            <ButtonSignin className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" />
          )}
        </div>
      </section>

      {/* What You Can Track Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You Can Track
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive home maintenance in one organized place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">🚨 Safety First</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Smoke detectors</li>
                <li>• Carbon monoxide alarms</li>
                <li>• Security system batteries</li>
                <li>• Emergency flashlights</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">🌡️ HVAC & Climate</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AC filters</li>
                <li>• Furnace filters</li>
                <li>• Humidifier filters</li>
                <li>• Vent cleaning</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">🔧 Appliances</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dishwasher filters</li>
                <li>• Water filters</li>
                <li>• Garbage disposal</li>
                <li>• Washing machine</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">🎮 Electronics</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• TV remotes</li>
                <li>• Game controllers</li>
                <li>• Wireless mice</li>
                <li>• Garage door openers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Master Your Home Maintenance?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join homeowners who&apos;ve taken control of their home maintenance schedules
          </p>
          
          {!session ? (
            <div className="space-y-4">
              <ButtonSignin className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" />
              <div className="text-indigo-200 text-sm">
                ✨ Completely free • 📧 Magic link login • 🚀 Start tracking in minutes
              </div>
            </div>
          ) : (
            <a href="/dashboard" className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block">
              Go to Dashboard →
            </a>
          )}
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
          <div className="flex justify-center gap-6 mb-4">
            <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </a>
            <a href="/blog/when-to-change-smoke-detector-batteries" className="text-gray-400 hover:text-white transition-colors">
              Safety Guide
            </a>
          </div>
          <div className="text-sm text-gray-500">
            Built for organized homeowners everywhere
          </div>
        </div>
      </footer>
    </main>
  );
}