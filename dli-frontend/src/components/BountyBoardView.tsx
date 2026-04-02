'use client';

import React, { useState, useEffect } from 'react';
import { get, post } from '@/lib/apiClient';
import { Flame, List, UploadCloud, Activity, Search, Bell, Monitor, User, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Task {
  _id: string;
  title: string;
  description: string;
  points: { base?: number; multiplier?: number; effective?: number } | number;
  status: string;
  isHotBounty?: boolean;
  difficulty?: number;
  tags?: string[];
  timeRemaining?: string;
  systemTag?: string;
  multiplier?: string;
}

export default function BountyBoardView({ initialTasks = [] }: { initialTasks?: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [selectedSubmissionTask, setSelectedSubmissionTask] = useState('');

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleClaimTask = async (taskId: string) => {
    try {
      setActiveTaskId(taskId);
      const res = await post(`/tasks/${taskId}/claim`, {});
      if (res?.success) {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'claimed' } : t));
        setSelectedSubmissionTask(taskId);
      } else {
        alert(res?.message || 'Failed to claim task');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActiveTaskId(null);
    }
  };

  const handleSubmitTask = async (e: React.FormEvent, taskId: string, url: string) => {
    e.preventDefault();
    if (!taskId || !url) return alert('Please provide active task ID and submission URL/Link');
    try {
      setActiveTaskId(taskId);
      const res = await post(`/tasks/${taskId}/submit`, { url });
      if (res?.success) {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'in_review' } : t));
        setSubmissionUrl('');
        setSelectedSubmissionTask('');
        alert('Submission deployed successfully!');
      } else {
        alert(res?.message || 'Failed to submit task');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActiveTaskId(null);
    }
  };

  const hotBounties = tasks.filter(task => task.isHotBounty === true);
  const standardTasks = tasks.filter(task => task.isHotBounty !== true);

  return (
    <div className="bg-[#111111] min-h-screen text-white font-mono p-8 animate-fade-in w-full">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#9ded10] to-[#b3ff3b]">
            TASK<span className="font-light text-white">BOARD</span>
          </h1>
          <p className="text-[10px] tracking-[0.2em] text-gray-500 mt-2">DIRECT LIAISON INTERFACE / ACTIVE NODE</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="QUERY DATABASE..." 
              className="bg-[#1a1a1a] border border-white/5 rounded-sm text-xs py-2.5 pl-10 pr-4 w-64 focus:outline-none focus:border-[#9ded10]/50 transition-colors"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-400 hover:text-[#9ded10] cursor-pointer transition-colors" />
          <Monitor className="w-5 h-5 text-gray-400 hover:text-[#9ded10] cursor-pointer transition-colors" />
          <div className="w-8 h-8 rounded-full bg-gray-800 border border-[#9ded10]/30 flex items-center justify-center overflow-hidden">
            <User className="w-4 h-4 text-[#9ded10]" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex justify-between items-center bg-[#1a1a1a] border border-white/5 p-2 px-4 rounded-sm mb-10 text-xs text-gray-400 font-semibold tracking-wider">
        <div className="flex gap-8 items-center">
          <span className="opacity-50">FILTER BY:</span>
          <button className="bg-white/10 text-[#9ded10] px-3 py-1.5 rounded-sm border border-[#9ded10]/20">ALL TASKS</button>
          <button className="hover:text-white transition-colors">INFRASTRUCTURE</button>
          <button className="hover:text-white transition-colors">SECURITY</button>
          <button className="hover:text-white transition-colors">RESEARCH</button>
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-50">SORT:</span>
          <button className="flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-sm border border-white/5 hover:border-white/20 transition-all">
            HIGHEST YIELD <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Hot Bounties Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold tracking-wide flex items-center gap-3 mb-6">
          <Flame className="w-5 h-5 text-[#9ded10]" /> HOT BOUNTIES
          <div className="h-[1px] bg-white/10 flex-grow ml-4"></div>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hotBounties.length > 0 ? (
            hotBounties.map(task => (
              <div key={task._id} className="relative bg-[#1a1a1a] border border-white/5 border-l-[#9ded10] border-l-4 p-6 hover:bg-[#222] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="text-[9px] border border-[#9ded10]/30 text-[#9ded10] px-2 py-0.5 tracking-wider uppercase">{task.tags?.[0] || 'CRITICAL PATH'}</span>
                    <span className="text-[9px] bg-[#2a1b38] text-[#c084fc] px-2 py-0.5 tracking-wider uppercase">{task.multiplier || '1.5X MULTIPLIER'}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[#9ded10] text-3xl font-bold">{typeof task.points === 'object' ? (task.points?.effective || task.points?.base || 0).toLocaleString() : task.points?.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500 tracking-widest">DLI CREDITS</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 uppercase w-4/5">{task.title}</h3>
                <p className="text-xs text-gray-400 mb-8 line-clamp-2 w-4/5">{task.description}</p>
                
                <div className="flex justify-between items-end">
                  <div className="flex gap-8">
                    <div>
                      <div className="text-[9px] text-gray-500 tracking-wider mb-1 uppercase">Difficulty</div>
                      <div className="flex gap-1">
                        {Array(5).fill(0).map((_, i) => (
                          <div key={i} className={`w-4 h-1.5 ${i < (task.difficulty || 4) ? 'bg-[#9ded10]' : 'bg-gray-700'}`}></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500 tracking-wider mb-1 uppercase">Time Remaining</div>
                      <div className="text-xs text-[#9ded10] font-bold">{task.timeRemaining || '24:00:00'}</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleClaimTask(task._id)}
                    disabled={activeTaskId === task._id || task.status !== 'open'}
                    className="bg-[#9ded10] hover:bg-[#85c90b] text-black font-bold text-xs px-6 py-2.5 uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {activeTaskId === task._id ? 'CLAIMING...' : task.status === 'open' ? 'CLAIM TASK' : task.status}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center border border-dashed border-white/10 text-gray-500 text-sm">NO ACTIVE HOT BOUNTIES FOUND.</div>
          )}
        </div>
      </div>

      {/* Task Queue Section */}
      <div className="mb-12">
        <h2 className="text-lg font-bold flex items-center gap-3 mb-4 uppercase tracking-widest text-gray-300">
          <List className="w-5 h-5 text-gray-400" /> TASK QUEUE
        </h2>
        
        <div className="bg-[#1a1a1a] border border-white/5 w-full text-sm">
          <div className="grid grid-cols-12 text-[10px] text-gray-500 font-semibold tracking-widest uppercase border-b border-white/5 p-4">
            <div className="col-span-5">Task Descriptor</div>
            <div className="col-span-2">System / Tag</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-1 text-right">Yield</div>
            <div className="col-span-2 text-right">Action</div>
          </div>
          
          <div className="flex flex-col">
            {standardTasks.length > 0 ? (
              standardTasks.map(task => (
                <div key={task._id} className="grid grid-cols-12 items-center p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="col-span-5 pr-4">
                    <div className="font-bold text-white mb-1 truncate">{task.title}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">ID: {task._id.substring(0, 8)}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] border border-white/10 bg-white/5 text-gray-300 px-2 py-1 tracking-wider uppercase">
                      {task.systemTag || 'GENERAL'}
                    </span>
                  </div>
                  <div className="col-span-2 flex gap-0.5">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className={`w-3 h-3 border border-black ${i < (task.difficulty || 2) ? 'bg-[#9ded10]' : 'bg-gray-700'}`}></div>
                    ))}
                  </div>
                  <div className="col-span-1 text-right font-bold flex flex-col items-end">
                    <span>{typeof task.points === 'object' ? (task.points?.effective || task.points?.base || 0) : task.points} <span className="text-[#9ded10] text-[9px] ml-1">DLI</span></span>
                  </div>
                  <div className="col-span-2 text-right">
                    <button 
                      onClick={() => handleClaimTask(task._id)}
                      disabled={activeTaskId === task._id || task.status !== 'open'}
                      className="text-[#9ded10] hover:text-white text-[10px] tracking-widest uppercase font-bold transition-colors disabled:opacity-50"
                    >
                      {activeTaskId === task._id ? 'LOADING...' : task.status === 'open' ? 'INVESTIGATE' : task.status}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs">QUEUE EMPTY. AWAITING NEXT BATCH.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proof of Work Submission Form */}
        <div className="col-span-2 bg-[#1a1a1a] border border-white/5 p-6 relative">
          <h2 className="text-lg font-bold flex items-center gap-3 mb-6 tracking-widest text-white uppercase">
            <UploadCloud className="w-5 h-5 text-[#9ded10]" /> PROOF OF WORK SUBMISSION
          </h2>
          
          <form className="flex gap-8" onSubmit={(e) => handleSubmitTask(e, selectedSubmissionTask, submissionUrl)}>
            <div className="w-1/2 space-y-6">
              <div>
                <label className="block text-[10px] text-gray-500 tracking-widest uppercase mb-2">ACTIVE TASK ID</label>
                <input 
                  type="text" 
                  required
                  value={selectedSubmissionTask}
                  onChange={(e) => setSelectedSubmissionTask(e.target.value)}
                  className="w-full bg-[#111] border border-white/5 p-3 text-sm text-[#9ded10] focus:outline-none focus:border-[#9ded10]/30 transition-colors" 
                  placeholder="NEURAL-NET-BYPASS-001" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 tracking-widest uppercase mb-2">SUBMISSION URL / LINK</label>
                <input 
                  type="url" 
                  required
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full bg-[#111] border border-white/5 p-3 text-sm text-gray-300 focus:outline-none focus:border-[#9ded10]/30 transition-colors placeholder:text-gray-700" 
                  placeholder="https://github.com/your-repo/submission" 
                />
              </div>
            </div>
            
            <div className="w-1/2 flex flex-col">
              <div className="flex-grow border-2 border-dashed border-white/10 hover:border-[#9ded10]/30 bg-[#111] w-full flex flex-col items-center justify-center cursor-pointer transition-colors mb-4 group text-center px-4">
                <UploadCloud className="w-8 h-8 text-gray-600 group-hover:text-[#9ded10] mb-2 transition-colors" />
                <div className="text-[10px] text-gray-400 tracking-widest font-bold uppercase mb-1">DROP BUILD ARTIFACTS HERE</div>
                <div className="text-[8px] text-gray-600 tracking-widest uppercase">MAX LIMIT: 50MB (PDF, ZIP, TAR)</div>
              </div>
              <button 
                type="submit"
                disabled={activeTaskId !== null || !selectedSubmissionTask || !submissionUrl}
                className="w-full bg-[#9ded10] hover:bg-[#85c90b] text-black font-bold uppercase tracking-wider text-xs py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeTaskId !== null ? 'DEPLOYING...' : 'DEPLOY SUBMISSION'}
              </button>
            </div>
          </form>
        </div>

        {/* Node Status */}
        <div className="col-span-1 bg-[#1a1a1a] border border-white/5 p-6 relative flex flex-col">
          <h2 className="text-lg font-bold flex items-center gap-3 mb-8 tracking-widest text-white uppercase">
            <Activity className="w-5 h-5 text-[#9ded10]" /> NODE STATUS
          </h2>
          
          <div className="space-y-6 flex-grow">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div className="text-[10px] text-gray-500 tracking-widest uppercase">ACTIVE BOUNTIES</div>
              <div className="text-2xl font-bold text-white">03</div>
            </div>
            
            <div className="w-full h-1 bg-white/10 relative">
              <div className="absolute top-0 left-0 h-full bg-[#9ded10] w-[65%]"></div>
            </div>
            
            <div className="flex justify-between items-end pb-2">
              <div className="text-[10px] text-gray-500 tracking-widest uppercase">ACCRUED DLI</div>
              <div className="text-2xl font-bold text-white">12,480</div>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="text-[10px] text-gray-500 tracking-widest uppercase">SYSTEM RANK</div>
              <div className="text-sm font-bold text-[#9ded10] tracking-widest uppercase">ARCHITECT</div>
            </div>
          </div>
          
          <div className="mt-8 bg-black/50 border border-[#9ded10]/20 p-3 flex gap-3 items-center">
            <div className="w-4 h-4 rounded-full border border-[#9ded10] flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 bg-[#9ded10] rounded-full"></div>
            </div>
            <div className="text-[9px] text-gray-400">
              You are <span className="text-white">1,520 DLI</span> away from <span className="text-[#9ded10]">Master Architect</span> status.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}