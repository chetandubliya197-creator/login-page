import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  MessageSquareText, 
  Search, 
  Bell, 
  Settings as SettingsIcon,
  Home,
  Globe,
  Compass,
  Users,
  User,
  HelpCircle,
  LogOut,
  Plus
} from 'lucide-react';
import { Activity, GraduationCap } from 'lucide-react'; // For the logo

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  { id: 'chat', label: 'Global Chat', icon: <Globe className="w-5 h-5" /> },
  { id: 'discover', label: 'Discover', icon: <Compass className="w-5 h-5" /> },
  { id: 'societies', label: 'Societies', icon: <Users className="w-5 h-5" /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquareText className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
];

export default function Sidebar({ onLogout, onNewPost }) {
  const { currentUser, activeTab, setActiveTab, notifications, markNotificationsAsRead, unreadPrivateCount } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
      setShowNotifications(!showNotifications);
      if (!showNotifications && unreadCount > 0) {
          markNotificationsAsRead();
      }
  };

  const MobileNavItems = NAV_ITEMS.filter(item => ['dashboard', 'chat', 'discover', 'societies', 'profile'].includes(item.id));

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200 w-full fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#0f172a]" />
                <Activity className="w-8 h-8 text-[#0f172a] absolute -bottom-2 -right-2" strokeWidth={3} />
            </div>
            <span className="text-lg font-black tracking-tight text-[#0f172a] ml-2">
                CampusPulse
            </span>
        </div>
        <div className="flex items-center gap-4">
            <button className="text-zinc-500 hover:text-zinc-900 transition-colors" onClick={() => setActiveTab('search')}>
                <Search className="w-5 h-5" />
            </button>
            <div className="relative">
                <button className="text-zinc-500 hover:text-zinc-900 transition-colors" onClick={handleNotificationClick}>
                    <Bell className="w-5 h-5" />
                </button>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
                )}
            </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg z-50 border-t border-zinc-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <nav className="flex items-center justify-around p-2">
            {MobileNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 flex-1
                  ${activeTab === item.id
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-zinc-500 hover:text-zinc-800'
                  }`}
              >
                <span className={`relative transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : ''}`}>
                  {item.icon}
                  {item.id === 'messages' && unreadPrivateCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-pulse"></span>
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
        
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-zinc-100 flex flex-col gap-1 bg-white">
          <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-[#0f172a]" />
                  <Activity className="w-8 h-8 text-[#0f172a] absolute -bottom-2 -right-3" strokeWidth={3} />
              </div>
              <h1 className="text-[22px] font-black tracking-tight text-[#0f172a] ml-3">
                CampusPulse
              </h1>
          </div>
          <p className="text-[10px] text-zinc-400 font-semibold tracking-wide ml-[42px]">DIGITAL COMMONS</p>
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

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
            
            {/* New Post Button */}
            <button onClick={onNewPost} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-sm shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mb-4">
                <Plus className="w-5 h-5" />
                New Post
            </button>

            <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200 w-full text-left group
                        ${activeTab === item.id
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                        }`}
                    >
                        <span className={`transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                        {item.icon}
                        </span>
                        {item.label}

                        <span className="ml-auto flex items-center gap-2">
                        {item.id === 'messages' && unreadPrivateCount > 0 && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-sm">{unreadPrivateCount}</span>
                        )}
                        </span>
                    </button>
                ))}
            </nav>
        </div>

        {/* Footer Area */}
        <div className="px-4 py-4 border-t border-zinc-100 bg-white flex flex-col gap-2">
            
            <button 
                onClick={() => setActiveTab('help')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all w-full
                    ${activeTab === 'help' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                    }`}
            >
                <HelpCircle className="w-4 h-4" />
                Help Center
            </button>

            {currentUser && (
                <div className="flex items-center justify-between gap-3 p-3 mt-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1" onClick={() => setActiveTab('profile')}>
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-9 h-9 rounded-full bg-white border border-zinc-200"
                        />
                        <div className="overflow-hidden">
                            <p className="text-[13px] font-bold text-zinc-900 truncate">{currentUser.name}</p>
                            <p className="text-[11px] text-zinc-500 font-medium truncate">@{currentUser.anonUsername.toLowerCase()}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="text-zinc-400 hover:text-rose-500 p-2 rounded-full hover:bg-rose-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      </aside>
    </>
  );
}
