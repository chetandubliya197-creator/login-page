import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageSquareText, Search, Bell, LogOut, Settings as SettingsIcon } from 'lucide-react';

const NAV_ITEMS = [
  {
    id: 'chat',
    label: 'Global Chat',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <MessageSquareText className="w-5 h-5" />,
  },
  {
    id: 'discover',
    label: 'Discover',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'societies',
    label: 'Societies',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function Sidebar({ onLogout }) {
  const { currentUser, activeTab, setActiveTab, notifications, markNotificationsAsRead, unreadPrivateCount } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
      setShowNotifications(!showNotifications);
      if (!showNotifications && unreadCount > 0) {
          markNotificationsAsRead();
      }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200 w-full fixed top-0 left-0 z-50">
        <span className="text-lg font-black tracking-tight text-zinc-950">
          Campus<span className="text-emerald-600">Pulse</span>
        </span>
        <div className="flex items-center gap-4">
            <button className="text-zinc-500 hover:text-zinc-900 transition-colors" onClick={() => setActiveTab('search')}>
                <Search className="w-5 h-5" />
            </button>
            <div className="relative">
                <button className="text-zinc-500 hover:text-zinc-900 transition-colors" onClick={handleNotificationClick}>
                    <Bell className="w-5 h-5" />
                </button>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border border-white"></span>
                )}
            </div>

            <button className="text-zinc-500 hover:text-zinc-900 transition-colors" onClick={() => setActiveTab('settings')}>
                <SettingsIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg z-50 border-t border-zinc-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <nav className="flex items-center justify-around p-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 flex-1
                  ${activeTab === item.id
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                  }`}
              >
                <span className={`relative transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : ''}`}>
                  {item.icon}
                  {item.id === 'messages' && unreadPrivateCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
                  )}
                </span>
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </button>
            ))}
          </nav>
      </div>

      {/* Mobile Notifications Dropdown */}
      {showNotifications && (
          <div className="md:hidden fixed top-[53px] right-0 w-full sm:w-80 bg-white border-b sm:border border-zinc-200 shadow-xl z-40 max-h-80 overflow-y-auto">
              <div className="p-3 border-b border-zinc-100 font-bold text-sm text-zinc-950">Notifications</div>
              {notifications.length === 0 ? (
                  <div className="p-4 text-xs text-zinc-500 text-center font-medium">No notifications</div>
              ) : (
                  notifications.map(n => (
                      <div key={n.id} className="p-3 border-b border-zinc-100 last:border-0 flex flex-col gap-1 hover:bg-zinc-50">
                          <span className="text-sm font-medium text-zinc-800">{n.message}</span>
                          <span className="text-[10px] text-zinc-500 font-medium">{n.time}</span>
                      </div>
                  ))
              )}
          </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-zinc-200 flex-shrink-0 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30">
        
        <div className="px-6 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
              <h1 className="text-xl font-black tracking-tight text-zinc-950">
                Campus<span className="text-emerald-600">Pulse</span>
              </h1>
              <p className="text-[11px] text-zinc-500 mt-1 font-bold tracking-wider uppercase">Your College Network</p>
          </div>
          <div className="flex gap-3">
              <button className="text-zinc-400 hover:text-zinc-900 transition-colors bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm" onClick={() => setActiveTab('search')}>
                  <Search className="w-4 h-4" />
              </button>
              <div className="relative">
                  <button className="text-zinc-400 hover:text-zinc-900 transition-colors bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm" onClick={handleNotificationClick}>
                      <Bell className="w-4 h-4" />
                  </button>
                  {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-white"></span>
                  )}
              </div>
          </div>
        </div>

        {/* Desktop Notifications Dropdown */}
        {showNotifications && (
            <div className="absolute top-[80px] left-full ml-2 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto overflow-hidden">
                <div className="p-4 border-b border-zinc-100 font-bold text-sm bg-zinc-50/50 text-zinc-950">Notifications</div>
                {notifications.length === 0 ? (
                    <div className="p-6 text-xs text-zinc-500 text-center font-medium">No notifications</div>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className="p-4 border-b border-zinc-100 last:border-0 flex flex-col gap-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                            <span className="text-sm font-medium text-zinc-800">{n.message}</span>
                            <span className="text-[11px] text-zinc-400 font-semibold">{n.time}</span>
                        </div>
                    ))
                )}
            </div>
        )}

        {currentUser && (
          <div className="px-4 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-100/50 transition-colors cursor-pointer" onClick={() => setActiveTab('profile')}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border-2 border-emerald-500/20 bg-white"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-zinc-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-zinc-500 font-medium truncate">{currentUser.branch} · {currentUser.year}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 w-full text-left group
                ${activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-transparent'
                }`}
            >
              <span className={`transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                {item.icon}
              </span>
              {item.label}

              <span className="ml-auto flex items-center gap-2">
                {item.id === 'messages' && unreadPrivateCount > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-sm">{unreadPrivateCount}</span>
                )}
                {activeTab === item.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                )}
              </span>
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-zinc-100 flex flex-col gap-1 bg-zinc-50/50">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 w-full group
                ${activeTab === 'settings'
                  ? 'bg-zinc-200 text-zinc-950'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
                }`}
          >
            <SettingsIcon className="w-5 h-5" />
            Settings
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 w-full group"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
