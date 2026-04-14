import React, { useState } from "react";
import { CreditCard, DollarSign, User, CheckCircle } from "lucide-react";
import { addAccount } from "../services/api"; 

const AccountForm: React.FC = () => {
  
  const [customerID, setCustomerID] = useState<string>("");
  const [type, setType] = useState<string>("Savings");
  const [balance, setBalance] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [createdAccountNo, setCreatedAccountNo] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ customerID?: string; balance?: string }>({});

  const validateForm = () => {
    const newErrors: { customerID?: string; balance?: string } = {};
    
    if (!customerID.trim()) {
      newErrors.customerID = "Customer ID is required";
    } else if (isNaN(Number(customerID)) || Number(customerID) <= 0) {
      newErrors.customerID = "Customer ID must be a positive number";
    }
    
    if (!balance.trim()) {
      newErrors.balance = "Initial balance is required";
    } else if (parseFloat(balance) < 0) {
      newErrors.balance = "Balance cannot be negative";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await addAccount({ 
        CustomerID: customerID, 
        Type: type, 
        Balance: parseFloat(balance) 
      });
      
      setCreatedAccountNo(response.AccountNo);
      setShowSuccess(true);
      setCustomerID("");
      setType("Savings");
      setBalance("");
      setErrors({});
      
      setTimeout(() => {
        setShowSuccess(false);
        setCreatedAccountNo(null);
      }, 5000);
    } catch (error) {
      console.error("Error creating account:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to create account";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: 'customerID' | 'balance', value: string) => {
    if (field === 'customerID') {
      setCustomerID(value);
      if (errors.customerID && value.trim()) {
        setErrors(prev => ({ ...prev, customerID: undefined }));
      }
    } else if (field === 'balance') {
      setBalance(value);
      if (errors.balance && value.trim() && parseFloat(value) >= 0) {
        setErrors(prev => ({ ...prev, balance: undefined }));
      }
    }
  };

  return (
<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Left Side Aesthetic Decor */}
        <div className="lg:w-5/12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
            <div className="absolute bottom-10 -right-10 w-72 h-72 rounded-full bg-purple-400 blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20 shadow-xl">
              <CreditCard className="w-8 h-8 text-blue-100" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">Open a New <br/>Account</h2>
            <p className="text-blue-100/90 text-lg leading-relaxed max-w-sm">
              Deploy secure, high-yield digital banking accounts for your customers instantly. Our automated system handles the rest.
            </p>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <h3 className="font-semibold text-xl mb-2 text-white">Bank-level Security</h3>
            <p className="text-blue-100/80 text-sm">All operations are AES-256 encrypted and strictly monitored under global financial compliance protocols.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:w-7/12 p-8 lg:p-14 bg-white relative">
          <div className="max-w-lg mx-auto">
            {/* Success Message */}
            {showSuccess && createdAccountNo && (
              <div className="mb-8 p-5 bg-green-50 border-2 border-green-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-1 rounded-full"><CheckCircle className="text-green-600" size={24} /></div>
                  <p className="text-green-800 font-bold text-lg">Account Initiated!</p>
                </div>
                <p className="text-green-700 text-sm pl-11">
                  Generated Account Number: <span className="font-bold text-base bg-green-100 px-2 py-1 rounded ml-1">{createdAccountNo}</span>
                </p>
              </div>
            )}

            <form className="space-y-7">
              {/* Customer ID Field */}
              <div className="space-y-2">
                <label htmlFor="customerID" className="block text-sm font-bold text-gray-700">
                  Customer ID <span className="text-blue-600">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="customerID"
                    type="number"
                    placeholder="Enter customer ID"
                    value={customerID}
                    onChange={e => handleFieldChange('customerID', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none transition-all ${
                      errors.customerID 
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" 
                        : "border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
                    }`}
                  />
                </div>
                {errors.customerID && (
                  <p className="text-sm text-red-500 font-semibold animate-in slide-in-from-top-1">* {errors.customerID}</p>
                )}
              </div>

              {/* Account Type Field */}
              <div className="space-y-2">
                <label htmlFor="accountType" className="block text-sm font-bold text-gray-700">
                  Account Type <span className="text-blue-600">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <CreditCard className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <select
                    id="accountType"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 focus:outline-none transition-all appearance-none cursor-pointer text-gray-800 font-medium relative"
                  >
                    <option value="Savings">Savings Account</option>
                    <option value="Current">Current Account</option>
                    <option value="Fixed">Fixed Deposit Account</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Initial Balance Field */}
              <div className="space-y-2">
                <label htmlFor="balance" className="block text-sm font-bold text-gray-700">
                  Initial Balance <span className="text-blue-600">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="balance"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={balance}
                    onChange={e => handleFieldChange('balance', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none transition-all font-medium text-gray-900 ${
                      errors.balance 
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" 
                        : "border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
                    }`}
                  />
                </div>
                {errors.balance ? (
                  <p className="text-sm text-red-500 font-semibold animate-in slide-in-from-top-1">* {errors.balance}</p>
                ) : (
                  <p className="text-xs text-gray-500 font-medium">Minimum initialization balance: Rs. 0.00</p>
                )}
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-600/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_16px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_20px_-6px_rgba(37,99,235,0.6)] transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Initializing Ledger...
                    </span>
                  ) : (
                    "Authorize Account Creation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;