import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, User, Paperclip, X, FileText, ArrowLeft, MoreVertical, Flag, Ban, Search, Phone, Video, Smile, MessageSquareText } from 'lucide-react';

export default function PrivateChat() {
  const { currentUser, students, privateMessages, sendPrivateMessage, reportUser, blockUser } = useContext(AppContext);
  const [activeChat, setActiveChat] = useState(null); 
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const connectedStudents = students.filter(s => 
    s.connectionStatus === 'connected' && 
    !currentUser.blockedUsers?.includes(s.id) &&
    !s.isSuspended &&
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
      scrollToBottom();
  }, [privateMessages, activeChat]);

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

    sendPrivateMessage(activeChat.id, inputText, attachment);
    setInputText('');
    setAttachment(null);
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
                    {connectedStudents.map(student => (
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
                                    <h3 className="text-[14px] font-bold text-[#0f172a] truncate">{student.name}</h3>
                                    <span className="text-[10px] font-medium text-emerald-600">10:42 AM</span>
                                </div>
                                <p className="text-[13px] text-zinc-500 font-medium truncate flex items-center gap-2">
                                    Are we still meeting at the libr...
                                    {activeChat?.id !== student.id && <span className="w-2 h-2 bg-emerald-500 rounded-full ml-auto shrink-0"></span>}
                                </p>
                            </div>
                        </button>
                    ))}
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

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6" onClick={() => setIsMenuOpen(false)}>
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

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {!isMe && (
                                            <img src={activeChat.avatar} className="w-8 h-8 rounded-full border border-zinc-200 mr-2 self-end mb-1" alt="" />
                                        )}
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed shadow-sm border ${
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
                                                <p className="font-medium tracking-wide">{msg.text}</p>
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

                <div className="p-4 bg-white border-t border-zinc-200 pb-[76px] md:pb-4 flex flex-col gap-2 z-10">

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

                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none text-[#0f172a] px-2 py-2 text-[14px] focus:outline-none focus:ring-0 placeholder-zinc-400 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() && !attachment}
                            className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white transition-colors flex-shrink-0 mr-1"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </>
        )}
      </div>
    </div>
  );
}
