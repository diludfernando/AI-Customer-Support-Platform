import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Shield, 
  Headphones, 
  Users,
  Zap
} from 'lucide-react';
import { loginUser, registerUser } from '../services/authService.js';

export default function AuthPage({ onAuthSuccess, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  
  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer', 'Support Agent', 'Administrator'

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await loginUser(loginEmail, loginPassword);
      if (res.success) {
        setSuccessMsg(`Welcome back, ${res.user.fullName}! Redirecting to workspace...`);
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 600);
      } else {
        setErrorMsg('Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!registerFullName || !registerEmail || !registerPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (registerPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerUser(registerFullName, registerEmail, registerPassword, selectedRole);
      if (res.success) {
        setSuccessMsg(`Account created successfully as ${res.user.role}! Signing you in...`);
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 700);
      } else {
        setErrorMsg('Failed to create account.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPass) => {
    setLoginEmail(demoEmail);
    setLoginPassword(demoPass);
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await loginUser(demoEmail, demoPass);
    if (res.success) {
      setSuccessMsg(`Demo Sign-In as ${res.user.fullName} (${res.user.role})...`);
      setTimeout(() => {
        onAuthSuccess(res.user);
      }, 500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-950/40 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/25 mb-4 border border-indigo-400/30">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            SupportAI <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Customer Support & RAG Intelligence Platform
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Banners */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-medium animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-300 text-xs font-medium animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= SIGN IN FORM ================= */}
        {mode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="alex.miller@company.com"
                  className="w-full bg-slate-950/90 border border-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); setErrorMsg('Password reset link has been dispatched to your email.'); }} className="text-[11px] text-indigo-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/90 border border-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-slate-950 border-slate-700 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-slate-400">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Logins */}
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-[11px] font-semibold text-slate-400 text-center mb-2.5 uppercase tracking-wider">
                ⚡ 1-Click Demo Accounts
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('alex@company.com', 'password123')}
                  className="p-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-center transition-all group"
                >
                  <p className="text-[11px] font-bold text-indigo-400 group-hover:text-indigo-300">Agent</p>
                  <p className="text-[9px] text-slate-500">Alex Miller</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('sarah@acmecorp.io', 'password123')}
                  className="p-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-center transition-all group"
                >
                  <p className="text-[11px] font-bold text-sky-400 group-hover:text-sky-300">Customer</p>
                  <p className="text-[9px] text-slate-500">Sarah Jenkins</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@platform.ai', 'password123')}
                  className="p-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-center transition-all group"
                >
                  <p className="text-[11px] font-bold text-amber-400 group-hover:text-amber-300">Admin</p>
                  <p className="text-[9px] text-slate-500">System Admin</p>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= SIGN UP FORM ================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={registerFullName}
                  onChange={(e) => setRegisterFullName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full bg-slate-950/90 border border-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="jordan.lee@company.com"
                  className="w-full bg-slate-950/90 border border-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-950/90 border border-slate-800 text-slate-100 text-xs rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('Customer')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedRole === 'Customer'
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Users className={`w-4 h-4 mb-1 ${selectedRole === 'Customer' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-[11px] font-bold">Customer</p>
                    <p className="text-[9px] text-slate-400 leading-tight">Submit tickets & chat AI</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('Support Agent')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedRole === 'Support Agent'
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Headphones className={`w-4 h-4 mb-1 ${selectedRole === 'Support Agent' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-[11px] font-bold">Support Agent</p>
                    <p className="text-[9px] text-slate-400 leading-tight">Manage ticket queue</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('Administrator')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedRole === 'Administrator'
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Shield className={`w-4 h-4 mb-1 ${selectedRole === 'Administrator' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-[11px] font-bold">Admin</p>
                    <p className="text-[9px] text-slate-400 leading-tight">Full system control</p>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create {selectedRole} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Toggle Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  Sign Up now
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}
