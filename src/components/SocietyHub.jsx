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
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px] overflow-y-auto pb-[60px] md:pb-0">

      <div className="px-6 py-5 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h2 className="font-black text-zinc-950 text-2xl tracking-tight">Society Hub</h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">
          College clubs, departments & interest groups
        </p>
      </div>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-10">

        <section>
          <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-5">
            All Societies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {societies.map((society) => (
              <div
                key={society.id}
                className={`rounded-3xl border p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                  ${society.joined ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-white border-zinc-200 shadow-sm'}`}
              >

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-black text-zinc-950 text-lg tracking-tight">{society.name}</h4>
                    <p className="text-sm text-zinc-600 font-medium mt-1.5 leading-relaxed">{society.description}</p>
                  </div>

                  <span className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 whitespace-nowrap">
                    {society.membersCount} members
                  </span>
                </div>

                <button
                  onClick={() => toggleSocietyJoin(society.id)}
                  className={`mt-auto w-full py-3 rounded-xl text-sm font-bold border transition-all duration-300 shadow-sm
                    ${society.joined
                      ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-rose-600'
                      : 'bg-zinc-950 hover:bg-zinc-800 text-white border-transparent'
                    }`}
                >
                  {society.joined ? 'Leave Society' : 'Join Society'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-5">
            Announcements · {joinedIds.length > 0 ? 'Your Societies' : 'Join a society to see updates'}
          </h3>

          {visibleAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 bg-white rounded-3xl border border-zinc-200 border-dashed">
              <svg className="w-12 h-12 mb-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <p className="text-sm font-bold text-zinc-500">No announcements. Join a society to get updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {visibleAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`relative rounded-3xl border p-6 flex flex-col gap-3 transition-all hover:shadow-md
                    ${ann.isPinned 
                        ? 'border-amber-200 bg-amber-50 shadow-sm' 
                        : 'border-zinc-200 bg-white shadow-sm hover:border-zinc-300'
                    }`}
                >

                  {ann.isPinned && (
                      <div className="absolute top-5 right-5 text-amber-500">
                          <Pin className="w-5 h-5 fill-current rotate-45" />
                      </div>
                  )}

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full w-fit uppercase tracking-wider ${ann.isPinned ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    {getSocietyName(ann.societyId)}
                  </span>

                  <h4 className="font-black text-zinc-950 text-[17px] pr-8 tracking-tight">{ann.title}</h4>

                  <p className="text-sm text-zinc-600 font-medium leading-relaxed">{ann.text}</p>

                  <span className="text-[11px] font-bold text-zinc-400 mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                      {ann.date}
                      {ann.isPinned && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                      {ann.isPinned && <span className="text-amber-600">Pinned</span>}
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
