import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft, Shield, Briefcase } from "lucide-react";
import { login, forgotPassword } from "../services/auth";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [view, setView] = useState<"login" | "forgotPassword" | "guestSelection">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    
    // (Removed strict email regex validation here to allow usernames)

    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      // Store in AuthContext (also saves to localStorage)
      authLogin(response.token, response.user);
      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/admin");
      } else if (response.user.role === "guest") {
        navigate("/guest");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Invalid email or password");
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async (role: 'admin' | 'employee') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/guest", { role });
      authLogin(response.data.token, response.data.user);
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Failed to initialize guest session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await forgotPassword(resetEmail);
      setSuccessMsg("A password reset link has been sent to your email");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to process request");
      } else {
        setError("Failed to process request");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans text-gray-900">
      
      {/* Left Panel: Branding & Aesthetics (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden items-center justify-center">
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500 blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500 blur-[150px]"></div>
        </div>

        {/* Floating Glass Element */}
        <div className="relative z-10 p-12 max-w-xl text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-3xl inline-flex mb-8 shadow-2xl">
             <img src="/aurora.png" alt="Aurora Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Banking built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">future.</span>
          </h1>
          <p className="text-lg text-indigo-100/80 mb-12 max-w-md leading-relaxed">
            Experience seamless, secure, and modern core banking designed to keep your assets protected and easily accessible everywhere in the world.
          </p>

          <div className="flex items-center gap-4">
             <div className="flex -space-x-4">
                {[...Array(4)].map((_, i) => (
                   <img key={i} className="w-10 h-10 border-2 border-indigo-900 rounded-full" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User avatar" />
                ))}
             </div>
             <div className="text-sm">
                <p className="font-semibold text-white">Trusted by Aurora GANG😎</p>
                <p className="text-indigo-200/70">Join our growing ecosystem</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Flow */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 lg:p-32 relative">
        {/* Subtle mobile aesthetic touches */}
        <div className="absolute top-0 left-0 w-full h-2 lg:hidden bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        
        <div className="w-full max-w-md mx-auto">
          {view === "login" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Header */}
              <div className="mb-8">
                <div className="lg:hidden bg-indigo-50 p-2 rounded-2xl inline-flex mb-6">
                   <img src="/aurora.png" alt="Aurora Logo" className="w-12 h-12 object-contain" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-500 font-medium">Enter your username or email to proceed.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50/50 border border-red-100/80 text-red-600 text-sm rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <span className="font-medium pt-0.5">{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username or Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                      <Mail size={20} strokeWidth={2.5} />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-gray-50 outline-none transition-all text-gray-900 font-medium"
                      placeholder="username or email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={20} strokeWidth={2.5} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-gray-50 outline-none transition-all text-gray-900 font-medium tracking-wide"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:text-indigo-500 transition-colors outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} strokeWidth={2.5}/> : <Eye size={20} strokeWidth={2.5}/>}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center group">
                    <div className="relative flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-300 checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all cursor-pointer"
                      />
                      <svg
                        className="absolute w-5 h-5 flex items-center justify-center p-0.5 pointer-events-none text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none group-hover:text-gray-900 transition-colors">
                      Remember for 30 days
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setView("forgotPassword");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative flex justify-center items-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-gray-900 hover:bg-indigo-600 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-4"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    "Login securely"
                  )}
                </button>
              </form>

              {/* Guest access hint */}
              <div className="mt-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-900">Want to explore safely?</p>
                  <p className="text-xs text-indigo-700/70 mt-0.5">Try our isolated 2-hour guest sessions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setView("guestSelection"); setError(null); setSuccessMsg(null); }}
                  className="text-xs font-bold text-white hover:bg-indigo-700 bg-indigo-600 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ml-3 shadow-md border border-indigo-500 hover:-translate-y-0.5 group flex items-center gap-2"
                >
                  <Shield size={14} className="text-indigo-200" />
                  Guest Mode
                </button>
              </div>
            </div>
          ) : view === "guestSelection" ? (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <button 
                 onClick={() => { setView("login"); setError(null); setSuccessMsg(null); }}
                 className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8 group disabled:opacity-50"
                 disabled={loading}
               >
                 <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5}/>
                 Return to login
               </button>
               
               <div className="mb-8">
                 <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Role</h2>
                 <p className="text-gray-500 font-medium leading-relaxed">
                   Select a persona to explore. You'll get your very own isolated dummy database.
                 </p>
               </div>

               {error && (
                 <div className="mb-6 p-4 bg-red-50/50 border border-red-100/80 text-red-600 text-sm rounded-2xl flex items-start gap-3">
                   <AlertCircle size={20} className="flex-shrink-0" />
                   <span className="font-medium pt-0.5">{error}</span>
                 </div>
               )}

               <div className="space-y-4">
                 <button
                   onClick={() => handleGuestLogin('admin')}
                   disabled={loading}
                   className="w-full relative group bg-white border-2 border-gray-100 hover:border-indigo-600 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <div className="flex items-start gap-4">
                     <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                       <Shield size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900 text-lg mb-1">Explore as Admin</h3>
                       <p className="text-sm text-gray-500">Full control over settings, complete visibility into operations, customers, and overall system logs.</p>
                     </div>
                   </div>
                 </button>

                 <button
                   onClick={() => handleGuestLogin('employee')}
                   disabled={loading}
                   className="w-full relative group bg-white border-2 border-gray-100 hover:border-purple-600 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <div className="flex items-start gap-4">
                     <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                       <Briefcase size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900 text-lg mb-1">Explore as Employee</h3>
                       <p className="text-sm text-gray-500">Manage daily customer operations, create accounts, authorize transactions, and view personal metrics.</p>
                     </div>
                   </div>
                 </button>
               </div>
               
               {loading && (
                  <div className="mt-6 flex flex-col items-center gap-3 text-indigo-600 animate-in fade-in">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold tracking-wide text-gray-600 animate-pulse">Provisioning your isolated environment...</p>
                  </div>
               )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button 
                onClick={() => {
                  setView("login");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
              >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5}/>
                Return to login
              </button>
              
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500 font-medium leading-relaxed">No worries, we'll send you reset instructions to your registered email address.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50/50 border border-red-100/80 text-red-600 text-sm rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <span className="font-medium pt-0.5">{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-6 p-4 bg-green-50/50 border border-green-100/80 text-green-700 text-sm rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-green-100 rounded-full p-0.5 flex-shrink-0">
                    <CheckCircle2 size={18} className="text-green-600" strokeWidth={3} />
                  </div>
                  <span className="font-medium">{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                      <Mail size={20} strokeWidth={2.5} />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-gray-50 outline-none transition-all text-gray-900 font-medium"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || successMsg !== null}
                  className="w-full relative flex justify-center items-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_8px_16px_-6px_rgba(79,70,229,0.4)] focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 pt-4"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending instructions...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
