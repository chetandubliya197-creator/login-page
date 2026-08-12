import React, { useState, useContext, useEffect, useRef } from 'react';
import { Search, X, User, Building2, MessageSquareText } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const { students, societies, globalMessages, setActiveTab } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const lowerQuery = query.toLowerCase();

  const studentResults = query ? students.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) || 
    s.anonUsername.toLowerCase().includes(lowerQuery) ||
    s.interests.some(i => i.toLowerCase().includes(lowerQuery))
  ).slice(0, 3) : [];

  const societyResults = query ? societies.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) || 
    s.description.toLowerCase().includes(lowerQuery)
  ).slice(0, 2) : [];

  const messageResults = query ? globalMessages.filter(m => 
    m.text.toLowerCase().includes(lowerQuery)
  ).slice(0, 2) : [];

  const hasResults = studentResults.length > 0 || societyResults.length > 0 || messageResults.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={handleClose}></div>

      <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

        <div className="flex items-center px-6 py-4 border-b border-zinc-200 bg-white">
          <Search className="w-6 h-6 text-emerald-600 mr-4" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, societies, or messages..."
            className="flex-1 bg-transparent border-none text-zinc-900 font-medium focus:outline-none focus:ring-0 text-lg placeholder-zinc-400"
          />
          <button onClick={handleClose} className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {!query ? (
            <div className="py-16 text-center text-zinc-400 text-[15px] font-medium">
              Type to start searching your college network...
            </div>
          ) : !hasResults ? (
            <div className="py-16 text-center text-zinc-500 text-[15px] font-medium">
              No results found for <span className="text-zinc-900 font-bold">"{query}"</span>
            </div>
          ) : (
            <div className="space-y-6 p-4">

              {studentResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-3 px-3">Students</h3>
                  <div className="space-y-1">
                    {studentResults.map(s => (
                      <div key={s.id} onClick={() => { setActiveTab('discover'); handleClose(); }} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-50 cursor-pointer transition-colors border border-transparent hover:border-zinc-100">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-zinc-900">{s.connectionStatus === 'connected' ? s.name : s.anonUsername}</p>
                          <p className="text-[13px] font-medium text-zinc-500">{s.branch}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {societyResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-3 px-3">Societies</h3>
                  <div className="space-y-1">
                    {societyResults.map(s => (
                      <div key={s.id} onClick={() => { setActiveTab('societies'); handleClose(); }} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-50 cursor-pointer transition-colors border border-transparent hover:border-zinc-100">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-zinc-900">{s.name}</p>
                          <p className="text-[13px] font-medium text-zinc-500 truncate max-w-sm">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messageResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-3 px-3">Messages</h3>
                  <div className="space-y-1">
                    {messageResults.map(m => (
                      <div key={m.id} onClick={() => { setActiveTab('chat'); handleClose(); }} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-50 cursor-pointer transition-colors border border-transparent hover:border-zinc-100">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                          <MessageSquareText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-medium text-zinc-700 truncate">{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
