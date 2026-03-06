import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.username, formData.email, formData.password);
            }
            
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="logo-section">
                            <div className="logo-icon-wrapper">
                                <Sparkles className="logo-sparkle" size={32} />
                                <span className="logo-emoji">💡</span>
                            </div>
                            <h1 className="brand-name">Insightly AI</h1>
                        </div>
                        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p>{isLogin ? 'Sign in to access your AI-powered insights' : 'Join Insightly AI to transform your meetings'}</p>
                    </div>

                    {error && (
                        <div className="auth-error-state">
                            <div className="error-content">{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="input-group">
                                <label>Username</label>
                                <div className="input-field-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="johndoe"
                                        required
                                        autoComplete="username"
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-field-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    autoComplete="email"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-field-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                            {!loading && <ArrowRight size={20} className="btn-arrow" />}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "New to Insightly AI?" : "Already have an account?"}
                            <button className="toggle-auth-btn" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? "Join now" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .auth-page {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    padding: 2rem;
                }

                .auth-container {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 460px;
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }


                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .auth-card {
                    background: var(--surface);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid var(--surface-border);
                    border-radius: 1.5rem;
                    padding: 3rem 2.5rem;
                    box-shadow: var(--shadow-lg);
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .logo-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .logo-icon-wrapper {
                    position: relative;
                    width: 64px;
                    height: 64px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: var(--grad-main);
                    border-radius: 1.25rem;
                    box-shadow: var(--shadow-glow);
                }

                .logo-emoji {
                    font-size: 2rem;
                    z-index: 2;
                }

                .logo-sparkle {
                    position: absolute;
                    color: white;
                    opacity: 0.4;
                    animation: spin 8s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .brand-name {
                    font-size: 1.5rem;
                    font-weight: 800;
                    background: var(--grad-main);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.02em;
                }

                .auth-header h2 {
                    font-size: 1.85rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-bottom: 0.5rem;
                }

                .auth-header p {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    line-height: 1.6;
                }

                .auth-error-state {
                    background: rgba(239, 68, 68, 0.1);
                    border-left: 4px solid var(--danger);
                    padding: 1rem;
                    border-radius: 0.75rem;
                    margin-bottom: 2rem;
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }

                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }

                .error-content {
                    color: #f87171;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }

                .input-group label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    margin-left: 0.25rem;
                }

                .input-field-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    left: 1.25rem;
                    color: var(--text-muted);
                    transition: color 0.3s ease;
                }

                .input-field-wrapper input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--surface-border);
                    border-radius: 1rem;
                    padding: 1rem 1.25rem 1rem 3.25rem;
                    color: var(--text-main);
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .input-field-wrapper input:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.06);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px var(--primary-glow);
                }

                .input-field-wrapper input:focus + .input-icon {
                    color: var(--primary);
                }

                .auth-submit-btn {
                    margin-top: 1rem;
                    background: var(--grad-main);
                    color: white;
                    border: none;
                    border-radius: 1rem;
                    padding: 1.1rem;
                    font-size: 1.1rem;
                    font-weight: 700;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                }

                .auth-submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
                    filter: brightness(1.1);
                }

                .auth-submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .auth-submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-arrow {
                    transition: transform 0.3s ease;
                }

                .auth-submit-btn:hover .btn-arrow {
                    transform: translateX(4px);
                }

                .auth-footer {
                    margin-top: 2.5rem;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                }

                .toggle-auth-btn {
                    background: none;
                    border: none;
                    color: var(--primary);
                    font-weight: 700;
                    margin-left: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .toggle-auth-btn:hover {
                    color: var(--secondary);
                    text-decoration: underline;
                }

                @media (max-width: 480px) {
                    .auth-card {
                        padding: 2.5rem 1.75rem;
                    }
                    .auth-page {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Auth;
