import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, User, Paperclip, X, FileText, ArrowLeft, MoreVertical, Flag, Ban } from 'lucide-react';

export default function PrivateChat() {
  const { currentUser, students, privateMessages, sendPrivateMessage, reportUser, blockUser } = useContext(AppContext);
  const [activeChat, setActiveChat] = useState(null); 
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const connectedStudents = students.filter(s => 
    s.connectionStatus === 'connected' && 
    !currentUser.blockedUsers?.includes(s.id) &&
    !s.isSuspended
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
    <div className="flex h-full bg-zinc-50 md:pt-0 pt-[53px]">

      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-zinc-200 bg-white flex-shrink-0 flex flex-col z-10 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-zinc-200 flex-shrink-0 bg-white">
          <h2 className="font-black text-zinc-950 text-xl tracking-tight">Messages</h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">Chat with your connections</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
            {connectedStudents.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm font-medium">
                    You don't have any connections yet, or they are unavailable. Go to Discover to find people!
                </div>
            ) : (
                <div className="space-y-1">
                    {connectedStudents.map(student => (
                        <button
                            key={student.id}
                            onClick={() => { setActiveChat(student); setIsMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left border
                                ${activeChat?.id === student.id 
                                    ? 'bg-zinc-100 border-zinc-200 shadow-sm' 
                                    : 'bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-100'}
                            `}
                        >
                            <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full border border-zinc-200 bg-zinc-100 shadow-sm" />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[15px] font-bold text-zinc-900 truncate">{student.name}</h3>
                                <p className="text-xs text-zinc-500 font-medium truncate">{student.branch}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>

        {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6 shadow-inner text-zinc-400">
                    <User className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-zinc-950 mb-2 tracking-tight">Your Private Messages</h3>
                <p className="text-sm font-medium">Select a connection from the sidebar to start chatting.</p>
            </div>
        ) : (
            <>
                <div className="px-4 py-3 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center gap-3 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative">
                    <button 
                        onClick={() => setActiveChat(null)}
                        className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full border border-zinc-200 shadow-sm bg-white" />
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-zinc-950">{activeChat.name}</h3>
                        <p className="text-[11px] text-zinc-500 font-medium">{activeChat.branch}</p>
                    </div>

                    <div className="relative">
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

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" onClick={() => setIsMenuOpen(false)}>
                    {currentConversation.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-sm font-medium">
                            No messages yet. Say hi to {activeChat.name.split(' ')[0]}!
                        </div>
                    ) : (
                        currentConversation.map((msg) => {
                            const isMe = msg.senderId === currentUser.id;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm ${
                                            isMe
                                            ? 'bg-emerald-600 text-white rounded-br-sm'
                                            : 'bg-white border border-zinc-200 text-zinc-900 rounded-bl-sm'
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
                                        <p>{msg.text}</p>
                                        <span className={`block text-[10px] mt-1.5 font-medium ${isMe ? 'text-emerald-100' : 'text-zinc-400'}`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-zinc-200 pb-[76px] md:pb-4 flex flex-col gap-2 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">

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
                        className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full p-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner"
                    >

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
                            className="p-2.5 rounded-full hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors flex-shrink-0"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 bg-transparent border-none text-zinc-900 px-2 py-2 text-[15px] focus:outline-none focus:ring-0 placeholder-zinc-400 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() && !attachment}
                            className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-colors shadow-md flex-shrink-0"
                        >
                            <Send className="w-5 h-5 -ml-0.5" />
                        </button>
                    </form>
                </div>
            </>
        )}
      </div>
    </div>
  );
}
