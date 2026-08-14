import React from 'react';
import { ArrowRight, Users, MessageSquare, Building2, ShieldCheck, Zap, Globe, GraduationCap, Activity } from 'lucide-react';

const FEATURES = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    title: 'Privacy First',
    desc: 'Stay anonymous until you choose to connect. Your real identity is revealed only to students you trust.',
    tag: 'Core Feature',
    bgColor: 'bg-emerald-100',
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-amber-600" />,
    title: 'Global Campus Chat',
    desc: 'One open group where every student on campus is already connected. Discuss, debate, and vibe together.',
    tag: 'Chat',
    bgColor: 'bg-amber-100',
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: 'Discover & Connect',
    desc: 'Browse student profiles across branches and years. Send connection requests to unlock their identity.',
    tag: 'Discover',
    bgColor: 'bg-blue-100',
  },
  {
    icon: <Building2 className="w-6 h-6 text-indigo-600" />,
    title: 'Societies & Clubs',
    desc: 'Join the Coding Society, Robotics Club, Cultural groups, and more. Get announcements directly in your feed.',
    tag: 'Societies',
    bgColor: 'bg-indigo-100',
  },
  {
    icon: <Zap className="w-6 h-6 text-orange-600" />,
    title: 'Instant Updates',
    desc: 'Real-time messages, connection alerts, and society announcements — all in one place.',
    tag: 'Real-time',
    bgColor: 'bg-orange-100',
  },
  {
    icon: <Globe className="w-6 h-6 text-purple-600" />,
    title: 'College-Only Access',
    desc: 'Login with your college ID. No outsiders. Just your campus community, secured and verified.',
    tag: 'Exclusive',
    bgColor: 'bg-purple-100',
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
    <section className="relative min-h-screen pt-28 flex flex-col items-center overflow-hidden bg-zinc-50">

      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-50 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 z-10 flex flex-col items-center text-center w-full">

        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm mb-8 cursor-pointer hover:shadow-md transition-all duration-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wider text-zinc-600 uppercase">
            🎓 Now Live for Your College · Join Today
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 max-w-5xl leading-[1.05] text-zinc-950">
          Your College, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-900 bg-clip-text text-transparent">
            One Pulse.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mb-4 font-medium leading-relaxed">
          CampusPulse connects every student in your college — through a private, anonymous-first network built for the campus experience.
        </p>
        <p className="text-sm text-zinc-500 mb-12 font-medium">
          Chat anonymously. Discover batchmates. Join societies. All in one place. 🔒
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16">
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-zinc-950 text-white font-bold text-base hover:-translate-y-0.5 transition-transform duration-300 shadow-xl hover:shadow-2xl"
          >
            Join CampusPulse
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onStartClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white border-2 border-zinc-200 text-zinc-900 font-bold text-base hover:bg-zinc-50 hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Login with College ID
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-20">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center py-6 px-4 bg-white rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-3xl font-black text-zinc-950">{stat.value}</span>
              <span className="text-xs text-zinc-500 mt-1 font-bold uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        <div id="features" className="w-full max-w-6xl">
          <p className="text-xs text-emerald-600 uppercase tracking-widest font-black mb-3">Everything you need</p>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 mb-12 tracking-tight">
            Built for Campus Life
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left">
            {FEATURES.map((feat, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-zinc-200/80 hover:border-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl shadow-inner ${feat.bgColor}`}>
                      {feat.icon}
                    </div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full border border-zinc-200">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-zinc-950 mb-2.5 tracking-tight group-hover:text-emerald-700 transition-colors">{feat.title}</h3>
                  <p className="text-sm text-zinc-600 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="about" className="mt-24 mb-12 w-full max-w-4xl bg-white rounded-3xl border border-zinc-200 p-10 sm:p-16 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative flex items-center justify-center mb-6 z-10">
              <GraduationCap className="w-12 h-12 text-[#0f172a]" />
              <Activity className="w-16 h-16 text-[#0f172a] absolute -bottom-4 -right-4" strokeWidth={3} />
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-zinc-950 mb-4 tracking-tight relative z-10">
            Ready to find your people?
          </h3>
          <p className="text-zinc-600 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mb-10 relative z-10">
            CampusPulse is an exclusive college network — built by students, for students. Sign up with your college email and start connecting anonymously today.
          </p>
          <button
            onClick={onStartClick}
            className="flex items-center gap-2.5 px-10 py-4 rounded-full bg-zinc-950 text-white font-bold text-lg hover:-translate-y-0.5 transition-transform duration-300 shadow-xl hover:shadow-2xl relative z-10"
          >
            Get Started — It's Free
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  );
}
