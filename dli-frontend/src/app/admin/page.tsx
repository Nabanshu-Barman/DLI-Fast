'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AdminView from '@/components/AdminView';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView="admin"
        onNavigate={(view) => router.push(`/${view === 'hero' ? '' : view}`)} 
        isLoggedIn={true}
        isAdmin={true}
        onLogout={() => router.push('/')}
      />
      <main className="relative pt-20">
        <div className="container mx-auto px-4 pb-20">
          <AdminView />
        </div>
      </main>
    </div>
  );
}