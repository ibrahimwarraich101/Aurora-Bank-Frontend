import { useEffect, useState } from "react";
import { UserCheck, Plus, Edit2, Power, Trash2, RefreshCw, X, Eye, EyeOff } from "lucide-react";
import { fetchEmployees, createEmployee, updateEmployee, toggleEmployeeActive, deleteEmployee } from "../../services/api";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: number;
  created_at: string;
  customer_count: number;
}

interface ModalState {
  type: "create" | "edit" | null;
  employee?: Employee;
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", phone: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<{show: boolean, message: string}>({ show: false, message: "" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchEmployees();
      setEmployees(res.data);
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ name: "", username: "", email: "", password: "", phone: "" });
    setError(null);
    setFormErrors({});
    setModal({ type: "create" });
  };

  const openEdit = (emp: Employee) => {
    setForm({ name: emp.name, username: "", email: emp.email, password: "", phone: emp.phone || "" });
    setError(null);
    setFormErrors({});
    setModal({ type: "edit", employee: emp });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setFormErrors({});
    
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Full Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    
    if (form.phone && !/^\+92\s\d{3}\s\d{7}$/.test(form.phone)) {
      errors.phone = "Format must be: +92 123 4567890";
    }

    if (modal.type === "create") {
      if (!form.username.trim()) errors.username = "Username is required";
      if (!form.password.trim()) errors.password = "Password is required";
      else if (form.password.length < 8) errors.password = "Minimum 8 characters required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSaving(false);
      return;
    }

    try {
      let res;
      if (modal.type === "create") {
        res = await createEmployee({ 
          name: form.name, 
          username: form.username,
          email: form.email, 
          password: form.password, 
          phone: form.phone 
        });
        setShowSuccessModal({ show: true, message: res?.message || `Employee created! A welcome email has been dispatched to ${form.email}.` });
      } else if (modal.type === "edit" && modal.employee) {
        await updateEmployee(modal.employee.id, { name: form.name, email: form.email, phone: form.phone });
        setShowSuccessModal({ show: true, message: `${form.name}'s profile has been updated. A security notification email is on its way.` });
      }
      setModal({ type: null });
      load();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to save";
      const isActualEmailError = msg.toLowerCase().includes("email") && !msg.includes("sendProfileUpdateEmail");
      
      setError(msg);
      if (isActualEmailError) setFormErrors(p => ({ ...p, email: msg }));
      if (msg.toLowerCase().includes("username")) setFormErrors(p => ({ ...p, username: msg }));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (emp: Employee) => {
    if (!confirm(`${emp.is_active ? "Deactivate" : "Activate"} ${emp.name}?`)) return;
    await toggleEmployeeActive(emp.id);
    load();
  };

  const handleDelete = async (emp: Employee) => {
    if (!confirm(`Permanently delete ${emp.name}? This cannot be undone.`)) return;
    await deleteEmployee(emp.id);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 relative rounded-2xl bg-gradient-to-tr from-violet-900 via-purple-900 to-indigo-900 p-6 overflow-hidden shadow-lg border border-violet-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white">
            <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl border border-white/20 overflow-hidden">
              <img src="/aurora.png" alt="Aurora Bank" className="w-8 h-8 object-contain brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Employee Management</h1>
              <p className="text-violet-100/80 text-sm mt-0.5">Create, manage, and control employee accounts.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white font-medium border border-white/10">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm bg-white rounded-lg hover:bg-white/90 transition-all text-violet-900 font-bold shadow-sm">
              <Plus className="w-4 h-4" /> New Employee
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-3" />
            <p className="text-sm">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <UserCheck className="mx-auto mb-3" size={40} />
            <p className="font-medium">No employees yet</p>
            <p className="text-sm mt-1">Click "New Employee" to create one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  {["Name", "Email", "Phone", "Customers", "Status", "Created", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900 text-sm">{emp.name}</td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{emp.email}</td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{emp.phone || "—"}</td>
                    <td className="px-5 py-4 text-sm">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">{emp.customer_count}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${emp.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {emp.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(emp.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleToggle(emp)} className={`p-1.5 rounded-lg transition-colors ${emp.is_active ? "hover:bg-red-50 text-red-500" : "hover:bg-green-50 text-green-600"}`} title={emp.is_active ? "Deactivate" : "Activate"}>
                          <Power size={15} />
                        </button>
                        <button onClick={() => handleDelete(emp)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Main Modal (Create/Edit) */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{modal.type === "create" ? "Create Employee" : "Edit Employee"}</h3>
              <button onClick={() => setModal({ type: null })} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mb-2">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2.5 border ${formErrors.name ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl text-sm focus:ring-2 focus:border-indigo-500 outline-none transition-all`}
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.name}</p>}
              </div>

              {modal.type === "create" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                    placeholder="johndoe123"
                    className={`w-full px-3 py-2.5 border ${formErrors.username ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl text-sm focus:ring-2 focus:border-indigo-500 outline-none transition-all`}
                  />
                  {formErrors.username && <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.username}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com"
                  className={`w-full px-3 py-2.5 border ${formErrors.email ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl text-sm focus:ring-2 focus:border-indigo-500 outline-none transition-all`}
                />
                {formErrors.email && <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => {
                    let val = e.target.value;
                    if (!val.startsWith("+92 ")) {
                      val = "+92 " + val.replace(/^\+92\s?/, "");
                    }
                    const digits = val.slice(4).replace(/\D/g, "");
                    let formatted = "+92 ";
                    if (digits.length > 0) formatted += digits.slice(0, 3);
                    if (digits.length > 3) formatted += " " + digits.slice(3, 10);
                    setForm(p => ({ ...p, phone: formatted }));
                  }}
                  onFocus={() => {
                    if (!form.phone) setForm(p => ({ ...p, phone: "+92 " }));
                  }}
                  placeholder="+92 300 1234567"
                  className={`w-full px-3 py-2.5 border ${formErrors.phone ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl text-sm focus:ring-2 focus:border-indigo-500 outline-none transition-all`}
                />
                {formErrors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.phone}</p>}
              </div>

              {modal.type === "create" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Minimum 8 characters"
                      className={`w-full pl-3 pr-10 py-2.5 border ${formErrors.password ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl text-sm focus:ring-2 focus:border-indigo-500 outline-none transition-all`}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formErrors.password && <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.password}</p>}
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setModal({ type: null })} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">
                {saving ? "Saving..." : (modal.type === "create" ? "Create Employee" : "Save Changes")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal — Aurora Bank Premium Theme */}
      {showSuccessModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(12px)'}}>
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl" style={{background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', border: '1px solid rgba(129,140,248,0.3)'}}>
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full" style={{background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none'}} />
            
            {/* Icon area */}
            <div className="relative pt-10 pb-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 40px rgba(99,102,241,0.6)'}}>
                <UserCheck size={44} className="text-white" />
              </div>
              {/* Decorative rings */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full" style={{border: '1px solid rgba(129,140,248,0.3)'}} />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full" style={{border: '1px solid rgba(129,140,248,0.15)'}} />
            </div>

            {/* Content */}
            <div className="relative px-8 pb-10 text-center">
              <h3 className="text-2xl font-bold text-white mb-3" style={{letterSpacing: '-0.5px'}}>Action Successful</h3>
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                {showSuccessModal.message}
              </p>
              <button
                onClick={() => setShowSuccessModal({ show: false, message: "" })}
                className="mt-8 w-full py-3.5 rounded-2xl font-bold text-white transition-all"
                style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 30px rgba(99,102,241,0.5)'}}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.5)')}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
