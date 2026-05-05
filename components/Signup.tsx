
import React, { useState } from 'react';

interface SignupProps {
    onSignupSubmit: (data: any) => void;
    onNavigateToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSubmit, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: 'Farm Manager',
        phone: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API delay and sending code
        setTimeout(() => {
            setIsLoading(false);
            // PROTOTYPE ONLY: Simulate the SMS/Email delivery
            alert(`(Prototype Simulation)\n\nA verification code has been sent to:\n📱 ${formData.phone}\n📧 ${formData.email}\n\nYour Code: 123456`);

            onSignupSubmit(formData);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center px-6 relative animate-in fade-in duration-500 overflow-y-auto py-10">

            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden">
                    <img src="ecomatt_logo.png" alt="Ecomatt Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
                <p className="text-sm text-gray-400 mt-1">Join Ecomatt Farm Management</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 mt-1 focus:border-ecomattGreen outline-none text-sm transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 mt-1 focus:border-ecomattGreen outline-none text-sm transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Role</label>
                    <div className="relative">
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 mt-1 focus:border-ecomattGreen outline-none text-sm appearance-none transition-colors"
                        >
                            <option value="Farm Manager">Farm Manager</option>
                            <option value="Herdsman">Herdsman</option>
                            <option value="General Worker">General Worker</option>
                            <option value="Veterinarian">Veterinarian</option>
                            <option value="Other">Other</option>
                        </select>
                        <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/3 text-gray-500 text-xs pointer-events-none"></i>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+263..."
                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 mt-1 focus:border-ecomattGreen outline-none text-sm transition-colors"
                    />
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 mt-1 focus:border-ecomattGreen outline-none text-sm transition-colors"
                    />
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 mt-1 focus:border-ecomattGreen outline-none text-sm transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-ecomattGreen text-black font-bold text-lg py-3 rounded-xl shadow-[0_0_20px_rgba(39,205,0,0.4)] mt-6 hover:bg-green-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin"></i> Sending Code...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <div className="text-center">
                <p className="text-gray-500 text-sm">Already have an account?</p>
                <button
                    onClick={onNavigateToLogin}
                    className="text-ecomattGreen font-bold text-sm mt-2 hover:underline"
                >
                    Sign In here
                </button>
            </div>

        </div>
    );
};

export default Signup;
