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
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={handleClose}></div>

      <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-gray-900/50">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, societies, or messages..."
            className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 text-lg placeholder-gray-500"
          />
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {!query ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              Type to start searching your college network...
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-4 p-2">

              {studentResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Students</h3>
                  <div className="space-y-1">
                    {studentResults.map(s => (
                      <div key={s.id} onClick={() => { setActiveTab('discover'); handleClose(); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{s.connectionStatus === 'connected' ? s.name : s.anonUsername}</p>
                          <p className="text-[10px] text-gray-500">{s.branch}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {societyResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Societies</h3>
                  <div className="space-y-1">
                    {societyResults.map(s => (
                      <div key={s.id} onClick={() => { setActiveTab('societies'); handleClose(); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center text-red-500">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{s.name}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-sm">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messageResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Messages</h3>
                  <div className="space-y-1">
                    {messageResults.map(m => (
                      <div key={m.id} onClick={() => { setActiveTab('chat'); handleClose(); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-500">
                          <MessageSquareText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300 truncate">{m.text}</p>
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
