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
  
  // Check if running as an installed PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  
  const [isModalOpen, setIsModalOpen] = useState(isPWA);

  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
        <Navbar onLoginClick={() => setIsModalOpen(true)} />
        <HeroSection onStartClick={() => setIsModalOpen(true)} />
        <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isPWA={isPWA} />
        <Toast />
        <footer className="w-full py-8 text-center text-xs text-zinc-500 border-t border-zinc-200 relative z-10 glassmorphism bg-white/50">
          <p>&copy; {new Date().getFullYear()} CampusPulse. Made with ❤️ for college students.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 overflow-hidden font-sans">
      <Sidebar onLogout={handleLogout} />
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
