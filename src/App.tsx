import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CustomerForm from "./components/CustomerForm";
import AccountForm from "./components/AccountForm";
import TransactionForm from "./components/TransactionForm";
import ViewAccounts from "./pages/ViewAccounts";
import AuditLogs from "./pages/AuditLogs";
import ViewTransactions from "./pages/ViewTransactions";
import ViewCustomers from "./pages/ViewCustomers";


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customer" element={<CustomerForm />} />
          <Route path="/account" element={<AccountForm />} />
          <Route path="/transaction" element={<TransactionForm />} />
          <Route path="/customers" element={<ViewAccounts/>} />
          <Route path="/accounts" element={<ViewCustomers />} />
          <Route path="/transactions" element={<ViewTransactions/>} />
          <Route path="/audit" element={<AuditLogs/>} />
        </Routes>
      </Layout>
    </Router>
  );
}


export default App;