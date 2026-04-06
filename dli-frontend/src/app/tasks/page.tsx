'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BountyBoardView from '@/components/BountyBoardView';
import { get } from '@/lib/apiClient';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TasksPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await get('/tasks');
      if (response.success) {
        setTasks(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to load tasks data.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView="tasks"
        onNavigate={(view) => router.push(`/${view === 'hero' ? '' : view}`)} 
        isLoggedIn={true}
        isAdmin={false}
        onLogout={() => {
          localStorage.removeItem('dli_jwt');
          router.push('/');
        }}
      />
      <main className="relative pt-20">
        <div className="container mx-auto px-4 pb-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-32 text-center animate-fade-in space-y-4 pt-40">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <h2 className="text-2xl font-bold font-mono uppercase tracking-widest text-[#9ded10]">Accessing Bounty Board...</h2>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Establishing encrypted tunnel to node</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-32 text-center animate-fade-in space-y-4 pt-40 bg-[#111111] font-mono">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h2 className="text-2xl font-bold uppercase tracking-widest text-red-500">Node Connection Failed</h2>
              <p className="text-gray-500 uppercase text-xs tracking-widest">{error}</p>
              <Button onClick={fetchTasks} className="mt-6 bg-[#9ded10] hover:bg-[#85c90b] text-black font-bold uppercase tracking-widest rounded-none">
                Retry Connection
              </Button>
            </div>
          ) : (
            <div className="pt-8">
              <BountyBoardView initialTasks={tasks} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}