
'use client';

import React from 'react';
import { ViewState } from '@/app/page';
import { LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Navbar({ 
  currentView, 
  onNavigate, 
  isLoggedIn, 
  isAdmin,
  onLogout 
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center px-6 md:px-12 justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate('hero')}
      >
        <span className="font-body font-bold text-xl tracking-tight uppercase text-white">
          F.A.S.T. <span className="text-primary">DLI</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <NavLink active={currentView === 'catalogue'} onClick={() => onNavigate('catalogue')}>
          Catalogue
        </NavLink>
        {isLoggedIn && !isAdmin && (
          <NavLink active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')}>
            Dashboard
          </NavLink>
        )}
        {isLoggedIn && isAdmin && (
          <NavLink active={currentView === 'admin'} onClick={() => onNavigate('admin')}>
            Admin
          </NavLink>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        ) : (
          <Button onClick={() => onNavigate('login')} className="btn-nvidia-glow bg-primary text-white font-bold px-6">
            <LogIn className="w-4 h-4 mr-2" /> Login
          </Button>
        )}
      </div>
    </nav>
  );
}

function NavLink({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`text-sm font-bold transition-colors hover:text-primary relative py-1 uppercase tracking-widest ${active ? 'text-primary' : 'text-white/70'}`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in zoom-in duration-300"></span>
      )}
    </button>
  );
}
