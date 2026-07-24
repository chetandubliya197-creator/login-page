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
    <div className="flex flex-col h-full bg-gray-950 md:pt-0 pt-[53px] overflow-y-auto">

      <div className="px-6 py-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
        <h2 className="font-bold text-white text-lg">Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">Manage your preferences and security</p>
      </div>

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-8">

        <section className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                <Bell className="w-5 h-5 text-red-500" />
                Notification Preferences
            </h3>

            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-gray-200">Push Notifications</h4>
                    <p className="text-xs text-gray-500 mt-1">Receive alerts for messages and connection requests.</p>
                </div>
                <button 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-red-500' : 'bg-gray-700'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        </section>

        <section className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                <Lock className="w-5 h-5 text-red-500" />
                Security & Password
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Current Password</label>
                    <input 
                        type="password"
                        name="current"
                        value={passwordState.current}
                        onChange={handlePasswordChange}
                        className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
                        placeholder="••••••••"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">New Password</label>
                        <input 
                            type="password"
                            name="new"
                            value={passwordState.new}
                            onChange={handlePasswordChange}
                            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Confirm New Password</label>
                        <input 
                            type="password"
                            name="confirm"
                            value={passwordState.confirm}
                            onChange={handlePasswordChange}
                            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>
        </section>

        <div className="flex items-center gap-4">
            <button 
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-colors"
            >
                Save Settings
            </button>

            {showSaveMessage && (
                <span className="flex items-center gap-2 text-sm text-green-400 animate-fade-in">
                    <Check className="w-4 h-4" />
                    Settings saved successfully!
                </span>
            )}
        </div>

        <section className="mt-12 pt-8 border-t border-red-500/20">
            <h3 className="text-lg font-bold text-red-500 mb-4">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div>
                    <h4 className="text-sm font-medium text-gray-200">Log Out of CampusPulse</h4>
                    <p className="text-xs text-gray-500 mt-1">This will clear your local session.</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium whitespace-nowrap"
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
