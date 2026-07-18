// src > app > layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import '../app/globals.css';
import { ReduxProvider } from '../redux/providers'; // To Link Between Redux and Project

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
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
