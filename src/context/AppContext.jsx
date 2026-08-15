import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage('cp_user', null);
  const [students, setStudents] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [globalMessages, setGlobalMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  
  const socketRef = useRef(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);

  // Anti-Misuse State (Rate Limiting)
  const [globalMessageHistory, setGlobalMessageHistory] = useLocalStorage('cp_global_msg_hist', []);
  const [connectionHistory, setConnectionHistory] = useLocalStorage('cp_conn_hist', []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const [societyAnnouncements, setSocietyAnnouncements] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const unreadPrivateCount = privateMessages.filter(
    m => m.senderId !== currentUser?.id && !m.read
  ).length;

  const API_BASE_URL = 'https://campuspulse-jnfo.onrender.com';

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) setStudents(await res.json());
    } catch (e) {
      console.error('Error fetching students', e);
    }
  }, [currentUser?.token]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/notifications`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) setNotifications(await res.json());
    } catch (e) {
      console.error('Error fetching notifications', e);
    }
  }, [currentUser?.token]);

  const fetchGlobalMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/global`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) setGlobalMessages(await res.json());
    } catch (e) {
      console.error('Error fetching chat', e);
    }
  }, [currentUser?.token]);

  const fetchPrivateMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/private-chat`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) setPrivateMessages(await res.json());
    } catch (e) {
      console.error('Error fetching private messages', e);
    }
  }, [currentUser?.token]);

  const fetchSocieties = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/societies`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) setSocieties(await res.json());
    } catch (e) {
      console.error('Error fetching societies', e);
    }
  }, [currentUser?.token]);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/societies/announcements`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) setSocietyAnnouncements(await res.json());
    } catch (e) {
      console.error('Error fetching announcements', e);
    }
  }, [currentUser?.token]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) setPosts(await res.json());
    } catch (e) {
      console.error('Error fetching posts', e);
    }
  }, [currentUser?.token]);

  const createAnnouncement = async (societyId, title, text, isPinned = false) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/societies/${societyId}/announcements`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}` 
        },
        body: JSON.stringify({ title, text, isPinned })
      });
      if (res.ok) {
        const newAnn = await res.json();
        setSocietyAnnouncements(prev => [newAnn, ...prev]);
        showToast('Announcement posted successfully!', 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to post announcement', 'error');
        return false;
      }
    } catch (e) {
      console.error('Error creating announcement', e);
      showToast('Network error', 'error');
      return false;
    }
  };

  const createSociety = async (name, description, icon) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/societies`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}` 
        },
        body: JSON.stringify({ name, description, icon })
      });
      if (res.ok) {
        const newSoc = await res.json();
        setSocieties(prev => [...prev, newSoc]);
        showToast('Society created successfully!', 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to create society', 'error');
        return false;
      }
    } catch (e) {
      console.error('Error creating society', e);
      showToast('Network error', 'error');
      return false;
    }
  };

  const createPost = async (content) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}` 
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        const newPost = await res.json();
        setPosts(prev => [newPost, ...prev]);
        showToast('Post created successfully!', 'success');
        return true;
      }
      showToast('Failed to create post', 'error');
      return false;
    } catch (e) {
      console.error('Error creating post', e);
      showToast('Network error', 'error');
      return false;
    }
  };

  useEffect(() => {
    if (currentUser?.token) {
      fetchStudents();
      fetchNotifications();
      fetchGlobalMessages();
      fetchPrivateMessages();
      fetchSocieties();
      fetchAnnouncements();
      fetchPosts();

      socketRef.current = io(API_BASE_URL, {
        auth: { token: currentUser.token },
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('receive_global_message', (msg) => {
        setGlobalMessages(prev => [...prev, msg]);
      });

      socketRef.current.on('update_global_message', (data) => {
        setGlobalMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, text: data.newText, isEdited: data.isEdited }
            : msg
        ));
      });

      socketRef.current.on('message_deleted', (messageId) => {
        setGlobalMessages(prev => prev.filter(msg => msg.id !== messageId));
      });

      socketRef.current.on('update_reactions', (data) => {
        setGlobalMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, reactions: data.reactions }
            : msg
        ));
      });

      socketRef.current.on('online_users_update', (count) => {
        setOnlineUsersCount(count);
      });

      socketRef.current.on('user_status_change', (data) => {
        setStudents(prev => prev.map(std => 
          std.id === data.userId ? { ...std, isOnline: data.isOnline } : std
        ));
      });

      // Private message listeners
      socketRef.current.on('receive_private_message', (msg) => {
        setPrivateMessages(prev => [...prev, msg]);
      });

      socketRef.current.on('update_private_message', (data) => {
        setPrivateMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, text: data.newText, isEdited: data.isEdited }
            : msg
        ));
      });

      socketRef.current.on('private_message_deleted', (messageId) => {
        setPrivateMessages(prev => prev.filter(msg => msg.id !== messageId));
      });

      socketRef.current.on('private_messages_read', (readerId) => {
        setPrivateMessages(prev => prev.map(msg => 
          msg.conversationId === readerId && !msg.read
            ? { ...msg, read: true }
            : msg
        ));
      });

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    }
  }, [currentUser?.token, fetchStudents, fetchNotifications, fetchGlobalMessages, fetchPrivateMessages, fetchSocieties, fetchAnnouncements]);

  const requestOtp = async (email, type = 'register') => {
    try {
      const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+[a-zA-Z]+[0-9]+@indoreinstitute\.com$/;
      if (!emailRegex.test(email)) {
        showToast('Please use your @indoreinstitute.com email.', 'error');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.message || 'Failed to send OTP', 'error');
        return false;
      }

      showToast('OTP sent successfully to your email', 'success');
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      showToast('Server error. Please try again later.', 'error');
      return false;
    }
  };

  const handleRegister = async (name, email, password, otp) => {
    try {
      const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+[a-zA-Z]+[0-9]+@indoreinstitute\.com$/;
      if (!emailRegex.test(email)) {
        showToast('Please use your @indoreinstitute.com email.', 'error');
        return false;
      }

      const collegeId = email.split('@')[0].toUpperCase();
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, collegeId, password, otp }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.message || 'Registration failed', 'error');
        return false;
      }
      
      setCurrentUser(data);
      showToast(`Welcome ${data.name}! 🎉`, 'success');
      return true;
    } catch (error) {
      console.error(error);
      showToast('Network error. Is the backend running?', 'error');
      return false;
    }
  };

  const handleResetPassword = async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.message || 'Password reset failed', 'error');
        return false;
      }
      
      showToast('Password reset successfully! Please sign in.', 'success');
      return true;
    } catch (error) {
      console.error(error);
      showToast('Network error. Is the backend running?', 'error');
      return false;
    }
  };

  const handleLogin = async (emailOrId, password) => {
    if (!emailOrId.trim() || !password.trim()) {
      showToast('Please enter your email and password.', 'error');
      return false;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrId, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.message || 'Login failed', 'error');
        return false;
      }
      
      setCurrentUser(data);
      showToast(`Welcome back, ${data.name}! 👋`, 'success');
      return true;
    } catch (error) {
      console.error(error);
      showToast('Network error. Is the backend running?', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('chat');
    showToast('Logged out successfully.', 'success');
  };

  const sendGlobalMessage = (text, attachment = null, replyToId = null) => {
    if ((!text.trim() && !attachment) || !currentUser || !socketRef.current) return;

    // Strict Guideline: Rate Limiting for Global Messages (Max 5 per minute)
    const now = Date.now();
    const recentMessages = globalMessageHistory.filter(time => now - time < 60000);
    if (recentMessages.length >= 10) {
      showToast("Thoda slow karo! 1 minute mein max 10 messages hi bhej sakte ho.", "error");
      return;
    }
    setGlobalMessageHistory([...recentMessages, now]);

    socketRef.current.emit('send_global_message', { text: text.trim(), attachment, replyToId });
  };

  const editGlobalMessage = (id, newText) => {
    if (!socketRef.current) return;
    socketRef.current.emit('edit_global_message', { messageId: id, newText: newText.trim() });
  };

  const deleteGlobalMessage = (id) => {
    if (!socketRef.current) return;
    socketRef.current.emit('delete_global_message', id);
  };

  const addReactionToMessage = (messageId, emoji) => {
    if (!socketRef.current) return;
    socketRef.current.emit('react_global_message', { messageId, emoji });
  };

  const sendConnectRequest = async (id) => {
    const now = Date.now();
    const recentConnections = connectionHistory.filter(time => now - time < 86400000);
    
    const targetStudent = students.find(s => s.id === id);
    if (targetStudent && targetStudent.connectionStatus === 'not_connected') {
      if (recentConnections.length >= 10) {
        showToast("Daily limit reached. You can only send 10 connection requests per 24 hours.", "error");
        return;
      }
      setConnectionHistory([...recentConnections, now]);
    }

    setStudents(prev => prev.map(std => {
      if (std.id !== id) return std;
      if (std.connectionStatus === 'not_connected') return { ...std, connectionStatus: 'pending' };
      return std;
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/connect/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.message || 'Failed to connect', 'error');
        setStudents(prev => prev.map(std => std.id === id ? { ...std, connectionStatus: 'not_connected' } : std));
        return;
      }
      showToast('Connection request sent!', 'success');
      fetchNotifications();
    } catch (e) {
      setStudents(prev => prev.map(std => std.id === id ? { ...std, connectionStatus: 'not_connected' } : std));
      showToast('Network error', 'error');
    }
  };

  const acceptConnectRequest = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/accept/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        showToast('Connection accepted!', 'success');
        fetchStudents();
        fetchNotifications();
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to accept request', 'error');
      }
    } catch (e) {
      showToast('Network error', 'error');
    }
  };

  const rejectConnectRequest = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/reject/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        showToast('Connection rejected', 'info');
        fetchStudents();
        fetchNotifications();
      } else {
        showToast('Failed to reject request', 'error');
      }
    } catch (e) {
      showToast('Network error', 'error');
    }
  };

  const toggleSocietyJoin = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/societies/${id}/toggle-join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message, 'success');
        setSocieties(prev => prev.map(soc => 
          soc.id === id ? { ...soc, joined: data.joined, membersCount: data.membersCount } : soc
        ));
      } else {
        showToast('Failed to toggle society membership', 'error');
      }
    } catch (e) {
      showToast('Network error', 'error');
    }
  };

  const updateProfile = (updatedProfile) => {
    setCurrentUser(prev => ({ ...prev, ...updatedProfile }));
    showToast('Profile updated successfully!', 'success');
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/onboarding`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        showToast('Failed to save profile. Please try again.', 'error');
        return;
      }

      const updatedUser = await response.json();
      setCurrentUser(prev => ({ ...prev, ...updatedUser, token: prev.token, isOnboarded: true }));
      showToast('Welcome to CampusPulse! 🎉', 'success');
    } catch (error) {
      console.error(error);
      showToast('Network error while saving profile.', 'error');
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const sendPrivateMessage = (receiverId, text, attachment = null, replyToId = null) => {
    if ((!text.trim() && !attachment) || !currentUser || !socketRef.current) return;

    if (currentUser.blockedUsers?.includes(receiverId)) {
        showToast("You cannot send messages to a blocked user.", "error");
        return;
    }

    socketRef.current.emit('send_private_message', { receiverId, text: text.trim() });
  };

  const editPrivateMessage = (id, newText) => {
    if (!socketRef.current) return;
    socketRef.current.emit('edit_private_message', { messageId: id, newText: newText.trim() });
  };

  const deletePrivateMessage = (id) => {
    if (!socketRef.current) return;
    socketRef.current.emit('delete_private_message', id);
  };

  const markPrivateConversationAsRead = (conversationUserId) => {
    if (!socketRef.current) return;
    socketRef.current.emit('mark_private_read', conversationUserId);
    
    // Optimistically update local state
    setPrivateMessages(prev => prev.map(msg => {
      if (msg.senderId === conversationUserId && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    }));
  };

  const reportUser = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}/report`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isSuspended) {
          showToast(`User has been automatically suspended due to multiple reports.`, "info");
        } else {
          showToast("User reported successfully. Thank you for keeping the campus safe.", "success");
        }
        setStudents(prev => prev.map(std => std.id === userId ? { ...std, reportCount: data.reportCount, isSuspended: data.isSuspended } : std));
      } else {
        showToast('Failed to report user', 'error');
      }
    } catch (e) {
      showToast('Network error', 'error');
    }
  };

  const blockUser = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}/block`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        showToast("User blocked. You will no longer see their messages or profile.", "success");
        setCurrentUser(prev => ({ ...prev, blockedUsers: data.blockedUsers }));
        
        // Also refetch students/messages to remove them from view immediately
        fetchStudents();
        fetchPrivateMessages();
        fetchGlobalMessages();
      } else {
        showToast('Failed to block user', 'error');
      }
    } catch (e) {
      showToast('Network error', 'error');
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (e) {
      console.error('Error fetching admin users', e);
      return [];
    }
  };

  const toggleSuspendUserAdmin = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/toggle-suspend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message, 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to toggle suspension', 'error');
        return false;
      }
    } catch (e) {
      showToast('Network error', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeTab,
        setActiveTab,
        students,
        globalMessages,
        onlineUsersCount,
        societies,
        societyAnnouncements,
        notifications,
        privateMessages,
        posts,
        setPosts,
        createPost,
        unreadPrivateCount,
        toast,
        showToast,
        handleLogin,
        requestOtp,
        handleRegister,
        handleResetPassword,
        handleLogout,
        sendGlobalMessage,
        editGlobalMessage,
        deleteGlobalMessage,
        addReactionToMessage,
        sendConnectRequest,
        acceptConnectRequest,
        rejectConnectRequest,
        toggleSocietyJoin,
        updateProfile,
        completeOnboarding,
        markNotificationsAsRead,
        sendPrivateMessage,
        editPrivateMessage,
        deletePrivateMessage,
        markPrivateConversationAsRead,
        reportUser,
        blockUser,
        fetchAdminUsers,
        toggleSuspendUserAdmin,
        fetchPosts,
        createAnnouncement,
        createSociety
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
