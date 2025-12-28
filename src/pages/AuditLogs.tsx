import React, { useState, useEffect } from "react";
import { Shield, Loader2, AlertCircle, Filter } from "lucide-react";
import { fetchAuditLogs, fetchAuditLogsByTable } from "../services/api";
import { AxiosError } from "axios";

interface AuditLog {
  LogID: number;
  Operation: string;
  TableAffected: string;
  RecordID: number | null;
  User: string;
  Details: string | null;
  DateTime: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTable, setFilterTable] = useState<string>("all");

  useEffect(() => {
    loadLogs();
  }, [filterTable]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (filterTable === "all") {
        response = await fetchAuditLogs();
      } else {
        response = await fetchAuditLogsByTable(filterTable);
      }
      setLogs(response.data || []);
    } catch (err: unknown) {
       const error = err as AxiosError;
      setError(error.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getOperationColor = (operation: string) => {
    switch (operation.toUpperCase()) {
      case 'INSERT': return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      case 'COMMIT': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ROLLBACK': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SAVEPOINT': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTableColor = (table: string) => {
    switch (table) {
      case 'Customer': return 'bg-blue-50 text-blue-700';
      case 'Account': return 'bg-green-50 text-green-700';
      case 'Transaction': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 p-4 rounded-2xl shadow-lg">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Audit Logs</h1>
              <p className="text-gray-600 mt-1">Complete system operation history and TCL tracking</p>
            </div>
          </div>
         
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center gap-4">
          <Filter className="text-gray-600" size={20} />
          <span className="font-semibold text-gray-700">Filter by Table:</span>
          <div className="flex gap-2">
            {['all', 'Customer', 'Account', 'Transaction'].map((table) => (
              <button
                key={table}
                onClick={() => setFilterTable(table)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterTable === table
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {table === 'all' ? 'All Tables' : table}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading audit logs...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Audit Logs</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Audit Logs Table */}
        {!loading && !error && logs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Log ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Operation</th>
                    <th className="px-6 py-4 text-left font-semibold">Table</th>
                    <th className="px-6 py-4 text-left font-semibold">Record ID</th>
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Details</th>
                    <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr
                      key={log.LogID}
                      className={`border-b border-gray-100 hover:bg-orange-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        #{log.LogID}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getOperationColor(log.Operation)}`}>
                          {log.Operation}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getTableColor(log.TableAffected)}`}>
                          {log.TableAffected}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono">
                        {log.RecordID || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {log.User}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm max-w-md truncate" title={log.Details || ''}>
                        {log.Details || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {formatDateTime(log.DateTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Total Logs: <span className="font-semibold text-gray-800">{logs.length}</span>
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">
                    Commits: <span className="font-semibold text-green-600">
                      {logs.filter(l => l.Operation === 'COMMIT').length}
                    </span>
                  </span>
                  <span className="text-gray-600">
                    Rollbacks: <span className="font-semibold text-orange-600">
                      {logs.filter(l => l.Operation === 'ROLLBACK').length}
                    </span>
                  </span>
                  <span className="text-gray-600">
                    Savepoints: <span className="font-semibold text-purple-600">
                      {logs.filter(l => l.Operation === 'SAVEPOINT').length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && logs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Audit Logs Found</h3>
            <p className="text-gray-600 mb-6">
              {filterTable === 'all' 
                ? 'No operations have been logged yet' 
                : `No operations logged for ${filterTable} table`}
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Shield size={20} />
            About Audit Logs
          </h3>
          <p className="text-blue-700 text-sm">
            Audit logs track all database operations including COMMIT, ROLLBACK, and SAVEPOINT transactions. 
            This ensures complete traceability of all system changes for security, compliance, and debugging purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;