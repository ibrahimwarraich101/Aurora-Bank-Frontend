import React, { useState, useEffect } from "react";
import { FileText, Home, Loader2, AlertCircle, ArrowUpCircle, ArrowDownCircle, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../services/api";
import { AxiosError } from "axios";

interface Transaction {
  TransID: number;
  FromAccount: number | null;
  ToAccount: number | null;
  Amount: number;
  Type: string;
  DateTime: string;
}

const ViewTransactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchTransactions();
      setTransactions(response.data || []);
    } catch (err: unknown) {
       const error = err as AxiosError;
      setError(error.message || "Failed to load transactions");
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return <ArrowDownCircle className="text-green-500" size={20} />;
      case 'Withdraw': return <ArrowUpCircle className="text-orange-500" size={20} />;
      case 'Transfer': return <ArrowRightLeft className="text-blue-500" size={20} />;
      default: return <FileText className="text-gray-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Deposit': return 'bg-green-100 text-green-800';
      case 'Withdraw': return 'bg-orange-100 text-orange-800';
      case 'Transfer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg">
              <FileText className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Transaction History</h1>
              <p className="text-gray-600 mt-1">View all transaction records</p>
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
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading transactions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Transactions</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && !error && transactions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Trans ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                    <th className="px-6 py-4 text-left font-semibold">From Account</th>
                    <th className="px-6 py-4 text-left font-semibold">To Account</th>
                    <th className="px-6 py-4 text-left font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={transaction.TransID}
                      className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        #{transaction.TransID}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(transaction.Type)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.Type)}`}>
                            {transaction.Type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono">
                        {transaction.FromAccount || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono">
                        {transaction.ToAccount || '-'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-purple-600">
                        {formatCurrency(transaction.Amount)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {formatDateTime(transaction.DateTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Total Transactions: <span className="font-semibold text-gray-800">{transactions.length}</span>
              </p>
              <p className="text-sm text-gray-600">
                Total Amount: <span className="font-semibold text-purple-600">
                  {formatCurrency(transactions.reduce((sum, trans) => sum + trans.Amount, 0))}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && transactions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Transactions Found</h3>
            <p className="text-gray-600 mb-6">Start by making your first transaction</p>
            <button
              onClick={() => navigate("/transaction")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Make Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTransactions;