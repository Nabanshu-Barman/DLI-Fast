'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Award, BookOpen, History } from 'lucide-react';

export default function DashboardView({ dashboardData }: { dashboardData: any }) {
  const user = dashboardData?.user;
  const balance = user?.points?.balance ?? 0;
  const coursesCompleted = user?.coursesCompletedCount ?? 0;
  const rank = user?.rank ?? 'Member';
  const name = user?.name ?? 'Member';
  const activeCourse = user?.activeCourse;
  
  const pendingRequests = dashboardData?.pendingRequests ?? [];
  const completedCourses = dashboardData?.completedCourses ?? [];
  
  const historyItems = [
    ...pendingRequests.map((r: any) => ({
      id: r._id,
      courseTitle: r.course?.title || 'Unknown Course',
      code: 'Pending...',
      date: new Date(r.requestedAt).toLocaleDateString(),
      status: 'Pending'
    })),
    ...completedCourses.map((rc: any) => ({
      id: rc._id,
      courseTitle: rc.courseId?.title || 'Unknown Course',
      code: rc.code || 'View Code',
      date: new Date(rc.usedAt || rc.createdAt).toLocaleDateString(),
      status: 'Approved'
    }))
  ];

  return (
    <div className="space-y-8 animate-fade-in pt-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-headline font-bold">Member Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {name}. Here's your current progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-primary/20 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold font-headline text-primary">{Math.floor(balance)}</span>
              <span className="text-muted-foreground text-sm">PTS</span>
            </div>
          </CardContent>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
        </Card>

        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <BookOpen className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold font-headline">{coursesCompleted}</span>
              <span className="text-muted-foreground text-sm">CERTIFIED</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Rank</CardTitle>
            <Award className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold font-headline italic">{rank}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 glass h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Current Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeCourse ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-1">{activeCourse.title}</h4>
                </div>
                <div className="pt-4">
                  <Badge variant="outline" className="border-primary text-primary bg-primary/5">
                    Course is active
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No active courses currently.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Redemption History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyItems.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No redemption history found.</p>
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
                  {historyItems.map((item: any) => (
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
