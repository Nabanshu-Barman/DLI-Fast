'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CatalogueView from '@/components/CatalogueView';
import { get } from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CataloguePage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await get('/courses');
      if (response.success && Array.isArray(response.data)) {
        setCourses(response.data);
      } else if (response.success && response.data?.courses) {
        setCourses(response.data.courses);
      } else {
        throw new Error(response.message || 'Failed to load courses data.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading the catalogue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView="catalogue"
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
            <div className="space-y-8 animate-fade-in pt-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <Skeleton className="h-10 w-64 mb-2" />
                  <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-2 w-full md:w-auto items-center">
                  <Skeleton className="h-10 w-full md:w-64" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-white/5 bg-card">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-6" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in space-y-4 pt-20">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <h2 className="text-2xl font-bold">Failed to load courses</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={fetchCourses} variant="outline" className="mt-4">
                Retry Fetch
              </Button>
            </div>
          ) : (
            <CatalogueView 
              isDarkMode={isDarkMode} 
              onToggleTheme={toggleTheme} 
              courses={courses}
              onCoursesChange={fetchCourses}
            />
          )}
        </div>
      </main>
    </div>
  );
}
