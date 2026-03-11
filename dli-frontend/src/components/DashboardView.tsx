
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Award, BookOpen, History, TrendingUp } from 'lucide-react';
import { MOCK_HISTORY } from '@/lib/mock-data';

export default function DashboardView() {
  const [isLoading, setIsLoading] = useState(true);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Animating points up
      let current = 0;
      const target = 420;
      const interval = setInterval(() => {
        current += 10;
        if (current >= target) {
          setPoints(target);
          clearInterval(interval);
        } else {
          setPoints(current);
        }
      }, 30);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-headline font-bold">Member Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Alex. Here's your current progress.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-primary/20 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-headline text-primary">{points}</span>
                <span className="text-muted-foreground text-sm">PTS</span>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-green-500">
              <TrendingUp className="w-3 h-3" /> +50 points this month
            </div>
          </CardContent>
          {/* Subtle background glow */}
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
        </Card>

        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <BookOpen className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-20" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-headline">12</span>
                <span className="text-muted-foreground text-sm">CERTIFIED</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-4">Top 5% of all learners</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Rank</CardTitle>
            <Award className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-headline italic">Elite</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-4">Level 4 Practitioner</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Course */}
        <Card className="lg:col-span-1 glass h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Current Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-1">Deep Learning Fundamentals</h4>
                  <p className="text-sm text-muted-foreground">Module 4: Backpropagation & Optimization</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Course Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2 bg-secondary" />
                </div>
                <div className="pt-4">
                  <Badge variant="outline" className="border-primary text-primary bg-primary/5">
                    Continuing where you left off...
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="lg:col-span-2 glass overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Redemption History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/10">
                    <TableHead>Course</TableHead>
                    <TableHead>Redemption Code</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_HISTORY.map((item) => (
                    <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium">{item.courseTitle}</TableCell>
                      <TableCell className="font-mono text-xs">{item.code}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className={
                            item.status === 'Approved' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/20' :
                            item.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20' :
                            'bg-destructive/20 text-destructive hover:bg-destructive/20'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
