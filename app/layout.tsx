import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '100-Country Flags Battle',
  description: 'Automated 100-Country Flag Elimination Tournament',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050814] text-white antialiased flex flex-col items-center justify-center">
        {children}
      </body>
    </html>
  );
}

