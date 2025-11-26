import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/authAPI';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getDashboard();
                setDashboardData(data);
            } catch (err) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-content">
                <div className="welcome-card">
                    <h2>{dashboardData?.message || 'Welcome to your Dashboard'}</h2>
                    {dashboardData?.user && (
                        <div className="user-info">
                            <h3>User Information</h3>
                            <p><strong>User ID:</strong> {dashboardData.user.id}</p>
                            {dashboardData.user.role && (
                                <p><strong>Role:</strong> {dashboardData.user.role}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="dashboard-cards">
                    <div className="info-card">
                        <h3>Protected Route</h3>
                        <p>This page is only accessible to authenticated users.</p>
                    </div>
                    <div className="info-card">
                        <h3>Token Status</h3>
                        <p>Your access token is active and valid.</p>
                    </div>
                    <div className="info-card">
                        <h3>Auto Refresh</h3>
                        <p>Tokens are automatically refreshed when expired.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
