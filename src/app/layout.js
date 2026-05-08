import { Inter, JetBrains_Mono, Outfit, Great_Vibes } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cursive = Great_Vibes({
  variable: "--font-cursive",
  weight: "400",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MindOS — Your Personal Decision & Mindset Engine",
  description: "MindOS is a high-performance AI decision engine designed to eliminate cognitive bias, clarify mental models, and accelerate your personal growth through logic-based auditing.",
  keywords: ["MindOS", "Decision Engine", "Mindset Coaching", "AI Decision Coach", "Cognitive Bias Auditor", "Personal Growth AI", "Strategic Thinking Tool"],
  authors: [{ name: "MindOS Lab" }],
  openGraph: {
    title: "MindOS — Think Better. Decide Faster.",
    description: "The AI-powered operating system for your mind. Audit your decisions, track your mindset, and unlock elite clarity.",
    url: "https://mindos.ai",
    siteName: "MindOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindOS - Strategic Clarity Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindOS — Your Personal Decision & Mindset Engine",
    description: "Think better. Decide faster. Grow daily with the world's first logic-based decision auditor.",
    images: ["/og-image.png"],
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
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${outfit.variable} ${cursive.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col bg-soft text-text-primary font-body" suppressHydrationWarning>
          <Toaster position="top-center" expand={false} richColors />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
