import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, CreditCard, ArrowRightLeft, Users, Database, Shield, Menu, X } from "lucide-react";

// Import all pages
import Dashboard from "./pages/Dashboard";
import CustomerForm from "./components/CustomerForm";
import AccountForm from "./components/AccountForm";
import TransactionForm from "./components/TransactionForm";
import ViewCustomers from "./pages/ViewCustomers";
import ViewAccounts from "./pages/ViewAccounts";
import ViewTransactions from "./pages/ViewTransactions";
import AuditLogs from "./pages/AuditLogs";

// Sidebar component
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/customer", label: "Customer Form", icon: User },
    { path: "/account", label: "Account Form", icon: CreditCard },
    { path: "/transaction", label: "Transaction Form", icon: ArrowRightLeft },
    { path: "/view-customers", label: "View Customers", icon: Users },
    { path: "/view-accounts", label: "View Accounts", icon: Database },
    { path: "/view-transactions", label: "Transaction History", icon: ArrowRightLeft },
    { path: "/audit-logs", label: "Audit Logs", icon: Shield },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 text-white transition-all duration-300 flex flex-col shadow-2xl h-screen fixed left-0 top-0 z-50`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/20">
        {sidebarOpen && <h1 className="text-xl font-bold">Aurora Bank</h1>}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/20 rounded-lg transition-all"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-lg font-bold'
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <Icon size={20} />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        {sidebarOpen && (
          <div className="text-xs text-white/80">
            <p>© 2025 Aurora Bank</p>
            <p>CBS Final Project</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-64">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customer" element={<CustomerForm />} />
          <Route path="/account" element={<AccountForm />} />
          <Route path="/transaction" element={<TransactionForm />} />
          <Route path="/view-customers" element={<ViewCustomers />} />
          <Route path="/view-accounts" element={<ViewAccounts />} />
          <Route path="/view-transactions" element={<ViewTransactions />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;