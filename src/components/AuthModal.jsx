import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {

  const { handleLogin, showToast } = useContext(AppContext);

  if (!isOpen) return null;

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const handleSendOtp = () => {
    if (!registerEmail) return;
    setIsOtpSent(true);
    setOtpCountdown(30);
    showToast(`OTP sent to ${registerEmail}! Use code: 123456`, 'info');
  };

  const handleModeChange = (loginState) => {
    setIsLogin(loginState);
    setIsOtpSent(false);
    setOtpCode('');
    setOtpCountdown(0);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = handleLogin(loginEmail, loginPassword);
    if (success) {
      onClose();
    } else {
      showToast('Login failed. Please check your credentials.', 'error');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (isOtpSent && otpCode !== '123456') {
      showToast("Invalid OTP! Please enter '123456' for demo.", 'error');
      return;
    }
    const success = handleLogin(registerEmail, registerPassword, registerName);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in transition-opacity duration-300">

      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-[850px] min-h-[680px] md:min-h-[580px] bg-[#121212] rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 transition-transform duration-300 scale-100">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/40 md:bg-white/5 hover:bg-red-600/20 hover:text-red-500 border border-white/5 hover:border-red-500/30 text-gray-400 transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div 
          className={`absolute z-20 bg-gradient-to-br from-[#a61515] to-[#e32636] transition-all duration-700 ease-in-out ${
            isLogin 
              ? 'left-0 md:left-1/2 top-1/2 md:top-0 h-1/2 md:h-full w-full md:w-1/2 clip-shape-login' 
              : 'left-0 top-0 h-1/2 md:h-full w-full md:w-1/2 clip-shape-register'
          }`}
        >

          <div 
            className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center pl-16 pr-4 sm:pl-24 sm:pr-8 text-center text-white transition-all duration-700 ease-in-out ${
              isLogin 
                ? 'opacity-100 scale-100 blur-0 translate-y-0 md:translate-x-0' 
                : 'opacity-0 scale-90 blur-md translate-y-12 md:translate-y-0 md:translate-x-12 pointer-events-none'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15 mb-6 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3s' }}>
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold mb-4 tracking-tight">WELCOME!</h3>
            <p className="text-white/80 font-light text-sm sm:text-base max-w-[280px] mb-8 leading-relaxed">
              Don't have an account yet? Create one now and start securing your workspace.
            </p>
            <button
              onClick={() => handleModeChange(false)}
              className="px-8 py-3 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 font-semibold text-sm tracking-wide backdrop-blur-sm active:scale-95 cursor-pointer"
            >
              Create Account
            </button>
          </div>

          <div 
            className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center pr-16 pl-4 sm:pr-24 sm:pl-8 text-center text-white transition-all duration-700 ease-in-out ${
              !isLogin 
                ? 'opacity-100 scale-100 blur-0 translate-y-0 md:translate-x-0' 
                : 'opacity-0 scale-90 blur-md -translate-y-12 md:translate-y-0 md:-translate-x-12 pointer-events-none'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15 mb-6 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3s' }}>
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold mb-4 tracking-tight">WELCOME BACK!</h3>
            <p className="text-white/80 font-light text-sm sm:text-base max-w-[280px] mb-8 leading-relaxed">
              Already have an account? Sign in to resume monitoring your secure assets.
            </p>
            <button
              onClick={() => handleModeChange(true)}
              className="px-8 py-3 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 font-semibold text-sm tracking-wide backdrop-blur-sm active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-8 sm:px-12 pt-32 pb-3 md:pt-32 md:pb-2 z-10">
          <form onSubmit={handleLoginSubmit} className="space-y-6">

            <div 
              className={`transition-all duration-700 ease-out ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '100ms' : '0ms' }}
            >
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">Sign In</h2>
              <p className="text-gray-400 text-xs font-light">Access your secure identity vault</p>
            </div>

            <div 
              className={`relative z-0 w-full group transition-all duration-700 ease-out ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '200ms' : '0ms' }}
            >
              <input
                type="email"
                name="email"
                id="login_email"
                className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer placeholder-transparent"
                placeholder=" "
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <label
                htmlFor="login_email"
                className="absolute left-0 top-3 text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-red-500"
              >
                Email Address
              </label>
              <Mail className="absolute right-0 top-3 w-5 h-5 text-gray-600 peer-focus:text-red-500 transition-colors" />
            </div>

            <div 
              className={`relative z-0 w-full group transition-all duration-700 ease-out ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '300ms' : '0ms' }}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="login_password"
                className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer placeholder-transparent"
                placeholder=" "
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <label
                htmlFor="login_password"
                className="absolute left-0 top-3 text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-red-500"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-gray-600 hover:text-gray-400 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div 
              className={`flex items-center justify-between transition-all duration-700 ease-out ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '400ms' : '0ms' }}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded bg-gray-900 border-gray-700 text-red-600 focus:ring-red-500/20 focus:ring-offset-gray-950 w-4 h-4 cursor-pointer" 
                />
                <span className="text-xs text-gray-400 font-light hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-xs text-red-500 hover:text-red-400 transition-colors font-medium">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm tracking-wide transition-all duration-700 ease-out active:scale-95 glow-btn ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '500ms' : '0ms' }}
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-8 sm:px-12 pt-32 pb-3 md:pt-32 md:pb-2 z-10 md:ml-auto">
          <form onSubmit={handleRegisterSubmit} className="space-y-5">

            <div 
              className={`transition-all duration-700 ease-out ${
                !isLogin ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: !isLogin ? '100ms' : '0ms' }}
            >
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">Create Account</h2>
              <p className="text-gray-400 text-xs font-light">Join the secure network</p>
            </div>

            <div 
              className={`relative z-0 w-full group transition-all duration-700 ease-out ${
                !isLogin ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: !isLogin ? '200ms' : '0ms' }}
            >
              <input
                type="text"
                name="name"
                id="register_name"
                className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer placeholder-transparent"
                placeholder=" "
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
              <label
                htmlFor="register_name"
                className="absolute left-0 top-3 text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-red-500"
              >
                Full Name
              </label>
              <User className="absolute right-0 top-3 w-5 h-5 text-gray-600 peer-focus:text-red-500 transition-colors" />
            </div>

            <div 
              className={`relative z-0 w-full group transition-all duration-700 ease-out ${
                !isLogin ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: !isLogin ? '300ms' : '0ms' }}
            >
              <input
                type="email"
                name="email"
                id="register_email"
                className="block py-3 pr-24 pl-0 w-full text-sm text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer placeholder-transparent"
                placeholder=" "
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <label
                htmlFor="register_email"
                className="absolute left-0 top-3 text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-red-500"
              >
                Email Address
              </label>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!registerEmail || otpCountdown > 0}
                className="absolute right-0 top-2 px-2.5 py-1 rounded bg-red-600/10 text-red-500 hover:bg-red-600/20 text-xs font-semibold tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-red-500/20"
              >
                {otpCountdown > 0 ? `${otpCountdown}s` : isOtpSent ? "Resend" : "Send OTP"}
              </button>
            </div>

            <div 
              className={`relative z-0 w-full group transition-all duration-500 ease-out ${
                isOtpSent && !isLogin
                  ? 'max-h-20 opacity-100 translate-y-0 mt-4'
                  : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden pointer-events-none'
              }`}
            >
              <input
                type="text"
                name="otp"
                id="register_otp"
                className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer placeholder-transparent"
                placeholder=" "
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required={isOtpSent && !isLogin}
              />
              <label
                htmlFor="register_otp"
                className="absolute left-0 top-3 text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-red-500"
              >
                Enter OTP
              </label>
              <ShieldCheck className="absolute right-0 top-3 w-5 h-5 text-gray-600 peer-focus:text-red-500 transition-colors" />
            </div>

            <div 
              className={`relative z-0 w-full group transition-all duration-700 ease-out ${
                !isLogin ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: !isLogin ? '400ms' : '0ms' }}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="register_password"
                className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer placeholder-transparent"
                placeholder=" "
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <label
                htmlFor="register_password"
                className="absolute left-0 top-3 text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-red-500"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-gray-600 hover:text-gray-400 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm tracking-wide transition-all duration-700 ease-out active:scale-95 glow-btn ${
                !isLogin ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: !isLogin ? '500ms' : '0ms' }}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
