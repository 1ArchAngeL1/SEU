'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { authService } from '@/service/auth.service';
import { ApiRequestError } from '@/lib/api-client';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login({ username, password });
      login(res.access_token);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.status === 401 ? 'Invalid username or password' : err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-admin-bg">
      {/* Background effects */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-50 bg-admin-bg-pattern"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] rounded-full opacity-[0.07]"
        style={{
          background:
            'radial-gradient(circle, var(--primary-orange) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] right-[-10%] w-[35rem] h-[35rem] rounded-full opacity-[0.05]"
        style={{
          background:
            'radial-gradient(circle, var(--blue) 0%, transparent 70%)',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4 admin-slide-up">
        <div className="bg-admin-card-gradient border border-admin-border rounded-2xl shadow-admin-lg overflow-hidden">
          {/* Header with brand accent */}
          <div className="relative px-8 pt-10 pb-8 text-center">
            {/* Logo */}
            <div className="mx-auto mb-6 size-16 rounded-2xl bg-gradient-to-br from-primary-orange to-primary-orange/70 grid place-items-center shadow-admin-accent ring-1 ring-primary-orange/40">
              <span className="font-[--font-bodoni] text-white text-[2rem] leading-none">
                S
              </span>
            </div>
            <h1 className="font-[--font-bodoni] font-normal text-seu-heading text-admin-fg">
              SEU Admin
            </h1>
            <p className="text-seu-caption text-admin-fg-muted mt-2 font-montserrat">
              Sign in to access the admin console
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-seu-caption font-montserrat border"
                style={{
                  background: 'var(--admin-danger-shell)',
                  borderColor: 'var(--admin-danger-border)',
                  color: 'var(--admin-danger-text)',
                }}
              >
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Username field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-seu-caption-sm font-montserrat font-medium text-admin-fg-muted uppercase tracking-wider"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[1.125rem] text-admin-fg-dim" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-admin-input-gradient border border-admin-border text-admin-fg placeholder:text-admin-fg-dim font-montserrat text-seu-caption focus:outline-none focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange/50 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-seu-caption-sm font-montserrat font-medium text-admin-fg-muted uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[1.125rem] text-admin-fg-dim" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-admin-input-gradient border border-admin-border text-admin-fg placeholder:text-admin-fg-dim font-montserrat text-seu-caption focus:outline-none focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-admin-fg-dim hover:text-admin-fg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-[1.125rem]" />
                  ) : (
                    <Eye className="size-[1.125rem]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary-orange to-primary-orange/85 text-white font-montserrat font-semibold text-seu-caption tracking-wide shadow-admin-accent hover:shadow-[0_8px_24px] hover:shadow-primary-orange/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary-orange/0 via-white/10 to-primary-orange/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-center text-seu-caption-sm text-admin-fg-dim font-montserrat mt-6">
          SEU Development &middot; Admin Console
        </p>
      </div>
    </div>
  );
}
