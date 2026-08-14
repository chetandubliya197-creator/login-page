import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, ChevronLeft, Calendar, Share2, MapPin, Users } from 'lucide-react';

const TABS = ['All Societies', 'Academic', 'Arts & Culture', 'Sports', 'Technology'];

export default function SocietyHub() {
  const { societies, toggleSocietyJoin } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('All Societies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [detailTab, setDetailTab] = useState('About');

  // Filter logic based on mockup categories (using mock logic since we don't have categories in initial data)
  const filteredSocieties = societies.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      
      if (activeTab === 'All Societies') return true;
      if (activeTab === 'Technology' && s.name.includes('Code') || s.name.includes('Tech') || s.name.includes('Robotics') || s.name.includes('AI') || s.name.includes('Cyber')) return true;
      if (activeTab === 'Arts & Culture' && s.name.includes('Culture') || s.name.includes('Photo') || s.name.includes('Art')) return true;
      if (activeTab === 'Sports' && s.name.includes('Sport')) return true;
      if (activeTab === 'Academic' && s.name.includes('Academic') || s.name.includes('Science')) return true;
      
      return false; // Very naive filter just for mockup purposes
  });

  if (selectedSociety) {
      return (
          <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto md:pt-0 pt-[53px]">
              {/* Banner Area */}
              <div className="relative h-64 md:h-80 w-full bg-zinc-800 flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Campus" 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
                  
                  <button 
                    onClick={() => setSelectedSociety(null)}
                    className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
                  >
                      <ChevronLeft className="w-4 h-4" />
                      Back to Societies
                  </button>
              </div>

              {/* Society Info Header */}
              <div className="relative px-6 md:px-12 -mt-16 md:-mt-20 z-10 max-w-5xl mx-auto w-full">
                  <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
                      <div className="flex flex-col md:flex-row gap-6 md:items-end">
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-4xl">
                              {selectedSociety.icon}
                          </div>
                          <div className="mb-2">
                              <span className="text-emerald-400 font-black tracking-widest text-xs uppercase mb-1 block">TECHNOLOGY</span>
                              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                                  {selectedSociety.name}
                              </h1>
                              <p className="text-zinc-300 font-medium max-w-xl text-sm md:text-base leading-relaxed drop-shadow">
                                  Empowering students through coding, hardware workshops, and tech entrepreneurship. Building the future of the digital quad.
                              </p>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-3 md:mb-2 bg-white/10 md:bg-transparent p-4 md:p-0 rounded-2xl backdrop-blur-md md:backdrop-blur-none">
                          <button className="p-3 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors border border-zinc-200">
                              <Share2 className="w-4 h-4" />
                              <span className="hidden md:inline">Share</span>
                          </button>
                          <button 
                            onClick={() => toggleSocietyJoin(selectedSociety.id)}
                            className={`px-8 py-3 rounded-xl font-bold shadow-sm transition-colors
                                ${selectedSociety.joined 
                                    ? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300' 
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                                }`}
                          >
                              {selectedSociety.joined ? 'Joined' : 'Join Society'}
                          </button>
                      </div>
                  </div>

                  <div className="flex items-center gap-6 mt-8 border-b border-zinc-200 pb-px text-sm font-bold">
                      {['About', 'Posts (42)', 'Events', 'Members'].map(tab => (
                          <button 
                            key={tab}
                            onClick={() => setDetailTab(tab)}
                            className={`pb-4 border-b-2 transition-colors ${detailTab === tab ? 'border-emerald-500 text-zinc-950' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
                          >
                              {tab}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Detail Content Area */}
              <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                  <div className="md:col-span-1 space-y-6">
                      <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
                          <h3 className="font-black text-xl text-zinc-950 mb-4">About Us</h3>
                          <p className="text-[14px] text-zinc-600 leading-relaxed font-medium mb-4">
                              The {selectedSociety.name} is the premier destination for students passionate about technology, software development, and digital entrepreneurship.
                          </p>
                          <p className="text-[14px] text-zinc-600 leading-relaxed font-medium mb-6">
                              We host weekly coding workshops, guest lectures from industry professionals, and our flagship annual hackathon. Whether you're a beginner or an experienced developer, you'll find a welcoming community here.
                          </p>
                          
                          <div className="space-y-4">
                              <div className="flex items-center gap-3 text-sm text-zinc-600 font-medium">
                                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center"><Search className="w-4 h-4 text-zinc-500" /></div>
                                  contact@{selectedSociety.name.replace(/\s+/g, '').toLowerCase()}.edu
                              </div>
                              <div className="flex items-center gap-3 text-sm text-zinc-600 font-medium">
                                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center"><Search className="w-4 h-4 text-zinc-500" /></div>
                                  {selectedSociety.name.replace(/\s+/g, '').toLowerCase()}.io
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                      <div className="flex items-center justify-between mb-4">
                          <h3 className="font-black text-xl text-zinc-950">Upcoming Events</h3>
                          <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All →</button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {[1, 2].map(i => (
                              <div key={i} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden group">
                                  <div className="h-40 bg-zinc-200 relative overflow-hidden">
                                      <img src={`https://images.unsplash.com/photo-1544144433-d50aff500b91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Event" />
                                      <div className="absolute top-3 right-3 bg-white rounded-xl text-center overflow-hidden shadow-sm">
                                          <div className="bg-rose-500 text-[9px] font-black text-white px-2 py-0.5 uppercase">OCT</div>
                                          <div className="text-sm font-black text-zinc-900 py-1">{12 + i}</div>
                                      </div>
                                  </div>
                                  <div className="p-5">
                                      <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase mb-2 block">WORKSHOP</span>
                                      <h4 className="font-black text-zinc-950 text-lg mb-2">Intro to React Native</h4>
                                      <p className="text-xs text-zinc-500 font-medium mb-4 line-clamp-2">
                                          Learn the basics of building cross-platform mobile applications using React Native and Expo.
                                      </p>
                                      
                                      <div className="flex flex-col gap-2 mb-5">
                                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                                              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                              6:00 PM - 8:00 PM
                                          </div>
                                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                                              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                              Innovation Hub, Room 304
                                          </div>
                                      </div>

                                      <button className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl text-sm transition-colors">
                                          RSVP Now
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- List View ---
  return (
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px] overflow-y-auto pb-[60px] md:pb-0">

      {/* Header */}
      <div className="px-6 py-8 bg-white flex-shrink-0 sticky top-0 z-10 border-b border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-black text-[#0f172a] text-[28px] tracking-tight">Societies</h2>
                <p className="text-[15px] text-zinc-500 font-medium mt-1">
                  Discover communities, connect with peers, and find your space on campus.
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-3 w-5 h-5 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="Search societies..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-100 border-none rounded-2xl pl-11 pr-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                />
              </div>
          </div>

          <div className="flex items-center gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide">
              {TABS.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all
                        ${activeTab === tab 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50 shadow-sm' 
                            : 'bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800'
                        }`}
                  >
                      {tab}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSocieties.map((society) => (
              <div
                key={society.id}
                className="bg-white rounded-3xl border border-zinc-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-300 group"
              >
                  <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {society.icon}
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-100">
                          {society.id.includes('coding') || society.id.includes('robot') || society.id.includes('ml') || society.id.includes('cyber') ? 'TECHNOLOGY' : society.id.includes('photo') || society.id.includes('cult') ? 'ARTS' : 'ACADEMIC'}
                      </span>
                  </div>

                  <div>
                      <h4 className="font-black text-[#0f172a] text-[19px] tracking-tight">{society.name}</h4>
                      <p className="text-[13px] text-zinc-500 font-medium mt-2 leading-relaxed line-clamp-2 min-h-[40px]">{society.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 mt-2">
                      <Users className="w-4 h-4 text-zinc-400" />
                      {society.membersCount} Members
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-100">
                      <button 
                        onClick={() => setSelectedSociety(society)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                      >
                          View Society
                      </button>
                      <button
                        onClick={() => toggleSocietyJoin(society.id)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm
                            ${society.joined
                            ? 'bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                            }`}
                      >
                        {society.joined ? 'Joined' : 'Join'}
                      </button>
                  </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
