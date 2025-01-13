import Index from "@/src/pagesFolder/Index";
import { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Discover insights about AI-powered customer engagement, marketing automation, and personalization strategies. Stay updated with the latest trends in customer experience optimization.',
  openGraph: {
    description: 'Discover insights about AI-powered customer engagement, marketing automation, and personalization strategies. Stay updated with the latest trends in customer experience optimization.',
  },
  twitter: {
    description: 'Discover insights about AI-powered customer engagement, marketing automation, and personalization strategies. Stay updated with the latest trends in customer experience optimization.',
  }
}

export default function Home() {
  return (
    <Index />
  )
}

