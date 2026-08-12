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
    <nav className="fixed top-0 left-0 right-0 z-40 glassmorphism bg-white/80 border-b border-zinc-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 transition-colors duration-300">
                Campus<span className="text-emerald-600">Pulse</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">Your College Network</span>
            </div>
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

          <div className="hidden md:flex items-center">
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
