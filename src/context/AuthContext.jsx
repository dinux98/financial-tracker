import React, { createContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
    users: JSON.parse(localStorage.getItem('moneytracker_users')) || [],
    currentUser: JSON.parse(sessionStorage.getItem('moneytracker_current_user')) || null,
    error: null
};

// Create context
export const AuthContext = createContext(initialState);

// Reducer
const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                currentUser: action.payload,
                error: null
            };
        case 'LOGOUT_USER':
            return {
                ...state,
                currentUser: null,
                error: null
            };
        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, action.payload]
            };
        case 'DELETE_USER':
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload)
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    // Initialize Default Admin if no users exist
    useEffect(() => {
        if (state.users.length === 0) {
            const defaultAdmin = {
                id: uuidv4(),
                name: 'Admin',
                pin: '1111',
                role: 'admin',
                avatar: '👑'
            };
            dispatch({ type: 'ADD_USER', payload: defaultAdmin });
        }
    }, []);

    // Persist Users
    useEffect(() => {
        if (state.users.length > 0) {
            localStorage.setItem('moneytracker_users', JSON.stringify(state.users));
        }
    }, [state.users]);

    // Persist Current Session
    useEffect(() => {
        if (state.currentUser) {
            sessionStorage.setItem('moneytracker_current_user', JSON.stringify(state.currentUser));
        } else {
            sessionStorage.removeItem('moneytracker_current_user');
        }
    }, [state.currentUser]);

    // Actions
    function login(pin) {
        const user = state.users.find(u => u.pin === pin);
        if (user) {
            dispatch({ type: 'LOGIN_USER', payload: user });
            return true;
        } else {
            dispatch({ type: 'AUTH_ERROR', payload: 'Invalid PIN' });
            return false;
        }
    }

    function logout() {
        dispatch({ type: 'LOGOUT_USER' });
    }

    function registerUser(name, pin, role = 'user') {
        const existingInfo = state.users.find(u => u.pin === pin);
        if (existingInfo) {
            dispatch({ type: 'AUTH_ERROR', payload: 'PIN already exists' });
            return false;
        }

        const newUser = {
            id: uuidv4(),
            name,
            pin,
            role,
            avatar: role === 'admin' ? '👑' : '👤'
        };
        dispatch({ type: 'ADD_USER', payload: newUser });
        return true;
    }

    function deleteUser(id) {
        dispatch({ type: 'DELETE_USER', payload: id });
    }

    return (
        <AuthContext.Provider value={{
            users: state.users,
            currentUser: state.currentUser,
            error: state.error,
            login,
            logout,
            registerUser,
            deleteUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};
