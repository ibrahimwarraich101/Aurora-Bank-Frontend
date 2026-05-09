import React, { useState, useEffect } from "react";
import { Users, Trash2, AlertCircle, Search, RefreshCw } from "lucide-react";
import axios from "axios";

interface Customer {
  CustomerID: number;
  Name: string;
  CNIC: string;
  Contact: string;
  CreatedAt?: string;
}

const ViewCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/customers");
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}"?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/customers/${id}`);
      setCustomers(customers.filter(c => c.CustomerID !== id));
      alert("Customer deleted successfully!");
    } catch (err) {
  if (axios.isAxiosError(err)) {
    alert(err.response?.data?.error || "Failed to delete customer");
  } else {
    alert("Failed to delete customer");
  }
}
 finally {
      setDeleteLoading(null);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.CNIC.includes(searchTerm) ||
    customer.Contact.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Compact Aesthetic Header */}
        <div className="mb-10 relative rounded-2xl bg-gradient-to-tr from-emerald-900 via-teal-900 to-cyan-900 p-6 overflow-hidden shadow-lg border border-teal-800/50">
           <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-white">
                 <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-inner">
                   <Users className="w-6 h-6 text-emerald-200" />
                 </div>
                 <div>
                   <h1 className="text-2xl font-bold tracking-tight drop-shadow-md">Client Directory</h1>
                   <p className="text-emerald-100/80 text-sm mt-0.5">
                      View, manage, and process all registered customer profiles.
                   </p>
                 </div>
              </div>
              <button
                onClick={fetchCustomers}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all text-white font-medium border border-white/10 shadow-sm"
               >
                 <RefreshCw className="w-4 h-4" />
                 Sync Database
               </button>
           </div>
        </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, CNIC, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-md"
            />
          </div>
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">CNIC</th>
                  <th className="px-6 py-4 text-left font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold">Created At</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No customers found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.CustomerID}
                      className={`hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {customer.CustomerID}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{customer.Name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono text-sm">
                        {customer.CNIC}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{customer.Contact}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {customer.CreatedAt
                          ? new Date(customer.CreatedAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleDelete(customer.CustomerID, customer.Name)}
                            disabled={deleteLoading === customer.CustomerID}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                          >
                            {deleteLoading === customer.CustomerID ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 text-center text-gray-600">
          <p className="font-medium">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomers;