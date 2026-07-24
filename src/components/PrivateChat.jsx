import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, User, Paperclip, X, FileText } from 'lucide-react';

export default function PrivateChat() {
  const { currentUser, students, privateMessages, sendPrivateMessage } = useContext(AppContext);
  const [activeChat, setActiveChat] = useState(null); 
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const connectedStudents = students.filter(s => s.connectionStatus === 'connected');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
      scrollToBottom();
  }, [privateMessages, activeChat]);

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
    <div className="flex h-full bg-gray-950 md:pt-0 pt-[53px]">

      <div className={`w-full md:w-80 border-r border-white/10 bg-gray-900/40 flex-shrink-0 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="font-bold text-white text-lg">Messages</h2>
          <p className="text-xs text-gray-500 mt-0.5">Chat with your connections</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
            {connectedStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                    You don't have any connections yet. Go to Discover to find people!
                </div>
            ) : (
                <div className="space-y-1">
                    {connectedStudents.map(student => (
                        <button
                            key={student.id}
                            onClick={() => setActiveChat(student)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left
                                ${activeChat?.id === student.id ? 'bg-white/10' : 'hover:bg-white/5'}
                            `}
                        >
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full border border-white/10 bg-gray-800" />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white truncate">{student.name}</h3>
                                <p className="text-xs text-gray-400 truncate">{student.branch}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>

        {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-400">
                    <User className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Your Private Messages</h3>
                <p className="text-sm">Select a connection from the sidebar to start chatting.</p>
            </div>
        ) : (
            <>

                <div className="px-4 py-3 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm flex items-center gap-3">
                    <button 
                        onClick={() => setActiveChat(null)}
                        className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-8 h-8 rounded-full border border-white/10" />
                    <div>
                        <h3 className="text-sm font-bold text-white">{activeChat.name}</h3>
                        <p className="text-[10px] text-gray-400">{activeChat.branch}</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentConversation.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
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
                                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                                            isMe
                                            ? 'bg-red-600 text-white rounded-br-sm'
                                            : 'bg-gray-800 border border-white/10 text-gray-100 rounded-bl-sm'
                                        }`}
                                    >

                                        {msg.attachment && (
                                            <div className={`mb-2 ${msg.text ? 'border-b border-white/10 pb-2' : ''}`}>
                                                {msg.attachment.type === 'image' ? (
                                                    <img 
                                                        src={msg.attachment.url} 
                                                        alt="attachment" 
                                                        className="max-h-48 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className={`flex items-center gap-2 p-2 rounded-xl ${isMe ? 'bg-red-700/50' : 'bg-gray-900/50'}`}>
                                                        <FileText className="w-5 h-5 text-gray-300" />
                                                        <span className="text-xs text-gray-200 truncate max-w-[150px]">{msg.attachment.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <p>{msg.text}</p>
                                        <span className={`block text-[10px] mt-1 ${isMe ? 'text-red-200' : 'text-gray-500'}`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-gray-900/80 border-t border-white/10 pb-[76px] md:pb-4 flex flex-col gap-2">

                    {attachment && (
                        <div className="flex items-center gap-3 p-2 bg-gray-800/80 border border-white/10 rounded-xl w-fit">
                            {attachment.type === 'image' ? (
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-900">
                                    <img src={attachment.url} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                </div>
                            )}
                            <div className="flex flex-col max-w-[120px]">
                                <span className="text-xs font-semibold text-white truncate">{attachment.name}</span>
                                <span className="text-[10px] text-gray-400">{attachment.type === 'image' ? 'Image' : 'File'}</span>
                            </div>
                            <button 
                                onClick={() => setAttachment(null)}
                                className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2 bg-gray-950 border border-white/10 rounded-xl p-1.5 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50 transition-all"
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
                            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 bg-transparent border-none text-white px-2 py-2 text-sm focus:outline-none focus:ring-0 placeholder-gray-600"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() && !attachment}
                            className="p-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white transition-colors"
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
