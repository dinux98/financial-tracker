import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="bg-rose-50 p-4 border-b border-rose-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-100 rounded-full text-rose-600">
                            <AlertTriangle size={20} />
                        </div>
                        <h3 className="font-bold text-rose-900">{title || "Confirm Action"}</h3>
                    </div>
                    <button onClick={onClose} className="text-rose-400 hover:text-rose-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-600 font-medium text-sm leading-relaxed">
                        {message || "Are you sure you want to proceed? This action cannot be undone."}
                    </p>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-sm hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all hover:-translate-y-0.5"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
