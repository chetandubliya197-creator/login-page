import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AppContext = createContext();

const INITIAL_STUDENTS = [
  {
    id: 'std_002',
    name: 'Rahul Verma',
    email: 'rahul.verma@college.edu',
    collegeId: 'COL2024098',
    anonUsername: 'DeltaRunner_21',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    branch: 'Computer Science',
    year: '3rd Year',
    bio: 'Competitive coder. Love Node.js and systems architecture.',
    connectionStatus: 'not_connected',
    interests: ['Coding', 'Gaming', 'Algorithms'],
    isOnline: true,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_003',
    name: 'Priya Singh',
    email: 'priya.singh@college.edu',
    collegeId: 'COL2024105',
    anonUsername: 'QuantumDev_99',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    branch: 'Electronics',
    year: '3rd Year',
    bio: 'IoT enthusiast & embedded systems developer.',
    connectionStatus: 'connected',
    interests: ['Arduino', 'Robotics', 'WebDev'],
    isOnline: true,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_004',
    name: 'Amit Patel',
    email: 'amit.patel@college.edu',
    collegeId: 'COL2025012',
    anonUsername: 'NeonRider_17',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    branch: 'Mechanical',
    year: '2nd Year',
    bio: 'CAD designer and motor sports lover.',
    connectionStatus: 'pending',
    interests: ['CAD', 'F1', 'Automobile'],
    isOnline: false,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_005',
    name: 'Sneha Sharma',
    email: 'sneha.sharma@college.edu',
    collegeId: 'COL2024045',
    anonUsername: 'CyberSage_08',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    branch: 'Information Technology',
    year: '3rd Year',
    bio: 'Cybersecurity learner. Pentesting and Linux are life.',
    connectionStatus: 'connected',
    interests: ['Cybersecurity', 'Linux', 'Python'],
    isOnline: true,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_006',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@college.edu',
    collegeId: 'COL2024210',
    anonUsername: 'PhoenixByte_33',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    branch: 'Civil Engineering',
    year: '4th Year',
    bio: 'Structural design nerd. AutoCAD is my canvas.',
    connectionStatus: 'not_connected',
    interests: ['AutoCAD', 'Architecture', 'Photography'],
    isOnline: false,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_007',
    name: 'Riya Kapoor',
    email: 'riya.kapoor@college.edu',
    collegeId: 'COL2025033',
    anonUsername: 'NovaStar_55',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya',
    branch: 'Computer Science',
    year: '2nd Year',
    bio: 'ML enthusiast. Currently learning PyTorch and data viz.',
    connectionStatus: 'not_connected',
    interests: ['Machine Learning', 'Python', 'Data Science'],
    isOnline: true,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_008',
    name: 'Vikram Nair',
    email: 'vikram.nair@college.edu',
    collegeId: 'COL2024077',
    anonUsername: 'StealthCoder_09',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    branch: 'Electronics',
    year: '4th Year',
    bio: 'Embedded systems and VLSI. Love building low-level stuff.',
    connectionStatus: 'not_connected',
    interests: ['VLSI', 'Arduino', 'PCB Design'],
    isOnline: false,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_009',
    name: 'Pooja Joshi',
    email: 'pooja.joshi@college.edu',
    collegeId: 'COL2025067',
    anonUsername: 'PixelDreamer_11',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
    branch: 'Information Technology',
    year: '2nd Year',
    bio: 'UI/UX designer who codes. Figma is my second home.',
    connectionStatus: 'not_connected',
    interests: ['UI/UX', 'Figma', 'React'],
    isOnline: true,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_010',
    name: 'Karan Gupta',
    email: 'karan.gupta@college.edu',
    collegeId: 'COL2024189',
    anonUsername: 'TurboHack_77',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
    branch: 'Computer Science',
    year: '3rd Year',
    bio: 'Open source contributor. Loves competitive programming.',
    connectionStatus: 'not_connected',
    interests: ['Open Source', 'C++', 'Competitive Programming'],
    isOnline: true,
    reportCount: 0,
    isSuspended: false,
  },
  {
    id: 'std_011',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@college.edu',
    collegeId: 'COL2025088',
    anonUsername: 'CloudMind_22',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    branch: 'Mechanical',
    year: '1st Year',
    bio: 'Robotics club member. Drone enthusiast and maker.',
    connectionStatus: 'not_connected',
    interests: ['Drones', 'Robotics', 'CAD'],
    isOnline: false,
    reportCount: 0,
    isSuspended: false,
  },
];

