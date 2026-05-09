import React, { useState } from "react";
import { User, CreditCard, Phone, CheckCircle } from "lucide-react";
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
<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Left Side Aesthetic Decor */}
        <div className="lg:w-5/12 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-emerald-400 blur-3xl"></div>
            <div className="absolute bottom-10 -right-10 w-72 h-72 rounded-full bg-cyan-400 blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20 shadow-xl">
              <img src="/aurora.png" alt="Aurora Bank" className="w-10 h-10 object-contain brightness-0 invert" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">Register <br/>Customer</h2>
            <p className="text-emerald-100/90 text-lg leading-relaxed max-w-sm">
              Securely onboard new clients into the financial ecosystem.
            </p>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <h3 className="font-semibold text-xl mb-2 text-white">KYC Compliance</h3>
            <p className="text-emerald-100/80 text-sm">All entries are cross-verified automatically conforming strictly to Know Your Customer guidelines.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:w-7/12 p-8 lg:p-14 bg-white relative">
          <div className="max-w-lg mx-auto">
            
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-8 p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full"><CheckCircle className="text-emerald-600" size={24} /></div>
                  <p className="text-emerald-800 font-bold text-lg">Customer onboarded successfully!</p>
                </div>
              </div>
            )}

            <form className="space-y-7">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                  Full Name <span className="text-emerald-600">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
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
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none transition-all ${
                      errors.name ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" : "border-gray-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500 font-semibold animate-in slide-in-from-top-1">* {errors.name}</p>}
              </div>

              {/* CNIC Field */}
              <div className="space-y-2">
                <label htmlFor="cnic" className="block text-sm font-bold text-gray-700">
                  CNIC Number <span className="text-emerald-600">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    id="cnic"
                    type="text"
                    placeholder="XXXXX-XXXXXXX-X"
                    value={cnic}
                    onChange={handleCNICChange}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none transition-all font-medium tracking-wide ${
                      errors.cnic ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" : "border-gray-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20"
                    }`}
                  />
                </div>
                {errors.cnic ? (
                  <p className="text-sm text-red-500 font-semibold animate-in slide-in-from-top-1">* {errors.cnic}</p>
                ) : (
                  <p className="text-xs text-gray-500 font-medium">Format: 12345-1234567-1</p>
                )}
              </div>

              {/* Contact Field */}
              <div className="space-y-2">
                <label htmlFor="contact" className="block text-sm font-bold text-gray-700">
                  Contact Number <span className="text-emerald-600">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    id="contact"
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={contact}
                    onChange={handleContactChange}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none transition-all font-medium ${
                      errors.contact ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" : "border-gray-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20"
                    }`}
                  />
                </div>
                {errors.contact ? (
                  <p className="text-sm text-red-500 font-semibold animate-in slide-in-from-top-1">* {errors.contact}</p>
                ) : (
                  <p className="text-xs text-gray-500 font-medium">Format: 0300-1234567</p>
                )}
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_16px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_20px_-6px_rgba(16,185,129,0.6)] transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying Record...
                    </span>
                  ) : (
                    "Authorize Registration"
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

export default CustomerForm;