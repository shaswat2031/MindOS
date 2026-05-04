import { Inter, JetBrains_Mono, Outfit, Great_Vibes } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  description: "Think better. Decide faster. Grow daily.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${outfit.variable} ${cursive.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col bg-soft text-text-primary font-body" suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
