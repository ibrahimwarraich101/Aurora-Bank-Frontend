import axios from "axios";

const API_URL = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({ baseURL: API_URL });

// Auto-attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-redirect on 401/403
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export { getAuthHeaders };

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

// ================== CUSTOMER APIs ==================
export const fetchCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const addCustomer = async (customer: Customer) => {
  const res = await api.post("/customers", customer);
  return res.data;
};

export const deleteCustomerApi = async (id: number) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};

// ================== ACCOUNT APIs ==================
export const fetchAccounts = async () => {
  const res = await api.get("/accounts");
  return res.data;
};

export const fetchAccountsByCustomer = async (customerId: string) => {
  const res = await api.get(`/accounts/by-customer/${customerId}`);
  return res.data;
};

export const addAccount = async (account: Account) => {
  const res = await api.post("/accounts", account);
  return res.data;
};

export const deleteAccountApi = async (id: number) => {
  const res = await api.delete(`/accounts/${id}`);
  return res.data;
};

// ================== TRANSACTION APIs ==================
export const deposit = async (AccountNo: string, Amount: number) => {
  try {
    const res = await api.post("/accounts/deposit", { AccountNo, Amount });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Deposit failed");
    }
    throw new Error("Network error. Please check if backend is running.");
  }
};

export const withdraw = async (AccountNo: string, Amount: number) => {
  try {
    const res = await api.post("/accounts/withdraw", { AccountNo, Amount });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Withdrawal failed");
    }
    throw new Error("Network error. Please check if backend is running.");
  }
};

export const transfer = async (transaction: Transaction) => {
  try {
    const res = await api.post("/transactions/transfer", transaction);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Transfer failed");
    }
    throw new Error("Network error. Please check if backend is running.");
  }
};

export const fetchTransactions = async () => {
  const res = await api.get("/transactions");
  return res.data;
};

// ================== AUDIT LOG APIs ==================
export const fetchAuditLogs = async () => {
  const res = await api.get("/audit-logs");
  return res.data;
};

// ================== EMPLOYEE APIs (Admin only) ==================
export const fetchEmployees = async () => {
  const res = await api.get("/employees");
  return res.data;
};

export const createEmployee = async (data: { name: string; email: string; password: string; phone?: string }) => {
  const res = await api.post("/employees", data);
  return res.data;
};

export const updateEmployee = async (id: number, data: { name?: string; email?: string; phone?: string }) => {
  const res = await api.put(`/employees/${id}`, data);
  return res.data;
};

export const toggleEmployeeActive = async (id: number) => {
  const res = await api.patch(`/employees/${id}/toggle`);
  return res.data;
};

export const deleteEmployee = async (id: number) => {
  const res = await api.delete(`/employees/${id}`);
  return res.data;
};

// ================== ADMIN APIs ==================
export const fetchAdminReports = async () => {
  const res = await api.get("/admin/reports");
  return res.data;
};

export const fetchSystemSettings = async () => {
  const res = await api.get("/admin/system-settings");
  return res.data;
};

export const updateSystemSettings = async (settings: Record<string, string>) => {
  const res = await api.put("/admin/system-settings", settings);
  return res.data;
};

export default api;