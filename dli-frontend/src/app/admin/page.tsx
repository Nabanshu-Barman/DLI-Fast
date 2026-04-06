'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AdminView from '@/components/AdminView';
import { useAuth } from '@/hooks/use-auth';

export default function AdminPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView="admin"
        onNavigate={(view) => router.push(`/${view === 'hero' ? '' : view}`)} 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={() => {
          logout();
          router.push('/');
        }}
      />
      <main className="relative pt-20">
        <div className="container mx-auto px-4 pb-20">
          <AdminView />
        </div>
      </main>
    </div>
  );
}