import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import ClientLayout from "@/components/ClientLayout";
import "@/styles/App.scss";
import "@/styles/Accessibility.scss";

export const metadata: Metadata = {
  title: {
    default: "Airline Management System",
    template: "%s | Airline Management System",
  },
  description: "Modern airline check-in and in-flight management system with real-time updates",
  icons: {
    icon: '/icon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  keywords: ['airline', 'check-in', 'flight management', 'passenger management'],
  authors: [{ name: 'Airline Management Team' }],
  creator: 'Airline Management System',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Airline Management System',
    description: 'Modern airline check-in and in-flight management system',
    siteName: 'Airline Management System',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1976d2',
};

/**
 * Root Layout - Server Component
 * 
 * Performance optimizations:
 * - Server-side rendering for initial HTML
 * - Proper metadata for SEO
 * - Theme and style loading optimized
 * - Client-side features isolated to ClientLayout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
