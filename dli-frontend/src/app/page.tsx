
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TechSpecsSection from '@/components/TechSpecsSection';
import AboutSection from '@/components/AboutSection';
import { useAuth } from '@/hooks/use-auth';

export type ViewState = 'dashboard' | 'catalogue' | 'tasks' | 'admin' | 'queue' | 'hero' | 'login';

export default function VelocityApp() {
  const router = useRouter();
  const { isLoggedIn, isAdmin, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView="hero" 
        onNavigate={(view) => router.push(`/${view === 'hero' ? '' : view}`)} 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={() => {
          logout();
          router.push('/');
        }}
      />
      
      <main className="relative">
        <HeroSection onLogin={() => router.push('/login')} />
        <TechSpecsSection onCatalogue={() => router.push('/catalogue')} />
        <AboutSection />
      </main>
    </div>
  );
}
