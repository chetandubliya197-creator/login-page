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

function InnerApp() {
  const { currentUser, activeTab, setActiveTab, handleLogout } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#030712_80%)] pointer-events-none z-[1]"></div>
        <Navbar onLoginClick={() => setIsModalOpen(true)} />
        <HeroSection onStartClick={() => setIsModalOpen(true)} />
        <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <Toast />
        <footer className="w-full py-8 text-center text-xs text-gray-600 border-t border-white/5 relative z-10 bg-gray-950/20">
          <p>&copy; {new Date().getFullYear()} CampusPulse. Made with ❤️ for college students.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      <Sidebar onLogout={handleLogout} />
      <OnboardingModal />
      <Toast />
      <main className="flex-1 overflow-hidden pb-[60px] md:pb-0 relative">
        {activeTab === 'chat' && <GlobalChat />}
        {activeTab === 'discover' && <DiscoverProfiles />}
        {activeTab === 'societies' && <SocietyHub />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'messages' && <PrivateChat />}
        {activeTab === 'settings' && <SettingsView />}
        <GlobalSearchModal
          isOpen={activeTab === 'search'}
          onClose={() => setActiveTab('chat')}
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
