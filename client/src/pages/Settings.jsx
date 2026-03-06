import React, { useState } from 'react';
import { User, Bell, Shield, Save, LogOut, ChevronRight, Globe, Lock, CreditCard } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const navItems = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'account', label: 'Account', icon: <Globe size={20} /> },
    { id: 'billing', label: 'Payments', icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="settings-wrapper slide-up">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </aside>

        <main className="settings-content-area">
          <div className="settings-card-premium fade-in">
            {activeTab === 'profile' && (
              <>
                <h3><User size={24} className="text-primary" /> Profile Information</h3>
                <form className="premium-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="input-container">
                    <label>Username</label>
                    <input type="text" className="premium-input" placeholder="Enter your name" />
                  </div>
                  <div className="input-container">
                    <label>Email Address</label>
                    <input type="email" className="premium-input" placeholder="Email address" />
                  </div>
                  <div className="input-container">
                    <label>Default Session Duration</label>
                    <select className="premium-select" defaultValue="60">
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="120">2 Hours</option>
                    </select>
                  </div>

                  <div className="settings-footer-actions">
                    <button type="button" className="btn-premium-logout">
                      <LogOut size={20} />
                      <span>Log Out</span>
                    </button>
                    <button type="submit" className="btn-premium-save">
                      <Save size={20} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab !== 'profile' && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Lock size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3>Module Locked</h3>
                <p style={{ color: 'var(--text-muted)' }}>This settings module is temporarily unavailable as we upgrade our infrastructure.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;

