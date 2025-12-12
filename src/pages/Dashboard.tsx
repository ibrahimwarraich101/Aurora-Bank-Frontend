import { Sparkles, User, CreditCard, ArrowRightLeft, ChevronRight, FileText, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-purple-600" size={32} />
            <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Core Banking System
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Manage customers, accounts, and transactions seamlessly</p>
        </div>

        {/* Dashboard buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/customer")}
            className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Customer Form</h3>
              <p className="text-gray-600 mb-4">Create and manage customer profiles</p>
              <ChevronRight className="text-purple-600 group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </div>
          </button>

          <button
            onClick={() => navigate("/account")}
            className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Account Form</h3>
              <p className="text-gray-600 mb-4">Open new accounts and manage balances</p>
              <ChevronRight className="text-emerald-600 group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </div>
          </button>

          <button
            onClick={() => navigate("/transaction")}
            className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <ArrowRightLeft className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Transaction Form</h3>
              <p className="text-gray-600 mb-4">Process deposits, withdrawals, and transfers</p>
              <ChevronRight className="text-pink-600 group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </div>
          </button>

          <button
            onClick={() => navigate("/customers")}
            className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">View Customers</h3>
              <p className="text-gray-600 mb-4">Browse all registered customers</p>
              <ChevronRight className="text-cyan-600 group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </div>
          </button>

          <button
            onClick={() => navigate("/accounts")}
            className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-teal-500 to-green-600 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">View Accounts</h3>
              <p className="text-gray-600 mb-4">Browse all bank accounts</p>
              <ChevronRight className="text-teal-600 group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </div>
          </button>

          <button
            onClick={() => navigate("/transactions")}
            className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Transaction History</h3>
              <p className="text-gray-600 mb-4">View all transaction records</p>
              <ChevronRight className="text-violet-600 group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </div>
          </button>

          <button
            onClick={() => navigate("/audit-logs")}
            className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 md:col-span-2 lg:col-span-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Audit Logs</h3>
              <p className="text-gray-600 mb-4">Track all system operations</p>
              <ChevronRight className="text-red-600 group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;