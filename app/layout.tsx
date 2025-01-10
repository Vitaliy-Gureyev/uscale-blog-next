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
  title: "Uscale Blog - Modern AI & Marketing Insights",
  description: "Discover how AI automation transforms marketing and business. Expert insights on implementing AI solutions and scaling operations efficiently.",
  openGraph: {
    type: "website",
    url: "https://blog.uscale.ai",
    title: "Uscale Blog - Modern AI & Marketing Insights",
    description: "Discover how AI automation transforms marketing and business. Expert insights on implementing AI solutions and scaling operations efficiently.",
    images: ["/lovable-uploads/aedff95c-0dc3-4dd8-bc86-b44c90691e38.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uscale Blog - Modern AI & Marketing Insights",
    description: "Discover how AI automation transforms marketing and business. Expert insights on implementing AI solutions and scaling operations efficiently.",
    images: ["/lovable-uploads/aedff95c-0dc3-4dd8-bc86-b44c90691e38.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head> */}
        {/* <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/lovable-uploads/86f89bcc-deb1-4fea-aa82-bc4d0cfbbc88.png" />
        <link rel="preload" href="/src/index.css" as="style" />
        <link rel="stylesheet" href="/src/index.css" />
        <link rel="preconnect" href="https://cdn.gpteng.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://jyjoyiymvgopvbtonipc.supabase.co" crossOrigin="anonymous" /> */}
      {/* </head> */}
      <CustomQueryClientProvider>
       <TooltipProvider delayDuration={0}>
      <Toaster />
      <Sonner />
       <SidebarProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AppLayout>
      {children}
      </AppLayout>

      {/* <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script> */}
        {/* <script type="module" src="/src/main.tsx" async></script> */}
      </body>
       </SidebarProvider>
       </TooltipProvider>
      </CustomQueryClientProvider>
    </html>
  );
}
