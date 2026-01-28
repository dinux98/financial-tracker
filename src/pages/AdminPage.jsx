import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Trash2, UserPlus, Shield, User, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
    const { users, registerUser, deleteUser, currentUser } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Protect Admin Page
    if (currentUser.role !== 'admin') {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-rose-600">Access Denied</h2>
                <p className="text-slate-500">You do not have permission to view this page.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold">Go Home</button>
            </div>
        )
    }

    const handleAddUser = (e) => {
        e.preventDefault();
        if (pin.length !== 4) {
            setError('PIN must be 4 digits');
            return;
        }
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        const success = registerUser(name, pin, role);
        if (success) {
            setName('');
            setPin('');
            setError('');
        }
    };

    return (
        <div className="animate-fade-in-up pb-10">
            <Header title="Admin Panel" subtitle="Manage users and permissions" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Add User Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <UserPlus size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Add New User</h3>
                    </div>

                    {error && <div className="mb-4 bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-bold">{error}</div>}

                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-primary outline-none transition-all"
                                    placeholder="e.g. Wife"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">PIN (4 Digits)</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={pin}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value) && e.target.value.length <= 4) {
                                            setPin(e.target.value);
                                        }
                                    }}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-primary outline-none transition-all"
                                    placeholder="e.g. 2024"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${role === 'user' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} className="hidden" />
                                    <User size={18} />
                                    <span className="font-bold text-sm">User</span>
                                </label>
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${role === 'admin' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="hidden" />
                                    <Shield size={18} />
                                    <span className="font-bold text-sm">Admin</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                            Create Account
                        </button>
                    </form>
                </div>

                {/* User List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                            <User size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Managed Accounts</h3>
                    </div>

                    <div className="space-y-3">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-slate-100">
                                        {user.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{user.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {user.role}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">PIN: {user.pin}</span>
                                        </div>
                                    </div>
                                </div>

                                {user.id !== currentUser.id && (
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
