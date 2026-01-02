import React, { useState, useEffect } from "react";
import { Shield, RefreshCw, Calendar, Database } from "lucide-react";
import axios from "axios";

interface AuditLog {
  LogID: number;
  Operation: string;
  TableAffected: string;
  User: string;
  DateTime: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/audit-logs");
      setLogs(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case "INSERT":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "COMMIT":
        return "bg-purple-100 text-purple-800";
      case "ROLLBACK":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLogs = filter === "All" 
    ? logs 
    : logs.filter(log => log.Operation === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-gray-700 to-slate-900 p-4 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Audit Logs</h1>
                <p className="text-gray-600">System operation tracking and security logs</p>
              </div>
            </div>
            <button
              onClick={fetchLogs}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 flex-wrap">
            {["All", "INSERT", "UPDATE", "DELETE", "COMMIT", "ROLLBACK"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  filter === type
                    ? "bg-gradient-to-r from-gray-700 to-slate-900 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:shadow-md"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Logs</p>
            <p className="text-3xl font-bold text-gray-800">{logs.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Inserts</p>
            <p className="text-3xl font-bold text-green-600">
              {logs.filter(l => l.Operation === "INSERT").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Deletes</p>
            <p className="text-3xl font-bold text-red-600">
              {logs.filter(l => l.Operation === "DELETE").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Commits</p>
            <p className="text-3xl font-bold text-purple-600">
              {logs.filter(l => l.Operation === "COMMIT").length}
            </p>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-700 to-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Log ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Operation</th>
                  <th className="px-6 py-4 text-left font-semibold">Table</th>
                  <th className="px-6 py-4 text-left font-semibold">User</th>
                  <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No audit logs found</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => (
                    <tr
                      key={log.LogID}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-gray-600">
                        #{log.LogID}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOperationColor(log.Operation)}`}>
                          {log.Operation}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{log.TableAffected}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {log.User}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(log.DateTime).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 text-center text-gray-600">
          <p className="font-medium">
            Showing {filteredLogs.length} of {logs.length} audit logs
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;