
'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TechSpecsSection from '@/components/TechSpecsSection';
import AboutSection from '@/components/AboutSection';
import LoginView from '@/components/LoginView';
import CatalogueView from '@/components/CatalogueView';
import DashboardView from '@/components/DashboardView';
import AdminView from '@/components/AdminView';

export type ViewState = 'hero' | 'login' | 'catalogue' | 'dashboard' | 'admin';

export default function VelocityApp() {
  const [currentView, setCurrentView] = useState<ViewState>('hero');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (currentView === 'hero' || currentView === 'login') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (currentView === 'catalogue') {
      if (isDarkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [currentView, isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (admin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    navigateTo(admin ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigateTo('hero');
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView={currentView} 
        onNavigate={navigateTo} 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      
      <main className="relative">
        {currentView === 'hero' && (
          <>
            <HeroSection onLogin={() => navigateTo('login')} />
            <TechSpecsSection onCatalogue={() => navigateTo('catalogue')} />
            <AboutSection />
          </>
        )}
        
        <div className={`transition-all duration-500 ${currentView === 'hero' ? 'hidden' : 'block pt-20'}`}>
          <div className="container mx-auto px-4 pb-20">
            {currentView === 'login' && <LoginView onLogin={handleLogin} />}
            {currentView === 'catalogue' && (
              <CatalogueView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
            )}
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'admin' && <AdminView />}
          </div>
        </div>
      </main>
    </div>
  );
}
