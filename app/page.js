import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import ButtonSignin from "@/components/ButtonSignin";

export const metadata = {
  title: "VoltaHome: Battery Tracking App | Never Forget Battery Changes",
  description: "Track battery life in all your devices with photos and smart alerts. Never get caught with dead batteries in smoke detectors, remotes, and more.",
  keywords: "battery tracker, battery replacement, smoke detector batteries, home safety",
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
            🏠 Smart Home Battery Management
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Keep Your Home<br />
          <span className="text-indigo-600">Powered & Safe</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Track when you changed batteries in your home devices. Take photos, set reminders, 
          and never get caught with dead smoke detectors or remotes again.
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
                      <p className="text-gray-600">Take a picture of any device that uses batteries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">📝 Log the Details</h4>
                      <p className="text-gray-600">Note the battery type and when you last changed it</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">⏰ Stay Informed</h4>
                      <p className="text-gray-600">Get visual status updates when it&apos;s time to replace</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 h-64 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <span className="text-5xl mb-3 block">📱</span>
                  <div className="font-medium">Camera Interface</div>
                  <div className="text-sm text-gray-500">Point, shoot, track</div>
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
              Everything for Your Home&apos;s Power Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple tools to track and manage batteries across your entire home
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visual Tracking</h3>
              <p className="text-gray-600">
                Take photos of your devices so you remember exactly what you&apos;re tracking.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Status</h3>
              <p className="text-gray-600">
                Color-coded indicators show when batteries are fresh, aging, or need replacement.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Whole Home</h3>
              <p className="text-gray-600">
                From smoke detectors to game controllers - track every battery in your home.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile First</h3>
              <p className="text-gray-600">
                Works perfectly on your phone. Add devices and check status from anywhere.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Private & Secure</h3>
              <p className="text-gray-600">
                Your home data stays private. Simple magic link login - no passwords needed.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Updates</h3>
              <p className="text-gray-600">
                Mark batteries as changed with one tap. Keep your tracking current effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            No More Battery Surprises
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-rose-600">😤 Sound Familiar?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Smoke detector chirps at 3am</li>
                <li>• TV remote dies during your show</li>
                <li>• Can&apos;t remember when you last changed batteries</li>
                <li>• Buying batteries you might already have</li>
                <li>• Worried about safety device failures</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-emerald-600">✅ With VoltaHome</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Stay ahead of battery changes</li>
                <li>• Visual records of all your devices</li>
                <li>• Know the status at a glance</li>
                <li>• Never caught off guard</li>
                <li>• Peace of mind for safety devices</li>
              </ul>
            </div>
          </div>

          {!session && (
            <ButtonSignin className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Power Up Your Home Management?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join homeowners who&apos;ve taken control of their battery maintenance
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
            Keep your home powered and safe
          </p>
          <div className="text-sm text-gray-500">
            Built for organized homeowners everywhere
          </div>
        </div>
      </footer>
    </main>
  );
}