import { useEffect, useState } from "react";
import { ArrowRightLeft, RefreshCw, Search } from "lucide-react";
import { fetchTransactions } from "../../services/api";

interface Tx {
  TransID: number;
  FromAccount: number | null;
  ToAccount: number | null;
  Amount: number;
  Type: string;
  DateTime: string;
  created_by_name: string;
}

const TYPE_COLORS: Record<string, string> = {
  Deposit: "bg-green-50 text-green-700",
  Withdraw: "bg-red-50 text-red-600",
  Transfer: "bg-blue-50 text-blue-700",
};

const AdminAllTransactions = () => {
  const [txns, setTxns] = useState<Tx[]>([]);
  const [filtered, setFiltered] = useState<Tx[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTxns(data);
      setFiltered(data);
    } catch {/**/} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = txns;
    if (typeFilter !== "All") result = result.filter(t => t.Type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.TransID.toString().includes(q) ||
        (t.created_by_name || "").toLowerCase().includes(q) ||
        t.Amount.toString().includes(q)
      );
    }
    setFiltered(result);
  }, [search, typeFilter, txns]);

  const totalVol = filtered.reduce((s, t) => s + parseFloat(String(t.Amount) || "0"), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-purple-900 via-pink-900 to-orange-900 p-6 overflow-hidden shadow-lg border border-pink-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6 text-pink-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">All Transactions</h1>
              <p className="text-pink-100/80 text-sm mt-0.5">Complete transaction history across the bank.</p>
            </div>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white font-medium border border-white/10">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total", value: filtered.length, color: "text-gray-900" },
          { label: "Deposits", value: filtered.filter(t => t.Type === "Deposit").length, color: "text-green-700" },
          { label: "Withdrawals", value: filtered.filter(t => t.Type === "Withdraw").length, color: "text-red-600" },
          { label: "Volume", value: `Rs. ${totalVol.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-blue-700" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-sm" />
        </div>
        {["All", "Deposit", "Withdraw", "Transfer"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${typeFilter === t ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300"}`}>{t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-3" />
            <p className="text-sm">Loading transactions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  {["TX ID", "Type", "From Acc", "To Acc", "Amount", "Employee", "Date"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-gray-400">No transactions found</td></tr>
                ) : filtered.map(t => (
                  <tr key={t.TransID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-sm text-gray-500">#{t.TransID}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${TYPE_COLORS[t.Type] || "bg-gray-100 text-gray-600"}`}>{t.Type}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{t.FromAccount ?? "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{t.ToAccount ?? "—"}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900 text-sm">Rs. {parseFloat(String(t.Amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-4">
                      <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">{t.created_by_name || "—"}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(t.DateTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-xs text-gray-500">
              Showing {filtered.length} of {txns.length} transactions
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllTransactions;
