import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Airline Management System',
  description: 'Staff check-in, in-flight services, and admin dashboard for airline operations',
};

/**
 * Home Page - Server Component
 * 
 * Benefits of Server Component:
 * - SEO-friendly with metadata
 * - Reduced client-side JavaScript bundle
 * - Better initial page load performance
 * - Delegates client interactivity to HomeClient
 */
export default function Home() {
  return <HomeClient />;
}
