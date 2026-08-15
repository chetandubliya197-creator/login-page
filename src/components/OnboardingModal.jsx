import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

export default function OnboardingModal() {
  const { currentUser, completeOnboarding } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix',
    branch: '',
    year: '1st Year',
    interests: []
  });

  const [usernameError, setUsernameError] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');

  const suggestedInterests = ['Coding', 'Design', 'Music', 'Sports', 'Gaming', 'Debate', 'Robotics', 'Photography'];

  const addInterest = (interest) => {
    const trimmed = interest.trim();
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

  const avatars = [
    // Girls - Flat Style
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Lily&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Aria&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Amelia&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Harper&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Evelyn&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Abigail&backgroundColor=ffdfbf',

    // Boys - Flat Style
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Mason&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Logan&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Elijah&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Jackson&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Carter&backgroundColor=ffdfbf',

    // Fun / Creative
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Wink&backgroundColor=c0aede',
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.username.trim()) {
        setUsernameError("Username cannot be empty");
        return;
      }
      if (formData.username.includes(' ')) {
        setUsernameError("Username cannot contain spaces");
        return;
      }
      setUsernameError('');
      setStep(2);
      return;
    }
    if (step === 2 && !formData.branch) {
      alert("Please enter your branch to continue.");
      return;
    }
    setStep(3);
  };

  const handleFinish = () => {
    completeOnboarding(formData);
  };

  if (currentUser?.isOnboarded) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-950 mb-2 tracking-tight">Welcome, {currentUser?.name?.split(' ')[0]}! 🎉</h2>
            <p className="text-zinc-500 text-sm font-medium">Let's set up your profile so you can connect with the right people on campus.</p>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="flex items-center gap-2 text-sm text-zinc-700 font-bold mb-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Choose an Avatar
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-2 max-h-48 overflow-y-auto p-1">
                  {avatars.map((avatarUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFormData(prev => ({...prev, avatar: avatarUrl}))}
                      className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-200 border-2 ${
                        formData.avatar === avatarUrl
                        ? 'border-emerald-500 shadow-md scale-105'
                        : 'border-transparent hover:scale-105 hover:bg-zinc-50'
                      }`}
                    >
                      <img src={avatarUrl} alt="avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-zinc-700 font-bold mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Pick a Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">@</span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({...prev, username: e.target.value.toLowerCase()}))}
                    placeholder="coolstudent"
                    className={`w-full bg-zinc-50 border rounded-xl pl-9 pr-4 py-3.5 text-zinc-900 font-medium placeholder-zinc-400 focus:outline-none focus:ring-1 transition-colors ${
                      usernameError ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-zinc-200 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                    autoFocus
                  />
                </div>
                {usernameError && <p className="text-xs text-rose-500 mt-2 font-medium">{usernameError}</p>}
                <p className="text-xs text-zinc-500 mt-2 font-medium">This will be your unique identity on CampusPulse.</p>
              </div>

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-4 mt-10 rounded-full bg-zinc-950 text-white font-bold text-base hover:-translate-y-0.5 transition-transform shadow-lg hover:shadow-xl"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="flex items-center gap-2 text-sm text-zinc-700 font-bold mb-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  What are you studying?
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData(prev => ({...prev, branch: e.target.value}))}
                  placeholder="e.g. Computer Science, Mechanical..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-zinc-700 font-bold mb-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Which year are you in?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                    <button
                      key={year}
                      onClick={() => setFormData(prev => ({...prev, year}))}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                        formData.year === year 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-full bg-white border-2 border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-zinc-950 text-white font-bold text-base hover:-translate-y-0.5 transition-transform shadow-lg hover:shadow-xl"
                >
                  Next Step
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="flex items-center gap-2 text-sm text-zinc-700 font-bold mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  What are your interests?
                </label>
                <p className="text-xs text-zinc-500 mb-3 font-medium">Add tags to help like-minded students find you.</p>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={currentInterest}
                    onChange={(e) => setCurrentInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest(currentInterest);
                      }
                    }}
                    placeholder="Type an interest & press Enter..."
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  <button 
                    onClick={() => addInterest(currentInterest)}
                    className="px-5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 min-h-[32px]">
                  {formData.interests.length === 0 && (
                    <span className="text-xs text-zinc-400 italic font-medium py-1">No interests added yet.</span>
                  )}
                  {formData.interests.map(interest => (
                    <span key={interest} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm">
                      {interest}
                      <button onClick={() => removeInterest(interest)} className="hover:text-emerald-900 transition-colors">&times;</button>
                    </span>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2 font-black">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedInterests.filter(i => !formData.interests.includes(i)).map(interest => (
                      <button
                        key={interest}
                        onClick={() => addInterest(interest)}
                        className="px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold hover:bg-zinc-200 transition-colors border border-zinc-200"
                      >
                        + {interest}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex gap-3 mt-10">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 rounded-full bg-white border-2 border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-zinc-950 text-white font-bold text-sm hover:-translate-y-0.5 transition-transform shadow-lg hover:shadow-xl"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
