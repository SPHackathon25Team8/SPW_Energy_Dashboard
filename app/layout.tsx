import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scottish Power Energy Dashboard',
  description: 'Track and optimize your energy consumption with AI-powered insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
