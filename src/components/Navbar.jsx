import React, { useState, useContext } from 'react';
import { Menu, X, ArrowRight, GraduationCap, Activity, Download } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Navbar({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const { deferredPrompt, installPWA } = useContext(AppContext);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glassmorphism bg-white/80 border-b border-zinc-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#0f172a]" />
              <Activity className="w-8 h-8 text-[#0f172a] absolute -bottom-2 -right-2" strokeWidth={3} />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 ml-2">CampusPulse</h1>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-zinc-600 font-medium hover:text-zinc-900 transition-colors duration-300 text-sm uppercase tracking-wider relative group"
              >
                {link.name}
                <span className="absolute bottom-[-6px] left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {deferredPrompt && (
              <button
                onClick={installPWA}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold text-sm tracking-wide transition-all hover:bg-emerald-50"
              >
                <Download className="w-4 h-4" />
                Install App
              </button>
            )}
            <button
              onClick={onLoginClick}
              className="relative px-6 py-2.5 rounded-full bg-zinc-950 text-white font-bold text-sm tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-600 hover:text-zinc-900 p-2 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-72 opacity-100 border-t border-zinc-200 bg-white shadow-xl' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-zinc-600 hover:text-zinc-900 text-base font-bold py-2 transition-colors border-b border-zinc-100 last:border-b-0"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {deferredPrompt && (
            <button
              onClick={() => { setIsOpen(false); installPWA(); }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold text-sm hover:bg-emerald-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          )}
          <button
            onClick={() => { setIsOpen(false); onLoginClick(); }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-950 text-white font-bold text-sm hover:bg-zinc-800 transition-colors shadow-lg"
          >
            Join Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
