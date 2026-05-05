
import React, { useState, useEffect } from 'react';

interface VerificationProps {
  contactInfo: { email: string; phone: string };
  onVerifySuccess: () => void;
  onBack: () => void;
}

const Verification: React.FC<VerificationProps> = ({ contactInfo, onVerifySuccess, onBack }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev: number) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate verification
    setTimeout(() => {
      if (fullCode === '123456') { // Mock correct code
        onVerifySuccess();
      } else {
        setIsVerifying(false);
        setError("Invalid code. Try 123456.");
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    }, 1500);
  };

  const handleResend = () => {
    setTimer(30);
    // PROTOTYPE ONLY: Simulate resending the code
    alert(`(Prototype Simulation)\n\nCode resent to:\n${contactInfo.email}\n\nYour Code: 123456`);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col px-6 py-12 relative animate-in fade-in duration-500">

      <button onClick={onBack} className="absolute top-8 left-6 text-gray-400 hover:text-white">
        <i className="fas fa-arrow-left text-xl"></i>
      </button>

      <div className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto w-full">

        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 p-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden">
          <img src="ecomatt_logo.png" alt="Ecomatt Logo" className="w-full h-full object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">Verification</h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          We sent a code to <span className="text-white font-bold">{contactInfo.phone}</span> and <span className="text-white font-bold">{contactInfo.email}</span>
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex justify-between gap-2 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 bg-gray-900 border border-gray-700 rounded-lg text-white text-2xl font-bold text-center focus:border-ecomattGreen outline-none transition-all"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs text-center mb-4 bg-red-500/10 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-ecomattGreen text-black font-bold text-lg py-3 rounded-xl shadow-[0_0_20px_rgba(39,205,0,0.4)] hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
          >
            {isVerifying ? <i className="fas fa-circle-notch fa-spin"></i> : 'Verify Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">Didn't receive code?</p>
          {timer > 0 ? (
            <span className="text-gray-400 font-mono text-sm">Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-ecomattGreen font-bold text-sm hover:underline"
            >
              Resend Code
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Verification;
