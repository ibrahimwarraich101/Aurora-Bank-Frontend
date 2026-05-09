import { useState, useEffect } from "react";
import { Settings, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, User, Mail, Info } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { changePassword, updateProfile } from "../../services/auth";
import { useRecaptcha } from "../../hooks/useRecaptcha";


const AdminSettings = () => {
  const { user, login: authLogin, token } = useAuth();
  const getRecaptchaToken = useRecaptcha();
  const [tab, setTab] = useState<"profile" | "password">("profile");


  // Profile form
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [strength, setStrength] = useState({ score: 0, label: "", color: "bg-gray-200" });

  useEffect(() => {
    let score = 0;
    if (newPassword.length > 5) score++;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    if (newPassword.length === 0) { setStrength({ score: 0, label: "", color: "bg-gray-200" }); return; }
    if (score <= 2) setStrength({ score: 25, label: "Weak", color: "bg-red-500" });
    else if (score <= 4) setStrength({ score: 60, label: "Medium", color: "bg-yellow-500" });
    else setStrength({ score: 100, label: "Strong", color: "bg-green-500" });
  }, [newPassword]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const recaptchaToken = await getRecaptchaToken("update_profile");
      const res = await updateProfile({ name, email }, recaptchaToken);
      // Update localStorage
      if (token && res.user) {
        authLogin(token, res.user);
      }
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPwdError("Passwords do not match"); return; }
    if (newPassword.length < 8) { setPwdError("New password must be at least 8 characters"); return; }
    setPwdSaving(true);
    setPwdError(null);
    setPwdSuccess(null);
    try {
      const recaptchaToken = await getRecaptchaToken("change_password");
      await changePassword(currentPassword, newPassword, recaptchaToken);
      setPwdSuccess("Password updated successfully!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setPwdSuccess(null), 3000);
    } catch (err) {
      setPwdError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-indigo-900 via-slate-800 to-indigo-950 p-6 overflow-hidden shadow-lg border border-indigo-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 text-white">
          <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
            <Settings className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Settings</h1>
            <p className="text-indigo-100/80 text-sm mt-0.5">Manage your admin profile and security credentials.</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Tabs */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 mb-6 shadow-sm">
          {[{ id: "profile", label: "Profile", icon: User }, { id: "password", label: "Password", icon: Lock }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as "profile" | "password")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <form onSubmit={handleProfileSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            {profileSuccess && <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex gap-2"><CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />{profileSuccess}</div>}
            {profileError && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex gap-2"><AlertCircle size={16} className="mt-0.5 flex-shrink-0" />{profileError}</div>}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 flex items-start gap-2">
              <Info size={14} className="mt-0.5 flex-shrink-0" />
              Admin role cannot be changed from this interface.
            </div>

            <button type="submit" disabled={profileSaving}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm">
              {profileSaving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {tab === "password" && (
          <form onSubmit={handlePasswordSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-indigo-50 rounded-lg"><ShieldCheck className="text-indigo-600" size={20} /></div>
              <div>
                <h3 className="font-bold text-gray-800">Change Password</h3>
                <p className="text-xs text-gray-500">Verify your current password before updating</p>
              </div>
            </div>

            {pwdSuccess && <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex gap-2"><CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />{pwdSuccess}</div>}
            {pwdError && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex gap-2"><AlertCircle size={16} className="mt-0.5 flex-shrink-0" />{pwdError}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Enter current password" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password <span className="text-red-500">*</span></label>
              <div className="relative mb-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type={showNew ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Enter new password" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Strength:</span>
                    <span className={strength.label === "Strong" ? "text-green-600 font-semibold" : strength.label === "Medium" ? "text-yellow-600 font-semibold" : "text-red-600 font-semibold"}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type={showNew ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Confirm new password" />
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><Info size={12} /> Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={pwdSaving}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm">
              {pwdSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
