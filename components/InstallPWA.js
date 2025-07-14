"use client";

import { useState, useEffect } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // For iOS, show instructions after a delay if not installed
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        if (!isInstalled) {
          setShowIOSInstructions(true);
        }
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }

    // Listen for the beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listen for successful app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
      setShowIOSInstructions(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleIOSClose = () => {
    setShowIOSInstructions(false);
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // iOS Instructions
  if (isIOS && showIOSInstructions) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <span className="font-medium text-sm">Install App</span>
          </div>
          <button 
            onClick={handleIOSClose}
            className="text-white hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-xs mb-3">
          Add BatteryTracker to your home screen for quick access:
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span>1.</span>
            <span>Tap the Share button</span>
            <span className="bg-white text-blue-600 px-1 py-0.5 rounded text-xs">⬆️</span>
          </div>
          <div className="flex items-center gap-2">
            <span>2.</span>
            <span>Select "Add to Home Screen"</span>
          </div>
          <div className="flex items-center gap-2">
            <span>3.</span>
            <span>Tap "Add"</span>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop Install Button
  if (!isIOS && showInstallButton) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleInstallClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
        >
          <span className="text-lg">📱</span>
          Install App
        </button>
      </div>
    );
  }

  return null;
}

// Alternative inline install button (for header or specific pages)
export function InlineInstallButton({ className = "" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (isInstalled || !showInstallButton) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className={`bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${className}`}
    >
      <span className="text-sm">📱</span>
      Install App
    </button>
  );
}