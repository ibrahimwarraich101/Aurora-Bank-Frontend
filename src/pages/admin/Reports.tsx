import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";
import { fetchAdminReports } from "../../services/api";

interface EmployeePerf {
  id: number;
  name: string;
  email: string;
  customers_created: number;
  accounts_created: number;
  transactions_done: number;
  total_volume: number;
}

const Reports = () => {
  const [data, setData] = useState<{
    monthlyTransactions: Array<{ month: string; count: number; volume: number }>;
    monthlyCustomers: Array<{ month: string; count: number }>;
    employeePerformance: EmployeePerf[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminReports().then(res => {
      if (res.success) setData(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatMonth = (m: string) => {
    const [y, mo] = m.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(mo) - 1]} ${y.slice(2)}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Generating reports...</p>
      </div>
    </div>
  );

  const txData = (data?.monthlyTransactions || []).map(d => ({ ...d, month: formatMonth(d.month) }));
  const custData = (data?.monthlyCustomers || []).map(d => ({ ...d, month: formatMonth(d.month) }));

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 p-6 overflow-hidden shadow-lg border border-purple-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 text-white">
          <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center overflow-hidden">
            <img src="/aurora.png" alt="Aurora Bank" className="w-8 h-8 object-contain brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-purple-100/80 text-sm mt-0.5">Bank-wide performance metrics and trends.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Monthly Transaction Volume */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-5">Monthly Transaction Volume</h2>
          {txData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={txData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: unknown) => [`Rs. ${Number(v).toLocaleString()}`, "Volume"]} />
                <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly New Customers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-5">New Customers per Month</h2>
          {custData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={custData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Employee Performance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <TrendingUp className="text-indigo-600" size={20} />
          <h2 className="text-base font-bold text-gray-800">Employee Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                {["Employee", "Email", "Customers", "Accounts", "Transactions", "Volume"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!data?.employeePerformance?.length ? (
                <tr><td colSpan={6} className="py-10 text-center text-gray-400">No employees found</td></tr>
              ) : data.employeePerformance.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900 text-sm">{emp.name}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm">{emp.email}</td>
                  <td className="px-5 py-4"><span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{emp.customers_created}</span></td>
                  <td className="px-5 py-4"><span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">{emp.accounts_created}</span></td>
                  <td className="px-5 py-4"><span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">{emp.transactions_done}</span></td>
                  <td className="px-5 py-4 font-semibold text-gray-900 text-sm">Rs. {parseFloat(String(emp.total_volume)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
