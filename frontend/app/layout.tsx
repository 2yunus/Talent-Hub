import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navigation from '../components/layout/Navigation'
import Sidebar from '../components/layout/Sidebar'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TalentHub - Connect Developers with Opportunities',
  description: 'A comprehensive job platform connecting talented developers with amazing opportunities. Find your next career move or hire the perfect developer for your team.',
  keywords: ['jobs', 'developers', 'careers', 'hiring', 'tech jobs', 'software engineering'],
  authors: [{ name: 'TalentHub Team' }],
  creator: 'TalentHub',
  publisher: 'TalentHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://talenthub.com'),
  openGraph: {
    title: 'TalentHub - Connect Developers with Opportunities',
    description: 'A comprehensive job platform connecting talented developers with amazing opportunities.',
    url: 'https://talenthub.com',
    siteName: 'TalentHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TalentHub - Job Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalentHub - Connect Developers with Opportunities',
    description: 'A comprehensive job platform connecting talented developers with amazing opportunities.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <AuthProvider>
          <div id="root" className="h-full">
            <Navigation />
            <div className="flex h-full pt-16">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <div className="min-h-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
