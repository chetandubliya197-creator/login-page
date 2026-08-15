import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Paperclip, X, Image as ImageIcon, FileText, Send, Smile, MoreVertical, Flag, Ban, Reply, Edit2, Trash2, ChevronDown, Check } from 'lucide-react';

export default function GlobalChat() {
  const { currentUser, students, globalMessages, onlineUsersCount, sendGlobalMessage, editGlobalMessage, deleteGlobalMessage, addReactionToMessage, reportUser, blockUser } = useContext(AppContext);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null); 
  const [activeMenu, setActiveMenu] = useState(null);
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null); 
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsScrolledUp(false);
    setUnreadCount(0);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isUp = scrollHeight - scrollTop - clientHeight > 100;
    setIsScrolledUp(isUp);
    if (!isUp) setUnreadCount(0);
  };

  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom();
    } else {
      setUnreadCount(prev => prev + 1);
    }
  }, [globalMessages.length]);

  const getSenderInfo = (senderId) => {
    if (senderId === currentUser.id) {
      return {
        displayName: currentUser.name + ' (You)',
        avatar: currentUser.avatar,
        isAnon: false,
        isMe: true,
      };
    }

    const sender = students.find((s) => s.id === senderId);
    if (!sender) {
      return { displayName: 'Unknown User', avatar: null, isAnon: true, isMe: false };
    }

    const isConnected = sender.connectionStatus === 'connected';

    return {
      displayName: isConnected ? sender.name : sender.anonUsername,
      avatar: isConnected ? sender.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${sender.anonUsername}`,
      isAnon: !isConnected,
      isMe: false,
      connectionStatus: sender.connectionStatus,
    };
  };

  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const isImage = file.type.startsWith('image/');

      const mockAttachment = {
          type: isImage ? 'image' : 'file',
          name: file.name,
          url: isImage ? URL.createObjectURL(file) : null
      };

      setAttachment(mockAttachment);
      e.target.value = ''; 
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    if (editingMsg) {
      editGlobalMessage(editingMsg.id, inputText.trim());
      setEditingMsg(null);
    } else {
      sendGlobalMessage(inputText.trim(), attachment, replyingTo?.id || null);
    }
    
    setInputText('');
    setAttachment(null);
    setReplyingTo(null);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
    if (!isScrolledUp) scrollToBottom();
  };

  const startEdit = (msg) => {
    setEditingMsg(msg);
    setInputText(msg.text);
    setReplyingTo(null);
    if (textareaRef.current) {
        textareaRef.current.focus();
    }
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const visibleMessages = globalMessages.filter(msg => !currentUser.blockedUsers?.includes(msg.senderId));

  return (
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px]">

      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center gap-3 flex-shrink-0 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        <div>
          <h2 className="font-black text-zinc-950 text-xl tracking-tight">Global Campus Chat</h2>
          <p className="text-xs text-zinc-500 font-medium">#international-hub · ({onlineUsersCount} online)</p>
        </div>

        <div className="ml-auto hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 shadow-sm">
          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span className="text-xs text-amber-700 font-bold">Privacy On</span>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 pb-[80px] md:pb-6 relative scroll-smooth"
      >
        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <svg className="w-12 h-12 mb-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
          </div>
        )}

        {visibleMessages.length > 0 && (
            <div className="flex justify-center my-6">
                <span className="px-4 py-1.5 bg-white border border-zinc-200 rounded-full text-[10px] text-zinc-500 font-bold tracking-widest uppercase shadow-sm">
                    Today
                </span>
            </div>
        )}

        {visibleMessages.map((msg) => {
          const sender = getSenderInfo(msg.senderId);
          const isMe = sender.isMe;
          const isMenuOpen = activeMenu === msg.id;
          const repliedMsg = msg.replyToId ? globalMessages.find(m => m.id === msg.replyToId) : null;
          const repliedSender = repliedMsg ? getSenderInfo(repliedMsg.senderId) : null;

          return (
            <div
              key={msg.id}
              onClick={() => setActiveMenu(isMenuOpen ? null : msg.id)}
              className={`flex items-end gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'} cursor-pointer md:cursor-default`}
            >
              <img
                src={sender.avatar}
                alt={sender.displayName}
                className={`w-10 h-10 rounded-full flex-shrink-0 border-2 bg-white ${
                  sender.isAnon
                    ? 'border-zinc-200 shadow-sm'
                    : isMe
                    ? 'border-emerald-200 shadow-sm'
                    : 'border-blue-200 shadow-sm'
                }`}
              />

              <div className={`max-w-[85%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1.5 relative`}>

                <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-bold text-zinc-900">{sender.displayName}</span>
                  {!isMe && <span className="text-xs font-medium text-zinc-500">{msg.timestamp}</span>}
                  
                  {sender.isAnon && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 font-bold">
                      anonymous
                    </span>
                  )}
                  {!sender.isAnon && !isMe && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      connected
                    </span>
                  )}

                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(isMenuOpen ? null : msg.id); }}
                      className={`p-1 rounded hover:bg-zinc-100 text-zinc-400 transition-all ${isMenuOpen ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100'}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                        {isMe ? (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); startEdit(msg); setActiveMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteGlobalMessage(msg.id); setActiveMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); reportUser(msg.senderId); setActiveMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <Flag className="w-3.5 h-3.5" />
                              Report User
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); blockUser(msg.senderId); setActiveMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Block User
                            </button>
                            {currentUser?.role === 'admin' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteGlobalMessage(msg.id); setActiveMenu(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors border-t border-zinc-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Admin Delete
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative group/bubble">
                    {repliedMsg && repliedSender && (
                        <div className={`mb-1 p-2 rounded-lg text-xs border-l-4 ${isMe ? 'bg-emerald-700/20 border-emerald-300 text-emerald-50' : 'bg-black/5 border-zinc-300 text-zinc-500'}`}>
                            <p className="font-bold mb-0.5">{repliedSender.displayName}</p>
                            <p className="truncate opacity-80">{repliedMsg.text}</p>
                        </div>
                    )}
                    <div
                      className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-sm'
                          : sender.isAnon
                          ? 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-sm'
                          : 'bg-zinc-100 text-zinc-900 border border-zinc-200/60 rounded-bl-sm'
                      }`}
                    >
                      {msg.attachment && (
                          <div className={`mb-3 ${msg.text ? `border-b pb-3 ${isMe ? 'border-emerald-500' : 'border-zinc-200'}` : ''}`}>
                              {msg.attachment.type === 'image' ? (
                                  <img 
                                    src={msg.attachment.url} 
                                    alt="attachment" 
                                    className="max-h-64 rounded-xl object-cover shadow-sm border border-black/5"
                                  />
                              ) : (
                                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${isMe ? 'bg-emerald-700/50 border-emerald-500' : 'bg-zinc-50 border-zinc-200'}`}>
                                      <FileText className={`w-6 h-6 ${isMe ? 'text-white' : 'text-zinc-500'}`} />
                                      <span className={`text-sm font-medium truncate max-w-[200px] ${isMe ? 'text-white' : 'text-zinc-800'}`}>{msg.attachment.name}</span>
                                  </div>
                              )}
                          </div>
                      )}
                      {msg.text}
                      {msg.isEdited && <span className={`text-[10px] ml-2 font-medium ${isMe ? 'text-emerald-200' : 'text-zinc-400'}`}>(edited)</span>}
                    </div>

                    <div className={`absolute -top-11 md:-top-5 ${isMe ? 'right-0 md:right-auto md:-left-14' : 'left-0 md:left-auto md:-right-24'} ${isMenuOpen ? 'flex' : 'hidden md:group-hover/bubble:flex'} items-center gap-1 bg-white border border-zinc-200 rounded-full px-2 py-1 shadow-lg z-30 transition-all scale-[0.85] md:scale-100 origin-bottom`}>
                        {['👍', '❤️', '😂'].map(emoji => (
                            <button 
                                key={emoji} 
                                onClick={(e) => { e.stopPropagation(); addReactionToMessage(msg.id, emoji); setActiveMenu(null); }}
                                className="hover:scale-125 transition-transform text-lg"
                            >
                                {emoji}
                            </button>
                        ))}
                        <div className="w-[1px] h-4 bg-zinc-200 mx-1"></div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); setEditingMsg(null); setActiveMenu(null); textareaRef.current?.focus(); }}
                            className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-emerald-600 transition-colors"
                        >
                            <Reply className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {msg.reactions && msg.reactions.length > 0 && (
                    <div className={`flex gap-1 -mt-2.5 z-10 ${isMe ? 'justify-end pr-2' : 'justify-start pl-2'}`}>
                        {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => {
                            const count = msg.reactions.filter(r => r.emoji === emoji).length;
                            return (
                                <span key={emoji} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-zinc-200 shadow-sm rounded-full text-xs font-bold text-zinc-700">
                                    {emoji} {count > 1 && count}
                                </span>
                            );
                        })}
                    </div>
                )}
                
                {isMe && <span className="text-[10px] text-zinc-400 font-medium">{msg.timestamp}</span>}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {isScrolledUp && (
        <div className="absolute bottom-24 right-6 z-20">
          <button
            onClick={scrollToBottom}
            className="flex items-center justify-center w-10 h-10 bg-white border border-zinc-200 text-zinc-600 rounded-full shadow-lg hover:bg-zinc-50 hover:text-emerald-600 transition-all relative"
          >
            <ChevronDown className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-4 border-t border-zinc-200 bg-white flex-shrink-0 flex flex-col gap-2 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">

        {replyingTo && (
            <div className="flex items-center gap-3 p-2.5 bg-emerald-50/50 border-l-4 border-emerald-500 rounded-r-xl w-full max-w-5xl mx-auto shadow-sm text-sm">
                <Reply className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-emerald-800 text-xs">Replying to {getSenderInfo(replyingTo.senderId).displayName}</p>
                    <p className="text-zinc-600 truncate">{replyingTo.text}</p>
                </div>
                <button 
                    onClick={() => setReplyingTo(null)}
                    className="p-1.5 rounded-full hover:bg-emerald-100 text-emerald-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}

        {editingMsg && (
            <div className="flex items-center gap-3 p-2.5 bg-amber-50/50 border-l-4 border-amber-500 rounded-r-xl w-full max-w-5xl mx-auto shadow-sm text-sm">
                <Edit2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-amber-800 text-xs">Editing Message</p>
                </div>
                <button 
                    onClick={() => { setEditingMsg(null); setInputText(''); }}
                    className="p-1.5 rounded-full hover:bg-amber-100 text-amber-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}

        {attachment && (
            <div className="flex items-center gap-3 p-2 bg-zinc-50 border border-zinc-200 rounded-xl w-fit shadow-sm">
                {attachment.type === 'image' ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-200 border border-zinc-200">
                        <img src={attachment.url} alt="preview" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-zinc-400" />
                    </div>
                )}
                <div className="flex flex-col max-w-[150px]">
                    <span className="text-xs font-bold text-zinc-800 truncate">{attachment.name}</span>
                    <span className="text-[10px] text-zinc-500 font-medium">{attachment.type === 'image' ? 'Image Attachment' : 'File Attachment'}</span>
                </div>
                <button 
                    onClick={() => setAttachment(null)}
                    className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-3 max-w-5xl mx-auto w-full">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx"
          />

          <div className="flex-1 relative flex items-end">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={editingMsg ? "Edit message..." : "Message #international-hub..."}
              rows={1}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-5 pr-12 py-3.5 text-[15px] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner resize-none min-h-[50px] max-h-[120px]"
            />
            <button type="button" className="absolute right-4 bottom-3.5 text-zinc-400 hover:text-zinc-600 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() && !attachment}
            className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg text-white self-end mb-1"
          >
            {editingMsg ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5 -ml-0.5" />}
          </button>
        </form>

        <p className="text-[10px] text-zinc-400 font-medium text-center hidden sm:block mt-1">
          Your messages are visible to everyone. Connect with a student to see their real identity.
        </p>
      </div>
    </div>
  );
}
