import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Users, Building2, Tag, MessageSquare } from 'lucide-react';

export default function ProfileView() {
  const { currentUser, updateProfile, students, societies, globalMessages } = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    bio: currentUser.bio || '',
    branch: currentUser.branch || '',
    year: currentUser.year || '',
    anonUsername: currentUser.anonUsername || '',
    interests: currentUser.interests || [],
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentInterest, setCurrentInterest] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateProfile(formData); 
    setEditMode(false);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCancel = () => {

    setFormData({
      name: currentUser.name,
      bio: currentUser.bio,
      branch: currentUser.branch,
      year: currentUser.year,
      anonUsername: currentUser.anonUsername,
      interests: currentUser.interests || [],
    });
    setEditMode(false);
    setCurrentInterest('');
  };

  const addInterest = () => {
    const trimmed = currentInterest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData(prev => ({ ...prev, interests: [...prev.interests, trimmed] }));
    }
    setCurrentInterest('');
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interestToRemove)
    }));
  };

  const connectionsCount = students.filter(s => s.connectionStatus === 'connected').length;
  const societiesCount = societies.filter(s => s.joined).length;
  const messagesCount = globalMessages.filter(m => m.senderId === currentUser.id).length;

  return (
    <div className="flex flex-col h-full bg-gray-950 md:pt-0 pt-[53px] overflow-y-auto pb-[60px] md:pb-0">

      <div className="px-6 py-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
        <h2 className="font-bold text-white text-lg">My Profile</h2>
        <p className="text-xs text-gray-500 mt-0.5">Manage your identity on the college network</p>
      </div>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-6">

        <div className="rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-sm p-6 flex flex-col sm:flex-row items-center gap-6">

          <div className="relative flex-shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full border-4 border-red-500/40"
            />

            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-gray-900"></span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{currentUser.branch} · {currentUser.year}</p>
            <p className="text-xs text-gray-500 mt-0.5">{currentUser.email}</p>

            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
              <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span className="text-xs text-orange-400">
                Anonymous as: <strong>{currentUser.anonUsername}</strong>
              </span>
            </div>
          </div>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-sm font-medium transition-all flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {!editMode && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{connectionsCount}</p>
                        <p className="text-xs text-gray-500">Connections</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{societiesCount}</p>
                        <p className="text-xs text-gray-500">Societies Joined</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{messagesCount}</p>
                        <p className="text-xs text-gray-500">Messages Sent</p>
                    </div>
                </div>
            </div>
        )}

        {saveSuccess && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-900/30 border border-green-500/30 text-green-400 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Profile updated successfully!
          </div>
        )}

        {editMode ? (
          <div className="rounded-2xl border border-red-500/20 bg-gray-900/60 backdrop-blur-sm p-6 space-y-4 mb-8">
            <h4 className="font-semibold text-white text-sm mb-2">Edit Your Information</h4>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell your college about yourself..."
                className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Branch / Department</label>
                <input
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all"
                >
                  <option value="1st Year" className="bg-gray-900">1st Year</option>
                  <option value="2nd Year" className="bg-gray-900">2nd Year</option>
                  <option value="3rd Year" className="bg-gray-900">3rd Year</option>
                  <option value="4th Year" className="bg-gray-900">4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Anonymous Username{' '}
                <span className="text-orange-400/70">(shown to non-connected users)</span>
              </label>
              <input
                name="anonUsername"
                value={formData.anonUsername}
                onChange={handleChange}
                placeholder="e.g. SilentPioneer_42"
                className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/30 transition-all"
              />
            </div>

            <div>
                <label className="block text-xs text-gray-500 mb-1.5">Interests & Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentInterest}
                    onChange={(e) => setCurrentInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    placeholder="Type an interest & press Enter..."
                    className="flex-1 bg-gray-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all"
                  />
                  <button 
                    onClick={addInterest}
                    className="px-4 bg-gray-700 text-white rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map(interest => (
                    <span key={interest} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                      {interest}
                      <button onClick={() => removeInterest(interest)} className="hover:text-white">&times;</button>
                    </span>
                  ))}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold border border-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (

          <div className="rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-sm p-6 space-y-6 mb-8">
            <div>
                <h4 className="font-semibold text-white text-sm mb-2">About Me</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {currentUser.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
                </p>
            </div>

            {currentUser.interests && currentUser.interests.length > 0 && (
                <div>
                    <h4 className="flex items-center gap-2 font-semibold text-white text-sm mb-3">
                        <Tag className="w-4 h-4 text-red-500" />
                        Interests & Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {currentUser.interests.map(interest => (
                            <span key={interest} className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs border border-white/5">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="pt-4 border-t border-white/8">
              <p className="text-xs text-gray-600">
                College ID: <span className="text-gray-400 font-mono">{currentUser.collegeId}</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                This is the ID provided by your college and cannot be changed here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
