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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-950 mb-2 tracking-tight">Welcome, {currentUser?.name?.split(' ')[0]}! 🎉</h2>
            <p className="text-zinc-500 text-sm font-medium">Let's set up your profile so you can connect with the right people on campus.</p>
          </div>

          {step === 1 ? (
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

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-4 mt-10 rounded-full bg-zinc-950 text-white font-bold text-base hover:-translate-y-0.5 transition-transform shadow-lg hover:shadow-xl"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
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
                  onClick={() => setStep(1)}
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