const INITIAL_SOCIETIES = [
  { id: 'soc_coding', name: 'Coding Society', description: 'Algorithms, Hackathons, Open Source', membersCount: 142, joined: true, icon: '💻' },
  { id: 'soc_robotics', name: 'Robotics Club', description: 'Arduino, Drone design, Hardware fabrication', membersCount: 88, joined: false, icon: '🤖' },
  { id: 'soc_cultural', name: 'Cultural Society', description: 'Music, Drama, Event organisation', membersCount: 110, joined: false, icon: '🎭' },
  { id: 'soc_ml', name: 'AI & ML Club', description: 'Machine Learning, Data Science, Deep Learning', membersCount: 76, joined: false, icon: '🧠' },
  { id: 'soc_cyber', name: 'CyberSec Club', description: 'Ethical Hacking, CTF, Network Security', membersCount: 54, joined: true, icon: '🔐' },
  { id: 'soc_photo', name: 'Photography Club', description: 'Campus shoots, Editing, Reels & Shorts', membersCount: 63, joined: false, icon: '📸' },
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 'ann_1', societyId: 'soc_coding', title: 'Internal Hackathon Next Week', text: 'Registrations close this Sunday. Prizes up to ₹10K!', date: 'Today', isPinned: true },
  { id: 'ann_2', societyId: 'soc_robotics', title: 'RoboWars Workshop', text: 'Learn to build line follower bots. Venue: Labs 3, Friday.', date: 'Yesterday', isPinned: false },
  { id: 'ann_3', societyId: 'soc_ml', title: 'Guest Lecture — Google Engineer', text: 'Join us this Thursday at 4 PM in Seminar Hall 2. Topic: LLMs in Production.', date: 'Today', isPinned: true },
  { id: 'ann_4', societyId: 'soc_cyber', title: 'CTF Competition — Register Now', text: 'College inter-CTF starts Friday midnight. Teams of 2-3. Prizes: ₹5K + goodies.', date: '2 days ago', isPinned: false },
];

const INITIAL_MESSAGES = [
  { id: 'msg_1', senderId: 'std_002', text: 'Hey guys! Anyone up for the Hackathon registrations?', timestamp: '9:30 PM', reactions: [] },
  { id: 'msg_2', senderId: 'std_003', text: 'Yes! I was looking for a teammate who knows React.', timestamp: '9:32 PM', reactions: [] },
  { id: 'msg_3', senderId: 'std_005', text: 'College server is down again. Anyone else can\'t open portals?', timestamp: '9:45 PM', reactions: [] },
  { id: 'msg_4', senderId: 'std_007', text: 'Which ML library is everyone using for the semester project?', timestamp: '9:50 PM', reactions: [] },
  { id: 'msg_5', senderId: 'std_010', text: 'Just submitted my first open source PR 🎉 took 3 weeks lol', timestamp: '10:01 PM', reactions: [{ emoji: '👍', userId: 'std_003' }] },
];

