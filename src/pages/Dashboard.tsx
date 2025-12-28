import { useEffect, useState } from "react";
import { Users, Wallet, TrendingUp, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import axios from "axios";

interface Transaction {
  TransID: number;
  Type: string;
  Amount: number;
  FromAccount: number | null;
  ToAccount: number | null;
  DateTime: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalAccounts: number;
  totalBalance: number;
  recentTransactions: Transaction[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color}`}>
        <Icon className="text-white" size={28} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalAccounts: 0,
    totalBalance: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dashboard/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back to Aurora Bank</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Accounts"
          value={stats.totalAccounts}
          icon={Wallet}
          color="from-green-500 to-emerald-600"
        />
        <StatCard
          title="Total Balance"
          value={`$${stats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
            View All →
          </button>
        </div>

        {stats.recentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Type</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">From</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">To</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((txn) => (
                  <tr key={txn.TransID} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-700 font-medium">#{txn.TransID}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          txn.Type === "Deposit"
                            ? "bg-green-100 text-green-700"
                            : txn.Type === "Withdraw"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {txn.Type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{txn.FromAccount || "-"}</td>
                    <td className="py-4 px-4 text-gray-700">{txn.ToAccount || "-"}</td>
                    <td className="py-4 px-4 text-gray-800 font-semibold">${txn.Amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-500 text-sm">{formatTime(txn.DateTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;