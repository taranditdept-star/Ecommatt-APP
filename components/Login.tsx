
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password?: string) => void;
  onSignupClick: () => void;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignupClick, error }) => {
  const [email, setEmail] = useState('manager@ecomatt.co.zw');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const setTestAccount = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center px-8 relative animate-in fade-in duration-700">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden">
          <img src="ecomatt_logo.png" alt="Ecomatt Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Ecomatt Farm</h1>
        <p className="text-sm text-gray-400 mt-2">Intelligent Management System</p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-sm mx-auto w-full">
        <div>
          <label className="text-xs text-gray-500 font-bold uppercase ml-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-4 mt-1 focus:border-ecomattGreen outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-bold uppercase ml-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="........"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-4 mt-1 focus:border-ecomattGreen outline-none transition-colors"
          />
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg"><p className="text-red-500 text-sm text-center font-bold">{error}</p></div>}

        <button
          type="submit"
          className="w-full bg-ecomattGreen text-black font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(39,205,0,0.4)] mt-4 hover:bg-green-500 transition-colors"
        >
          Sign In
        </button>
      </form>

      <div className="text-center mb-8">
        <p className="text-gray-500 text-xs">Don't have an account?</p>
        <button onClick={onSignupClick} className="text-ecomattGreen font-bold text-xs mt-1 hover:underline">Create an Account</button>
      </div>

      {/* Role Testing Helpers */}
      <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800 max-w-sm mx-auto w-full">
        <p className="text-gray-500 text-xs font-bold uppercase mb-3 text-center">Tap to Prefill Credentials</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setTestAccount('manager@ecomatt.co.zw')} className="text-[10px] bg-gray-800 text-white py-2 rounded hover:bg-gray-700">Manager (Admin)</button>
          <button type="button" onClick={() => setTestAccount('herdsman@ecomatt.co.zw')} className="text-[10px] bg-gray-800 text-white py-2 rounded hover:bg-gray-700">Herdsman</button>
          <button type="button" onClick={() => setTestAccount('vet@ecomatt.co.zw')} className="text-[10px] bg-gray-800 text-white py-2 rounded hover:bg-gray-700">Veterinarian</button>
          <button type="button" onClick={() => setTestAccount('worker@ecomatt.co.zw')} className="text-[10px] bg-gray-800 text-white py-2 rounded hover:bg-gray-700">Worker</button>
        </div>
      </div>

      <p className="text-center text-gray-600 text-[10px] mt-8">Version 1.2.0 • Ecomatt PWA</p>
    </div>
  );
};

export default Login;
