import React from 'react';
import { HelpCircle, Book, ShieldAlert, Mail, ChevronRight, MessageSquareText } from 'lucide-react';
import { Wrench } from 'lucide-react';

const FAQS = [
  {
    question: 'How do I join a society?',
    answer: 'Navigate to the "Societies" tab from the sidebar, find a society that interests you, and click the "Join" button. You will instantly get access to their announcements and events.'
  },
  {
    question: 'Why is my email not being accepted during registration?',
    answer: 'CampusPulse is exclusively for Indore Institute students. You must use your official college email ID format (name.surnamebranchyear@indoreinstitute.com) to register.'
  },
  {
    question: 'How can I report inappropriate behavior?',
    answer: 'In any private chat or global chat, click the three dots (More Options) next to a user\'s message or profile, and select "Report User". Our admin team reviews reports within 24 hours.'
  },
  {
    question: 'Can I change my anonymous username?',
    answer: 'Currently, anonymous usernames are auto-generated to maintain privacy and cannot be manually changed. You can, however, update your public display name in Settings.'
  },
  {
    question: 'How does anonymity work in Global Chat?',
    answer: 'Global Chat is 100% anonymous to other students. They will only see your anonymous avatar and auto-generated username. However, admins have the authority to trace messages back to the original sender if there is a report of bullying or harassment.'
  }
];

const TECH_ISSUES = [
  {
    issue: 'I am not receiving the OTP email.',
    solution: 'Please check your Spam or Junk folder. Sometimes college email filters block automated emails. Also, double-check that you entered your email address correctly without any typos.'
  },
  {
    issue: 'How do I install the CampusPulse app on my phone?',
    solution: 'CampusPulse is a Progressive Web App. Open the website in Chrome (Android) or Safari (iOS). You should see an "Install App" prompt. If not, tap the browser menu (3 dots or share button) and select "Add to Home Screen".'
  },
  {
    issue: 'Notifications are not working.',
    solution: 'Make sure you have allowed notification permissions in your browser settings for this site. Also, check if your phone is in "Do Not Disturb" or "Battery Saver" mode, which might block background notifications.'
  }
];

export default function HelpCenterView() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 md:pt-0 pt-[53px] overflow-y-auto pb-[60px] md:pb-0 scroll-smooth">
      
      {/* Header */}
      <div className="px-6 md:px-12 py-8 bg-white flex-shrink-0 sticky top-0 z-10 border-b border-zinc-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-4xl mx-auto w-full">
              <div>
                <h2 className="flex items-center gap-3 font-black text-zinc-950 text-2xl md:text-3xl tracking-tight">
                    <HelpCircle className="w-8 h-8 text-emerald-600" />
                    Help Center
                </h2>
                <p className="text-sm md:text-[15px] text-zinc-500 font-medium mt-2">
                  Find answers, learn the rules, and get support for your CampusPulse experience.
                </p>
              </div>
          </div>
      </div>

      <div className="flex-1 px-6 md:px-12 py-8 max-w-4xl mx-auto w-full space-y-10 pb-20">

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => scrollToSection('faqs')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-zinc-200 rounded-3xl hover:border-emerald-500 hover:shadow-md transition-all group">
                <Book className="w-8 h-8 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                <span className="font-bold text-zinc-900">Platform Guide</span>
            </button>
            <button onClick={() => scrollToSection('guidelines')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-zinc-200 rounded-3xl hover:border-emerald-500 hover:shadow-md transition-all group">
                <ShieldAlert className="w-8 h-8 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                <span className="font-bold text-zinc-900">Safety & Privacy</span>
            </button>
            <button onClick={() => scrollToSection('tech-issues')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-zinc-200 rounded-3xl hover:border-emerald-500 hover:shadow-md transition-all group">
                <Wrench className="w-8 h-8 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                <span className="font-bold text-zinc-900">Tech Issues</span>
            </button>
        </div>

        {/* Tech Issues */}
        <section id="tech-issues">
            <h3 className="text-[16px] font-black text-zinc-950 tracking-tight mb-6 flex items-center gap-2">
                Troubleshooting & Tech Issues
            </h3>
            <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden divide-y divide-zinc-100">
                {TECH_ISSUES.map((tech, idx) => (
                    <div key={idx} className="p-6 hover:bg-zinc-50 transition-colors">
                        <div className="flex gap-3 mb-2">
                            <Wrench className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <h4 className="text-[15px] font-bold text-zinc-900">{tech.issue}</h4>
                        </div>
                        <p className="text-[14px] text-zinc-600 font-medium leading-relaxed pl-8">{tech.solution}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* FAQs */}
        <section id="faqs">
            <h3 className="text-[16px] font-black text-zinc-950 tracking-tight mb-6 flex items-center gap-2">
                Frequently Asked Questions
            </h3>
            <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden divide-y divide-zinc-100">
                {FAQS.map((faq, idx) => (
                    <div key={idx} className="p-6 hover:bg-zinc-50 transition-colors">
                        <h4 className="text-[15px] font-bold text-zinc-900 mb-2">{faq.question}</h4>
                        <p className="text-[14px] text-zinc-600 font-medium leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Community Guidelines */}
        <section id="guidelines">
            <h3 className="text-[16px] font-black text-zinc-950 tracking-tight mb-6 flex items-center gap-2">
                Community Guidelines
            </h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <p className="text-[14px] text-emerald-900 font-medium leading-relaxed mb-6">
                    CampusPulse is designed to be a safe, professional, and engaging space for all students of Indore Institute. By using this platform, you agree to adhere to the following rules:
                </p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs mt-0.5">1</span>
                        <div>
                            <strong className="block text-[14px] text-emerald-950">Respect Everyone</strong>
                            <span className="text-[13px] text-emerald-800 font-medium">Hate speech, bullying, harassment, and discrimination of any kind will result in immediate suspension.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                        <div>
                            <strong className="block text-[14px] text-emerald-950">Keep it Professional</strong>
                            <span className="text-[13px] text-emerald-800 font-medium">While casual chat is encouraged, remember this is a college platform. Avoid sharing inappropriate content or spam.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs mt-0.5">3</span>
                        <div>
                            <strong className="block text-[14px] text-emerald-950">No Fake Profiles</strong>
                            <span className="text-[13px] text-emerald-800 font-medium">Impersonating faculty members, societies, or other students is strictly prohibited.</span>
                        </div>
                    </li>
                </ul>
            </div>
        </section>

        {/* Contact Support */}
        <section id="contact" className="pt-4">
            <div className="bg-zinc-950 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <h3 className="text-xl font-black mb-2">Still need help?</h3>
                    <p className="text-zinc-400 text-sm font-medium">Found a bug or need to report an issue? Send an email to the admin team directly.</p>
                </div>
                <a 
                  href="mailto:rudrebirla@gmail.com?subject=CampusPulse Support Request"
                  className="w-full md:w-auto bg-white text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                    <Mail className="w-4 h-4" />
                    Contact Support
                </a>
            </div>
        </section>

      </div>
    </div>
  );
}
