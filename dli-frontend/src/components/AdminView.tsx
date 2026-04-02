
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle2, XCircle, Plus, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { get, patch } from '@/lib/apiClient';

interface PendingRequest {
  _id: string;
  requestedBy?: { _id: string; name: string; srmRegNo: string; points?: { balance: number } };
  course?: { _id: string; title: string; pointsRequired: number; inventoryCount?: number };
  userBalanceAtRequest?: number;
  status: string;
  requestedAt?: string;
}

export default function AdminView() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await get('/admin/requests?status=pending');
      if (res?.success) {
        setRequests(res.data || []);
      } else {
        throw new Error(res?.message || 'Failed to fetch pending requests');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      setProcessingId(id);
      const res = await patch(`/admin/requests/${id}`, { action });
      if (res?.success !== false) {
        setRequests(prev => prev.filter(r => r._id !== id));
      } else {
        alert(res?.message || 'Failed to process request');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-4xl font-headline font-bold">Admin Panel</h2>
        <p className="text-muted-foreground">Manage platform points, users, and course requests.</p>
      </div>

      {/* Pending count stat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Pending Requests</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg"><Clock className="text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline mb-1">
              {isLoading ? <Skeleton className="h-10 w-16" /> : requests.length}
            </div>
          </CardContent>
        </Card>
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
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-destructive" />
                <p className="text-destructive text-sm font-bold">{error}</p>
                <Button onClick={fetchRequests} variant="outline" size="sm">Retry</Button>
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
                    <TableRow key={request._id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium text-xs truncate max-w-[120px]">
                        {request.requestedBy?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{request.course?.title || 'Unknown Course'}</TableCell>
                      <TableCell>
                        <span className="font-bold">
                          {request.course?.pointsRequired || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(request._id, 'approved')}
                            disabled={processingId === request._id}
                            className="p-1.5 rounded-full hover:bg-green-500/20 text-green-500 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleAction(request._id, 'rejected')}
                            disabled={processingId === request._id}
                            className="p-1.5 rounded-full hover:bg-red-500/20 text-red-500 transition-colors disabled:opacity-50"
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
