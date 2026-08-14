import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, User, Paperclip, X, FileText, ArrowLeft, MoreVertical, Flag, Ban, Search, Phone, Video, Smile, MessageSquareText, Reply, Edit2, Trash2, ChevronDown, Check } from 'lucide-react';

export default function PrivateChat() {
  const { currentUser, students, privateMessages, sendPrivateMessage, editPrivateMessage, deletePrivateMessage, reportUser, blockUser, markPrivateConversationAsRead } = useContext(AppContext);
  const [activeChat, setActiveChat] = useState(null); 
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const connectedStudents = students.filter(s => 
    s.connectionStatus === 'connected' && 
    !currentUser.blockedUsers?.includes(s.id) &&
    !s.isSuspended &&
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLatestMessage = (studentId) => {
    const conversation = privateMessages.filter(m => 
        (m.senderId === currentUser.id && m.conversationId === studentId) ||
        (m.senderId === studentId && m.conversationId === currentUser.id)
    );
    return conversation.length > 0 ? conversation[conversation.length - 1] : null;
  };

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
  }, [privateMessages.length, activeChat]);

  // If the active chat gets blocked or suspended, clear the active chat
  useEffect(() => {
    if (activeChat) {
        const isBlocked = currentUser.blockedUsers?.includes(activeChat.id);
        const updatedStudent = students.find(s => s.id === activeChat.id);
        if (isBlocked || updatedStudent?.isSuspended) {
            setActiveChat(null);
        }
    }
  }, [currentUser.blockedUsers, students, activeChat]);

  // Mark messages as read when a chat is open
  useEffect(() => {
    if (activeChat) {
      markPrivateConversationAsRead(activeChat.id);
    }
  }, [activeChat, privateMessages.length]);

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
    if ((!inputText.trim() && !attachment) || !activeChat) return;

    if (editingMsg) {
      editPrivateMessage(editingMsg.id, inputText.trim());
      setEditingMsg(null);
    } else {
      sendPrivateMessage(activeChat.id, inputText.trim(), attachment, replyingTo?.id || null);
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

  const currentConversation = activeChat 
    ? privateMessages.filter(m => 
        (m.senderId === currentUser.id && m.conversationId === activeChat.id) ||
        (m.senderId === activeChat.id && m.conversationId === currentUser.id)
      )
    : [];

  return (
    <div className="flex h-full bg-white md:pt-0 pt-[53px]">

      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-zinc-200 bg-white flex-shrink-0 flex flex-col z-10 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-zinc-100 flex-shrink-0 bg-white flex justify-between items-center">
          <h2 className="font-black text-[#0f172a] text-xl tracking-tight">Messages</h2>
          <button className="text-zinc-400 hover:text-zinc-600">
             <FileText className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-100">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="Search messages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-9 pr-4 py-2 text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {connectedStudents.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm font-medium">
                    No conversations found.
                </div>
            ) : (
                <div className="flex flex-col">
                    {connectedStudents.map(student => {
                        const latestMsg = getLatestMessage(student.id);
                        const isUnread = latestMsg && latestMsg.senderId === student.id && !latestMsg.read;

                        return (
                        <button
                            key={student.id}
                            onClick={() => { setActiveChat(student); setIsMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 p-4 transition-all text-left border-b border-zinc-50
                                ${activeChat?.id === student.id 
                                    ? 'bg-zinc-50/80' 
                                    : 'bg-white hover:bg-zinc-50/50'}
                            `}
                        >
                            <div className="relative">
                                <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full border border-zinc-200 bg-zinc-100" />
                                {student.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`text-[14px] truncate ${isUnread ? 'font-black text-[#0f172a]' : 'font-bold text-[#0f172a]'}`}>{student.name}</h3>
                                    {latestMsg && <span className={`text-[10px] font-medium ${isUnread ? 'text-emerald-600 font-bold' : 'text-zinc-400'}`}>{latestMsg.timestamp}</span>}
                                </div>
                                <p className={`text-[13px] truncate flex items-center gap-2 ${isUnread ? 'text-emerald-700 font-bold' : 'text-zinc-500 font-medium'}`}>
                                    {latestMsg 
                                        ? (latestMsg.attachment ? (latestMsg.attachment.type === 'image' ? '📸 Image' : '📎 Attachment') : latestMsg.text)
                                        : 'Say hi!'
                                    }
                                    {isUnread && <span className="w-2 h-2 bg-emerald-500 rounded-full ml-auto shrink-0"></span>}
                                </p>
                            </div>
                        </button>
                    )})}
                </div>
            )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col relative bg-zinc-50/30 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>

        {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6 shadow-inner text-zinc-400">
                    <MessageSquareText className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-zinc-950 mb-2 tracking-tight">Your Messages</h3>
                <p className="text-sm font-medium">Select a conversation from the sidebar to start chatting.</p>
            </div>
        ) : (
            <>
                <div className="px-6 py-4 border-b border-zinc-200 bg-white flex items-center gap-3 z-10">
                    <button 
                        onClick={() => setActiveChat(null)}
                        className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="relative">
                        <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full border border-zinc-200 bg-white" />
                        {activeChat.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[15px] font-bold text-[#0f172a]">{activeChat.name}</h3>
                        <p className="text-[12px] text-zinc-500 font-medium">Active now</p>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors hidden sm:block">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors hidden sm:block">
                            <Video className="w-5 h-5" />
                        </button>

                        <div className="relative ml-2">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                                    <button 
                                        onClick={() => { reportUser(activeChat.id); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                                    >
                                        <Flag className="w-3.5 h-3.5" />
                                        Report User
                                    </button>
                                    <button 
                                        onClick={() => { blockUser(activeChat.id); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                        <Ban className="w-3.5 h-3.5" />
                                        Block User
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative scroll-smooth" 
                    onClick={() => setIsMenuOpen(false)}
                >
                    {currentConversation.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-sm font-medium">
                            No messages yet. Say hi to {activeChat.name.split(' ')[0]}!
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center my-4">
                                <span className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Today, 9:30 AM</span>
                            </div>
                            {currentConversation.map((msg) => {
                                const isMe = msg.senderId === currentUser.id;
                                const repliedMsg = msg.replyToId ? currentConversation.find(m => m.id === msg.replyToId) : null;
                                const repliedSenderName = repliedMsg ? (repliedMsg.senderId === currentUser.id ? currentUser.name : activeChat.name) : null;

                                return (
                                    <div
                                        key={msg.id}
                                        onClick={() => setActiveMenu(activeMenu === msg.id ? null : msg.id)}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} cursor-pointer md:cursor-default`}
                                    >
                                        {!isMe && (
                                            <img src={activeChat.avatar} className="w-8 h-8 rounded-full border border-zinc-200 mr-2 self-end mb-1" alt="" />
                                        )}
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className="relative group/bubble">
                                                {repliedMsg && repliedSenderName && (
                                                    <div className={`mb-1 p-2 rounded-lg text-xs border-l-4 ${isMe ? 'bg-[#1e293b]/20 border-zinc-500 text-[#0f172a]' : 'bg-black/5 border-zinc-300 text-zinc-500'}`}>
                                                        <p className="font-bold mb-0.5">{repliedSenderName}</p>
                                                        <p className="truncate opacity-80">{repliedMsg.text}</p>
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[75%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed shadow-sm border whitespace-pre-wrap ${
                                                        isMe
                                                        ? 'bg-[#0f172a] text-white rounded-br-sm border-[#0f172a]'
                                                        : 'bg-white border-zinc-200 text-zinc-900 rounded-bl-sm'
                                                    }`}
                                                >
                                                    {msg.attachment && (
                                                        <div className={`mb-3 ${msg.text ? `border-b pb-3 ${isMe ? 'border-zinc-700' : 'border-zinc-200'}` : ''}`}>
                                                            {msg.attachment.type === 'image' ? (
                                                                <img 
                                                                    src={msg.attachment.url} 
                                                                    alt="attachment" 
                                                                    className="max-h-64 rounded-xl object-cover shadow-sm border border-black/5"
                                                                />
                                                            ) : (
                                                                <div className={`flex items-center gap-3 p-3 rounded-xl border ${isMe ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                                                                    <FileText className={`w-6 h-6 ${isMe ? 'text-white' : 'text-zinc-500'}`} />
                                                                    <span className={`text-sm font-medium truncate max-w-[200px] ${isMe ? 'text-white' : 'text-zinc-800'}`}>{msg.attachment.name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className="font-medium tracking-wide">
                                                        {msg.text}
                                                        {msg.isEdited && <span className={`text-[10px] ml-2 font-medium ${isMe ? 'text-zinc-400' : 'text-zinc-400'}`}>(edited)</span>}
                                                    </p>
                                                </div>

                                                <div className={`absolute -top-11 md:top-1/2 md:-translate-y-1/2 ${isMe ? 'right-0 md:right-auto md:-left-20' : 'left-0 md:left-auto md:-right-20'} ${activeMenu === msg.id ? 'flex' : 'hidden md:group-hover/bubble:flex'} items-center gap-1 bg-white border border-zinc-200 rounded-full px-1 py-1 shadow-lg z-20 transition-all scale-[0.85] md:scale-100 origin-bottom`}>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); setEditingMsg(null); setActiveMenu(null); textareaRef.current?.focus(); }}
                                                        className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-emerald-600 transition-colors"
                                                        title="Reply"
                                                    >
                                                        <Reply className="w-3.5 h-3.5" />
                                                    </button>
                                                    {isMe && (
                                                        <>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); startEdit(msg); setActiveMenu(null); }}
                                                                className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-blue-600 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); deletePrivateMessage(msg.id); setActiveMenu(null); }}
                                                                className="p-1.5 hover:bg-rose-50 rounded-full text-zinc-400 hover:text-rose-600 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[10px] mt-1.5 font-semibold text-zinc-400 mx-1">
                                                {msg.timestamp} {isMe && '• Read'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {isScrolledUp && (
                    <div className="absolute bottom-[90px] md:bottom-20 right-6 z-20">
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

                <div className="p-4 bg-white border-t border-zinc-200 pb-[76px] md:pb-4 flex flex-col gap-2 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                    
                    {replyingTo && (
                        <div className="flex items-center gap-3 p-2.5 bg-zinc-50 border-l-4 border-zinc-500 rounded-r-xl w-full max-w-5xl mx-auto shadow-sm text-sm">
                            <Reply className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-zinc-800 text-xs">Replying to {replyingTo.senderId === currentUser.id ? currentUser.name : activeChat.name}</p>
                                <p className="text-zinc-600 truncate">{replyingTo.text}</p>
                            </div>
                            <button 
                                onClick={() => setReplyingTo(null)}
                                className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-600 transition-colors"
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
                            <div className="flex flex-col max-w-[120px]">
                                <span className="text-xs font-bold text-zinc-800 truncate">{attachment.name}</span>
                                <span className="text-[10px] text-zinc-500 font-medium">{attachment.type === 'image' ? 'Image' : 'File'}</span>
                            </div>
                            <button 
                                onClick={() => setAttachment(null)}
                                className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2 bg-white border border-zinc-300 rounded-full p-1 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-sm"
                    >
                        <button
                            type="button"
                            className="p-2.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors flex-shrink-0 ml-1"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect}
                            className="hidden" 
                            accept="image/*,.pdf,.doc,.docx"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors flex-shrink-0"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>

                        <div className="flex-1 relative flex items-end w-full">
                            <textarea
                                ref={textareaRef}
                                value={inputText}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                placeholder={editingMsg ? "Edit message..." : "Type a message..."}
                                rows={1}
                                className="w-full bg-transparent border-none text-[#0f172a] px-2 py-2.5 text-[14px] focus:outline-none focus:ring-0 placeholder-zinc-400 font-medium resize-none min-h-[40px] max-h-[120px]"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!inputText.trim() && !attachment}
                            className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white transition-colors flex-shrink-0 mr-1 self-end mb-1"
                        >
                            {editingMsg ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4 -ml-0.5" />}
                        </button>
                    </form>
                </div>
            </>
        )}
      </div>
    </div>
  );
}
