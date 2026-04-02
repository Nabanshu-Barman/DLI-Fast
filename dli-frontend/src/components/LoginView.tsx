
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { post } from '@/lib/apiClient';

interface LoginProps {
  onLogin: (isAdmin: boolean) => void;
}

export default function LoginView({ onLogin }: LoginProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register-only fields
  const [name, setName] = useState('');
  const [srmRegNo, setSrmRegNo] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await post('/auth/login', { email, password });

      if (response.success && response.data?.token) {
        localStorage.setItem('dli_jwt', response.data.token);
        const isAdmin = response.data.user?.role === 'admin';
        onLogin(isAdmin);
        router.push(isAdmin ? '/admin' : '/dashboard');
      } else {
        throw new Error(response.message || 'Login failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await post('/auth/register', {
        name,
        email,
        srmRegNo,
        password,
      });

      if (response.success && response.data?.token) {
        localStorage.setItem('dli_jwt', response.data.token);
        onLogin(false);
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Could not create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-fade-in">
      <Card className="glass shadow-2xl border-white/10 overflow-hidden bg-black/40 backdrop-blur-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline font-bold text-white">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-white/50">
            {mode === 'login'
              ? 'Enter your credentials to access the DLI platform'
              : 'Register a new member account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-white/70">Email</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-login" className="text-white/70">Password</Label>
                </div>
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold h-12 btn-nvidia-glow mt-4">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <span className="flex items-center gap-2"><LogIn className="w-4 h-4" /> Sign In</span>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-register" className="text-white/70">Full Name</Label>
                <Input
                  id="name-register"
                  type="text"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-register" className="text-white/70">Registration Number</Label>
                <Input
                  id="reg-register"
                  type="text"
                  placeholder="RA2011003010001"
                  value={srmRegNo}
                  onChange={(e) => setSrmRegNo(e.target.value)}
                  required
                  className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register" className="text-white/70">Email</Label>
                <Input
                  id="email-register"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register" className="text-white/70">Password</Label>
                <Input
                  id="password-register"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold h-12 btn-nvidia-glow mt-4">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Create Account</span>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-white/50 hover:text-primary transition-colors"
            >
              {mode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground border-t border-white/5 pt-6">
          NVIDIA Deep Learning Institute Platform &copy; 2024
        </CardFooter>
      </Card>
    </div>
  );
}
