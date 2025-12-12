import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CustomerForm from "./components/CustomerForm";
import AccountForm from "./components/AccountForm";
import TransactionForm from "./components/TransactionForm";
import ViewCustomers from "./pages/ViewCustomers";
import ViewAccounts from "./pages/ViewAccounts";
import ViewTransactions from "./pages/ViewTransactions";
import AuditLogs from "./pages/AuditLogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customer" element={<CustomerForm />} />
        <Route path="/account" element={<AccountForm />} />
        <Route path="/transaction" element={<TransactionForm />} />
        <Route path="/customers" element={<ViewCustomers />} />
        <Route path="/accounts" element={<ViewAccounts />} />
        <Route path="/transactions" element={<ViewTransactions />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
      </Routes>
    </Router>
  );
}

export default App;