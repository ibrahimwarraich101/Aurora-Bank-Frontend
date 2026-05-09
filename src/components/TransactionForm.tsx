import React, { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, DollarSign, Lock } from "lucide-react";
import { deposit, withdraw, transfer } from "../services/api";


const TransactionForm: React.FC = () => {
  const [fromAccount, setFromAccount] = useState<string>("");
  const [toAccount, setToAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"Deposit" | "Withdrawal" | "Transfer">("Deposit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; fromAccount?: string; toAccount?: string }>({});

  const handleSubmit = async () => {
    setErrors({});
    const newErrors: { amount?: string; fromAccount?: string; toAccount?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (type === "Deposit" && !toAccount) {
      newErrors.toAccount = "Destination account is required";
    }
    if (type === "Withdrawal" && !fromAccount) {
      newErrors.fromAccount = "Source account is required";
    }
    if (type === "Transfer") {
      if (!fromAccount) newErrors.fromAccount = "Source account is required";
      if (!toAccount) newErrors.toAccount = "Destination account is required";
      if (fromAccount && toAccount && fromAccount === toAccount) {
        newErrors.toAccount = "Cannot transfer to the same account";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Transaction failed";
      if (msg.toLowerCase().includes("balance")) setErrors({ amount: msg });
      else if (msg.toLowerCase().includes("account")) setErrors({ toAccount: msg });
      else setErrors({ amount: msg });
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
      
        {/* Left Side Aesthetic Decor */}
        <div className="lg:w-5/12 bg-gradient-to-br from-indigo-800 via-purple-700 to-fuchsia-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-400 blur-3xl"></div>
            <div className="absolute bottom-10 -right-10 w-72 h-72 rounded-full bg-pink-400 blur-3xl"></div>
          </div>
          
          <div className="relative z-10 transition-all duration-500">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20 shadow-xl">
              <img src="/aurora.png" alt="Aurora Bank" className="w-10 h-10 object-contain brightness-0 invert" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Execute <br/>Transaction
            </h2>
            <p className="text-indigo-100/90 text-lg leading-relaxed max-w-sm">
              Process secure multi-currency transfers, clearings, and ledger modifications instantaneously within our compliance network.
            </p>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <h3 className="font-semibold text-xl mb-2 text-white">Encrypted Pipeline</h3>
            <div className="flex items-center gap-2 text-indigo-100/80 text-sm">
               <Lock size={16} />
               <p>All transactions are AES-256 encrypted.</p>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:w-7/12 p-8 lg:p-14 bg-white relative">
          <div className="max-w-lg mx-auto">
        
            {/* Header info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">New {type}</h2>
              <p className="text-gray-500 font-medium tracking-wide">Complete your {type.toLowerCase()} authorization</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className={`mb-6 p-4 ${config.bgLight} border-2 ${config.borderColor} rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm`}>
                <p className={`${config.textColor} text-center font-bold text-lg flex items-center justify-center gap-2`}>
                  ✓ Transaction Authorized
                </p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-7">
              {/* Transaction Type Selector */}
              <div className="space-y-2">
                <label htmlFor="transactionType" className="block text-sm font-bold text-gray-700">
                  Transaction Type
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setType("Deposit");
                      setErrors({});
                    }}
                    className={`py-3 px-2 rounded-xl font-bold transition-all duration-300 transform ${
                      type === "Deposit"
                        ? "bg-white text-green-600 shadow-md scale-100"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 scale-95"
                    }`}
                  >
                    <ArrowDownCircle className={`w-5 h-5 mx-auto mb-1 ${type === 'Deposit' ? 'animate-bounce' : ''}`} />
                    <span className="text-xs">Deposit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType("Withdrawal");
                      setErrors({});
                    }}
                    className={`py-3 px-2 rounded-xl font-bold transition-all duration-300 transform ${
                      type === "Withdrawal"
                        ? "bg-white text-orange-600 shadow-md scale-100"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 scale-95"
                    }`}
                  >
                    <ArrowUpCircle className={`w-5 h-5 mx-auto mb-1 flex-shrink-0 ${type === 'Withdrawal' ? 'animate-bounce' : ''}`} />
                    <span className="text-xs px-1 text-center block w-full truncate">Withdraw</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType("Transfer");
                      setErrors({});
                    }}
                    className={`py-3 px-2 rounded-xl font-bold transition-all duration-300 transform ${
                      type === "Transfer"
                        ? "bg-white text-blue-600 shadow-md scale-100"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 scale-95"
                    }`}
                  >
                    <ArrowRightLeft className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Transfer</span>
                  </button>
                </div>
              </div>

              {/* From Account */}
              {needsFromAccount && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label htmlFor="fromAccount" className="block text-sm font-bold text-gray-700">
                    Source Account {type === "Transfer" && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id="fromAccount"
                    type="text"
                    placeholder="Enter source account number"
                    value={fromAccount}
                    onChange={e => {
                      setFromAccount(e.target.value);
                      setErrors(p => ({ ...p, fromAccount: undefined }));
                    }}
                    className={`w-full px-5 py-3.5 border-2 ${errors.fromAccount ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-opacity-20'} rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white ${config.focusRing} focus:border-transparent focus:ring-4 transition-all font-medium text-gray-900 outline-none`}
                  />
                  {errors.fromAccount && <p className="mt-1 text-xs text-red-500 font-semibold">* {errors.fromAccount}</p>}
                </div>
              )}

              {/* To Account */}
              {needsToAccount && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label htmlFor="toAccount" className="block text-sm font-bold text-gray-700">
                    Destination Account {type === "Transfer" && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id="toAccount"
                    type="text"
                    placeholder="Enter destination account number"
                    value={toAccount}
                    onChange={e => {
                      setToAccount(e.target.value);
                      setErrors(p => ({ ...p, toAccount: undefined }));
                    }}
                    className={`w-full px-5 py-3.5 border-2 ${errors.toAccount ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-opacity-20'} rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white ${config.focusRing} focus:border-transparent focus:ring-4 transition-all font-medium text-gray-900 outline-none`}
                  />
                  {errors.toAccount && <p className="mt-1 text-xs text-red-500 font-semibold">* {errors.toAccount}</p>}
                </div>
              )}

              {/* Amount */}
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-bold text-gray-700">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className={`h-6 w-6 text-gray-400 group-focus-within:${config.textColor} transition-colors`} />
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
                      setErrors(p => ({ ...p, amount: undefined }));
                    }}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 ${errors.amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-opacity-20'} rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white ${config.focusRing} focus:border-transparent focus:ring-4 transition-all text-xl font-bold text-gray-900 outline-none tracking-wider`}
                  />
                  {errors.amount && <p className="mt-1 text-xs text-red-500 font-semibold">* {errors.amount}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !amount}
                  className={`w-full bg-gradient-to-r ${config.gradient} text-white font-bold py-4 px-6 rounded-2xl hover:opacity-90 focus:outline-none focus:ring-4 ${config.focusRing} focus:ring-opacity-30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating Node...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                       PROCESS {type.toUpperCase()}
                      {type === "Deposit" && <ArrowDownCircle className="w-5 h-5 ml-1" />}
                      {type === "Withdrawal" && <ArrowUpCircle className="w-5 h-5 ml-1" />}
                      {type === "Transfer" && <ArrowRightLeft className="w-5 h-5 ml-1" />}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;