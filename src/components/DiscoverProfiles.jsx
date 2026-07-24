import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const STATUS_CONFIG = {
  not_connected: {
    label: 'Connect',
    style: 'bg-red-600/80 hover:bg-red-500 text-white border-transparent',
  },
  pending: {
    label: 'Pending…',
    style: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 cursor-default',
  },
  connected: {
    label: 'Connected ✓',
    style: 'bg-green-500/10 border-green-500/30 text-green-400',
  },
};

export default function DiscoverProfiles() {
  const { students, sendConnectRequest } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [activeInternalTab, setActiveInternalTab] = useState('discover'); 

  const branches = ['All', ...new Set(students.map((s) => s.branch))];

  const filteredStudents = students.filter((student) => {
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
    <div className="flex flex-col h-full bg-gray-950 md:pt-0 pt-[53px] pb-[60px] md:pb-0">

      <div className="px-6 pt-4 pb-2 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
        <h2 className="font-bold text-white text-lg">Discover Students</h2>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          Connect with batchmates · Real identity revealed only after connecting
        </p>

        <div className="flex items-center gap-4 border-b border-white/5">
            <button 
                onClick={() => setActiveInternalTab('discover')}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeInternalTab === 'discover' ? 'text-white border-red-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
                Discover Network
            </button>
            <button 
                onClick={() => setActiveInternalTab('connections')}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeInternalTab === 'connections' ? 'text-white border-red-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
                My Connections
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px]">{students.filter(s => s.connectionStatus === 'connected').length}</span>
            </button>
        </div>

        <div className="flex gap-3 mt-4">

          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or interest..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all"
            />
          </div>

          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="bg-gray-800/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all"
          >
            {branches.map((b) => (
              <option key={b} value={b} className="bg-gray-900">
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p className="text-sm">No students match your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => {
              const isConnected = student.connectionStatus === 'connected';
              const isPending = student.connectionStatus === 'pending';
              const statusCfg = STATUS_CONFIG[student.connectionStatus];

              return (
                <div
                  key={student.id}
                  className={`relative rounded-2xl border bg-gray-900/60 backdrop-blur-sm p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5
                    ${isConnected ? 'border-green-500/20 hover:shadow-green-500/5' : 'border-white/8 hover:shadow-red-500/5'}`}
                >

                  {isConnected && (
                    <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 border border-green-700/30">
                      Connected
                    </span>
                  )}
                  {isPending && (
                    <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-700/30">
                      Pending
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          isConnected
                            ? student.avatar
                            : `https://api.dicebear.com/7.x/bottts/svg?seed=${student.anonUsername}`
                        }
                        alt={isConnected ? student.name : student.anonUsername}
                        className={`w-14 h-14 rounded-full border-2 ${
                          isConnected ? 'border-green-500/40' : 'border-gray-600/40 opacity-80'
                        }`}
                      />

                      {!isConnected && (
                        <span className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full p-0.5 border border-gray-700">
                          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                          </svg>
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-white text-sm">
                        {isConnected ? student.name : student.anonUsername}
                      </p>
                      <p className="text-xs text-gray-500">{student.branch} · {student.year}</p>
                      {!isConnected && (
                        <p className="text-[10px] text-gray-600 mt-0.5">Real name hidden</p>
                      )}
                    </div>
                  </div>

                  {isConnected && student.bio && (
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{student.bio}</p>
                  )}

                  {isConnected && student.interests?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {student.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => sendConnectRequest(student.id)}
                    disabled={isPending}
                    className={`mt-auto w-full py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${statusCfg.style}`}
                  >
                    {statusCfg.label}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
