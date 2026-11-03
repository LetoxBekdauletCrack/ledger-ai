'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: 'Login Failed',
          description: data.error || 'Invalid email or password',
          type: 'error',
        });
        return;
      }

      if (data.token) {
        localStorage.setItem('ledger_token', data.token);
        localStorage.setItem('ledger_user', JSON.stringify(data.user));
      }

      toast({
        title: 'Welcome back!',
        description: `Signed in as ${data.user?.name || email}`,
        type: 'success',
      });

      router.push('/');
    } catch (err: any) {
      toast({
        title: 'Connection Error',
        description: 'Could not connect to authentication service.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('demo@ledgerai.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-600 items-center justify-center shadow-xl shadow-emerald-500/20 mb-3">
            <Sparkles className="h-6 w-6 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to LedgerAI</h1>
          <p className="text-xs text-slate-400 mt-1">Autonomous AI-powered personal financial intelligence</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  data-testid="login-email-input"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  data-testid="login-password-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold h-10 mt-2 shadow-lg shadow-emerald-500/20"
              data-testid="login-submit-btn"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Auto-fill Helper */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1.5 underline underline-offset-4"
              data-testid="demo-login-fill-btn"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Fill with Demo Credentials (demo@ledgerai.com)
            </button>
          </div>
        </div>

        {/* Footer links */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-emerald-400 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