const INITIAL_PRIVATE_MESSAGES = [
  { id: 'pm_1', conversationId: 'std_001', senderId: 'std_003', text: 'Hey, are you free for the project meeting?', timestamp: '10:00 AM', read: true },
  { id: 'pm_2', conversationId: 'std_003', senderId: 'std_001', text: 'Yes, around 2 PM works for me.', timestamp: '10:05 AM', read: true },
];

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage('cp_user', null);
  const [students, setStudents] = useState([]);
  const [societies, setSocieties] = useLocalStorage('cp_societies', INITIAL_SOCIETIES);
  const [globalMessages, setGlobalMessages] = useLocalStorage('cp_global_msgs', INITIAL_MESSAGES);
  const [privateMessages, setPrivateMessages] = useLocalStorage('cp_private_msgs', INITIAL_PRIVATE_MESSAGES);
  
  // Anti-Misuse State (Rate Limiting)
  const [globalMessageHistory, setGlobalMessageHistory] = useLocalStorage('cp_global_msg_hist', []);
  const [connectionHistory, setConnectionHistory] = useLocalStorage('cp_conn_hist', []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const [societyAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

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

  useEffect(() => {
    if (currentUser?.token) {
      fetchStudents();
      fetchNotifications();
    }
  }, [currentUser?.token, fetchStudents, fetchNotifications]);

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
    if ((!text.trim() && !attachment) || !currentUser) return;

    // Strict Guideline: Rate Limiting for Global Messages (Max 5 per minute)
    const now = Date.now();
    const recentMessages = globalMessageHistory.filter(time => now - time < 60000); // 1 minute window
    if (recentMessages.length >= 5) {
      showToast("Rate limit exceeded. You can only send 5 messages per minute to prevent spam.", "error");
      return;
    }
    setGlobalMessageHistory([...recentMessages, now]);

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      attachment,
      replyToId,
      isEdited: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };
    setGlobalMessages(prev => [...prev, newMsg]);
  };

  const editGlobalMessage = (id, newText) => {
    setGlobalMessages(prev => prev.map(msg => 
      msg.id === id && msg.senderId === currentUser.id 
        ? { ...msg, text: newText.trim(), isEdited: true }
        : msg
    ));
    showToast('Message updated', 'success');
  };

  const deleteGlobalMessage = (id) => {
    setGlobalMessages(prev => prev.filter(msg => msg.id !== id || msg.senderId !== currentUser.id));
    showToast('Message deleted', 'success');
  };

  const addReactionToMessage = (messageId, emoji) => {
    setGlobalMessages(prev =>
      prev.map(msg => {
        if (msg.id !== messageId) return msg;
        const existing = msg.reactions || [];
        const alreadyReacted = existing.find(r => r.emoji === emoji && r.userId === currentUser.id);
        if (alreadyReacted) {
          return { ...msg, reactions: existing.filter(r => !(r.emoji === emoji && r.userId === currentUser.id)) };
        }
        return { ...msg, reactions: [...existing, { emoji, userId: currentUser.id }] };
      })
    );
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

  const toggleSocietyJoin = (id) => {
    setSocieties(prev =>
      prev.map(soc => {
        if (soc.id !== id) return soc;
        const joined = !soc.joined;
        showToast(joined ? `Joined ${soc.name}! 🎉` : `Left ${soc.name}.`, joined ? 'success' : 'info');
        return { ...soc, joined };
      })
    );
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
    if ((!text.trim() && !attachment) || !currentUser) return;

    // Check if blocked
    if (currentUser.blockedUsers?.includes(receiverId)) {
        showToast("You cannot send messages to a blocked user.", "error");
        return;
    }

    const newMsg = {
      id: `pmsg_${Date.now()}`,
      senderId: currentUser.id,
      conversationId: receiverId,
      text: text.trim(),
      attachment,
      replyToId,
      isEdited: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setPrivateMessages(prev => [...prev, newMsg]);
  };

  const editPrivateMessage = (id, newText) => {
    setPrivateMessages(prev => prev.map(msg => 
      msg.id === id && msg.senderId === currentUser.id 
        ? { ...msg, text: newText.trim(), isEdited: true }
        : msg
    ));
    showToast('Message updated', 'success');
  };

  const deletePrivateMessage = (id) => {
    setPrivateMessages(prev => prev.filter(msg => msg.id !== id || msg.senderId !== currentUser.id));
    showToast('Message deleted', 'success');
  };

  const markPrivateConversationAsRead = (conversationUserId) => {
    setPrivateMessages(prev => prev.map(msg => {
      if (msg.senderId === conversationUserId && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    }));
  };

  const reportUser = (userId) => {
    setStudents(prev => prev.map(std => {
      if (std.id !== userId) return std;
      const newReportCount = (std.reportCount || 0) + 1;
      const isSuspended = newReportCount >= 5;
      
      if (isSuspended) {
        showToast(`User has been automatically suspended due to multiple reports.`, "info");
      } else {
        showToast("User reported successfully. Thank you for keeping the campus safe.", "success");
      }
      return { ...std, reportCount: newReportCount, isSuspended };
    }));
  };

  const blockUser = (userId) => {
    setCurrentUser(prev => {
      const blocked = prev.blockedUsers || [];
      if (blocked.includes(userId)) return prev;
      showToast("User blocked. You will no longer see their messages or profile.", "success");
      return { ...prev, blockedUsers: [...blocked, userId] };
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeTab,
        setActiveTab,
        students,
        globalMessages,
        societies,
        societyAnnouncements,
        notifications,
        privateMessages,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
