import React from 'react';
import { ArrowRight, Users, MessageSquare, Building2, ShieldCheck, Zap, Globe } from 'lucide-react';

const FEATURES = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-red-400" />,
    title: 'Privacy First',
    desc: 'Stay anonymous until you choose to connect. Your real identity is revealed only to students you trust.',
    tag: 'Core Feature',
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-orange-400" />,
    title: 'Global Campus Chat',
    desc: 'One open group where every student on campus is already connected. Discuss, debate, and vibe together.',
    tag: 'Chat',
  },
  {
    icon: <Users className="w-6 h-6 text-yellow-400" />,
    title: 'Discover & Connect',
    desc: 'Browse student profiles across branches and years. Send connection requests to unlock their identity.',
    tag: 'Discover',
  },
  {
    icon: <Building2 className="w-6 h-6 text-green-400" />,
    title: 'Societies & Clubs',
    desc: 'Join the Coding Society, Robotics Club, Cultural groups, and more. Get announcements directly in your feed.',
    tag: 'Societies',
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    title: 'Instant Updates',
    desc: 'Real-time messages, connection alerts, and society announcements — all in one place.',
    tag: 'Real-time',
  },
  {
    icon: <Globe className="w-6 h-6 text-purple-400" />,
    title: 'College-Only Access',
    desc: 'Login with your college ID. No outsiders. Just your campus community, secured and verified.',
    tag: 'Exclusive',
  },
];

const STATS = [
  { value: '500+', label: 'Students Connected' },
  { value: '12+', label: 'Active Societies' },
  { value: '24/7', label: 'Campus Chat Live' },
  { value: '100%', label: 'College Exclusive' },
];

export default function HeroSection({ onStartClick }) {
  return (
    <section className="relative min-h-screen pt-28 flex flex-col items-center overflow-hidden bg-gray-950 bg-grid-pattern">

      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-red-600/8 blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-orange-600/8 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-red-950/20 blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 z-10 flex flex-col items-center text-center w-full">

        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glassmorphism border border-white/10 mb-8 cursor-pointer hover:border-red-500/30 transition-colors duration-300 group">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
            🎓 Now Live for Your College · Join Today
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 max-w-5xl leading-[1.05]">
          <span className="block text-white mb-1">Your College,</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-400 font-extrabold">
            One Pulse.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-4 font-light leading-relaxed">
          CampusPulse connects every student in your college — through a private, anonymous-first network built for the campus experience.
        </p>
        <p className="text-sm text-gray-600 mb-12">
          Chat anonymously. Discover batchmates. Join societies. All in one place. 🔒
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16">
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-base hover:scale-105 transition-transform duration-300 glow-btn shadow-xl shadow-red-950/30"
          >
            Join CampusPulse
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onStartClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl glassmorphism text-white font-semibold text-base hover:bg-white/5 transition-all duration-300 hover:border-white/20"
          >
            <ShieldCheck className="w-4 h-4 text-red-400" />
            Login with College ID
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden w-full max-w-3xl mb-20 border border-white/8 glassmorphism">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center py-5 px-4 bg-gray-950/60">
              <span className="text-2xl font-extrabold text-white">{stat.value}</span>
              <span className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>

        <div id="features" className="w-full max-w-6xl">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-3">Everything you need</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-12">
            Built for <span className="text-red-500">Campus Life</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {FEATURES.map((feat, index) => (
              <div
                key={index}
                className="glassmorphism p-6 rounded-2xl border border-white/5 hover:border-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/10 group"
              >

                <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center border border-white/8 mb-4 group-hover:border-white/15 transition-colors">
                  {feat.icon}
                </div>

                <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-2 block">{feat.tag}</span>

                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>

                <p className="text-gray-500 text-sm font-light leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="about" className="mt-24 mb-12 w-full max-w-3xl glassmorphism rounded-3xl border border-white/8 p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center mb-6 glow-red">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to find your people?
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-8">
            CampusPulse is an exclusive college network — built by students, for students. Sign up with your college email and start connecting anonymously today.
          </p>
          <button
            onClick={onStartClick}
            className="flex items-center gap-2.5 px-10 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-base hover:scale-105 transition-transform duration-300 glow-btn"
          >
            Get Started — It's Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
