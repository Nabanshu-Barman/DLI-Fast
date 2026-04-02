'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardView from '@/components/DashboardView';
import { get } from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await get('/dashboard/me');
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || 'Failed to load dashboard data.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading your dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView="dashboard"
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
          {isLoading ? (
            <div className="space-y-8 animate-fade-in pt-8">
              <Skeleton className="h-12 w-64 mb-2" />
              <Skeleton className="h-6 w-96 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <Skeleton className="h-64 lg:col-span-1" />
                <Skeleton className="h-64 lg:col-span-2" />
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in space-y-4 pt-20">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <h2 className="text-2xl font-bold">Failed to load dashboard</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={fetchDashboard} variant="outline" className="mt-4">
                Retry Fetch
              </Button>
            </div>
          ) : (
            <DashboardView dashboardData={dashboardData} />
          )}
        </div>
      </main>
    </div>
  );
}
