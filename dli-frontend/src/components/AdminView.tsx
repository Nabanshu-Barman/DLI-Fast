
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Coins, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { MOCK_ADMIN_REQUESTS } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminView() {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState(MOCK_ADMIN_REQUESTS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-4xl font-headline font-bold">Admin Panel</h2>
        <p className="text-muted-foreground">Manage platform points, users, and course requests.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-primary" />} label="Total Members" value="1,248" delta="+12%" />
        <StatCard icon={<Coins className="text-primary" />} label="Points Issued" value="452.5k" delta="+5%" />
        <StatCard icon={<Clock className="text-primary" />} label="Pending Requests" value={requests.length.toString()} delta="-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Requests */}
        <Card className="lg:col-span-2 glass border-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle>Course Enrollment Requests</CardTitle>
            <CardDescription>Review and approve member course redemptions.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : requests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>User</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Points Cost</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium text-xs truncate max-w-[120px]">{request.user}</TableCell>
                      <TableCell>{request.course}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${request.balance >= request.points ? 'text-green-500' : 'text-red-500'}`}>
                          {request.points}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">(Bal: {request.balance})</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(request.id, 'approve')}
                            className="p-1.5 rounded-full hover:bg-green-500/20 text-green-500 transition-colors"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleAction(request.id, 'reject')}
                            className="p-1.5 rounded-full hover:bg-red-500/20 text-red-500 transition-colors"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center text-muted-foreground bg-white/5 rounded-lg border border-dashed">
                All requests have been processed.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issue Points Form */}
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Issue Points
            </CardTitle>
            <CardDescription>Manually award points to a platform member.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-select">Search Member</Label>
              <Input id="member-select" placeholder="Enter name or email..." className="bg-background/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points-amount">Points Amount</Label>
              <Input id="points-amount" type="number" placeholder="0" className="bg-background/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Input id="reason" placeholder="Event bonus, correction..." className="bg-background/50 border-white/10" />
            </div>
            <Button className="w-full bg-primary text-white font-bold h-11 btn-nvidia-glow mt-4">
              Grant Points
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, delta }: { icon: React.ReactNode, label: string, value: string, delta: string }) {
  const isPositive = delta.startsWith('+');
  return (
    <Card className="glass border-white/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-headline mb-1">{value}</div>
        <div className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-400'}`}>
          {delta} <span className="text-muted-foreground font-normal">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
