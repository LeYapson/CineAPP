'use client';

import { ReactNode } from 'react';
import EnhancedHeader from '@/components/layout/EnhancedHeader';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EnhancedHeader />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  );
}
