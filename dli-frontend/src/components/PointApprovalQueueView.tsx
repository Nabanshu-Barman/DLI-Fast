'use client';

import React, { useState, useEffect } from 'react';
import { get, patch } from '@/lib/apiClient';
import { Check, X, HelpCircle, ShieldCheck, Search, Bell, Monitor, User, Link as LinkIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RequestData {
  _id: string;
  user: {
    _id: string;
    name: string;
    uid?: string;
  };
  taskTitle: string;
  taskCategory: string;
  submissionDate: string;
  time: string;
  rewardPoints: number;
  evidenceType: string;
  evidenceLink: string;
}

export default function PointApprovalQueueView({ initialRequests = [], onActionComplete }: { initialRequests?: RequestData[], onActionComplete?: () => void }) {
  const [pendingRequests, setPendingRequests] = useState<RequestData[]>(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    setPendingRequests(initialRequests);
  }, [initialRequests]);

  const handleAction = async (requestId: string, actionStatus: string) => {
    try {
      setProcessingId(requestId);
      const res = await patch(`/admin/requests/${requestId}`, { action: actionStatus });
      if (res?.success !== false) {
        setPendingRequests(prev => prev.filter(r => r._id !== requestId));
        if (onActionComplete) onActionComplete();
      } else {
        alert(res?.message || 'Failed to update request status');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // Mock sum of points directly derived from pendingRequests 
  // (In reality this might come from a metadata endpoint)
  const totalPendingPoints = pendingRequests.reduce((sum, req) => sum + (req.rewardPoints || 0), 0) || 142500;

  return (
    <div className="bg-[#111111] min-h-screen text-white font-mono p-8 animate-fade-in w-full">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase flex flex-col">
            POINT APPROVAL QUEUE
            <span className="text-[10px] tracking-[0.2em] font-normal text-gray-500 mt-2 lowercase">
              ENFORCING PROTOCOL_V4.0 // PENDING_REVIEW_STACK
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-6 mr-12 text-sm text-gray-400 font-bold uppercase tracking-wider">
            <span className="text-white border-b-2 border-[#9ded10] pb-1">Approvals</span>
            <span className="hover:text-white transition-colors cursor-pointer">Resources</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="SEARCH HASH..." 
              className="bg-[#1a1a1a] border border-white/5 rounded-sm text-xs py-2.5 pl-10 pr-4 w-48 focus:outline-none focus:border-[#9ded10]/50 transition-colors"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-400 hover:text-[#9ded10] cursor-pointer transition-colors" />
          <Monitor className="w-5 h-5 text-gray-400 hover:text-[#9ded10] cursor-pointer transition-colors" />
          <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-500/50 flex items-center justify-center overflow-hidden">
            <User className="w-4 h-4 text-cyan-500" />
          </div>
        </div>
      </div>



      {/* Top Stats Area */}
      <div className="flex gap-6 mb-8 mt-2 items-start justify-end w-full">
         <div className="bg-[#1a1a1a] border border-white/5 border-l-[#9ded10] border-l-4 px-6 py-4 min-w-[200px]">
           <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">TOTAL PENDING</div>
           <div className="text-3xl font-bold text-white">
             {totalPendingPoints.toLocaleString()} <span className="text-[#9ded10] text-sm">XP</span>
           </div>
         </div>
         <div className="bg-[#1a1a1a] border border-white/5 border-l-red-500 border-l-4 px-6 py-4 min-w-[200px]">
           <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">QUEUE STATUS</div>
           <div className="text-2xl font-bold text-red-400 tracking-widest uppercase mt-1">
             CRITICAL
           </div>
         </div>
      </div>

      {/* Analytics Charts Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-3 bg-[#1a1a1a] border border-white/5 p-6 flex flex-col justify-between">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase text-[#9ded10]">WORKLOAD DISTRIBUTION</div>
          <div className="flex h-32 items-end gap-2 mt-6">
            <div className="bg-white/5 w-full h-[30%]"></div>
            <div className="bg-white/10 w-full h-[60%]"></div>
            <div className="bg-white/5 w-full h-[50%]"></div>
            <div className="bg-[#9ded10]/80 w-full h-[90%] relative">
               <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-[#9ded10] tracking-widest uppercase">TODAY</span>
            </div>
            <div className="bg-white/10 w-full h-[20%]"></div>
            <div className="bg-white/5 w-full h-[15%]"></div>
            <div className="bg-white/10 w-full h-[25%]"></div>
          </div>
        </div>
        <div className="col-span-1 bg-[#1a1a1a] border border-white/5 p-6 flex flex-col justify-center">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4">REVIEW EFFICIENCY</div>
          <div className="text-4xl font-bold text-white mb-4">
            92<span className="text-[#9ded10]">%</span>
          </div>
          <div className="w-full h-1 bg-white/10 relative mb-4">
            <div className="absolute top-0 left-0 h-full bg-[#9ded10] w-[92%]"></div>
          </div>
          <div className="text-[9px] text-gray-500 tracking-widest uppercase">AVG. TAT: 4.2 HOURS</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#1a1a1a] border border-white/5 mb-8">
        {/* Table Header / Filters */}
        <div className="flex justify-between items-center border-b border-white/5 p-6">
          <h2 className="text-xs font-bold text-white tracking-widest uppercase">
            PENDING REQUESTS ({pendingRequests.length})
          </h2>
          <div className="flex gap-2">
            <button className="bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] px-4 py-2 uppercase tracking-widest border border-white/5 transition-colors">
              FILTERS
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] px-4 py-2 uppercase tracking-widest border border-white/5 transition-colors">
              EXPORT CSV
            </button>
          </div>
        </div>
        
        {/* Table Columns */}
        <div className="grid grid-cols-12 gap-4 text-[9px] text-gray-500 font-bold tracking-widest uppercase border-b border-white/5 p-4 px-6">
          <div className="col-span-3">MEMBER IDENTITY</div>
          <div className="col-span-3">TASK DESIGNATION</div>
          <div className="col-span-2">SUBMISSION</div>
          <div className="col-span-1 text-right">REWARD</div>
          <div className="col-span-1 text-center">EVIDENCE</div>
          <div className="col-span-2 text-right">ACTION HASH</div>
        </div>
        
        {/* Table Rows */}
        <div className="flex flex-col">
          {pendingRequests.length > 0 ? (
            pendingRequests.map(req => (
              <div key={req._id} className="grid grid-cols-12 gap-4 items-center p-4 px-6 border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                
                {/* Member Identity */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {req.user?.name ? req.user.name.substring(0, 2).toUpperCase() : '??'}
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">{req.user?.name || 'Unknown User'}</div>
                    <div className="text-[9px] text-gray-500 uppercase mt-0.5 tracking-wider">UID: {req.user?.uid || req.user?._id?.substring(0,6) || 'XXXX-X'}</div>
                  </div>
                </div>
                
                {/* Task Designation */}
                <div className="col-span-3">
                  <div className="text-white text-xs truncate pr-4">{req.taskTitle || 'Unknown Task'}</div>
                  <div className="text-[9px] text-[#9ded10] uppercase mt-0.5 tracking-wider">CATEGORY: {req.taskCategory || 'GENERAL'}</div>
                </div>
                
                {/* Submission */}
                <div className="col-span-2">
                  <div className="text-gray-300 text-xs">{req.submissionDate || '2023-11-24'}</div>
                  <div className="text-[9px] text-gray-500 uppercase mt-0.5 tracking-wider">{req.time || '14:22 GMT'}</div>
                </div>
                
                {/* Reward */}
                <div className="col-span-1 text-right">
                  <div className="text-[#9ded10] font-bold text-xs">{req.rewardPoints ? req.rewardPoints.toLocaleString() : '0'} XP</div>
                </div>
                
                {/* Evidence */}
                <div className="col-span-1 text-center flex justify-center">
                  <a href={req.evidenceLink || '#'} target="_blank" rel="noreferrer" className="text-[#9ded10] hover:text-white transition-colors flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold">
                    <LinkIcon className="w-3 h-3" /> {req.evidenceType || 'GITHUB PR'}
                  </a>
                </div>
                
                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-2">
                  <button 
                    onClick={() => handleAction(req._id, 'approved')}
                    disabled={processingId === req._id}
                    className="w-7 h-7 flex items-center justify-center border border-[#9ded10]/30 hover:bg-[#9ded10]/10 text-[#9ded10] transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    className="w-7 h-7 flex items-center justify-center border border-white/10 hover:bg-white/10 text-gray-400 transition-colors disabled:opacity-50"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleAction(req._id, 'rejected')}
                    disabled={processingId === req._id}
                    className="w-7 h-7 flex items-center justify-center border border-red-500/30 hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 text-xs tracking-widest uppercase">
              NO PENDING REQUESTS FOUND IN STACK.
            </div>
          )}
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 px-6 border-t border-white/5 flex justify-between items-center bg-[#151515]">
          <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
            SHOWING {Math.min(3, pendingRequests.length)} OF {pendingRequests.length} ENTRIES
          </div>
          <div className="flex gap-1">
             <button className="w-7 h-7 flex items-center justify-center border border-white/5 text-gray-500 hover:text-white bg-white/5 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
             <button className="w-7 h-7 flex items-center justify-center border-none text-black bg-[#9ded10] font-bold text-[10px]">1</button>
             <button className="w-7 h-7 flex items-center justify-center border border-white/5 text-gray-400 hover:text-white bg-white/5 transition-colors text-[10px] font-bold">2</button>
             <button className="w-7 h-7 flex items-center justify-center border border-white/5 text-gray-400 hover:text-white bg-white/5 transition-colors text-[10px] font-bold">3</button>
             <button className="w-7 h-7 flex items-center justify-center border border-white/5 text-gray-500 hover:text-white bg-white/5 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Bottom Layout Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-3 bg-[#1a1a1a] border border-white/5 p-6 flex gap-6 items-center">
           <div className="w-12 h-12 border border-[#9ded10]/30 shrink-0 flex items-center justify-center text-[#9ded10] bg-[#9ded10]/5">
             <ShieldCheck className="w-6 h-6" />
           </div>
           <div>
             <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1 mt-1">SYSTEM INTEGRITY NOTICE</h3>
             <p className="text-xs text-gray-400">All point approvals are logged in the immutable system ledger. Ensure proof validation protocol <span className="text-[#9ded10]">FAST-V4-99</span> is followed before final deployment.</p>
           </div>
        </div>
        
        <div className="col-span-1 bg-[#1a1a1a] border border-white/5 p-6 flex flex-col justify-center">
           <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase mb-3 text-gray-400">
             <span>AUTO-QUEUE SWEEP</span>
             <span className="text-[#9ded10]">ACTIVE</span>
           </div>
           <div className="w-full h-1 bg-white/10 relative mb-4">
             <div className="absolute top-0 left-0 h-full bg-yellow-500 w-[65%]"></div>
           </div>
           <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase text-gray-500">
             <span>NEXT SWEEP: 94M 22S</span>
             <span className="text-[#9ded10] cursor-pointer hover:text-white transition-colors">MANUAL RUN</span>
           </div>
        </div>
      </div>

    </div>
  );
}