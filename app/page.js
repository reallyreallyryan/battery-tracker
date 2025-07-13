import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import ButtonSignin from "@/components/ButtonSignin";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔋</span>
          <span className="text-xl font-bold text-gray-900">BatteryTracker</span>
        </div>
        
        <div className="flex items-center gap-4">
          {session ? (
            <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Go to Dashboard
            </a>
          ) : (
            <ButtonSignin />
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            📷 Camera-Powered Battery Management
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Never Forget to Change<br />
          Your <span className="text-blue-600">Batteries</span> Again
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Take photos of your devices, track battery life, and get smart alerts when it's time to replace them. 
          From smoke detectors to TV remotes - keep your home powered and safe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          {!session ? (
            <>
              <ButtonSignin className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" />
              <div className="text-gray-500">
                ✨ Free to use • 📧 No passwords needed
              </div>
            </>
          ) : (
            <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
              Open Your Dashboard →
            </a>
          )}
        </div>

        {/* Demo Preview */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">📷 Take a Photo</h4>
                      <p className="text-gray-600">Use your camera to capture any battery-powered device</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">📝 Add Details</h4>
                      <p className="text-gray-600">Select battery type and when you last changed them</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">🚨 Get Smart Alerts</h4>
                      <p className="text-gray-600">See color-coded status and know exactly when to replace batteries</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl mb-2 block">📱</span>
                  <div className="text-sm">Live Demo</div>
                  <div className="text-xs">Camera Interface Preview</div>
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
              Everything You Need to Stay Powered
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple tools to track, monitor, and replace batteries before they die
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Camera Integration</h3>
              <p className="text-gray-600">
                Take photos of your devices with built-in camera. Works on phones and computers.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Alerts</h3>
              <p className="text-gray-600">
                Color-coded status shows when batteries are good, need attention, or must be replaced.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Whole Home Coverage</h3>
              <p className="text-gray-600">
                Track everything from smoke detectors to TV remotes. Keep your family safe and devices working.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
              <p className="text-gray-600">
                Perfect on phones and tablets. Take photos and check status anywhere in your home.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Magic link login - no passwords to remember. Your data stays private and secure.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Updates</h3>
              <p className="text-gray-600">
                Mark batteries as changed with one tap. Real-time status updates across all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Stop Playing Battery Roulette
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-red-600">😤 The Problem</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Smoke detector beeps at 3am</li>
                <li>• TV remote dies during the big game</li>
                <li>• Forgot when you last changed batteries</li>
                <li>• Buying batteries you already have</li>
                <li>• Safety devices with dead batteries</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-600">✅ The Solution</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Proactive battery replacement</li>
                <li>• Visual tracking with photos</li>
                <li>• Smart status monitoring</li>
                <li>• Never caught off guard again</li>
                <li>• Peace of mind for safety devices</li>
              </ul>
            </div>
          </div>

          {!session && (
            <ButtonSignin className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Never Miss a Battery Change?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join others who've already taken control of their battery management
          </p>
          
          {!session ? (
            <div className="space-y-4">
              <ButtonSignin className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" />
              <div className="text-blue-200 text-sm">
                ✨ Completely free • 📧 Magic link login • 🚀 Start in 30 seconds
              </div>
            </div>
          ) : (
            <a href="/dashboard" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block">
              Go to Your Dashboard →
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🔋</span>
            <span className="text-xl font-bold">BatteryTracker</span>
          </div>
          <p className="text-gray-400 mb-4">
            Never forget to change your batteries again
          </p>
          <div className="text-sm text-gray-500">
            Built with ❤️ for organized homes everywhere
          </div>
        </div>
      </footer>
    </main>
  );
}