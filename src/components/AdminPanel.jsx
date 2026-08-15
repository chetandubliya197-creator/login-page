import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Search, Ban, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

export default function AdminPanel() {
  const { currentUser, fetchAdminUsers, toggleSuspendUserAdmin, createDummyAccount } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchAdminUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadUsers();
    }
  }, [currentUser]);

  const handleToggleSuspend = async (userId) => {
    const success = await toggleSuspendUserAdmin(userId);
    if (success) {
      setUsers(users.map(u => u._id === userId ? { ...u, isSuspended: !u.isSuspended } : u));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.collegeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <Shield className="w-16 h-16 mb-4 text-zinc-300" />
        <h2 className="text-xl font-bold text-zinc-700">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row gap-4 items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl hidden sm:block">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-zinc-950 text-xl tracking-tight">Admin Dashboard</h2>
            <p className="text-xs text-zinc-500 font-medium">Manage students & moderation</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={createDummyAccount}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
          >
            Test App as Dummy
          </button>
          <div className="px-3 py-2 bg-zinc-100 rounded-xl text-xs font-bold text-zinc-600 border border-zinc-200 whitespace-nowrap">
            {users.length} Users
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase font-bold border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">College ID</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Reports</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-zinc-500">Loading users...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-zinc-500">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-zinc-200 bg-white" />
                          <div>
                            <p className="font-bold text-zinc-900">{user.name}</p>
                            <p className="text-[10px] text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-700">{user.collegeId}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-zinc-100 text-zinc-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {user.reportCount > 0 ? (
                            <span className={`font-bold ${user.reportCount >= 3 ? 'text-rose-600' : 'text-amber-600'}`}>
                              {user.reportCount}
                            </span>
                          ) : (
                            <span className="text-zinc-400">0</span>
                          )}
                          {user.reportCount >= 3 && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          user.isSuspended ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {user.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleToggleSuspend(user._id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto ${
                              user.isSuspended 
                                ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                            }`}
                          >
                            {user.isSuspended ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Helper Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
          <MessageSquare className="w-5 h-5 flex-shrink-0 text-blue-600" />
          <p>
            <strong>Chat Moderation:</strong> To delete inappropriate messages, go to the <strong>Global Campus Chat</strong>. As an admin, you have the ability to click the 3-dot menu on any user's message and select "Delete".
          </p>
        </div>
      </div>
    </div>
  );
}
