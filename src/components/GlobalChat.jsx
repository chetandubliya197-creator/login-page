import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Paperclip, X, Image as ImageIcon, FileText } from 'lucide-react';

export default function GlobalChat() {
  const { currentUser, students, globalMessages, sendGlobalMessage, addReactionToMessage } = useContext(AppContext);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null); 
  const messagesEndRef = useRef(null); 
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [globalMessages]);

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
    sendGlobalMessage(inputText.trim(), attachment);
    setInputText('');
    setAttachment(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 md:pt-0 pt-[53px]">

      <div className="px-6 py-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm flex items-center gap-3 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
        <div>
          <h2 className="font-bold text-white text-lg">Global Chat</h2>
          <p className="text-xs text-gray-500">All college students · Anonymous until connected</p>
        </div>

        <div className="ml-auto flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
          <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span className="text-xs text-orange-400 font-medium">Privacy On</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-[80px] md:pb-4">
        {globalMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}

        {globalMessages.length > 0 && (
            <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-gray-900 border border-white/10 rounded-full text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                    Today
                </span>
            </div>
        )}

        {globalMessages.map((msg) => {
          const sender = getSenderInfo(msg.senderId);
          const isMe = sender.isMe;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >

              <img
                src={sender.avatar}
                alt={sender.displayName}
                className={`w-8 h-8 rounded-full flex-shrink-0 border-2 ${
                  sender.isAnon
                    ? 'border-gray-600 opacity-70'
                    : isMe
                    ? 'border-red-500/50'
                    : 'border-blue-500/50'
                }`}
              />

              <div className={`max-w-[85%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1 relative`}>

                <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-semibold text-gray-300">{sender.displayName}</span>
                  {sender.isAnon && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-400 border border-gray-600">
                      anonymous
                    </span>
                  )}
                  {!sender.isAnon && !isMe && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-900/40 text-green-400 border border-green-700/40">
                      connected
                    </span>
                  )}
                </div>

                <div className="relative group/bubble">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-red-600/80 text-white rounded-br-sm'
                          : sender.isAnon
                          ? 'bg-gray-800/80 text-gray-300 border border-white/5 rounded-bl-sm'
                          : 'bg-gray-700/80 text-white border border-white/5 rounded-bl-sm'
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

                      {msg.text}
                    </div>

                    <div className={`absolute -top-4 ${isMe ? '-left-12' : '-right-12'} hidden group-hover/bubble:flex items-center gap-1 bg-gray-900 border border-white/10 rounded-full px-2 py-1 shadow-xl z-10 transition-all`}>
                        {['👍', '❤️', '😂'].map(emoji => (
                            <button 
                                key={emoji} 
                                onClick={() => addReactionToMessage(msg.id, emoji)}
                                className="hover:scale-125 transition-transform"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {msg.reactions && msg.reactions.length > 0 && (
                    <div className={`flex gap-1 -mt-2 z-10 ${isMe ? 'justify-end pr-2' : 'justify-start pl-2'}`}>
                        {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => {
                            const count = msg.reactions.filter(r => r.emoji === emoji).length;
                            return (
                                <span key={emoji} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-900 border border-white/10 rounded-full text-[10px]">
                                    {emoji} {count > 1 && count}
                                </span>
                            );
                        })}
                    </div>
                )}

                <span className="text-[10px] text-gray-600">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {inputText.length > 3 && (
            <div className="flex items-end gap-3 opacity-50 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0" />
                <div className="bg-gray-800/50 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
            </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-4 border-t border-white/10 bg-gray-900/30 backdrop-blur-sm flex-shrink-0 flex flex-col gap-2">

        {attachment && (
            <div className="flex items-center gap-3 p-2 bg-gray-800/80 border border-white/10 rounded-xl w-fit">
                {attachment.type === 'image' ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-900">
                        <img src={attachment.url} alt="preview" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                )}
                <div className="flex flex-col max-w-[150px]">
                    <span className="text-xs font-semibold text-white truncate">{attachment.name}</span>
                    <span className="text-[10px] text-gray-400">{attachment.type === 'image' ? 'Image Attachment' : 'File Attachment'}</span>
                </div>
                <button 
                    onClick={() => setAttachment(null)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-3">

          <img
            src={currentUser.avatar}
            alt="You"
            className="w-9 h-9 rounded-full border-2 border-red-500/40 flex-shrink-0 hidden sm:block"
          />

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
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to the whole college..."
            className="flex-1 bg-gray-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !attachment}
            className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </form>

        <p className="text-[10px] text-gray-600 text-center hidden sm:block">
          Your messages are visible to everyone. Connect with a student to see their real identity.
        </p>
      </div>
    </div>
  );
}
