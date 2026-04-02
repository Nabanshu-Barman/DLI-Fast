
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, User } from 'lucide-react';
import { post } from '@/lib/apiClient'; // Or adjust import based on your apiClient export

interface LoginProps {
  onLogin: (isAdmin: boolean) => void;
}

export default function LoginView({ onLogin }: LoginProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('member');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await post('/auth/login', { 
        email: email, 
        password: password 
      });

      if (response.success && response.data?.token) {
        localStorage.setItem('dli_jwt', response.data.token);
        
        // Notify parent if needed, then navigate
        onLogin(activeTab === 'admin');
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-fade-in">
      <Card className="glass shadow-2xl border-white/10 overflow-hidden bg-black/40 backdrop-blur-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline font-bold text-white">Sign In</CardTitle>
          <CardDescription className="text-white/50">Enter your credentials to access the DLI platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="member" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/5 border border-white/10">
              <TabsTrigger value="member" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" /> Member
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <ShieldCheck className="w-4 h-4 mr-2" /> Admin
              </TabsTrigger>
            </TabsList>
            
            {error && (
              <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                {error}
              </div>
            )}

            <TabsContent value="member">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-member" className="text-white/70">Email</Label>
                  <Input 
                    id="email-member" 
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
                    <Label htmlFor="password-member" className="text-white/70">Password</Label>
                    <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                  </div>
                  <Input 
                    id="password-member" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold h-12 btn-nvidia-glow mt-4">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-admin" className="text-white/70">Admin Email</Label>
                  <Input 
                    id="email-admin" 
                    type="email" 
                    placeholder="admin@nvidia.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin" className="text-white/70">Admin Password</Label>
                  <Input 
                    id="password-admin" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold h-12 btn-nvidia-glow mt-4">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Enter'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground border-t border-white/5 pt-6">
          NVIDIA Deep Learning Institute Platform &copy; 2024
        </CardFooter>
      </Card>
    </div>
  );
}
