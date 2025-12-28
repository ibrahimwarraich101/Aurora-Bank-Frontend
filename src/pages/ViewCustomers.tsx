import React, { useState, useEffect } from "react";
import { User, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCustomers } from "../services/api";
import { AxiosError } from "axios";

interface Customer {
  CustomerID: number;
  Name: string;
  CNIC: string;
  Contact: string;
  CreatedAt: string;
}

const ViewCustomers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCustomers();
      setCustomers(response.data || []);
    } catch (err: unknown) {
       const error = err as AxiosError;
      setError(error.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">All Customers</h1>
              <p className="text-gray-600 mt-1">View all registered customers in the system</p>
            </div>
          </div>
          
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading customers...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Customers</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Customers Table */}
        {!loading && !error && customers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">CNIC</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr
                      key={customer.CustomerID}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {customer.CustomerID}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{customer.Name}</td>
                      <td className="px-6 py-4 text-gray-700 font-mono">{customer.CNIC}</td>
                      <td className="px-6 py-4 text-gray-700">{customer.Contact}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {formatDate(customer.CreatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Count */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total Customers: <span className="font-semibold text-gray-800">{customers.length}</span>
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && customers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Customers Found</h3>
            <p className="text-gray-600 mb-6">Start by adding your first customer to the system</p>
            <button
              onClick={() => navigate("/customer")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Add Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCustomers;