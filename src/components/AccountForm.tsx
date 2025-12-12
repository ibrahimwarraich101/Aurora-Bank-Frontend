import React, { useState } from "react";
import { CreditCard, DollarSign, User, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addAccount } from "../services/api"; 

const AccountForm: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Account</h2>
          <p className="text-gray-600">Set up a new banking account for your customer</p>
        </div>

        {/* Success Message */}
        {showSuccess && createdAccountNo && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-green-800 font-medium">Account created successfully!</p>
            </div>
            <p className="text-green-700 text-center text-sm">
              Account Number: <span className="font-bold">{createdAccountNo}</span>
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Customer ID Field */}
          <div className="space-y-2">
            <label htmlFor="customerID" className="block text-sm font-semibold text-gray-700">
              Customer ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="customerID"
                type="number"
                placeholder="Enter customer ID"
                value={customerID}
                onChange={e => handleFieldChange('customerID', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none ${
                  errors.customerID 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {errors.customerID && (
              <p className="text-sm text-red-500 font-medium">* {errors.customerID}</p>
            )}
          </div>

          {/* Account Type Field */}
          <div className="space-y-2">
            <label htmlFor="accountType" className="block text-sm font-semibold text-gray-700">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="accountType"
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="Savings">Savings Account</option>
                <option value="Current">Current Account</option>
                <option value="Fixed">Fixed Deposit Account</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Initial Balance Field */}
          <div className="space-y-2">
            <label htmlFor="balance" className="block text-sm font-semibold text-gray-700">
              Initial Balance <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="balance"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={balance}
                onChange={e => handleFieldChange('balance', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none ${
                  errors.balance 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {errors.balance && (
              <p className="text-sm text-red-500 font-medium">* {errors.balance}</p>
            )}
            {!errors.balance && (
              <p className="text-xs text-gray-500 mt-1">Minimum balance: $0.00</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          All accounts are protected with bank-level security
        </p>
      </div>
    </div>
  );
};

export default AccountForm;