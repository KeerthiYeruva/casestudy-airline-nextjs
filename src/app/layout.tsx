import type { ReactNode } from 'react';

/**
 * Root Layout - Required for Next.js App Router
 * This is a minimal root layout that wraps the locale-specific layout
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
