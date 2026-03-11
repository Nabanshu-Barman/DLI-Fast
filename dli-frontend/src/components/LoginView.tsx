
'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, User } from 'lucide-react';

interface LoginProps {
  onLogin: (isAdmin: boolean) => void;
}

export default function LoginView({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(activeTab === 'admin');
    }, 1500);
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
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5 border border-white/10">
              <TabsTrigger value="member" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" /> Member
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <ShieldCheck className="w-4 h-4 mr-2" /> Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="member">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-member" className="text-white/70">Email</Label>
                  <Input 
                    id="email-member" 
                    type="email" 
                    placeholder="name@example.com" 
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
                    required 
                    className="bg-black/50 border-white/10 focus-visible:ring-primary glow-green text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin" className="text-white/70">Admin Password</Label>
                  <Input 
                    id="password-admin" 
                    type="password" 
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
