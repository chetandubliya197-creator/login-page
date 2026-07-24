import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('chat');

  const [students, setStudents] = useState([
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
      interests: ['Coding', 'Gaming', 'Algorithms']
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
      interests: ['Arduino', 'Robotics', 'WebDev']
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
      interests: ['CAD', 'F1', 'Automobile']
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
      interests: ['Cybersecurity', 'Linux', 'Python']
    }
  ]);

  const [globalMessages, setGlobalMessages] = useState([
    {
      id: 'msg_1',
      senderId: 'std_002', 
      text: 'Hey guys! Anyone up for the Hackathon registrations?',
      timestamp: '9:30 PM'
    },
    {
      id: 'msg_2',
      senderId: 'std_003', 
      text: 'Yes Rahul! I was looking for a teammate who knows React.',
      timestamp: '9:32 PM'
    },
    {
      id: 'msg_3',
      senderId: 'std_005', 
      text: 'College Server is down again. Is anyone else unable to open portals?',
      timestamp: '9:45 PM'
    }
  ]);

  const [societies, setSocieties] = useState([
    { id: 'soc_coding', name: 'Coding Society', description: 'Algorithms, Hackathons, Open Source', membersCount: 142, joined: true },
    { id: 'soc_robotics', name: 'Robotics Club', description: 'Arduino, Drone design, Hardware fabrication', membersCount: 88, joined: false },
    { id: 'soc_cultural', name: 'Cultural Society', description: 'Music, Drama, Event organisation', membersCount: 110, joined: false }
  ]);

  const [societyAnnouncements, setSocietyAnnouncements] = useState([
    { id: 'ann_1', societyId: 'soc_coding', title: 'Internal Hackathon Next Week', text: 'Registrations close this Sunday. Prizes up to ₹10K!', date: 'Today', isPinned: true },
    { id: 'ann_2', societyId: 'soc_robotics', title: 'RoboWars Workshop', text: 'Learn to build line follower bots. Venue: Labs 3, Friday.', date: 'Yesterday' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 'notif_1', type: 'connection_request', message: 'Amit Patel sent you a connection request.', read: false, time: '2 mins ago' },
    { id: 'notif_2', type: 'system', message: 'Welcome to CampusPulse! Complete your profile.', read: true, time: '1 hr ago' }
  ]);

  const [privateMessages, setPrivateMessages] = useState([
    { id: 'pm_1', conversationId: 'std_003', senderId: 'std_003', text: 'Hey, are you free for the project meeting?', timestamp: '10:00 AM' },
    { id: 'pm_2', conversationId: 'std_003', senderId: 'std_001', text: 'Yes, around 2 PM works for me.', timestamp: '10:05 AM' }
  ]);

  const handleLogin = (emailOrId, password, name = null) => {

    if (emailOrId.trim()) {
      const mockUser = {
        id: 'std_001',
        name: name || 'Chetan Sharma',
        email: emailOrId.includes('@') ? emailOrId : 'chetan.sharma@college.edu',
        collegeId: emailOrId.includes('@') ? 'COL2024001' : emailOrId.toUpperCase(),
        anonUsername: 'SilentPioneer_42',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'Chetan'}`,
        branch: 'Computer Science',
        year: '3rd Year',
        bio: 'Frontend designer and React developer. Building college ecosystem.',
        isOnboarded: !name
      };
      setCurrentUser(mockUser);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('chat');
  };

  const sendGlobalMessage = (text, attachment = null) => {
    if ((!text.trim() && !attachment) || !currentUser) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      attachment: attachment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setGlobalMessages((prev) => [...prev, newMsg]);
  };

  const addReactionToMessage = (messageId, emoji) => {
      setGlobalMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
              const existingReactions = msg.reactions || [];
              return { ...msg, reactions: [...existingReactions, { emoji, userId: currentUser.id }] };
          }
          return msg;
      }));
  };

  const sendConnectRequest = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((std) => {
        if (std.id === id) {

          if (std.connectionStatus === 'not_connected') {
            return { ...std, connectionStatus: 'pending' };
          }

          if (std.connectionStatus === 'pending') {
            return { ...std, connectionStatus: 'connected' };
          }

          return { ...std, connectionStatus: 'not_connected' };
        }
        return std;
      })
    );
  };

  const toggleSocietyJoin = (id) => {
    setSocieties((prev) =>
      prev.map((soc) => (soc.id === id ? { ...soc, joined: !soc.joined } : soc))
    );
  };

  const updateProfile = (updatedProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedProfile
    }));
  };

  const completeOnboarding = (onboardingData) => {
      setCurrentUser(prev => ({
          ...prev,
          ...onboardingData,
          isOnboarded: true
      }));
  };

  const markNotificationsAsRead = () => {
      setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const sendPrivateMessage = (receiverId, text, attachment = null) => {
    if ((!text.trim() && !attachment) || !currentUser) return;

    const newMsg = {
      id: `pmsg_${Date.now()}`,
      senderId: currentUser.id,
      conversationId: receiverId, 
      text: text.trim(),
      attachment: attachment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPrivateMessages((prev) => [...prev, newMsg]);
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
        handleLogin,
        handleLogout,
        sendGlobalMessage,
        addReactionToMessage,
        sendConnectRequest,
        toggleSocietyJoin,
        updateProfile,
        completeOnboarding,
        markNotificationsAsRead,
        sendPrivateMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
