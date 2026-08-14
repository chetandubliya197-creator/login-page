import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Bell, Lock, User, Shield, Check, Search } from 'lucide-react';

export default function SettingsView() {
  const { currentUser, handleLogout } = useContext(AppContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleSaveSettings = () => {
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-white md:pt-0 pt-[53px] overflow-y-auto pb-[60px] md:pb-0">

      {/* Header */}
      <div className="px-6 md:px-12 py-8 bg-white flex-shrink-0 sticky top-0 z-10 border-b border-zinc-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-black text-[#0f172a] text-[28px] tracking-tight">Settings</h2>
                <p className="text-[15px] text-zinc-500 font-medium mt-1">
                  Manage your account preferences, privacy, and security settings.
                </p>
              </div>

              <div className="relative w-full md:w-72 hidden md:block">
                <Search className="absolute left-4 top-3 w-5 h-5 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="Search settings..." 
                    className="w-full bg-zinc-100 border-none rounded-2xl pl-11 pr-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                />
              </div>
          </div>
      </div>

      <div className="flex-1 px-6 md:px-12 py-8 max-w-4xl w-full space-y-12 pb-20">

        {/* Account Section */}
        <section>
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-emerald-600 tracking-tight mb-6">
                <User className="w-5 h-5" />
                Account
            </h3>

            <div className="border border-zinc-200 rounded-3xl divide-y divide-zinc-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                    <div className="flex items-center gap-4">
                        <img src={currentUser?.avatar} alt="Profile" className="w-12 h-12 rounded-full border border-zinc-200" />
                        <div>
                            <h4 className="text-[15px] font-bold text-[#0f172a]">Profile Information</h4>
                            <p className="text-[13px] font-medium text-zinc-500 mt-0.5">Update your public facing name, bio, and avatar.</p>
                        </div>
                    </div>
                    <button className="px-5 py-2 bg-white border border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors">
                        Edit Profile
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                    <div>
                        <h4 className="text-[15px] font-bold text-[#0f172a]">Email Address</h4>
                        <p className="text-[13px] font-medium text-zinc-500 mt-0.5">{currentUser?.email}</p>
                    </div>
                    <button className="px-5 py-2 bg-white border border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors">
                        Change Email
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                    <div>
                        <h4 className="text-[15px] font-bold text-[#0f172a]">Password</h4>
                        <p className="text-[13px] font-medium text-zinc-500 mt-0.5">Last changed 3 months ago</p>
                    </div>
                    <button className="px-5 py-2 bg-white border border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors">
                        Update Password
                    </button>
                </div>
            </div>
        </section>

        {/* Privacy Section */}
        <section>
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-emerald-600 tracking-tight mb-6">
                <Shield className="w-5 h-5" />
                Privacy
            </h3>

            <div className="border border-zinc-200 rounded-3xl divide-y divide-zinc-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                    <div>
                        <h4 className="text-[15px] font-bold text-[#0f172a]">Message Permissions</h4>
                        <p className="text-[13px] font-medium text-zinc-500 mt-0.5">Control who can send you direct messages.</p>
                    </div>
                    <select className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                        <option>Connections Only</option>
                        <option>Everyone</option>
                        <option>Nobody</option>
                    </select>
                </div>

                <div className="flex items-center justify-between p-6 gap-4">
                    <div>
                        <h4 className="text-[15px] font-bold text-[#0f172a]">Public Profile Visibility</h4>
                        <p className="text-[13px] font-medium text-zinc-500 mt-0.5">Allow non-connections to view your societies and posts.</p>
                    </div>
                    <button 
                        onClick={() => setPublicProfile(!publicProfile)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shadow-inner ${publicProfile ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${publicProfile ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </section>

        {/* Notifications Section */}
        <section>
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-emerald-600 tracking-tight mb-6">
                <Bell className="w-5 h-5" />
                Notifications
            </h3>

            <div className="border border-zinc-200 rounded-3xl divide-y divide-zinc-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 gap-4">
                    <div>
                        <h4 className="text-[15px] font-bold text-[#0f172a]">Push Notifications</h4>
                        <p className="text-[13px] font-medium text-zinc-500 mt-0.5">Receive alerts for messages and connection requests.</p>
                    </div>
                    <button 
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shadow-inner ${notificationsEnabled ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </section>

        <div className="flex items-center gap-4 pt-6">
            <button 
                onClick={handleSaveSettings}
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[14px] transition-all shadow-md hover:shadow-lg"
            >
                Save Settings
            </button>

            {showSaveMessage && (
                <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[13px] font-bold text-emerald-700 animate-fade-in shadow-sm">
                    <Check className="w-4 h-4" />
                    Saved!
                </span>
            )}
        </div>

      </div>
    </div>
  );
}
