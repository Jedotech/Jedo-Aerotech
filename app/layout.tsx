import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jedo Technologies | Global Aviation Sourcing Chennai',
  description: 'Premier sourcing agency for Cessna, Piper, and Diamond aircraft parts. FAA 8130-3 & EASA Form 1 certified parts with Indian customs clearance.',
  keywords: 'Aircraft parts India, Cessna parts Chennai, Piper parts sourcing, Aviation MRO India, Jedo Tech',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/favicon.ico', // Ensure you have a favicon.ico in your /public folder
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        {/* Global SEO and Social Media Meta Tags */}
        <meta property="og:title" content="Jedo Technologies | Aviation Sourcing" />
        <meta property="og:description" content="Certified aircraft parts delivered to your hangar in India." />
        <meta property="og:image" content="/hero-aircraft.png" />
        <meta name="theme-color" content="#002d5b" />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  )
}