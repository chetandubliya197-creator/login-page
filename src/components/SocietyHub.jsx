import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Pin } from 'lucide-react';

export default function SocietyHub() {
  const { societies, societyAnnouncements, toggleSocietyJoin } = useContext(AppContext);

  const joinedIds = societies.filter((s) => s.joined).map((s) => s.id);

  const visibleAnnouncements = societyAnnouncements
    .filter((a) => joinedIds.includes(a.societyId))
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const getSocietyName = (id) => societies.find((s) => s.id === id)?.name || 'Society';

  return (
    <div className="flex flex-col h-full bg-gray-950 md:pt-0 pt-[53px] overflow-y-auto pb-[60px] md:pb-0">

      <div className="px-6 py-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
        <h2 className="font-bold text-white text-lg">Society Hub</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          College clubs, departments & interest groups
        </p>
      </div>

      <div className="flex-1 p-6 space-y-8">

        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            All Societies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {societies.map((society) => (
              <div
                key={society.id}
                className={`rounded-2xl border p-5 bg-gray-900/60 backdrop-blur-sm flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                  ${society.joined ? 'border-red-500/30 shadow-red-500/5' : 'border-white/8'}`}
              >

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{society.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{society.description}</p>
                  </div>

                  <span className="flex-shrink-0 text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-400 border border-white/10">
                    {society.membersCount} members
                  </span>
                </div>

                <button
                  onClick={() => toggleSocietyJoin(society.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all duration-200
                    ${society.joined
                      ? 'bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30'
                      : 'bg-red-600/80 hover:bg-red-500 text-white border-transparent'
                    }`}
                >
                  {society.joined ? 'Leave Society' : 'Join Society'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Announcements · {joinedIds.length > 0 ? 'Your Societies' : 'Join a society to see updates'}
          </h3>

          {visibleAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600">
              <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <p className="text-sm">No announcements. Join a society to get updates.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`relative rounded-2xl border p-5 flex flex-col gap-2 transition-all
                    ${ann.isPinned 
                        ? 'border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-gray-900/40 shadow-lg shadow-orange-500/5' 
                        : 'border-white/8 bg-gray-900/40 hover:border-red-500/20'
                    }`}
                >

                  {ann.isPinned && (
                      <div className="absolute top-4 right-4 text-orange-400">
                          <Pin className="w-4 h-4 fill-current rotate-45" />
                      </div>
                  )}

                  <span className={`text-[10px] px-2 py-0.5 rounded-full w-fit ${ann.isPinned ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {getSocietyName(ann.societyId)}
                  </span>

                  <h4 className="font-semibold text-white text-sm pr-6">{ann.title}</h4>

                  <p className="text-xs text-gray-400 leading-relaxed">{ann.text}</p>

                  <span className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                      {ann.date}
                      {ann.isPinned && <span className="w-1 h-1 rounded-full bg-gray-600"></span>}
                      {ann.isPinned && <span>Pinned</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
