import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, isPWA }) {

  const { handleLogin, handleRegister, handleResetPassword, showToast, requestOtp } = useContext(AppContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!registerEmail) return;
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+[a-zA-Z]+[0-9]+@indoreinstitute\.com$/;
    if (!emailRegex.test(registerEmail)) {
      showToast("Please use your @indoreinstitute.com email.", 'error');
      return;
    }
    const success = await requestOtp(registerEmail);
    if (success) {
      setIsOtpSent(true);
      setOtpCountdown(30);
      showToast(`OTP sent to ${registerEmail}!`, 'info');
    }
  };

  const handleModeChange = (loginState) => {
    setIsLogin(loginState);
    setIsForgotPassword(false);
    setIsOtpSent(false);
    setOtpCode('');
    setOtpCountdown(0);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+[a-zA-Z]+[0-9]+@indoreinstitute\.com$/;
      if (!emailRegex.test(loginEmail)) {
        showToast("Please use your @indoreinstitute.com email.", 'error');
        return;
      }
      const success = await requestOtp(loginEmail, 'reset');
      if (success) {
        setIsOtpSent(true);
        setOtpCountdown(30);
        showToast(`OTP sent to ${loginEmail}!`, 'info');
      }
      return;
    }

    if (!otpCode) {
      showToast("Please enter the OTP.", 'error');
      return;
    }
    
    if (loginPassword.length < 6) {
      showToast("Password must be at least 6 characters.", 'error');
      return;
    }

    const success = await handleResetPassword(loginEmail, otpCode, loginPassword);
    if (success) {
      setIsForgotPassword(false);
      setIsOtpSent(false);
      setOtpCode('');
      setLoginPassword('');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+[a-zA-Z]+[0-9]+@indoreinstitute\.com$/;
    if (!emailRegex.test(loginEmail)) {
      showToast("Please use your @indoreinstitute.com email.", 'error');
      return;
    }
    const success = await handleLogin(loginEmail, loginPassword);
    if (success) {
      onClose();
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isOtpSent && !otpCode) {
      showToast("Please enter the OTP.", 'error');
      return;
    }
    const success = await handleRegister(registerName, registerEmail, registerPassword, otpCode);
    if (success) {
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isPWA ? 'bg-zinc-50' : 'bg-zinc-900/40 backdrop-blur-sm'} animate-fade-in transition-opacity duration-300`}>

      <div className="absolute inset-0" onClick={!isPWA ? onClose : undefined}></div>

      <div className="relative w-full max-w-[850px] min-h-[680px] md:min-h-[580px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 transition-transform duration-300 scale-100">

        {!isPWA && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-zinc-100 md:bg-white/50 hover:bg-zinc-200 text-zinc-500 transition-all duration-300 border border-zinc-200 shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div 
          className={`hidden md:block absolute z-20 bg-emerald-600 transition-all duration-700 ease-in-out shadow-xl ${
            isLogin 
              ? 'left-1/2 top-0 h-full w-1/2' 
              : 'left-0 top-0 h-full w-1/2'
          }`}
        >

          <div 
            className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center p-8 text-center text-white transition-all duration-700 ease-in-out ${
              isLogin 
                ? 'opacity-100 scale-100 blur-0 translate-y-0 md:translate-x-0' 
                : 'opacity-0 scale-90 blur-md translate-y-12 md:translate-y-0 md:translate-x-12 pointer-events-none'
            }`}
          >
            <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center border border-white/30 mb-6 backdrop-blur-md shadow-inner">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-black mb-4 tracking-tight">Welcome!</h3>
            <p className="text-emerald-50 font-medium text-base max-w-[280px] mb-8 leading-relaxed">
              New to CampusPulse? Create an account to join your exclusive college network.
            </p>
            <button
              onClick={() => handleModeChange(false)}
              className="px-8 py-3.5 rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-emerald-700 transition-all duration-300 font-bold text-sm tracking-wide shadow-lg cursor-pointer"
            >
              Create Account
            </button>
          </div>

          <div 
            className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center p-8 text-center text-white transition-all duration-700 ease-in-out ${
              !isLogin 
                ? 'opacity-100 scale-100 blur-0 translate-y-0 md:translate-x-0' 
                : 'opacity-0 scale-90 blur-md -translate-y-12 md:translate-y-0 md:-translate-x-12 pointer-events-none'
            }`}
          >
            <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center border border-white/30 mb-6 backdrop-blur-md shadow-inner">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-black mb-4 tracking-tight">Welcome Back!</h3>
            <p className="text-emerald-50 font-medium text-base max-w-[280px] mb-8 leading-relaxed">
              Already connected? Sign in to see what's happening on campus right now.
            </p>
            <button
              onClick={() => handleModeChange(true)}
              className="px-8 py-3.5 rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-emerald-700 transition-all duration-300 font-bold text-sm tracking-wide shadow-lg cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Login / Reset Form */}
        <div className={`absolute md:relative inset-0 md:inset-auto w-full md:w-1/2 h-full flex flex-col justify-center px-6 sm:px-14 py-12 md:pt-32 md:pb-2 z-10 bg-white overflow-y-auto transition-all duration-700 ease-in-out ${isLogin ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none'}`}>
          <form onSubmit={isForgotPassword ? handleResetSubmit : handleLoginSubmit} className="space-y-6">

            <div 
              className={`transition-all duration-700 ease-out ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '100ms' : '0ms' }}
            >
              <h2 className="text-3xl font-black text-zinc-950 tracking-tight mb-2">
                {isForgotPassword ? "Reset Password" : "Sign In"}
              </h2>
              <p className="text-zinc-500 text-sm font-medium">
                {isForgotPassword ? "Enter email to receive OTP" : "Access your campus network"}
              </p>
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
                className="block py-3 px-0 w-full text-base text-zinc-900 bg-transparent border-0 border-b-2 border-zinc-200 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer placeholder-transparent transition-colors"
                placeholder=" "
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <label
                htmlFor="login_email"
                className="absolute left-0 top-3 text-zinc-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-emerald-600 font-medium"
              >
                College Email
              </label>
              <Mail className="absolute right-0 top-3 w-5 h-5 text-zinc-400 peer-focus:text-emerald-600 transition-colors" />
            </div>

            {isForgotPassword && (
              <div 
                className={`relative z-0 w-full group transition-all duration-500 ease-out ${
                  isOtpSent
                    ? 'max-h-20 opacity-100 translate-y-0 mt-4'
                    : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden pointer-events-none'
                }`}
              >
                <input
                  type="text"
                  name="reset_otp"
                  id="reset_otp"
                  className="block py-3 px-0 w-full text-base text-zinc-900 bg-transparent border-0 border-b-2 border-zinc-200 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer placeholder-transparent transition-colors"
                  placeholder=" "
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required={isForgotPassword && isOtpSent}
                />
                <label
                  htmlFor="reset_otp"
                  className="absolute left-0 top-3 text-zinc-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-emerald-600 font-medium"
                >
                  Enter OTP
                </label>
                <ShieldCheck className="absolute right-0 top-3 w-5 h-5 text-zinc-400 peer-focus:text-emerald-600 transition-colors" />
              </div>
            )}

            {(isForgotPassword && !isOtpSent) ? null : (
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
                  className="block py-3 px-0 w-full text-base text-zinc-900 bg-transparent border-0 border-b-2 border-zinc-200 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer placeholder-transparent transition-colors"
                  placeholder=" "
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required={!isForgotPassword || isOtpSent}
                />
                <label
                  htmlFor="login_password"
                  className="absolute left-0 top-3 text-zinc-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-emerald-600 font-medium"
                >
                  {isForgotPassword ? "New Password" : "Password"}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            <div 
              className={`flex items-center justify-between transition-all duration-700 ease-out ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '400ms' : '0ms' }}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" 
                />
                <span className="text-sm text-zinc-500 font-medium hover:text-zinc-700 transition-colors">Remember me</span>
              </label>
              {!isForgotPassword && (
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(true)} 
                  className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-bold"
                >
                  Forgot Password?
                </button>
              )}
            </div>

            {isForgotPassword && (
              <button 
                type="button" 
                onClick={() => setIsForgotPassword(false)} 
                className="w-full text-center text-sm font-bold text-zinc-500 hover:text-zinc-800 transition-colors block"
              >
                ← Back to Sign In
              </button>
            )}

            <button
              type="submit"
              className={`w-full py-4 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-base tracking-wide transition-all duration-700 ease-out shadow-lg hover:-translate-y-0.5 ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '500ms' : '0ms' }}
            >
              {isForgotPassword ? (isOtpSent ? "Reset Password" : "Send OTP") : "Sign In"}
            </button>

            {/* Mobile Toggle */}
            <div 
              className={`md:hidden text-center mt-6 transition-all duration-700 ease-out ${
                isLogin ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: isLogin ? '600ms' : '0ms' }}
            >
              <p className="text-zinc-600 text-sm">
                Don't have an account?{' '}
                <button type="button" onClick={() => handleModeChange(false)} className="text-emerald-600 font-bold hover:underline">
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className={`absolute md:relative inset-0 md:inset-auto w-full md:w-1/2 h-full flex flex-col justify-center px-6 sm:px-14 py-12 md:pt-32 md:pb-2 z-10 md:ml-auto bg-white overflow-y-auto transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none'}`}>
          <form onSubmit={handleRegisterSubmit} className="space-y-6">

            <div 
              className={`transition-all duration-700 ease-out ${
                !isLogin ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: !isLogin ? '100ms' : '0ms' }}
            >
              <h2 className="text-3xl font-black text-zinc-950 tracking-tight mb-2">Sign Up</h2>
              <p className="text-zinc-500 text-sm font-medium">Join the secure college network</p>
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
                className="block py-3 px-0 w-full text-base text-zinc-900 bg-transparent border-0 border-b-2 border-zinc-200 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer placeholder-transparent transition-colors"
                placeholder=" "
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
              <label
                htmlFor="register_name"
                className="absolute left-0 top-3 text-zinc-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-emerald-600 font-medium"
              >
                Full Name
              </label>
              <User className="absolute right-0 top-3 w-5 h-5 text-zinc-400 peer-focus:text-emerald-600 transition-colors" />
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
                className="block py-3 pr-24 pl-0 w-full text-base text-zinc-900 bg-transparent border-0 border-b-2 border-zinc-200 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer placeholder-transparent transition-colors"
                placeholder=" "
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <label
                htmlFor="register_email"
                className="absolute left-0 top-3 text-zinc-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-emerald-600 font-medium"
              >
                College Email
              </label>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!registerEmail || otpCountdown > 0}
                className="absolute right-0 top-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-bold tracking-wider transition-colors disabled:opacity-50 border border-zinc-200 shadow-sm"
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
                className="block py-3 px-0 w-full text-base text-zinc-900 bg-transparent border-0 border-b-2 border-zinc-200 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer placeholder-transparent transition-colors"
                placeholder=" "
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required={isOtpSent && !isLogin}
              />
              <label
                htmlFor="register_otp"
                className="absolute left-0 top-3 text-zinc-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-emerald-600 font-medium"
              >
                Enter OTP
              </label>
              <ShieldCheck className="absolute right-0 top-3 w-5 h-5 text-zinc-400 peer-focus:text-emerald-600 transition-colors" />
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
                className="block py-3 px-0 w-full text-base text-zinc-900 bg-transparent border-0 border-b-2 border-zinc-200 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-600 peer placeholder-transparent transition-colors"
                placeholder=" "
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <label
                htmlFor="register_password"
                className="absolute left-0 top-3 text-zinc-500 text-sm duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-emerald-600 font-medium"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-zinc-400 hover:text-zinc-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-base tracking-wide transition-all duration-700 ease-out shadow-lg hover:-translate-y-0.5 ${
                !isLogin ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: !isLogin ? '500ms' : '0ms' }}
            >
              Sign Up
            </button>

            {/* Mobile Toggle */}
            <div 
              className={`md:hidden text-center mt-6 transition-all duration-700 ease-out ${
                !isLogin ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-[120%] opacity-0 blur-md pointer-events-none'
              }`}
              style={{ transitionDelay: !isLogin ? '600ms' : '0ms' }}
            >
              <p className="text-zinc-600 text-sm">
                Already have an account?{' '}
                <button type="button" onClick={() => handleModeChange(true)} className="text-emerald-600 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
