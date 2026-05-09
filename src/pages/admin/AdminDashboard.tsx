import { useEffect, useState } from "react";
import { Users, CreditCard, TrendingUp, Activity, UserCheck, DollarSign } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface AdminStats {
  totalEmployees: number;
  totalCustomers: number;
  totalAccounts: number;
  totalBalance: number;
  totalVolume: number;
  recentActivity: Array<{
    LogID: number;
    action: string;
    performed_by_name: string;
    DateTime: string;
    details: string;
  }>;
}

const StatCard = ({ title, value, icon: Icon, color, subtext }: {
  title: string; value: string | number; icon: React.ElementType; color: string; subtext?: string;
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats").then(res => {
      if (res.data.success) setStats(res.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatTime = (dt: string) => {
    const diff = Date.now() - new Date(dt).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-amber-700 via-orange-800 to-amber-900 p-6 overflow-hidden shadow-lg border border-amber-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 text-white">
          <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl border border-white/20 overflow-hidden">
            <img src="/aurora.png" alt="Aurora Bank" className="w-8 h-8 object-contain brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-amber-100/80 text-sm mt-0.5">
              Welcome back, {user?.name}. Here's a real-time overview of the entire bank.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Employees" value={stats?.totalEmployees ?? 0} icon={UserCheck} color="from-amber-500 to-orange-600" />
        <StatCard title="Total Customers" value={stats?.totalCustomers ?? 0} icon={Users} color="from-blue-500 to-blue-600" />
        <StatCard title="Total Accounts" value={stats?.totalAccounts ?? 0} icon={CreditCard} color="from-emerald-500 to-teal-600" />
        <StatCard title="Total Balance" value={`Rs. ${(stats?.totalBalance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`} icon={DollarSign} color="from-purple-500 to-purple-600" subtext="All accounts" />
        <StatCard title="Transaction Volume" value={`Rs. ${(stats?.totalVolume ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`} icon={TrendingUp} color="from-pink-500 to-rose-600" subtext="All time" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Recent Activity</h2>
        {!stats?.recentActivity?.length ? (
          <div className="text-center py-10 text-gray-400">
            <Activity className="mx-auto mb-3" size={40} />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.map((a) => (
              <div key={a.LogID} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Activity className="text-indigo-600" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.details || a.action}</p>
                  <p className="text-xs text-gray-400">{a.performed_by_name || "System"}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(a.DateTime)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
