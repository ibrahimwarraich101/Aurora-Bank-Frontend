import { useEffect, useState } from "react";
import { Users, CreditCard, TrendingUp, Eye, ArrowRightLeft, DollarSign } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const GuestDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    totalCustomers: number;
    totalAccounts: number;
    totalBalance: number;
    totalVolume: number;
  } | null>(null);

  useEffect(() => {
    api.get("/dashboard/stats").then(res => {
      if (res.data.success) setStats(res.data.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-slate-700 via-gray-700 to-slate-800 p-6 overflow-hidden shadow-lg border border-slate-600/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-400 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 text-white">
          <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl border border-white/20">
            <Eye className="w-6 h-6 text-slate-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Guest View</h1>
            <p className="text-slate-100/80 text-sm mt-0.5">
              Welcome, {user?.name}. You have read-only access to Aurora Bank's overview.
            </p>
          </div>
        </div>
      </div>

      {/* Read-only notice */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center mt-0.5">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <div>
          <p className="text-amber-800 text-sm font-semibold">Guest Access — Read Only</p>
          <p className="text-amber-700 text-xs mt-0.5">You can browse the application but cannot create, modify, or delete any data.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: "Total Customers", value: stats?.totalCustomers ?? "—", icon: Users, color: "from-blue-500 to-blue-600" },
          { title: "Total Accounts", value: stats?.totalAccounts ?? "—", icon: CreditCard, color: "from-emerald-500 to-teal-600" },
          { title: "Total Balance", value: stats?.totalBalance != null ? `Rs. ${stats.totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—", icon: DollarSign, color: "from-purple-500 to-purple-600" },
          { title: "Transaction Volume", value: stats?.totalVolume != null ? `Rs. ${stats.totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—", icon: TrendingUp, color: "from-pink-500 to-rose-600" },
        ].map(s => (
          <div key={s.title} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{s.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{s.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${s.color}`}>
                <s.icon className="text-white" size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature list */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ArrowRightLeft size={18} className="text-indigo-600" />
          Available Guest Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "View all customer records",
            "View all bank accounts",
            "View complete transaction history",
            "Browse system audit logs",
            "See bank-wide statistics",
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              {f}
            </div>
          ))}
          {[
            "Create or modify records",
            "Access admin settings",
            "Manage employees",
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 text-xs">✗</span>
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
