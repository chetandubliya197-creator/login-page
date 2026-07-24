import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

export default function OnboardingModal() {
  const { currentUser, completeOnboarding } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    branch: '',
    year: '1st Year',
    interests: []
  });

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

  const handleNext = () => {
    if (step === 1 && !formData.branch) {
      alert("Please enter your branch to continue.");
      return;
    }
    setStep(2);
  };

  const handleFinish = () => {
    completeOnboarding(formData);
  };

  if (currentUser?.isOnboarded) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Welcome, {currentUser?.name?.split(' ')[0]}! 🎉</h2>
            <p className="text-gray-400 text-sm">Let's set up your profile so you can connect with the right people on campus.</p>
          </div>

          {step === 1 ? (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 font-medium mb-2">
                  <BookOpen className="w-4 h-4 text-red-500" />
                  What are you studying?
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData(prev => ({...prev, branch: e.target.value}))}
                  placeholder="e.g. Computer Science, Mechanical..."
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                  autoFocus
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 font-medium mb-2">
                  <GraduationCap className="w-4 h-4 text-red-500" />
                  Which year are you in?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                    <button
                      key={year}
                      onClick={() => setFormData(prev => ({...prev, year}))}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        formData.year === year 
                        ? 'bg-red-600/20 text-red-400 border border-red-500/50' 
                        : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-8 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-red-900/20"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 font-medium mb-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  What are your interests?
                </label>
                <p className="text-xs text-gray-500 mb-3">Add tags to help like-minded students find you.</p>

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
                    className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
                  />
                  <button 
                    onClick={() => addInterest(currentInterest)}
                    className="px-4 bg-gray-700 text-white rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.interests.length === 0 && (
                    <span className="text-xs text-gray-600 italic">No interests added yet.</span>
                  )}
                  {formData.interests.map(interest => (
                    <span key={interest} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                      {interest}
                      <button onClick={() => removeInterest(interest)} className="hover:text-white">&times;</button>
                    </span>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedInterests.filter(i => !formData.interests.includes(i)).map(interest => (
                      <button
                        key={interest}
                        onClick={() => addInterest(interest)}
                        className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        + {interest}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl bg-gray-800 text-gray-300 font-medium text-sm hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-red-900/20"
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
