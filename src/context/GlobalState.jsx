import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from './AuthContext';

// Initial state
const initialState = {
    transactions: JSON.parse(localStorage.getItem('transactions')) || [
        { id: 1, text: 'Freelance Payment', amount: 15000, date: '2024-01-15', category: 'Salary', type: 'income' },
        { id: 2, text: 'Grocery Shopping', amount: 3500, date: '2024-01-16', category: 'Food', type: 'expense' },
        { id: 3, text: 'Utility Bill', amount: 4500, date: '2024-01-18', category: 'Bills', type: 'expense' },
    ]
};

// Create context
export const GlobalContext = createContext(initialState);

// Reducer
const AppReducer = (state, action) => {
    switch (action.type) {
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
            };
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions]
            };
        case 'EDIT_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(transaction =>
                    transaction.id === action.payload.id ? action.payload : transaction
                )
            };
        case 'SET_TRANSACTIONS':
            return {
                ...state,
                transactions: action.payload
            };
        default:
            return state;
    }
};

// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    const [transactionEdit, setTransactionEdit] = React.useState({ item: {}, edit: false });
    const { currentUser, users } = useContext(AuthContext);

    // Migration and Loading Logic
    useEffect(() => {
        // Migration: If we have transactions WITHOUT userId, and we have an Admin user (first user), assign them.
        if (state.transactions.length > 0 && !state.transactions[0].userId && users.length > 0) {
            const adminId = users[0].id; // Assuming first user is Admin
            const migratedTransactions = state.transactions.map(t => ({ ...t, userId: adminId }));

            // Dispatch update to state and localStorage immediately
            dispatch({ type: 'SET_TRANSACTIONS', payload: migratedTransactions });
            localStorage.setItem('transactions', JSON.stringify(migratedTransactions));
        }
    }, [users, state.transactions]);


    // Persistence
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(state.transactions));
    }, [state.transactions]);

    // Actions
    function deleteTransaction(id) {
        dispatch({
            type: 'DELETE_TRANSACTION',
            payload: id
        });
    }

    function addTransaction(transaction) {
        if (!currentUser) return; // Guard clause

        const newTransaction = {
            ...transaction,
            id: uuidv4(),
            userId: currentUser.id // Tag transaction with User ID
        };
        dispatch({
            type: 'ADD_TRANSACTION',
            payload: newTransaction
        });
    }

    function editTransaction(updatedTransaction) {
        dispatch({
            type: 'EDIT_TRANSACTION',
            payload: updatedTransaction
        });
    }

    // Filter transactions for the current user
    const userTransactions = state.transactions.filter(t => t.userId === currentUser?.id);

    return (
        <GlobalContext.Provider value={{
            transactions: userTransactions, // Only expose user's transactions
            allTransactions: state.transactions, // Internal use if needed
            deleteTransaction,
            addTransaction,
            editTransaction,
            transactionEdit,
            setTransactionEdit
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
