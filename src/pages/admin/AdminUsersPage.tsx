import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, User, Power, AlertCircle } from 'lucide-react';
import { User as UserType } from '../../types/index.js';
import { api } from '../../services/api.js';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { success, error: toastError } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getUsers(search || undefined);
      if (res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const toggleUserStatus = async (user: UserType) => {
    const nextStatus = Number(user.is_active) === 1 ? 0 : 1;
    setUpdatingId(user.id);
    try {
      const res = await api.admin.updateUserStatus(user.id, nextStatus);
      if (res.data) {
        success(`User ${user.name} has been ${nextStatus ? 'activated' : 'deactivated'}.`);
        loadUsers();
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to update user status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Registered Accounts
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              View customer profiles, monitor administrator privileges, and toggle account activation.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search users by name or email address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Member Since</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-400">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500">
                      No matching user accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map(u => {
                    const isActive = Number(u.is_active) === 1;
                    const isSelfAdmin = u.role === 'admin';

                    return (
                      <tr key={u.id} className="hover:bg-zinc-50/50 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-600 font-extrabold text-xs flex items-center justify-center">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-zinc-900 block">{u.name}</span>
                              <span className="text-[11px] text-zinc-400 block">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-zinc-100 text-zinc-700'
                            }`}
                          >
                            {u.role === 'admin' ? (
                              <Shield className="w-3 h-3 text-indigo-600" />
                            ) : (
                              <User className="w-3 h-3 text-zinc-400" />
                            )}
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => toggleUserStatus(u)}
                            disabled={updatingId === u.id}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] inline-flex items-center gap-1.5 transition ${
                              isActive
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
