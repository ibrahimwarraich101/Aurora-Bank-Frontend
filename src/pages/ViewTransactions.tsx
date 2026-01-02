import React, { useState, useEffect } from "react";
import { ArrowRightLeft, ArrowDownCircle, ArrowUpCircle, RefreshCw, Calendar, Search } from "lucide-react";
import axios from "axios";

interface Transaction {
  TransID: number;
  FromAccount: number | null;
  ToAccount: number | null;
  Amount: number;
  Type: string;
  DateTime: string;
}

const ViewTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/transactions");
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "Deposit":
        return <ArrowDownCircle className="w-5 h-5 text-green-600" />;
      case "Withdraw":
        return <ArrowUpCircle className="w-5 h-5 text-orange-600" />;
      case "Transfer":
        return <ArrowRightLeft className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Deposit":
        return "bg-green-100 text-green-800";
      case "Withdraw":
        return "bg-orange-100 text-orange-800";
      case "Transfer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === "All" || t.Type === filter;
    const matchesSearch = 
      t.TransID.toString().includes(searchTerm) ||
      t.FromAccount?.toString().includes(searchTerm) ||
      t.ToAccount?.toString().includes(searchTerm) ||
      t.Amount.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.Amount), 0);
  const depositCount = transactions.filter(t => t.Type === "Deposit").length;
  const withdrawCount = transactions.filter(t => t.Type === "Withdraw").length;
  const transferCount = transactions.filter(t => t.Type === "Transfer").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg">
                <ArrowRightLeft className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Transaction History</h1>
                <p className="text-gray-600">View all banking transactions</p>
              </div>
            </div>
            <button
              onClick={fetchTransactions}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Transactions</p>
                  <p className="text-3xl font-bold text-gray-800">{transactions.length}</p>
                </div>
                <ArrowRightLeft className="w-10 h-10 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Deposits</p>
                  <p className="text-3xl font-bold text-green-600">{depositCount}</p>
                </div>
                <ArrowDownCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Withdrawals</p>
                  <p className="text-3xl font-bold text-orange-600">{withdrawCount}</p>
                </div>
                <ArrowUpCircle className="w-10 h-10 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Transfers</p>
                  <p className="text-3xl font-bold text-blue-600">{transferCount}</p>
                </div>
                <ArrowRightLeft className="w-10 h-10 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by transaction ID, account number, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-md"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 flex-wrap">
            {["All", "Deposit", "Withdraw", "Transfer"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  filter === type
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:shadow-md"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">From Account</th>
                  <th className="px-6 py-4 text-left font-semibold">To Account</th>
                  <th className="px-6 py-4 text-right font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <ArrowRightLeft className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No transactions found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <tr
                      key={transaction.TransID}
                      className={`hover:bg-purple-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-purple-600">
                        #{transaction.TransID}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getIcon(transaction.Type)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.Type)}`}>
                            {transaction.Type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono">
                        {transaction.FromAccount ? `#${transaction.FromAccount}` : "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono">
                        {transaction.ToAccount ? `#${transaction.ToAccount}` : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-green-600">
                          ${Number(transaction.Amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(transaction.DateTime).toLocaleString()}
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
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-gray-600 text-sm mb-1">Showing Transactions</p>
              <p className="text-2xl font-bold text-gray-800">
                {filteredTransactions.length} of {transactions.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Average Transaction</p>
              <p className="text-2xl font-bold text-blue-600">
                ${filteredTransactions.length ? (totalAmount / filteredTransactions.length).toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactions;