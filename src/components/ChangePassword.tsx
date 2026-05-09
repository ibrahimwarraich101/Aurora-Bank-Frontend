import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, Info } from "lucide-react";
import { changePassword } from "../services/auth";
import { useRecaptcha } from "../hooks/useRecaptcha";

export default function ChangePassword() {
  const getRecaptchaToken = useRecaptcha();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [strengthMatch, setStrengthMatch] = useState({ score: 0, label: "Weak", color: "bg-red-500" });

  useEffect(() => {
    // Password Strength Evaluator
    let score = 0;
    if (newPassword.length > 5) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    
    if (newPassword.length === 0) {
      setStrengthMatch({ score: 0, label: "", color: "bg-gray-200" });
    } else if (score <= 2) {
      setStrengthMatch({ score: 25, label: "Weak", color: "bg-red-500" });
    } else if (score === 3 || score === 4) {
      setStrengthMatch({ score: 60, label: "Medium", color: "bg-yellow-500" });
    } else {
      setStrengthMatch({ score: 100, label: "Strong", color: "bg-green-500" });
    }
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken("change_password");
      await changePassword(currentPassword, newPassword, recaptchaToken);
      setSuccess("Your password has been updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update password");
      } else {
        setError("Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-lg w-full">
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
        <div className="bg-indigo-50 p-2 rounded-lg">
          <ShieldCheck className="text-indigo-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
          <p className="text-sm text-gray-500">Update your account security credentials</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-5 p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all sm:text-sm"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all sm:text-sm"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Strength Indicator */}
          {newPassword.length > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Password strength:</span>
                <span className={`font-semibold ${
                  strengthMatch.label === 'Strong' ? 'text-green-600' : 
                  strengthMatch.label === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>{strengthMatch.label}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${strengthMatch.color}`} 
                  style={{ width: `${strengthMatch.score}%` }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showNew ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all sm:text-sm"
              placeholder="Confirm new password"
              required
            />
          </div>
          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
             <p className="text-red-500 text-xs mt-1.5 flex items-center">
               <Info size={12} className="mr-1"/> Passwords do not match
             </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}
