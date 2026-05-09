import { useEffect, useState } from "react";
import { Shield, RefreshCw, Search } from "lucide-react";
import { fetchAuditLogs } from "../../services/api";

interface Log {
  LogID: number;
  Operation: string;
  TableAffected: string;
  action: string;
  details: string;
  performed_by_name: string;
  User: string;
  DateTime: string;
}

const ACTION_COLORS: Record<string, string> = {
  USER_LOGIN: "bg-blue-50 text-blue-700",
  CREATE_CUSTOMER: "bg-green-50 text-green-700",
  DELETE_CUSTOMER: "bg-red-50 text-red-600",
  CREATE_ACCOUNT: "bg-emerald-50 text-emerald-700",
  DELETE_ACCOUNT: "bg-red-50 text-red-600",
  DEPOSIT: "bg-teal-50 text-teal-700",
  WITHDRAW: "bg-orange-50 text-orange-700",
  TRANSFER: "bg-indigo-50 text-indigo-700",
  CREATE_EMPLOYEE: "bg-violet-50 text-violet-700",
  CHANGE_PASSWORD: "bg-amber-50 text-amber-700",
};

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filtered, setFiltered] = useState<Log[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
      setFiltered(data);
    } catch {/**/} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search) { setFiltered(logs); return; }
    const q = search.toLowerCase();
    setFiltered(logs.filter(l =>
      (l.action || "").toLowerCase().includes(q) ||
      (l.details || "").toLowerCase().includes(q) ||
      (l.performed_by_name || l.User || "").toLowerCase().includes(q) ||
      (l.TableAffected || "").toLowerCase().includes(q)
    ));
  }, [search, logs]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-gray-900 via-slate-800 to-zinc-900 p-6 overflow-hidden shadow-lg border border-slate-700/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">System Audit Logs</h1>
              <p className="text-slate-300/80 text-sm mt-0.5">Complete audit trail for all employees and actions.</p>
            </div>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white font-medium border border-white/10">
            <RefreshCw className="w-4 h-4" /> Sync Logs
          </button>
        </div>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" placeholder="Search by action, table, user, or details..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none shadow-sm" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-500 mx-auto mb-3" />
            <p className="text-sm">Loading logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  {["Log ID", "Action", "Table", "Details", "Performed By", "Timestamp"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400">No logs found</td></tr>
                ) : filtered.map(l => (
                  <tr key={l.LogID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">#{l.LogID}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ACTION_COLORS[l.action] || "bg-gray-100 text-gray-600"}`}>
                        {l.action || l.Operation}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{l.TableAffected}</td>
                    <td className="px-5 py-4 text-sm text-gray-700 max-w-xs truncate">{l.details || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {l.performed_by_name || l.User || "System"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{new Date(l.DateTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-xs text-gray-500">
              Showing {filtered.length} of {logs.length} log entries
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
