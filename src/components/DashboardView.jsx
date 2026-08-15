import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';



export default function DashboardView() {
  const { currentUser, posts, setPosts, createPost } = useContext(AppContext);
  const [newPostText, setNewPostText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handlePostSubmit = async (e) => {
      e.preventDefault();
      if (!newPostText.trim() || isSubmitting) return;
      
      setIsSubmitting(true);
      const success = await createPost(newPostText);
      if (success) {
          setNewPostText('');
      }
      setIsSubmitting(false);
  };

  const API_BASE_URL = 'https://campuspulse-jnfo.onrender.com';
  const handleDeletePost = async (postId) => {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      try {
          const res = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${currentUser.token}` }
          });
          if (res.ok) {
              // Remove from state directly — no page reload needed
              setPosts(prev => prev.filter(p => p.id !== postId));
          }
      } catch(e) {
          console.error(e);
      }
  };

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
            <form onSubmit={handlePostSubmit} className="flex-1 flex flex-col items-end gap-3">
                <textarea 
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Share an update with your campus..." 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none min-h-[80px]"
                ></textarea>
                <button 
                    type="submit" 
                    disabled={isSubmitting || !newPostText.trim()}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold rounded-xl text-sm shadow-sm transition-all"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>

        {/* Feed */}
        <div className="space-y-5">
            {posts.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">No posts yet. Be the first to share something!</div>
            ) : (
                posts.map(post => (
                    <div key={post.id} className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200 relative">
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
                            
                            {(currentUser?.role === 'admin' || currentUser?.id === post.authorId) && (
                                <button 
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 text-xs font-bold"
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        <p className="text-[15px] text-zinc-800 leading-relaxed mb-4 whitespace-pre-wrap">
                            {post.content}
                        </p>

                        <div className="flex items-center gap-6 pt-4 border-t border-zinc-100">
                            <button className="flex items-center gap-2 text-zinc-500 hover:text-emerald-600 transition-colors group">
                                <Heart className="w-4 h-4 group-hover:fill-emerald-100" />
                                <span className="text-xs font-bold">{post.likes?.length || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-zinc-500 hover:text-emerald-600 transition-colors group">
                                <MessageCircle className="w-4 h-4 group-hover:fill-emerald-100" />
                                <span className="text-xs font-bold">{post.comments?.length || 0}</span>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
