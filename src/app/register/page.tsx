'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: 'Registration Failed',
          description: data.error || 'Failed to create account',
          type: 'error',
        });
        return;
      }

      if (data.token) {
        localStorage.setItem('ledger_token', data.token);
        localStorage.setItem('ledger_user', JSON.stringify(data.user));
      }

      toast({
        title: 'Account Created',
        description: 'Welcome to LedgerAI!',
        type: 'success',
      });

      router.push('/');
    } catch (err) {
      toast({
        title: 'Connection Error',
        description: 'Failed to communicate with authentication API.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-600 items-center justify-center shadow-xl shadow-emerald-500/20 mb-3">
            <Sparkles className="h-6 w-6 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your LedgerAI account</h1>
          <p className="text-xs text-slate-400 mt-1">Join the next generation of automated personal finance</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  required
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                  data-testid="register-name-input"
                />
              </div>
            </div>

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
                  data-testid="register-email-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password (min 6 characters)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  data-testid="register-password-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold h-10 mt-2 shadow-lg shadow-emerald-500/20"
              data-testid="register-submit-btn"
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
            </Button>
          </form>
        </div>

        {/* Footer links */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

