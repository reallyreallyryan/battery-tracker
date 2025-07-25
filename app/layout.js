import { Inter } from "next/font/google";
import { Providers } from "./providers";
import config from "@/config";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata = {
  title: config.appName,
  description: config.appDescription,
  keywords: ['battery tracker', 'battery management', 'home maintenance', 'device tracking', 'smart home'],
  authors: [{ name: 'NectarStack' }],
  creator: 'NectarStack',
  publisher: 'NectarStack',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // PWA metadata
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: config.appName,
  },
  // Icons
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      <head>
       <meta name="google-site-verification" content="obYzvpoIl1YAElL2tKPu6hEQjOjmtQa8i3YN0omQ25c" />
        {/* PWA meta tags */}
        <meta name="application-name" content={config.appName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={config.appName} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" /> 
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YZ920FQWJR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YZ920FQWJR');
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}