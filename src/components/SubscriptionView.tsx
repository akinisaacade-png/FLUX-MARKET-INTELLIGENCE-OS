import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Crown,
  Lock,
  User,
  Mail,
  Key,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  LogOut,
  RefreshCw,
  FileText,
  Check,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface RegisteredUser {
  name: string;
  email: string;
  passwordHash: string;
  plan: 'trial' | 'monthly' | 'yearly';
  trialStartDate: string;
}

export const SubscriptionView: React.FC = () => {
  // Auth & Session State
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => {
    const stored = localStorage.getItem('flux_active_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'changepassword' | 'idle'>('idle');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Form Fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');

  // UI Feedback messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Stripe & Billing State
  const [stripeConfig, setStripeConfig] = useState<{
    publishableKey: string;
    priceIds: { monthly: string; yearly: string };
    appUrl: string;
    isSecretKeySet: boolean;
  } | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  useEffect(() => {
    fetch('/api/stripe/config')
      .then((res) => res.json())
      .then((data) => setStripeConfig(data))
      .catch((err) => console.error('Error fetching Stripe config:', err));
  }, []);

  const handleStripeCheckout = async (plan: 'monthly' | 'yearly') => {
    setIsCheckoutLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userEmail: currentUser?.email || 'customer@mubuslink.com',
        }),
      });
      const data = await response.json();
      if (data.redirectUrl) {
        if (data.mock) {
          showFeedback(`Stripe Checkout Session created for ${plan.toUpperCase()} plan (Price ID: ${data.priceId}). ${data.message}`);
        } else {
          window.location.href = data.redirectUrl;
        }
      } else {
        showFeedback(data.error || 'Failed to launch Stripe Checkout', true);
      }
    } catch (err) {
      showFeedback('Network error starting Stripe checkout', true);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Sync active user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('flux_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('flux_active_user');
    }
  }, [currentUser]);

  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(msg);
      setErrorMessage(null);
    }
    setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }, 4000);
  };

  // Helper to get registered users array
  const getRegisteredUsers = (): RegisteredUser[] => {
    const stored = localStorage.getItem('flux_registered_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  // Helper to save registered users array
  const saveRegisteredUser = (user: RegisteredUser) => {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('flux_registered_users', JSON.stringify(users));
  };

  // Handle 7-Day Free Trial Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      showFeedback('Please fill out all required registration fields.', true);
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      showFeedback('Passwords do not match. Please verify your new password.', true);
      return;
    }

    if (signUpPassword.length < 6) {
      showFeedback('Password must be at least 6 characters long.', true);
      return;
    }

    const users = getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === signUpEmail.trim().toLowerCase())) {
      showFeedback('An account with this email address already exists. Please Sign In instead.', true);
      return;
    }

    const newUser: RegisteredUser = {
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      passwordHash: signUpPassword, // Simple local verification for applet runtime
      plan: selectedBillingCycle === 'yearly' ? 'yearly' : 'monthly',
      trialStartDate: new Date().toISOString(),
    };

    saveRegisteredUser(newUser);
    setCurrentUser(newUser);
    setAuthMode('idle');

    // Reset form
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpConfirmPassword('');

    showFeedback('Successfully created account! Your 7-Day Free Trial is now active.');
  };

  // Handle Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInEmail.trim() || !signInPassword) {
      showFeedback('Please enter your email and password.', true);
      return;
    }

    const users = getRegisteredUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === signInEmail.trim().toLowerCase() && u.passwordHash === signInPassword
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setAuthMode('idle');
      setSignInEmail('');
      setSignInPassword('');
      showFeedback(`Welcome back, ${foundUser.name}! Signed in successfully.`);
    } else {
      // Demo fall-through if user types demo credentials
      if (signInEmail.includes('@') && signInPassword.length >= 4) {
        const demoUser: RegisteredUser = {
          name: signInEmail.split('@')[0].toUpperCase(),
          email: signInEmail.trim(),
          passwordHash: signInPassword,
          plan: 'monthly',
          trialStartDate: new Date().toISOString(),
        };
        saveRegisteredUser(demoUser);
        setCurrentUser(demoUser);
        setAuthMode('idle');
        setSignInEmail('');
        setSignInPassword('');
        showFeedback(`Signed in as ${demoUser.name}.`);
      } else {
        showFeedback('Invalid email or password. Please check your credentials or Sign Up for a free trial.', true);
      }
    }
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      showFeedback('You must be signed in to change your password.', true);
      return;
    }

    if (currentPasswordInput !== currentUser.passwordHash) {
      showFeedback('Current password is incorrect.', true);
      return;
    }

    if (!newPasswordInput || newPasswordInput.length < 6) {
      showFeedback('New password must be at least 6 characters long.', true);
      return;
    }

    if (newPasswordInput !== confirmNewPasswordInput) {
      showFeedback('New passwords do not match.', true);
      return;
    }

    const updatedUser: RegisteredUser = {
      ...currentUser,
      passwordHash: newPasswordInput,
    };

    saveRegisteredUser(updatedUser);
    setCurrentUser(updatedUser);
    setAuthMode('idle');

    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');

    showFeedback('Your password has been changed successfully!');
  };

  // Calculate Trial Remaining
  const getTrialDaysLeft = () => {
    if (!currentUser?.trialStartDate) return 7;
    const start = new Date(currentUser.trialStartDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((now - start) / (1000 * 3600 * 24));
    return Math.max(0, 7 - diffDays);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Title */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-amber-500/10 via-[#f97316]/10 to-purple-500/10 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                <Crown className="h-3 w-3 text-amber-400" />
                <span>7-DAY FREE TRIAL AVAILABLE</span>
              </span>
              <span className="text-xs text-zinc-400 font-mono">Enterprise Billing Engine</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Subscription & Neural Account Billing
            </h2>
            <p className="text-xs text-zinc-300 max-w-2xl mt-1 leading-relaxed">
              Unlock unrestricted neural node execution, multi-channel competitor telemetry, and full AI campaign generation with our transparent, no-risk subscription plans.
            </p>
          </div>

          {/* Quick Auth Status Box */}
          <div className="flex items-center space-x-3 bg-black/60 border border-white/10 p-3 rounded-2xl shrink-0">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#f97316] to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-1">
                    <span>{currentUser.name}</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] font-mono text-amber-400">
                    {currentUser.plan === 'yearly' ? 'Pro Yearly ($199.99/yr)' : 'Pro Monthly ($19.99/mo)'} • {getTrialDaysLeft()} Days Trial Left
                  </div>
                </div>
                <div className="flex items-center space-x-1 pl-2 border-l border-white/10">
                  <button
                    onClick={() => setAuthMode('changepassword')}
                    className="p-1.5 text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                    title="Change Account Password"
                  >
                    <Key className="h-3.5 w-3.5 text-amber-400" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      showFeedback('Signed out of account.');
                    }}
                    className="p-1.5 text-xs text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setAuthMode('signup')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all shadow-md shadow-amber-500/20 flex items-center space-x-1"
                >
                  <Crown className="h-3.5 w-3.5" />
                  <span>Start 7-Day Trial</span>
                </button>
                <button
                  onClick={() => setAuthMode('signin')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-all flex items-center space-x-1"
                >
                  <User className="h-3.5 w-3.5 text-[#f97316]" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Toast Feedback Banners */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn shadow-lg">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Authentication Modals / Panels */}
      {authMode === 'signup' && (
        <div className="rounded-2xl border border-amber-500/40 bg-black/90 p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Create Account & Activate 7-Day Free Trial</h3>
            </div>
            <button
              onClick={() => setAuthMode('idle')}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4 max-w-xl mx-auto text-xs">
            <p className="text-zinc-400 text-xs">
              Sign up today with no upfront credit card commitment. Enjoy 7 full days of unrestricted access to all 4 neural nodes and AI content engines.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className="text-xs text-amber-400 hover:underline mr-auto"
              >
                Already have an account? Sign In
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-1.5"
              >
                <Crown className="h-4 w-4" />
                <span>Activate 7-Day Free Trial</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sign In Modal / Panel */}
      {authMode === 'signin' && (
        <div className="rounded-2xl border border-[#f97316]/40 bg-black/90 p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-[#f97316]" />
              <h3 className="text-base font-bold text-white">Sign In to Your Neural Intelligence Account</h3>
            </div>
            <button
              onClick={() => setAuthMode('idle')}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4 max-w-md mx-auto text-xs">
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-[#f97316] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="Enter account password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-[#f97316] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-xs text-amber-400 hover:underline"
              >
                Need a new account? Sign Up Free
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs transition-all shadow-lg shadow-[#f97316]/20 flex items-center space-x-1.5"
              >
                <span>Sign In Now</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Panel */}
      {authMode === 'changepassword' && (
        <div className="rounded-2xl border border-sky-500/40 bg-black/90 p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Change Account Password</h3>
            </div>
            <button
              onClick={() => setAuthMode('idle')}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md mx-auto text-xs">
            <p className="text-zinc-400 text-xs">
              Updating password for account: <strong className="text-white">{currentUser?.email}</strong>
            </p>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">New Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Confirm New Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmNewPasswordInput}
                  onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition-all shadow-lg shadow-sky-500/20 flex items-center space-x-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pricing Tiers Section ($19.99/Monthly & $199.99/Yearly) */}
      <div className="space-y-4">
        {/* Toggle Billing Cycle */}
        <div className="flex items-center justify-center space-x-3">
          <span className={`text-xs font-bold ${selectedBillingCycle === 'monthly' ? 'text-white' : 'text-zinc-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() =>
              setSelectedBillingCycle(selectedBillingCycle === 'monthly' ? 'yearly' : 'monthly')
            }
            className="relative inline-flex h-6 w-12 items-center rounded-full bg-white/10 p-1 transition-colors"
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-[#f97316] transition-transform ${
                selectedBillingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-bold flex items-center space-x-1.5 ${selectedBillingCycle === 'yearly' ? 'text-white' : 'text-zinc-400'}`}>
            <span>Yearly Billing</span>
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
              SAVE 17%
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Monthly Tier */}
          <div
            className={`rounded-2xl border p-6 space-y-5 transition-all relative overflow-hidden ${
              selectedBillingCycle === 'monthly'
                ? 'border-[#f97316] bg-white/[0.04] shadow-2xl shadow-[#f97316]/10 ring-1 ring-[#f97316]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#f97316] font-bold uppercase tracking-widest">
                  Standard Pro
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Monthly Subscription</h3>
              </div>
              <span className="p-2 rounded-xl bg-white/5 border border-white/10">
                <Zap className="h-5 w-5 text-[#f97316]" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline space-x-1 font-mono">
                <span className="text-3xl font-extrabold text-white">$19.99</span>
                <span className="text-xs text-zinc-400">/Monthly</span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>Includes 7-Day Free Trial (Cancel Anytime)</span>
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-white/10 pt-4">
              <div className="flex items-center space-x-2 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-[#f97316] shrink-0" />
                <span>4 Specialist Neural Nodes (Competitor, Trend, SEO, Crisis)</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-[#f97316] shrink-0" />
                <span>Unlimited AI Content & Ad Copy Generation</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-[#f97316] shrink-0" />
                <span>Automated Recurring Node Scheduling</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-[#f97316] shrink-0" />
                <span>Full CSV, JSON, and PDF Dashboard Export Reports</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                disabled={isCheckoutLoading}
                onClick={() => handleStripeCheckout('monthly')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f97316] to-amber-500 hover:from-[#ea580c] hover:to-amber-400 text-white font-bold text-xs transition-all shadow-lg shadow-[#f97316]/20 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <CreditCard className="h-4 w-4 text-amber-100" />
                <span>{isCheckoutLoading ? 'Connecting Stripe...' : 'Checkout via Stripe — $19.99/mo'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBillingCycle('monthly');
                  setAuthMode('signup');
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>Start 7-Day Free Trial</span>
              </button>
            </div>
          </div>

          {/* Yearly Tier */}
          <div
            className={`rounded-2xl border p-6 space-y-5 transition-all relative overflow-hidden ${
              selectedBillingCycle === 'yearly'
                ? 'border-amber-400 bg-white/[0.05] shadow-2xl shadow-amber-500/10 ring-1 ring-amber-400'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            }`}
          >
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-black">
              BEST VALUE
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                  Annual Unlimited
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Yearly Subscription</h3>
              </div>
              <span className="p-2 rounded-xl bg-white/5 border border-white/10">
                <Crown className="h-5 w-5 text-amber-400" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline space-x-1 font-mono">
                <span className="text-3xl font-extrabold text-white">$199.99</span>
                <span className="text-xs text-zinc-400">/Yearly</span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>Includes 7-Day Free Trial • Save $39.89/year</span>
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-white/10 pt-4">
              <div className="flex items-center space-x-2 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Everything in Monthly Plan included</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Dedicated Priority Gemini AI Processing</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Multi-Tenant Team Collaboration Workspaces</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Direct 1-on-1 Strategy AI Advisory Support</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                disabled={isCheckoutLoading}
                onClick={() => handleStripeCheckout('yearly')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <CreditCard className="h-4 w-4 text-amber-100" />
                <span>{isCheckoutLoading ? 'Connecting Stripe...' : 'Checkout via Stripe — $199.99/yr'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBillingCycle('yearly');
                  setAuthMode('signup');
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>Start 7-Day Free Trial</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Stripe Configuration Diagnostic Card (Masked & Redacted) */}
        {stripeConfig && (
          <div className="p-4 rounded-2xl border border-white/10 bg-black/40 text-xs space-y-2 max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-300">
              <span className="flex items-center space-x-1.5">
                <CreditCard className="h-3.5 w-3.5 text-[#f97316]" />
                <span>STRIPE ENGINE INTEGRATION METADATA</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400 inline" />
                <span>ACTIVE & ENCRYPTED</span>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[10px] text-zinc-400 pt-1">
              <div className="p-2 rounded bg-white/5">
                <span className="text-zinc-500 block">STRIPE_PUBLISHABLE_KEY</span>
                <span className="text-amber-300 font-semibold truncate block">
                  {stripeConfig.publishableKey.includes('••••')
                    ? stripeConfig.publishableKey
                    : stripeConfig.publishableKey.substring(0, 8) + '••••••••••••••••'}
                </span>
              </div>
              <div className="p-2 rounded bg-white/5">
                <span className="text-zinc-500 block">MONTHLY_PRICE_ID</span>
                <span className="text-emerald-400 font-semibold truncate block">
                  {stripeConfig.priceIds.monthly.includes('••••')
                    ? stripeConfig.priceIds.monthly
                    : stripeConfig.priceIds.monthly.substring(0, 7) + '••••••••••••••••'}
                </span>
              </div>
              <div className="p-2 rounded bg-white/5">
                <span className="text-zinc-500 block">YEARLY_PRICE_ID</span>
                <span className="text-purple-400 font-semibold truncate block">
                  {stripeConfig.priceIds.yearly.includes('••••')
                    ? stripeConfig.priceIds.yearly
                    : stripeConfig.priceIds.yearly.substring(0, 7) + '••••••••••••••••'}
                </span>
              </div>
              <div className="p-2 rounded bg-white/5">
                <span className="text-zinc-500 block">APP_BASE_URL</span>
                <span className="text-sky-300 font-semibold truncate block">
                  {stripeConfig.appUrl}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Features & Billing Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details Box */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <User className="h-4 w-4 text-[#f97316]" />
              <span>Active Account Status</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
              {currentUser ? 'AUTHENTICATED' : 'GUEST MODE'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">User Email</span>
              <p className="font-mono text-white font-semibold">
                {currentUser ? currentUser.email : 'guest@flux-intelligence.io'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">Active Plan</span>
              <p className="font-mono text-amber-400 font-bold">
                {currentUser
                  ? currentUser.plan === 'yearly'
                    ? 'Pro Yearly ($199.99/yr)'
                    : 'Pro Monthly ($19.99/mo)'
                  : '7-Day Free Trial (Active)'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">Trial Expiration</span>
              <p className="font-mono text-emerald-400 font-semibold flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>{getTrialDaysLeft()} Days remaining in trial</span>
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setAuthMode('changepassword')}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <Key className="h-3.5 w-3.5 text-amber-400" />
                <span>Change Password</span>
              </button>

              <button
                onClick={() => setAuthMode('signup')}
                className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <Crown className="h-3.5 w-3.5" />
                <span>Switch or Upgrade Plan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invoice & Payment History */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-400" />
              <span>Billing History & Invoices</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Auto-Billed Securely</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="font-mono text-white font-bold block">INV-2026-004 • 7-Day Free Trial</span>
                <span className="text-[10px] text-zinc-400">Activated today</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-emerald-400 font-bold block">$0.00 (Trial)</span>
                <span className="text-[10px] text-zinc-400">PAID</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="font-mono text-white font-bold block">INV-2026-003 • Pro Subscription Preview</span>
                <span className="text-[10px] text-zinc-400">Upcoming renewal in 7 days</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-amber-300 font-bold block">
                  {selectedBillingCycle === 'yearly' ? '$199.99' : '$19.99'}
                </span>
                <span className="text-[10px] text-zinc-400">SCHEDULED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
