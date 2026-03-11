
'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_COURSES, Course } from '@/lib/mock-data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Sun, Moon } from 'lucide-react';

interface CatalogueProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export default function CatalogueView({ isDarkMode = true, onToggleTheme }: CatalogueProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCourses(MOCK_COURSES);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-headline font-bold">Course Catalogue</h2>
          <p className="text-muted-foreground">Unlock professional certifications with your earned points.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto items-center">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
          
          {/* Theme Toggle specifically for Catalogue View as per requirement */}
          {onToggleTheme && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onToggleTheme}
              className="ml-2 border-primary/20"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading 
          ? Array(6).fill(0).map((_, i) => <CatalogueSkeleton key={i} />)
          : courses.map(course => <CourseCard key={course.id} course={course} />)
        }
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group overflow-hidden bg-card border-white/5 hover:border-primary/50 transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
        <Badge className="absolute top-4 right-4 bg-primary text-white font-bold px-3 py-1">
          {course.pointsRequired} Points
        </Badge>
      </div>
      <CardHeader>
        <h3 className="text-xl font-bold font-headline leading-tight">{course.title}</h3>
      </CardHeader>
      <CardContent className="h-20 overflow-hidden">
        <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-secondary hover:bg-primary hover:text-white transition-all duration-300 font-bold">
          Request Course
        </Button>
      </CardFooter>
    </Card>
  );
}

function CatalogueSkeleton() {
  return (
    <Card className="overflow-hidden bg-card border-white/5">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
