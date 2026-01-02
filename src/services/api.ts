import axios from "axios";

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

export interface AuditLog {
  LogID: number;
  Operation: string;
  TableAffected: string;
  RecordID: number | null;
  User: string;
  Details: string;
  UserAction: string;
  Status: string;
  DateTime: string;
}

// ================== CUSTOMER APIs ==================

export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const addCustomer = async (customer: Customer) => {
  try {
    const response = await axios.post(`${API_URL}/customers`, customer);
    return response.data;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

// ================== ACCOUNT APIs ==================

export const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/accounts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const addAccount = async (account: Account) => {
  try {
    const response = await axios.post(`${API_URL}/accounts`, account);
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

// ================== TRANSACTION APIs ==================

/**
 * Deposit money into an account
 * @param AccountNo - Account number to deposit into
 * @param Amount - Amount to deposit
 */
export const deposit = async (AccountNo: string, Amount: number) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/deposit`, {
      AccountNo,
      Amount
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Deposit failed");
    }
    throw new Error("Network error. Please check if backend is running.");
  }
};

/**
 * Withdraw money from an account
 * @param AccountNo - Account number to withdraw from
 * @param Amount - Amount to withdraw
 */
export const withdraw = async (AccountNo: string, Amount: number) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/withdraw`, {
      AccountNo,
      Amount
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Withdrawal failed");
    }
    throw new Error("Network error. Please check if backend is running.");
  }
};

/**
 * Transfer money between two accounts
 * @param transaction - Transaction details with FromAccount, ToAccount, Amount
 */
export const transfer = async (transaction: Transaction) => {
  try {
    const response = await axios.post(`${API_URL}/transactions/transfer`, transaction);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Transfer failed");
    }
    throw new Error("Network error. Please check if backend is running.");
  }
};

export const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// ================== AUDIT LOG APIs ==================

export const fetchAuditLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/auditlogs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
};

export const fetchAuditLogsByTable = async (tableName: string) => {
  try {
    const response = await axios.get(`${API_URL}/auditlogs/table/${tableName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching audit logs by table:", error);
    throw error;
  }
};