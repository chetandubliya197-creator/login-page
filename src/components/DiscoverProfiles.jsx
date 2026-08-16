import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { MoreVertical, Flag, Ban } from 'lucide-react';

const STATUS_CONFIG = {
  not_connected: {
    label: 'Connect',
    style: 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm hover:shadow-md border-transparent',
  },
  pending: {
    label: 'Pending…',
    style: 'bg-amber-50 border-amber-200 text-amber-700 cursor-default shadow-sm font-bold',
  },
  connected: {
    label: 'Connected ✓',
    style: 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-sm',
  },
};

export default function DiscoverProfiles() {
  const { currentUser, students, sendConnectRequest, reportUser, blockUser, notifications, acceptConnectRequest, rejectConnectRequest } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [activeInternalTab, setActiveInternalTab] = useState('discover'); 
  const [activeMenu, setActiveMenu] = useState(null);

  const visibleStudents = students.filter(s => 
    !currentUser.blockedUsers?.includes(s.id) && 
    !s.isSuspended &&
    s.id !== currentUser.id // don't show self
  );

  const branches = ['All', ...new Set(visibleStudents.map((s) => s.branch))];

  const filteredStudents = visibleStudents.filter((student) => {
    const query = searchQuery.toLowerCase();
    const isConnected = student.connectionStatus === 'connected';

    if (activeInternalTab === 'connections' && !isConnected) return false;

    const matchesSearch =
      query === '' ||
      student.anonUsername.toLowerCase().includes(query) ||
      (isConnected &&
        (student.name.toLowerCase().includes(query) ||
          student.interests.some((i) => i.toLowerCase().includes(query))));

    const matchesBranch = filterBranch === 'All' || student.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px] pb-[60px] md:pb-0" onClick={() => setActiveMenu(null)}>

      {/* Header Area */}
      <div className="px-6 pt-6 pb-0 border-b border-zinc-200 bg-white flex-shrink-0 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h2 className="font-black text-zinc-950 text-2xl tracking-tight">Discover Students</h2>
        <p className="text-sm text-zinc-500 font-medium mt-1 mb-6">
          Connect with batchmates · Real identity revealed only after connecting
        </p>

        <div className="flex items-center gap-6 border-b border-zinc-100">
            <button 
                onClick={() => setActiveInternalTab('discover')}
                className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeInternalTab === 'discover' ? 'text-zinc-950 border-emerald-600' : 'text-zinc-500 border-transparent hover:text-zinc-800'}`}
            >
                Discover Network
            </button>
            <button 
                onClick={() => setActiveInternalTab('connections')}
                className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeInternalTab === 'connections' ? 'text-zinc-950 border-emerald-600' : 'text-zinc-500 border-transparent hover:text-zinc-800'}`}
            >
                My Connections
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] border border-zinc-200">
                    {visibleStudents.filter(s => s.connectionStatus === 'connected').length}
                </span>
            </button>
        </div>

        <div className="flex gap-3 py-4 bg-white">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or interest..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-10 pr-4 py-2.5 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
            />
          </div>

          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="bg-white border border-zinc-200 rounded-full px-4 py-2.5 text-sm font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b} value={b} className="bg-white text-zinc-900 font-medium">
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <svg className="w-12 h-12 mb-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p className="text-sm font-bold text-zinc-500">No students match your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((student) => {
              const hasReceivedRequest = notifications?.some(n => 
                (n.type === 'connection_request' || (n.message && n.message.toLowerCase().includes('request'))) && 
                (
                  n.senderId === student.id || 
                  n.relatedUserId === student.id || 
                  n.userId === student.id || 
                  n.fromUserId === student.id ||
                  (n.message && student.name && n.message.includes(student.name)) ||
                  (n.message && student.anonUsername && n.message.includes(student.anonUsername))
                )
              );
              const isConnected = student.connectionStatus === 'connected';
              const isPending = student.connectionStatus === 'pending' && !hasReceivedRequest;
              const statusCfg = STATUS_CONFIG[hasReceivedRequest ? 'not_connected' : student.connectionStatus];
              const isMenuOpen = activeMenu === student.id;

              return (
                <div
                  key={student.id}
                  className={`relative rounded-3xl border bg-white p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl
                    ${isConnected ? 'border-emerald-200' : 'border-zinc-200'}`}
                >

                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {isConnected && (
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider shadow-sm">
                        Connected
                      </span>
                    )}
                    {isPending && (
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold uppercase tracking-wider shadow-sm">
                        Pending
                      </span>
                    )}
                    
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(isMenuOpen ? null : student.id); }}
                        className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                          <button 
                            onClick={(e) => { e.stopPropagation(); reportUser(student.id); setActiveMenu(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Flag className="w-3.5 h-3.5" />
                            Report User
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); blockUser(student.id); setActiveMenu(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Block User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="relative">
                      <img
                        src={
                          isConnected
                            ? student.avatar
                            : `https://api.dicebear.com/7.x/bottts/svg?seed=${student.anonUsername}`
                        }
                        alt={isConnected ? student.name : student.anonUsername}
                        className={`w-16 h-16 rounded-2xl border-2 shadow-sm ${
                          isConnected ? 'border-emerald-200 bg-emerald-50' : 'border-zinc-200 bg-zinc-50'
                        }`}
                      />

                      {isConnected && student.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></span>
                      )}

                      {!isConnected && (
                        <span className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-1 border border-zinc-200 shadow-sm">
                          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                          </svg>
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-black text-zinc-950 text-lg tracking-tight pr-6">
                        {isConnected ? student.name : student.anonUsername}
                      </p>
                      <p className="text-[13px] font-bold text-zinc-500 mt-0.5">{student.branch} · {student.year}</p>
                      {!isConnected && (
                        <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-wider">Real name hidden</p>
                      )}
                    </div>
                  </div>

                  {isConnected && student.bio && (
                    <p className="text-sm text-zinc-600 font-medium leading-relaxed line-clamp-2 mt-1">{student.bio}</p>
                  )}

                  {isConnected && student.interests?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {student.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}

                  {hasReceivedRequest ? (
                    <div className="mt-auto flex items-center gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); acceptConnectRequest(student.id); }}
                            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[13px] font-bold transition-all duration-300 shadow-sm"
                        >
                            Accept
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); rejectConnectRequest(student.id); }}
                            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[13px] font-bold transition-all duration-300 shadow-sm"
                        >
                            Reject
                        </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => sendConnectRequest(student.id)}
                      disabled={isPending}
                      className={`mt-auto w-full py-3 rounded-xl text-[13px] font-bold border transition-all duration-300 ${statusCfg.style}`}
                    >
                      {statusCfg.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
