import React, { useState, useEffect } from "react";
import { CreditCard, Home, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAccounts } from "../services/api";
import { AxiosError } from "axios";

interface Account {
  AccountNo: number;
  Type: string;
  Balance: number;
  Status: string;
  CustomerName: string;
  CNIC: string;
}

const ViewAccounts: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAccounts();
      setAccounts(response.data || []);
    } catch (err: unknown) {
      const error = err as AxiosError;
      setError(error.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Savings': return 'bg-blue-100 text-blue-800';
      case 'Current': return 'bg-purple-100 text-purple-800';
      case 'Fixed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 p-4 rounded-2xl shadow-lg">
              <CreditCard className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">All Accounts</h1>
              <p className="text-gray-600 mt-1">View all bank accounts in the system</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading accounts...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Accounts</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Accounts Table */}
        {!loading && !error && accounts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Account No</th>
                    <th className="px-6 py-4 text-left font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left font-semibold">CNIC</th>
                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                    <th className="px-6 py-4 text-left font-semibold">Balance</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account, index) => (
                    <tr
                      key={account.AccountNo}
                      className={`border-b border-gray-100 hover:bg-green-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {account.AccountNo}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{account.CustomerName}</td>
                      <td className="px-6 py-4 text-gray-700 font-mono text-sm">{account.CNIC}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(account.Type)}`}>
                          {account.Type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        {formatCurrency(account.Balance)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(account.Status)}`}>
                          {account.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Total Accounts: <span className="font-semibold text-gray-800">{accounts.length}</span>
              </p>
              <p className="text-sm text-gray-600">
                Total Balance: <span className="font-semibold text-green-600">
                  {formatCurrency(accounts.reduce((sum, acc) => sum + acc.Balance, 0))}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && accounts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Accounts Found</h3>
            <p className="text-gray-600 mb-6">Start by creating your first account</p>
            <button
              onClick={() => navigate("/account")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAccounts;