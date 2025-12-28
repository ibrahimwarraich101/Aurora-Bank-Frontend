import React, { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, DollarSign, Lock } from "lucide-react";
import { deposit, withdraw, transfer } from "../services/api";
import { AxiosError } from "axios";

const TransactionForm: React.FC = () => {
  const [fromAccount, setFromAccount] = useState<string>("");
  const [toAccount, setToAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"Deposit" | "Withdrawal" | "Transfer">("Deposit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async () => {
    setErrorMessage("");
    
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }
    
    if (type === "Deposit" && !toAccount) {
      setErrorMessage("Please enter the account number for deposit");
      return;
    }
    if (type === "Withdrawal" && !fromAccount) {
      setErrorMessage("Please enter the account number for withdrawal");
      return;
    }
    if (type === "Transfer" && (!fromAccount || !toAccount)) {
      setErrorMessage("Please enter both sender and receiver account numbers");
      return;
    }
    if (type === "Transfer" && fromAccount === toAccount) {
      setErrorMessage("Cannot transfer to the same account");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (type === "Deposit") {
        await deposit(toAccount, parseFloat(amount));
      } else if (type === "Withdrawal") {
        await withdraw(fromAccount, parseFloat(amount));
      } else if (type === "Transfer") {
        await transfer({ 
          FromAccount: fromAccount, 
          ToAccount: toAccount, 
          Amount: parseFloat(amount), 
          Type: type 
        });
      }
      
      setShowSuccess(true);
      setFromAccount(""); 
      setToAccount(""); 
      setAmount(""); 
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as AxiosError;
      setErrorMessage(error.message || "Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTransactionConfig = () => {
    switch (type) {
      case "Deposit":
        return {
          icon: <ArrowDownCircle className="w-8 h-8 text-white" />,
          gradient: "from-green-500 to-emerald-600",
          focusRing: "focus:ring-green-500",
          bgLight: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800"
        };
      case "Withdrawal":
        return {
          icon: <ArrowUpCircle className="w-8 h-8 text-white" />,
          gradient: "from-orange-500 to-red-600",
          focusRing: "focus:ring-orange-500",
          bgLight: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-800"
        };
      case "Transfer":
        return {
          icon: <ArrowRightLeft className="w-8 h-8 text-white" />,
          gradient: "from-blue-500 to-indigo-600",
          focusRing: "focus:ring-blue-500",
          bgLight: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800"
        };
    }
  };

  const config = getTransactionConfig();
  const needsFromAccount = type === "Withdrawal" || type === "Transfer";
  const needsToAccount = type === "Deposit" || type === "Transfer";

  return (
    // Find and replace the outer div`
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
      
        {/* Header with dynamic icon */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl mb-4 shadow-lg transform transition-all duration-300`}>
            {config.icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">New Transaction</h2>
          <p className="text-gray-600">Complete your {type.toLowerCase()} transaction</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className={`mb-6 p-4 ${config.bgLight} border ${config.borderColor} rounded-xl animate-in fade-in slide-in-from-top duration-300`}>
            <p className={`${config.textColor} text-center font-medium`}>
              ✓ Transaction completed successfully!
            </p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top duration-300">
            <p className="text-red-800 text-center font-medium">
              ✗ {errorMessage}
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Transaction Type Selector */}
          <div className="space-y-2">
            <label htmlFor="transactionType" className="block text-sm font-semibold text-gray-700">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType("Deposit");
                  setErrorMessage("");
                }}
                className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  type === "Deposit"
                    ? "bg-white text-green-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ArrowDownCircle className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Deposit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("Withdrawal");
                  setErrorMessage("");
                }}
                className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  type === "Withdrawal"
                    ? "bg-white text-orange-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ArrowUpCircle className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Withdraw</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("Transfer");
                  setErrorMessage("");
                }}
                className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  type === "Transfer"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ArrowRightLeft className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Transfer</span>
              </button>
            </div>
          </div>

          {/* From Account */}
          {needsFromAccount && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top duration-300">
              <label htmlFor="fromAccount" className="block text-sm font-semibold text-gray-700">
                From Account {type === "Transfer" && <span className="text-red-500">*</span>}
              </label>
              <input
                id="fromAccount"
                type="text"
                placeholder="Enter source account number"
                value={fromAccount}
                onChange={e => {
                  setFromAccount(e.target.value);
                  setErrorMessage("");
                }}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl ${config.focusRing} focus:ring-2 focus:border-transparent transition-all outline-none`}
              />
            </div>
          )}

          {/* To Account */}
          {needsToAccount && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top duration-300">
              <label htmlFor="toAccount" className="block text-sm font-semibold text-gray-700">
                To Account {type === "Transfer" && <span className="text-red-500">*</span>}
              </label>
              <input
                id="toAccount"
                type="text"
                placeholder="Enter destination account number"
                value={toAccount}
                onChange={e => {
                  setToAccount(e.target.value);
                  setErrorMessage("");
                }}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl ${config.focusRing} focus:ring-2 focus:border-transparent transition-all outline-none`}
              />
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  setErrorMessage("");
                }}
                className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl ${config.focusRing} focus:ring-2 focus:border-transparent transition-all outline-none text-lg font-semibold`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !amount}
            className={`w-full bg-gradient-to-r ${config.gradient} text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 focus:outline-none focus:ring-4 ${config.focusRing} focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Transaction...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Complete {type}
                {type === "Deposit" && <ArrowDownCircle className="w-5 h-5" />}
                {type === "Withdrawal" && <ArrowUpCircle className="w-5 h-5" />}
                {type === "Transfer" && <ArrowRightLeft className="w-5 h-5" />}
              </span>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <p>All transactions are secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;