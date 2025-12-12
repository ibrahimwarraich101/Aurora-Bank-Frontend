const API_URL = "http://localhost:5000";

export interface Customer {
  Name: string;
  CNIC: string;
  Contact: string;
}

export interface Account {
  CustomerID: string;
  Type: string;
  Balance: number;
}

export interface Transaction {
  FromAccount?: string;
  ToAccount?: string;
  Amount: number;
  Type: "Deposit" | "Withdrawal" | "Transfer";
}

// ✅ Fetch all customers
export const fetchCustomers = async () => {
  const res = await fetch(`${API_URL}/customers`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
};

// ✅ Add new customer
export const addCustomer = async (customer: Customer) => {
  const res = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to add customer");
  }
  return res.json();
};

// ✅ Fetch all accounts
export const fetchAccounts = async () => {
  const res = await fetch(`${API_URL}/accounts`);
  if (!res.ok) throw new Error("Failed to fetch accounts");
  return res.json();
};

// ✅ Create new account
export const addAccount = async (account: Account) => {
  const res = await fetch(`${API_URL}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create account");
  }
  return res.json();
};

// ✅ Deposit money
export const deposit = async (AccountNo: string, Amount: number) => {
  const res = await fetch(`${API_URL}/accounts/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ AccountNo, Amount })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Deposit failed");
  }
  return res.json();
};

// ✅ Withdraw money
export const withdraw = async (AccountNo: string, Amount: number) => {
  const res = await fetch(`${API_URL}/accounts/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ AccountNo, Amount })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Withdrawal failed");
  }
  return res.json();
};

// ✅ Transfer money
export const transfer = async (transaction: Transaction) => {
  const res = await fetch(`${API_URL}/transactions/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Transfer failed");
  }
  return res.json();
};

// ✅ NEW: Fetch all transactions
export const fetchTransactions = async () => {
  const res = await fetch(`${API_URL}/transactions`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};

// ✅ NEW: Fetch all audit logs
export const fetchAuditLogs = async () => {
  const res = await fetch(`${API_URL}/auditlogs`);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
};

// ✅ NEW: Fetch audit logs by table
export const fetchAuditLogsByTable = async (tableName: string) => {
  const res = await fetch(`${API_URL}/auditlogs/table/${tableName}`);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
};