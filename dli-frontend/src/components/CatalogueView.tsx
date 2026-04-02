'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Sun, Moon, Loader2 } from 'lucide-react';
import { post } from '@/lib/apiClient';

interface CatalogueProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  courses: any[];
  onCoursesChange?: () => void;
}

export default function CatalogueView({ isDarkMode = true, onToggleTheme, courses, onCoursesChange }: CatalogueProps) {
  const [requestingCourseId, setRequestingCourseId] = useState<string | null>(null);

  const handleRequestCourse = async (courseId: string) => {
    setRequestingCourseId(courseId);
    try {
      const response = await post('/requests', { courseId });
      if (response.success) {
        alert('Course requested successfully!');
        if (onCoursesChange) onCoursesChange();
      } else {
        alert(`Error: ${response.message || 'Could not request course'}`);
      }
    } catch (err: any) {
      alert(`API Error: ${err.message || 'Something went wrong while requesting the course.'}`);
    } finally {
      setRequestingCourseId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pt-8">
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
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
          </div>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
          
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
        {courses.length === 0 ? (
          <p className="text-muted-foreground col-span-3 text-center py-10">No courses available.</p>
        ) : (
          courses.map(course => (
            <CourseCard 
              key={course._id} 
              course={course} 
              isRequesting={requestingCourseId === course._id}
              onRequest={() => handleRequestCourse(course._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, isRequesting, onRequest }: { course: any, isRequesting: boolean, onRequest: () => void }) {
  const outOfStock = course.inventoryCount <= 0;
  const heroImage = course.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <Card className={`group overflow-hidden bg-card border-white/5 transition-all duration-300 ${outOfStock ? 'opacity-60' : 'hover:border-primary/50'}`}>
      <div className="relative h-48 w-full overflow-hidden bg-secondary/20">
        <img 
          src={heroImage} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
        <Badge className="absolute top-4 right-4 bg-primary text-white font-bold px-3 py-1 border-none shadow-xl">
          {course.pointsRequired} Points
        </Badge>
        {course.level && (
          <Badge variant="outline" className="absolute top-4 left-4 bg-black/40 text-white backdrop-blur-md border-white/20">
            {course.level}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-bold font-headline leading-tight line-clamp-2" title={course.title}>
            {course.title}
          </h3>
        </div>
        {course.category && (
          <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{course.category}</p>
        )}
      </CardHeader>
      <CardContent className="h-16 overflow-hidden pt-0 text-sm text-muted-foreground line-clamp-2">
        <p>{course.description || 'No description available for this course.'}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 relative">
        <div className="w-full flex justify-between text-xs text-muted-foreground mb-1">
          <span>Inventory</span>
          <span className={outOfStock ? "text-destructive font-bold" : ""}>
            {course.inventoryCount} left
          </span>
        </div>
        <Button 
          className="w-full bg-secondary hover:bg-primary hover:text-white transition-all duration-300 font-bold"
          onClick={onRequest}
          disabled={outOfStock || isRequesting}
        >
          {isRequesting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Requesting...</>
          ) : outOfStock ? (
            'Out of Stock'
          ) : (
            'Request Course'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
