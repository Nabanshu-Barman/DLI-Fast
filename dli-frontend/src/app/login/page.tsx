'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoginView from '@/components/LoginView';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView="login"
        onNavigate={(view) => router.push(`/${view === 'hero' ? '' : view}`)} 
        isLoggedIn={false}
        isAdmin={false}
        onLogout={() => {}}
      />
      <main className="relative pt-20">
        <div className="container mx-auto px-4 pb-20">
          <LoginView onLogin={(isAdmin) => router.push(isAdmin ? '/admin' : '/dashboard')} />
        </div>
      </main>
    </div>
  );
}