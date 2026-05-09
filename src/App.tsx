import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, User, CreditCard, ArrowRightLeft, Users, Database,
  Shield, Menu, X, LogOut, Settings, BarChart2, UserCheck,
  FileText, Building2, Eye
} from "lucide-react";

// Employee pages
import Dashboard from "./pages/Dashboard";
import CustomerForm from "./components/CustomerForm";
import AccountForm from "./components/AccountForm";
import TransactionForm from "./components/TransactionForm";
import ViewCustomers from "./pages/ViewCustomers";
import ViewAccounts from "./pages/ViewAccounts";
import ViewTransactions from "./pages/ViewTransactions";
import AuditLogs from "./pages/AuditLogs";
import ChangePassword from "./components/ChangePassword";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import AdminAllCustomers from "./pages/admin/AdminAllCustomers";
import AdminAllAccounts from "./pages/admin/AdminAllAccounts";
import AdminAllTransactions from "./pages/admin/AdminAllTransactions";
import Reports from "./pages/admin/Reports";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import SystemSettings from "./pages/admin/SystemSettings";
import AdminSettings from "./pages/admin/AdminSettings";

// Guest pages
import GuestDashboard from "./pages/guest/GuestDashboard";

import Login from "./pages/Login";

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const { user, logout, isAdmin, isGuest } = useAuth();

  const adminMenu = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/employees", label: "Employees", icon: UserCheck },
    { path: "/admin/customers", label: "All Customers", icon: Users },
    { path: "/admin/accounts", label: "All Accounts", icon: Database },
    { path: "/admin/transactions", label: "All Transactions", icon: ArrowRightLeft },
    { path: "/admin/reports", label: "Reports", icon: BarChart2 },
    { path: "/admin/audit-logs", label: "Audit Logs", icon: Shield },
    { path: "/admin/system-settings", label: "System Settings", icon: Building2 },
    { path: "/admin/settings", label: "My Settings", icon: Settings },
  ];


  const employeeMenu = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/customer", label: "Customer Form", icon: User },
    { path: "/account", label: "Account Form", icon: CreditCard },
    { path: "/transaction", label: "Transaction Form", icon: ArrowRightLeft },
    { path: "/view-customers", label: "View Customers", icon: Users },
    { path: "/view-accounts", label: "View Accounts", icon: Database },
    { path: "/view-transactions", label: "Transaction History", icon: FileText },
    { path: "/audit-logs", label: "Audit Logs", icon: Shield },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const menuItems = isAdmin() ? adminMenu : employeeMenu;

  const roleLabel = isGuest() ? `Guest ${isAdmin() ? 'Admin' : 'Employee'}` : (isAdmin() ? "Administrator" : "Employee");
  const roleBadgeClass = isGuest()
    ? "bg-amber-500/20 text-amber-300"
    : isAdmin()
    ? "bg-fuchsia-500/20 text-fuchsia-300"
    : "bg-indigo-500/20 text-indigo-300";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin" || path === "/" || path === "/guest") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`${open ? "w-64" : "w-20"} bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white transition-all duration-300 flex flex-col shadow-2xl h-screen fixed left-0 top-0 z-50 border-r border-white/5`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {open && (
          <div className="flex items-center gap-2">
            <img src="/aurora.png" alt="Aurora Bank" className="w-8 h-8 object-contain" />
            <span className="font-bold text-sm tracking-wide">Aurora Bank</span>
          </div>
        )}
        <button onClick={() => setOpen(!open)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Role Badge */}
      {open && user && (
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs text-slate-400 mb-1">Signed in as</p>
          <p className="text-sm font-semibold truncate">{user.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${roleBadgeClass}`}>
            {roleLabel}
          </span>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                active
                  ? "bg-white/15 text-white font-semibold shadow-inner border border-white/10"
                  : "hover:bg-white/8 text-slate-300 hover:text-white"
              }`}
            >
              <Icon size={18} className={active ? "text-indigo-300" : "text-slate-400"} />
              {open && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/15 rounded-xl transition-all text-red-400 hover:text-red-300 text-sm ${!open && "justify-center"}`}
        >
          <LogOut size={18} />
          {open && <span>Logout</span>}
        </button>
        {open && (
          <p className="text-xs text-slate-600 mt-3 text-center">© Aurora Bank</p>
        )}
      </div>
    </div>
  );
};

// ─── Layout ───────────────────────────────────────────────────────────────────
const Layout = () => {
  const { isGuest } = useAuth();
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-64 flex flex-col bg-slate-50">
        {isGuest() && (
          <div className="bg-amber-100 flex items-center justify-center p-2.5 shadow-sm border-b border-amber-200 z-40 sticky top-0">
            <Shield size={16} className="text-amber-600 mr-2" />
            <p className="text-sm font-semibold text-amber-900">
              You're in Guest Mode — changes are temporary and strictly isolated. This session expires automatically.
            </p>
          </div>
        )}
        <div className="flex-1 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// ─── Route Guards ─────────────────────────────────────────────────────────────
const RequireAuth = ({ allowedRoles }: { allowedRoles: ("admin" | "employee" | "guest")[] }) => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "guest") return <Navigate to="/guest" replace />;
    return <Navigate to="/" replace />;
  }
  return <Layout />;
};

// ─── Employee Settings wrapper ────────────────────────────────────────────────
const EmployeeSettingsPage = () => (
  <div className="min-h-screen bg-slate-50 p-6 lg:p-10 flex flex-col">
    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-indigo-900 via-slate-800 to-indigo-950 p-6 overflow-hidden shadow-lg border border-indigo-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 text-white">
          <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl border border-white/20">
            <Settings className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Settings</h1>
            <p className="text-indigo-100/80 text-sm mt-0.5">Manage your account security and preferences.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center -mt-20">
        <ChangePassword />
      </div>
    </div>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Employee routes */}
        <Route element={<RequireAuth allowedRoles={["employee"]} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customer" element={<CustomerForm />} />
          <Route path="/account" element={<AccountForm />} />
          <Route path="/transaction" element={<TransactionForm />} />
          <Route path="/view-customers" element={<ViewCustomers />} />
          <Route path="/view-accounts" element={<ViewAccounts />} />
          <Route path="/view-transactions" element={<ViewTransactions />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/settings" element={<EmployeeSettingsPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<EmployeeManagement />} />
          <Route path="/admin/customers" element={<AdminAllCustomers />} />
          <Route path="/admin/accounts" element={<AdminAllAccounts />} />
          <Route path="/admin/transactions" element={<AdminAllTransactions />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/system-settings" element={<SystemSettings />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Guest routes (read-only, reuses admin view pages) */}
        <Route element={<RequireAuth allowedRoles={["guest"]} />}>
          <Route path="/guest" element={<GuestDashboard />} />
          <Route path="/guest/customers" element={<AdminAllCustomers />} />
          <Route path="/guest/accounts" element={<AdminAllAccounts />} />
          <Route path="/guest/transactions" element={<AdminAllTransactions />} />
          <Route path="/guest/audit-logs" element={<AdminAuditLogs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;