import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import GlobalChat from './components/GlobalChat';
import DiscoverProfiles from './components/DiscoverProfiles';
import SocietyHub from './components/SocietyHub';
import ProfileView from './components/ProfileView';
import OnboardingModal from './components/OnboardingModal';
import SettingsView from './components/SettingsView';
import GlobalSearchModal from './components/GlobalSearchModal';
import PrivateChat from './components/PrivateChat';
import Toast from './components/Toast';
import DashboardView from './components/DashboardView';
import HelpCenterView from './components/HelpCenterView';
import AdminPanel from './components/AdminPanel';

function InnerApp() {
  const { currentUser, activeTab, setActiveTab, handleLogout } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
        <Navbar onLoginClick={() => setIsModalOpen(true)} />
        <HeroSection onStartClick={() => setIsModalOpen(true)} />
        <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <Toast />
        <footer className="w-full py-8 text-center text-xs text-zinc-500 border-t border-zinc-200 relative z-10 glassmorphism bg-white/50">
          <p>&copy; {new Date().getFullYear()} CampusPulse. Made with ❤️ for college students.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 overflow-hidden font-sans">
      <Sidebar onLogout={handleLogout} onNewPost={() => setIsPostModalOpen(true)} />
      <OnboardingModal />
      <Toast />
      <main className="flex-1 overflow-hidden pb-[60px] md:pb-0 relative">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'chat' && <GlobalChat />}
        {activeTab === 'discover' && <DiscoverProfiles />}
        {activeTab === 'societies' && <SocietyHub />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'messages' && <PrivateChat />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'help' && <HelpCenterView />}
        {activeTab === 'admin' && <AdminPanel />}
        <GlobalSearchModal
          isOpen={activeTab === 'search'}
          onClose={() => setActiveTab('dashboard')}
        />
      </main>

      {/* Basic Create Post Modal placeholder */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-black text-zinc-900">Create Post</h2>
                    <button onClick={() => setIsPostModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
                </div>
                <textarea 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[120px]"
                    placeholder="What do you want to share with the campus?"
                ></textarea>
                <div className="flex justify-end mt-4">
                    <button onClick={() => setIsPostModalOpen(false)} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm">Post</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}
