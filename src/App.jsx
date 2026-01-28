import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalState';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// Layout Wrapper to ensure Layout is only shown on private pages
const AppLayout = ({ children }) => {
    return (
        <Layout>
            {children}
        </Layout>
    );
}

function App() {
    return (
        <AuthProvider>
            <GlobalProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />

                        <Route path="/" element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Dashboard />
                                </AppLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/transactions" element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <TransactionsPage />
                                </AppLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/reports" element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <ReportsPage />
                                </AppLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <AdminPage />
                                </AppLayout>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </GlobalProvider>
        </AuthProvider>
    );
}

export default App;
