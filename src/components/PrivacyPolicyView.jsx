import React from 'react';
import { Shield, Lock, FileText, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyView() {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 pt-[53px] md:pt-0">
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8">
        
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Privacy & Terms</h1>
          <p className="text-zinc-500 font-medium max-w-lg mx-auto">
            We take your security and privacy seriously. Please read our guidelines and policies carefully.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-zinc-200 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-50 rounded-xl text-zinc-600 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">1. End-to-End Encryption (E2EE)</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                Your private messages on CampusPulse are encrypted on your device before they are sent over the network. 
                This means that our database only stores cryptographic ciphertext. Neither our team, the admins, nor any unauthorized third-party can read the contents of your private chats.
              </p>
            </div>
          </div>

          <hr className="border-zinc-100" />

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-50 rounded-xl text-zinc-600 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">2. Data Storage & Deletion</h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                We practice data minimization. Chat histories are not meant to be kept forever. In the future, automated storage rules will regularly purge old messages to ensure data hygiene. 
                When you delete a message from your end, it is completely erased from our servers.
              </p>
            </div>
          </div>

          <hr className="border-zinc-100" />

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-50 rounded-xl text-zinc-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">3. User Responsibility & Conduct</h2>
              <p className="text-zinc-600 leading-relaxed text-sm mb-3">
                By using CampusPulse, you agree to take full responsibility for your actions and communications.
              </p>
              <ul className="list-disc list-inside text-zinc-600 text-sm space-y-2">
                <li>Do not harass, bully, or intimidate other students.</li>
                <li>Do not share illegal, explicit, or highly sensitive confidential information.</li>
                <li>The platform is an open space. While we encrypt private chats, global chats and profiles are public.</li>
                <li>CampusPulse and its creators are not legally liable for the user-generated content shared on this platform.</li>
              </ul>
            </div>
          </div>

        </div>

        <p className="text-center text-xs text-zinc-400 font-medium">
          Last updated: {new Date().toLocaleDateString()} &copy; Team CampusPulse
        </p>
      </div>
    </div>
  );
}
