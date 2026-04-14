import { useEffect, useState } from "react";
import { Building2, Save } from "lucide-react";
import { fetchSystemSettings, updateSystemSettings } from "../../services/api";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    bank_name: "",
    default_deposit_limit: "",
    default_withdraw_limit: "",
    account_types: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemSettings().then(res => {
      if (res.success) setSettings(prev => ({ ...prev, ...res.data }));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateSystemSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900 p-6 overflow-hidden shadow-lg border border-slate-700/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 text-white">
          <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-slate-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-slate-300/80 text-sm mt-0.5">Configure bank-wide defaults and operational parameters.</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-500 mx-auto mb-3" />
            <p className="text-sm">Loading settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            {success && <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl">✅ Settings saved successfully!</div>}
            {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>}

            {[
              { key: "bank_name", label: "Bank Name", type: "text", placeholder: "Aurora Bank", help: "The official name displayed throughout the system." },
              { key: "default_deposit_limit", label: "Default Deposit Limit (PKR)", type: "number", placeholder: "1000000", help: "Maximum amount allowed per deposit transaction." },
              { key: "default_withdraw_limit", label: "Default Withdrawal Limit (PKR)", type: "number", placeholder: "500000", help: "Maximum amount allowed per withdrawal transaction." },
              { key: "account_types", label: "Account Types", type: "text", placeholder: "Savings,Current", help: "Comma-separated list of available account types." },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  value={settings[f.key as keyof typeof settings]}
                  onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">{f.help}</p>
              </div>
            ))}

            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors disabled:opacity-60 shadow-sm mt-2">
              <Save size={16} />
              {saving ? "Saving..." : "Save System Settings"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
