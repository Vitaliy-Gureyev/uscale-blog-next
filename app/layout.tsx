import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner"
import { SidebarProvider } from "@/src/components/ui/sidebar"
import CustomQueryClientProvider from "@/src/components/CustomQueryClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.uscale.ai'),
  title: {
    default: 'Uscale Blog | AI-Powered Customer Engagement Insights',
    template: '%s | Uscale Blog'
  },
  description: 'Enhance customer experience with Uscale\'s AI agents, automating lifecycle marketing and delivering personalized, data-driven campaigns at scale.',
  keywords: ['AI agents', 'customer engagement', 'marketing automation', 'personalization', 'AI marketing'],
  authors: [{ name: 'Uscale Team' }],
  creator: 'Uscale',
  publisher: 'Uscale',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.uscale.ai',
    siteName: 'Uscale Blog',
    title: 'Uscale Blog | AI-Powered Customer Engagement Insights',
    description: 'Enhance customer experience with Uscale\'s AI agents, automating lifecycle marketing and delivering personalized, data-driven campaigns at scale.',
    images: [
      {
        url: 'https://cdn.prod.website-files.com/671fc5fb37adf5d8b62182ce/6745880ab644c2416841e990_logo.svg',
        width: 1200,
        height: 630,
        alt: 'Uscale Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uscale Blog | AI-Powered Customer Engagement Insights',
    description: 'Enhance customer experience with Uscale\'s AI agents, automating lifecycle marketing and delivering personalized, data-driven campaigns at scale.',
    images: ['https://cdn.prod.website-files.com/671fc5fb37adf5d8b62182ce/6745880ab644c2416841e990_logo.svg'],
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
  icons: {
    icon: [
      { url: 'https://cdn.prod.website-files.com/671fc5fb37adf5d8b62182ce/674588777e510dc7948e9828_icon32.png' }
    ],
    apple: [
      { url: 'https://cdn.prod.website-files.com/671fc5fb37adf5d8b62182ce/6745889611b72aa7bea2c3ae_icon256.png' }
    ]
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://blog.uscale.ai'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <CustomQueryClientProvider>
        <TooltipProvider delayDuration={0}>
          <Toaster/>
          <Sonner/>
          <SidebarProvider>
            <AppLayout>
              {children}
            </AppLayout>
      </SidebarProvider>
</TooltipProvider>
</CustomQueryClientProvider>
      </body>
      </html>
)
  ;
}
