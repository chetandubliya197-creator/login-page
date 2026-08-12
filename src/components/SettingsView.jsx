import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Bell, Lock, LogOut, Check } from 'lucide-react';

export default function SettingsView() {
  const { handleLogout } = useContext(AppContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [passwordState, setPasswordState] = useState({
      current: '',
      new: '',
      confirm: ''
  });
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handlePasswordChange = (e) => {
      setPasswordState(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleSaveSettings = () => {

      if (passwordState.new && passwordState.new !== passwordState.confirm) {
          alert("New passwords do not match!");
          return;
      }

      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
      setPasswordState({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px] overflow-y-auto pb-[60px] md:pb-0">

      <div className="px-6 py-5 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h2 className="font-black text-zinc-950 text-2xl tracking-tight">Settings</h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">Manage your preferences and security</p>
      </div>

      <div className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-8">

        <section className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-xl font-black text-zinc-950 tracking-tight mb-6">
                <Bell className="w-6 h-6 text-emerald-600" />
                Notification Preferences
            </h3>

            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div>
                    <h4 className="text-[15px] font-bold text-zinc-900">Push Notifications</h4>
                    <p className="text-[13px] font-medium text-zinc-500 mt-0.5">Receive alerts for messages and connection requests.</p>
                </div>
                <button 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shadow-inner ${notificationsEnabled ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        </section>

        <section className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-xl font-black text-zinc-950 tracking-tight mb-6">
                <Lock className="w-6 h-6 text-emerald-600" />
                Security & Password
            </h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-[13px] font-bold text-zinc-600 mb-2">Current Password</label>
                    <input 
                        type="password"
                        name="current"
                        value={passwordState.current}
                        onChange={handlePasswordChange}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
                        placeholder="••••••••"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[13px] font-bold text-zinc-600 mb-2">New Password</label>
                        <input 
                            type="password"
                            name="new"
                            value={passwordState.new}
                            onChange={handlePasswordChange}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-zinc-600 mb-2">Confirm New Password</label>
                        <input 
                            type="password"
                            name="confirm"
                            value={passwordState.confirm}
                            onChange={handlePasswordChange}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>
        </section>

        <div className="flex items-center gap-4 pt-2">
            <button 
                onClick={handleSaveSettings}
                className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[15px] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
                Save Settings
            </button>

            {showSaveMessage && (
                <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-[13px] font-bold text-emerald-700 animate-fade-in shadow-sm">
                    <Check className="w-4 h-4" />
                    Settings saved successfully!
                </span>
            )}
        </div>

        <section className="mt-14 pt-8 border-t border-zinc-200">
            <h3 className="text-sm font-black text-rose-600 tracking-widest uppercase mb-4">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-rose-200 bg-rose-50 shadow-sm">
                <div>
                    <h4 className="text-[15px] font-black text-rose-950 tracking-tight">Log Out of CampusPulse</h4>
                    <p className="text-[13px] font-medium text-rose-700 mt-1">This will clear your local session.</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors text-sm font-bold shadow-sm whitespace-nowrap"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
        </section>

      </div>
    </div>
  );
}
