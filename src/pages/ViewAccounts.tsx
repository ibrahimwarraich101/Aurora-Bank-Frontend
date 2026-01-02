import React, { useState, useEffect } from "react";
import { CreditCard, Trash2, AlertCircle, Search, RefreshCw, DollarSign } from "lucide-react";
import axios from "axios";

interface Account {
  AccountNo: number;
  CustomerID: number;
  CustomerName?: string;
  Type: string;
  Balance: number;
  CreatedAt?: string;
}

const ViewAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/accounts");
      setAccounts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch accounts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (accountNo: number) => {
    if (!confirm(`Are you sure you want to delete Account #${accountNo}?`)) {
      return;
    }

    setDeleteLoading(accountNo);
    try {
      await axios.delete(`http://localhost:5000/accounts/${accountNo}`);
      setAccounts(accounts.filter(a => a.AccountNo !== accountNo));
      alert("Account deleted successfully!");
    } catch (err) {
  if (axios.isAxiosError(err)) {
    alert(err.response?.data?.error || "Failed to delete account");
  } else {
    alert("Failed to delete account");
  }
}
finally {
      setDeleteLoading(null);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.AccountNo.toString().includes(searchTerm) ||
    account.CustomerID.toString().includes(searchTerm) ||
    account.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.Type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = filteredAccounts.reduce((sum, acc) => sum + Number(acc.Balance), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">All Accounts</h1>
                <p className="text-gray-600">View all registered accounts in the system</p>
              </div>
            </div>
            <button
              onClick={fetchAccounts}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by account number, customer ID, name, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-md"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Accounts</p>
                  <p className="text-3xl font-bold text-gray-800">{filteredAccounts.length}</p>
                </div>
                <CreditCard className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Balance</p>
                  <p className="text-3xl font-bold text-gray-800">${totalBalance.toFixed(2)}</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Balance</p>
                  <p className="text-3xl font-bold text-gray-800">
                    ${filteredAccounts.length ? (totalBalance / filteredAccounts.length).toFixed(2) : "0.00"}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Accounts Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Account No</th>
                  <th className="px-6 py-4 text-left font-semibold">Customer ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Customer Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-right font-semibold">Balance</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No accounts found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account, index) => (
                    <tr
                      key={account.AccountNo}
                      className={`hover:bg-emerald-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        #{account.AccountNo}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {account.CustomerID}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {account.CustomerName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          account.Type === "Savings" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {account.Type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-green-600">
                          ${Number(account.Balance).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleDelete(account.AccountNo)}
                            disabled={deleteLoading === account.AccountNo}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                          >
                            {deleteLoading === account.AccountNo ? (
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
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewAccounts;