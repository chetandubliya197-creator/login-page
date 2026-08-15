import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Users, Building2, Tag, MessageSquare, Camera } from 'lucide-react';

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
    avatar: currentUser.avatar || '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentInterest, setCurrentInterest] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic check for file size (e.g. max 2MB) so localStorage doesn't crash
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
      avatar: currentUser.avatar,
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
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px] overflow-y-auto pb-[60px] md:pb-0">

      <div className="px-6 py-5 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex-shrink-0 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] sticky top-0">
        <h2 className="font-black text-zinc-950 text-2xl tracking-tight">My Profile</h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">Manage your identity on the college network</p>
      </div>

      <div className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">

        {/* Profile Header Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">

          <div className="relative flex-shrink-0 group">
            <img
              src={editMode ? formData.avatar : currentUser.avatar}
              alt={currentUser.name}
              className="w-28 h-28 rounded-3xl border-4 border-white shadow-md bg-zinc-50 object-cover"
            />
            {editMode ? (
                <>
                  <label className="absolute inset-0 bg-black/40 rounded-3xl flex flex-col items-center justify-center cursor-pointer md:opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                      <Camera className="w-8 h-8 text-white mb-1" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  <label className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors z-20">
                      <Camera className="w-4 h-4 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </>
            ) : (
                <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 justify-center sm:justify-start">
                <h3 className="text-2xl font-black text-zinc-950 tracking-tight">{currentUser.name}</h3>
                <span className="text-sm font-bold text-zinc-400">@{currentUser.username || currentUser.anonUsername}</span>
            </div>
            <p className="text-[15px] font-bold text-zinc-500 mt-1">{currentUser.branch} · {currentUser.year}</p>
            <p className="text-sm text-zinc-400 font-medium mt-0.5">{currentUser.email}</p>

            <div className="flex items-center gap-2 mt-4 justify-center sm:justify-start bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 w-fit mx-auto sm:mx-0">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span className="text-xs text-amber-700 font-medium">
                Anonymous as: <strong className="font-bold">{currentUser.anonUsername}</strong>
              </span>
            </div>
          </div>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold transition-all flex-shrink-0 shadow-sm border border-zinc-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {/* Stats Grid */}
        {!editMode && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-950">{connectionsCount}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Connections</p>
                    </div>
                </div>
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-950">{societiesCount}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Societies Joined</p>
                    </div>
                </div>
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-950">{messagesCount}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Messages Sent</p>
                    </div>
                </div>
            </div>
        )}

        {saveSuccess && (
          <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Profile updated successfully!
          </div>
        )}

        {editMode ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm mb-8">
            <h4 className="font-black text-zinc-950 text-lg tracking-tight mb-2">Edit Your Information</h4>

            <div>
              <label className="block text-[13px] font-bold text-zinc-600 mb-2">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-zinc-600 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell your college about yourself..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-zinc-600 mb-2">Branch / Department</label>
                <input
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-zinc-600 mb-2">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm cursor-pointer"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-zinc-600 mb-2">
                Anonymous Username{' '}
                <span className="text-amber-600/70">(shown to non-connected users)</span>
              </label>
              <input
                name="anonUsername"
                value={formData.anonUsername}
                onChange={handleChange}
                placeholder="e.g. SilentPioneer_42"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-inner"
              />
            </div>

            <div>
                <label className="block text-[13px] font-bold text-zinc-600 mb-2">Interests & Skills</label>
                <div className="flex gap-2 mb-3">
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
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
                  />
                  <button 
                    onClick={addInterest}
                    className="px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map(interest => (
                    <span key={interest} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm">
                      {interest}
                      <button onClick={() => removeInterest(interest)} className="hover:text-emerald-900 transition-colors">&times;</button>
                    </span>
                  ))}
                </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={handleSave}
                className="flex-1 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[15px] font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-700 text-[15px] font-bold border-2 border-zinc-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-8 shadow-sm mb-8">
            <div>
                <h4 className="font-black text-zinc-950 text-lg tracking-tight mb-3">About Me</h4>
                <p className="text-[15px] text-zinc-600 font-medium leading-relaxed">
                  {currentUser.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
                </p>
            </div>

            {currentUser.interests && currentUser.interests.length > 0 && (
                <div>
                    <h4 className="flex items-center gap-2 font-black text-zinc-950 text-lg tracking-tight mb-4">
                        <Tag className="w-5 h-5 text-emerald-600" />
                        Interests & Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {currentUser.interests.map(interest => (
                            <span key={interest} className="px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold border border-zinc-200 shadow-sm">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="pt-6 border-t border-zinc-100">
              <p className="text-sm font-bold text-zinc-600">
                College ID: <span className="text-zinc-900 font-mono bg-zinc-100 px-2 py-1 rounded-md">{currentUser.collegeId}</span>
              </p>
              <p className="text-xs font-medium text-zinc-400 mt-2">
                This is the ID provided by your college and cannot be changed here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
