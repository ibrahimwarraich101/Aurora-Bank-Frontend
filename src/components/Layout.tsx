import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sparkles, 
  User, 
  CreditCard, 
  ArrowRightLeft, 
  Users,
  Wallet,
  History,
  Shield,
  Menu,
  X,
  Home
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/customer", label: "Customer Form", icon: User },
    { path: "/account", label: "Account Form", icon: CreditCard },
    { path: "/transaction", label: "Transaction Form", icon: ArrowRightLeft },
    { path: "/customers", label: "View Customers", icon: Users },
    { path: "/accounts", label: "View Accounts", icon: Wallet },
    { path: "/transactions", label: "Transaction History", icon: History },
    { path: "/audit", label: "Audit Logs", icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full"
          >
            <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg flex-shrink-0">
              <Sparkles className="text-white" size={24} />
            </div>
            {isSidebarOpen && (
              <div className="text-left">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Aurora Bank
                </h1>
                <p className="text-xs text-gray-500">Banking System</p>
              </div>
            )}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-7 -right-3 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all"
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6  overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {isSidebarOpen && (
                      <span className="font-medium text-base">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <p className="text-xs text-gray-600 text-center">
              © 2024 Aurora Bank
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Secure Banking System
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;