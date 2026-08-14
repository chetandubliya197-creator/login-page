import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const DUMMY_POSTS = [
  {
    id: 1,
    author: 'Alex Mercer',
    role: 'Computer Science, 3rd Year',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content: 'Just finished setting up the new robotics lab for the upcoming semester! We have 3 new 3D printers and a ton of Arduino kits. Anyone interested in a beginner workshop next week?',
    time: '2 hours ago',
    likes: 42,
    comments: 12
  },
  {
    id: 2,
    author: 'Tech Innovators Hub',
    role: 'Official Society',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=TechHub',
    content: 'Don\'t forget! Our annual Hackathon registrations close this Friday. Form your teams of up to 4 members. We have some amazing sponsors lined up this year! 💻🚀',
    time: '5 hours ago',
    likes: 128,
    comments: 34
  },
  {
    id: 3,
    author: 'Priya Sharma',
    role: 'Design Club, 2nd Year',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    content: 'Looking for a UI/UX designer to join our team for the upcoming hackathon. We have 2 backend devs and 1 frontend dev already. DM me if interested!',
    time: 'Yesterday',
    likes: 15,
    comments: 4
  }
];

export default function DashboardView() {
  const { currentUser } = useContext(AppContext);

  return (
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px] pb-[80px] md:pb-0 overflow-y-auto">
      {/* Header Area */}
      <div className="px-6 pt-6 pb-4 bg-white flex-shrink-0 z-10 sticky top-0 md:static border-b border-zinc-200">
        <h2 className="font-black text-zinc-950 text-2xl tracking-tight">Dashboard</h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">
          Welcome back, {currentUser?.name?.split(' ')[0]}! Here's what's happening.
        </p>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* Create Post Input */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-200 flex gap-4">
            <img src={currentUser?.avatar} alt="You" className="w-10 h-10 rounded-full border border-zinc-200" />
            <div className="flex-1">
                <input 
                    type="text" 
                    placeholder="Share an update with your campus..." 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
            </div>
        </div>

        {/* Feed */}
        <div className="space-y-5">
            {DUMMY_POSTS.map(post => (
                <div key={post.id} className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-xl bg-zinc-100" />
                            <div>
                                <h3 className="font-bold text-zinc-950 text-[15px] leading-tight">{post.author}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-xs text-zinc-500 font-medium">{post.role}</p>
                                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                    <p className="text-xs text-zinc-400 font-medium">{post.time}</p>
                                </div>
                            </div>
                        </div>
                        <button className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-full hover:bg-zinc-100">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-[15px] text-zinc-800 leading-relaxed mb-4">
                        {post.content}
                    </p>

                    <div className="flex items-center gap-6 pt-4 border-t border-zinc-100">
                        <button className="flex items-center gap-2 text-zinc-500 hover:text-emerald-600 transition-colors group">
                            <Heart className="w-4 h-4 group-hover:fill-emerald-100" />
                            <span className="text-xs font-bold">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-zinc-500 hover:text-emerald-600 transition-colors group">
                            <MessageCircle className="w-4 h-4 group-hover:fill-emerald-100" />
                            <span className="text-xs font-bold">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-zinc-500 hover:text-emerald-600 transition-colors ml-auto">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
