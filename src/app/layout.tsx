// src > app > layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import '../app/globals.css';

import QueryProvider from './providers/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Task Manager',
  description:
    'A simple task management application built with Next.js and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className={` ${inter.className} min-h-full flex flex-col`}>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
