import React, { useState } from 'react';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';

export default function Navbar({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glassmorphism border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">

          <div className="flex items-center space-x-3 cursor-pointer group">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center glow-red transition-transform duration-300 group-hover:scale-110">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-red-400 transition-colors duration-300">
                Campus<span className="text-red-500">Pulse</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Your College Network</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 font-medium hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider relative group"
              >
                {link.name}
                <span className="absolute bottom-[-6px] left-0 w-0 h-[2px] bg-red-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <button
              onClick={onLoginClick}
              className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-sm tracking-wide overflow-hidden group transition-all duration-300 hover:scale-105 glow-btn"
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
              className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-72 opacity-100 border-t border-white/5 bg-gray-950/95 backdrop-blur-lg' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-gray-300 hover:text-white text-base font-semibold py-2 transition-colors border-b border-white/5 last:border-b-0"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => { setIsOpen(false); onLoginClick(); }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-red-950/20"
          >
            Join Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
