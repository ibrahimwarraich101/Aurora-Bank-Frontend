import React, { useState } from "react";
import { UserPlus, User, CreditCard, Phone} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../services/api";

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [cnic, setCnic] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name?: string; cnic?: string; contact?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; cnic?: string; contact?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!cnic.trim()) {
      newErrors.cnic = "CNIC number is required";
    } else if (cnic.replace(/\D/g, '').length !== 13) {
      newErrors.cnic = "CNIC must be 13 digits";
    }
    
    if (!contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (contact.replace(/\D/g, '').length !== 11) {
      newErrors.contact = "Contact must be 11 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addCustomer({ 
        Name: name, 
        CNIC: cnic, 
        Contact: contact 
      });
      
      setShowSuccess(true);
      setName("");
      setCnic("");
      setContact("");
      setErrors({});
      
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to add customer";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCNIC = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
  };

  const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNIC(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 13) {
      setCnic(formatted);
      if (errors.cnic) {
        setErrors(prev => ({ ...prev, cnic: undefined }));
      }
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 11)}`;
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 11) {
      setContact(formatted);
      if (errors.contact) {
        setErrors(prev => ({ ...prev, contact: undefined }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Customer</h2>
          <p className="text-gray-600">Register a new customer in the system</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in slide-in-from-top duration-300">
            <p className="text-emerald-800 text-center font-medium">
              ✓ Customer added successfully! Redirecting...
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name && e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, name: undefined }));
                  }
                }}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">* {errors.name}</p>}
          </div>

          {/* CNIC Field */}
          <div className="space-y-2">
            <label htmlFor="cnic" className="block text-sm font-semibold text-gray-700">
              CNIC Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="cnic"
                type="text"
                placeholder="XXXXX-XXXXXXX-X"
                value={cnic}
                onChange={handleCNICChange}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none ${
                  errors.cnic ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
            </div>
            {errors.cnic && <p className="text-xs text-red-500 mt-1">* {errors.cnic}</p>}
            {!errors.cnic && <p className="text-xs text-gray-500 mt-1">Format: 12345-1234567-1</p>}
          </div>

          {/* Contact Field */}
          <div className="space-y-2">
            <label htmlFor="contact" className="block text-sm font-semibold text-gray-700">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="contact"
                type="tel"
                placeholder="03XX-XXXXXXX"
                value={contact}
                onChange={handleContactChange}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none ${
                  errors.contact ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
            </div>
            {errors.contact && <p className="text-xs text-red-500 mt-1">* {errors.contact}</p>}
            {!errors.contact && <p className="text-xs text-gray-500 mt-1">Format: 0300-1234567</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Customer...
              </span>
            ) : (
              "Add Customer"
            )}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          All customer data is securely encrypted and protected
        </p>
      </div>
    </div>
  );
};

export default CustomerForm;