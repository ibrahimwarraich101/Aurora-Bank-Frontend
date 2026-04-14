import { useEffect, useState } from "react";
import { Database, RefreshCw, Search } from "lucide-react";
import { fetchAccounts } from "../../services/api";

interface Account {
  AccountNo: number;
  CustomerID: number;
  CustomerName: string;
  Type: string;
  Balance: number;
  CreatedAt: string;
  created_by_name: string;
}

const AdminAllAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filtered, setFiltered] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAccounts();
      setAccounts(data);
      setFiltered(data);
    } catch {/**/} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = accounts;
    if (typeFilter !== "All") result = result.filter(a => a.Type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.AccountNo.toString().includes(q) ||
        (a.CustomerName || "").toLowerCase().includes(q) ||
        (a.created_by_name || "").toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, typeFilter, accounts]);

  const totalBalance = filtered.reduce((s, a) => s + parseFloat(String(a.Balance) || "0"), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-blue-900 via-indigo-900 to-purple-900 p-6 overflow-hidden shadow-lg border border-indigo-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">All Accounts</h1>
              <p className="text-blue-100/80 text-sm mt-0.5">Bank-wide account ledger with full visibility.</p>
            </div>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white font-medium border border-white/10">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total Accounts", value: filtered.length },
          { label: "Total Balance", value: `Rs. ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
          { label: "Avg Balance", value: `Rs. ${filtered.length ? (totalBalance / filtered.length).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}` }
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm" />
        </div>
        {["All", "Savings", "Current"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${typeFilter === t ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3" />
            <p className="text-sm">Loading accounts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  {["Account No", "Customer", "Type", "Balance", "Employee", "Date"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400">No accounts found</td></tr>
                ) : filtered.map(a => (
                  <tr key={a.AccountNo} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-sm text-gray-700">#{a.AccountNo}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900 text-sm">{a.CustomerName || `ID #${a.CustomerID}`}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.Type === "Savings" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>{a.Type}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900 text-sm">Rs. {parseFloat(String(a.Balance)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-4">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">{a.created_by_name || "—"}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(a.CreatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-xs text-gray-500">
              Showing {filtered.length} of {accounts.length} accounts
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllAccounts;
