import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Delete, ArrowRight, User } from 'lucide-react';

export const LoginPage = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { login, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleNumberClick = (num) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
            setError('');
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    const handleLogin = () => {
        if (pin.length < 4) return;

        const success = login(pin);
        if (!success) {
            setError('Incorrect PIN. Please try again.');
            setPin('');
        }
    };

    // Auto-login when 4 digits are entered
    useEffect(() => {
        if (pin.length === 4) {
            handleLogin();
        }
    }, [pin]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-100 border border-white p-8 w-full max-w-sm flex flex-col items-center animate-scale-up">

                <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mb-6 shadow-inner">
                    <Lock size={32} />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-sm mb-8">Enter your PIN to access your finances</p>

                {/* PIN Display */}
                <div className="flex gap-4 mb-8">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-emerald-500 scale-110' : 'bg-slate-200'}`}></div>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 text-rose-500 text-sm font-bold bg-rose-50 px-4 py-2 rounded-lg animate-pulse">
                        {error}
                    </div>
                )}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-6 w-full mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num.toString())}
                            className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm text-2xl font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 hover:-translate-y-1 transition-all flex items-center justify-center mx-auto active:scale-95"
                        >
                            {num}
                        </button>
                    ))}
                    <div className="flex items-center justify-center">
                        {/* Empty Spacer */}
                    </div>
                    <button
                        onClick={() => handleNumberClick('0')}
                        className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm text-2xl font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 hover:-translate-y-1 transition-all flex items-center justify-center mx-auto active:scale-95"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 shadow-sm text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-all flex items-center justify-center mx-auto active:scale-95"
                    >
                        <Delete size={24} />
                    </button>
                </div>

                <p className="text-xs text-slate-400 mt-4">Default Admin PIN: 1111</p>
            </div>
        </div>
    );
};
