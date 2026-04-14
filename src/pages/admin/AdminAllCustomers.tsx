import { useEffect, useState } from "react";
import { Users, RefreshCw, Search } from "lucide-react";
import { fetchCustomers } from "../../services/api";

interface Customer {
  CustomerID: number;
  Name: string;
  CNIC: string;
  Contact: string;
  CreatedAt: string;
  created_by_name: string;
}

const AdminAllCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchCustomers();
      setCustomers(data);
      setFiltered(data);
    } catch {/**/} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(customers.filter(c =>
      c.Name.toLowerCase().includes(q) ||
      c.CNIC.includes(q) ||
      c.Contact.includes(q) ||
      (c.created_by_name || "").toLowerCase().includes(q)
    ));
  }, [search, customers]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-emerald-900 via-teal-900 to-cyan-900 p-6 overflow-hidden shadow-lg border border-teal-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">All Customers</h1>
              <p className="text-emerald-100/80 text-sm mt-0.5">View all customers registered bank-wide.</p>
            </div>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white font-medium border border-white/10">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by name, CNIC, contact, or employee..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto mb-3" />
            <p className="text-sm">Loading customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  {["ID", "Name", "CNIC", "Contact", "Created By", "Date"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400">No customers found</td></tr>
                ) : filtered.map(c => (
                  <tr key={c.CustomerID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500">#{c.CustomerID}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900 text-sm">{c.Name}</td>
                    <td className="px-5 py-4 text-gray-600 text-sm font-mono">{c.CNIC}</td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{c.Contact}</td>
                    <td className="px-5 py-4">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {c.created_by_name || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(c.CreatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-xs text-gray-500">
              Showing {filtered.length} of {customers.length} customers
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllCustomers;
