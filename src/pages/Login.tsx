import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft, Shield, Briefcase, Sparkles } from "lucide-react";
import { login, forgotPassword } from "../services/auth";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useRecaptcha } from "../hooks/useRecaptcha";


export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const getRecaptchaToken = useRecaptcha();
  const [view, setView] = useState<"login" | "forgotPassword" | "guestSelection">("login");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all required fields"); return; }
    setLoading(true); setError(null);
    try {
      const recaptchaToken = await getRecaptchaToken("login");
      const response = await login(email, password, recaptchaToken);
      authLogin(response.token, response.user);
      if (response.user.role === "admin") navigate("/admin");
      else if (response.user.role === "guest") navigate("/guest");
      else navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally { setLoading(false); }
  };

  const handleGuestLogin = async (role: 'admin' | 'employee') => {
    setLoading(true); setError(null);
    try {
      const recaptchaToken = await getRecaptchaToken("guest_login");
      const response = await api.post("/auth/guest", { role, recaptchaToken });
      authLogin(response.data.token, response.data.user);
      if (response.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch { setError("Failed to initialize guest session. Please try again."); }
    finally { setLoading(false); }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) { setError("Please enter your email address"); return; }
    setLoading(true); setError(null); setSuccessMsg(null);
    try {
      const recaptchaToken = await getRecaptchaToken("forgot_password");
      await forgotPassword(resetEmail, recaptchaToken);
      setSuccessMsg("A password reset link has been sent to your email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process request");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex font-sans" style={{ background: '#0a0a1a' }}>

      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-16" style={{ background: 'linear-gradient(145deg, #0d0d2b 0%, #1a1040 50%, #0d0d2b 100%)' }}>
        {/* Animated glow orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'pulse 6s ease-in-out infinite' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'pulse 8s ease-in-out infinite reverse' }} />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(67,56,202,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }} />

        {/* Grid texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="mb-10 inline-flex items-center gap-3">
            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
              <img src="/aurora.png" alt="Aurora Bank" className="w-10 h-10 object-contain brightness-0 invert" />
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-tight">Aurora Bank</p>
              <p className="text-indigo-400 text-xs font-medium tracking-widest uppercase">Enterprise Portal</p>
            </div>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6" style={{ letterSpacing: '-1.5px' }}>
            Banking built<br />
            for the{' '}
            <span style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              future.
            </span>
          </h1>

          <p className="text-indigo-200/60 text-lg leading-relaxed mb-12 max-w-md">
            Secure, modern, and intelligent core banking—designed to keep your institution protected and productive.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mb-12">
            {['256-bit Encryption', 'Real-time Monitoring', 'Multi-tenant Architecture'].map(f => (
              <span key={f} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-indigo-300" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {f}
              </span>
            ))}
          </div>

          {/* Avatars */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[10, 11, 12, 13].map(i => (
                <img key={i} className="w-9 h-9 rounded-full border-2" style={{ borderColor: '#1a1040' }} src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-bold">Trusted by Aurora GANG 😎</p>
              <p className="text-indigo-400/60 text-xs">Join our growing ecosystem</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Auth Forms ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative" style={{ background: 'linear-gradient(145deg, #0f0f24 0%, #13102e 100%)' }}>
        {/* Subtle glow behind the card */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />

        <div className="w-full max-w-md relative z-10">

          {/* ── LOGIN VIEW ── */}
          {view === "login" && (
            <div>
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                  <img src="/aurora.png" alt="Aurora Bank" className="w-8 h-8 object-contain brightness-0 invert" />
                </div>
                <div>
                  <p className="text-white font-bold">Aurora Bank</p>
                  <p className="text-indigo-400 text-xs">Enterprise Portal</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white mb-2" style={{ letterSpacing: '-0.5px' }}>Welcome Back</h2>
                <p className="text-indigo-300/60 font-medium">Sign in with your username or email.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={18} className="flex-shrink-0 text-red-400" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Email/Username */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-200/80 mb-2">Username or Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400/60 group-focus-within:text-indigo-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="username or email@example.com"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm font-medium outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(129,140,248,0.15)', }}
                      onFocus={e => { e.currentTarget.style.border = '1px solid rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(129,140,248,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-200/80 mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400/60 group-focus-within:text-indigo-400 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="block w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm font-medium outline-none transition-all tracking-widest"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(129,140,248,0.15)' }}
                      onFocus={e => { e.currentTarget.style.border = '1px solid rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(129,140,248,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-400/60 hover:text-indigo-300 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-indigo-500/40 bg-transparent accent-indigo-500"
                    />
                    <span className="text-sm text-indigo-300/60 group-hover:text-indigo-300 transition-colors">Remember for 30 days</span>
                  </label>
                  <button type="button" onClick={() => { setView("forgotPassword"); setError(null); setSuccessMsg(null); }} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 mt-2"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)')}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : "Login Securely →"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: 'rgba(129,140,248,0.1)' }} />
                <span className="text-xs text-indigo-400/40 font-medium">OR</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(129,140,248,0.1)' }} />
              </div>

              {/* Guest Mode */}
              <button
                type="button"
                onClick={() => { setView("guestSelection"); setError(null); setSuccessMsg(null); }}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-indigo-300 transition-all flex items-center justify-center gap-2"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
              >
                <Sparkles size={16} className="text-indigo-400" />
                Try Guest Mode — No account needed
              </button>
            </div>
          )}

          {/* ── GUEST SELECTION VIEW ── */}
          {view === "guestSelection" && (
            <div>
              <button onClick={() => { setView("login"); setError(null); }} className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors mb-8 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white mb-2" style={{ letterSpacing: '-0.5px' }}>Choose Your Role</h2>
                <p className="text-indigo-300/60">Select a persona to explore with an isolated dummy database.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={18} className="flex-shrink-0 text-red-400" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Admin card */}
                <button
                  onClick={() => handleGuestLogin('admin')}
                  disabled={loading}
                  className="w-full p-5 rounded-2xl text-left transition-all disabled:opacity-50 group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(129,140,248,0.15)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.border = '1px solid rgba(99,102,241,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.border = '1px solid rgba(129,140,248,0.15)'; }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl transition-colors" style={{ background: 'rgba(99,102,241,0.15)' }}>
                      <Shield size={22} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Explore as Admin</h3>
                      <p className="text-sm text-indigo-300/50">Full control: settings, employees, reports, and system logs.</p>
                    </div>
                  </div>
                </button>

                {/* Employee card */}
                <button
                  onClick={() => handleGuestLogin('employee')}
                  disabled={loading}
                  className="w-full p-5 rounded-2xl text-left transition-all disabled:opacity-50 group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(167,139,250,0.15)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.border = '1px solid rgba(139,92,246,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.border = '1px solid rgba(167,139,250,0.15)'; }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.15)' }}>
                      <Briefcase size={22} className="text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Explore as Employee</h3>
                      <p className="text-sm text-indigo-300/50">Manage customers, authorize transactions, and view metrics.</p>
                    </div>
                  </div>
                </button>
              </div>

              {loading && (
                <div className="mt-8 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
                  <p className="text-sm text-indigo-400/60 font-medium">Provisioning your isolated environment...</p>
                </div>
              )}
            </div>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === "forgotPassword" && (
            <div>
              <button onClick={() => { setView("login"); setError(null); setSuccessMsg(null); }} className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors mb-8 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white mb-2" style={{ letterSpacing: '-0.5px' }}>Reset Password</h2>
                <p className="text-indigo-300/60">Enter your email and we'll send you reset instructions.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={18} className="flex-shrink-0 text-red-400" />
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium text-emerald-300" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-400" />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-indigo-200/80 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400/60">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm font-medium outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(129,140,248,0.15)' }}
                      onFocus={e => { e.currentTarget.style.border = '1px solid rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(129,140,248,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || successMsg !== null}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending instructions...
                    </span>
                  ) : "Send Reset Link →"}
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-indigo-400/30 mt-10">
            © 2026 Aurora Bank Group · All Rights Reserved
          </p>

        </div>
      </div>
    </div>
  );
}
