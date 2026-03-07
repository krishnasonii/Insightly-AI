import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Zap, Target, ShieldCheck, Sparkle, BarChart3, Globe, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [duration, setDuration] = useState('15');

  return (
    <div className="home-wrapper fade-in">
      { }
      <div className="decor-elements">
        <div className="decor-shape shape-1"></div>
        <div className="decor-shape shape-2"></div>
        <div className="decor-shape shape-3"></div>
      </div>

      <div className="hero-container slide-up">
        <div className="hero-content">
          <div className="badge-wrapper">
            <div className="new-badge">
              <Sparkle size={14} className="sparkle" />
              <span>New: Intelligent Meeting Mesh</span>
            </div>
          </div>
          <h1>Summarize meetings <br /><span className="text-gradient">effortlessly</span></h1>
          <p className="hero-subtitle">
            Experience the future of meeting intelligence. Capture, transcribe, and distill your conversations into actionable insights with Insightly AI's precision engine.
          </p>

          <div className="action-hub glass">
            <div className="duration-picker">
              <label>Match your session:</label>
              <div className="select-container">
                <Clock size={16} className="clock-icon" />
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="15">15 Seconds (Quick Test)</option>
                  <option value="30">30 Minutes (Standard)</option>
                  <option value="60">1 Hour (In-depth)</option>
                </select>
              </div>
            </div>

            <div className="divider-v"></div>

            <Link to={user ? "/live" : "/signup"} className="main-cta-btn" style={{ textDecoration: 'none' }}>
              <span>{user ? "Initialize Session" : "Start Free Trial"}</span>
              <ChevronRight size={20} className="arrow" />
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-val">99.8%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">Real-time</span>
            <span className="stat-label">Latency</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">AES-256</span>
            <span className="stat-label">Secured</span>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2>Engineered for Performance</h2>
          <p>Our comprehensive toolset ensures you never miss a beat.</p>
        </div>

        <div className="bento-grid">
          {/* Main Feature - Large Rectangle */}
          <div className="bento-item bento-large glass card-glow">
            <div className="card-icon-wrapper purple">
              <Zap size={32} />
            </div>
            <div className="bento-content">
              <h3>Lightning Transcription</h3>
              <p>Word-for-word accuracy delivered in real-time as you speak, powered by Deepgram's latest Nova-2 engine. Experience sub-second latency even in complex technical discussions.</p>
              <div className="bento-stats">
                <div className="b-stat"><span>&lt; 300ms</span><label>Latency</label></div>
                <div className="b-stat"><span>Multi-lang</span><label>Support</label></div>
              </div>
            </div>
          </div>

          { }
          <div className="bento-item glass">
            <div className="card-icon-wrapper blue">
              <Target size={24} />
            </div>
            <h3>AI Summary</h3>
            <p>Distill long meetings into concise takeaways instantly.</p>
          </div>

          { }
          <div className="bento-item glass">
            <div className="card-icon-wrapper pink">
              <ShieldCheck size={24} />
            </div>
            <h3>Secured</h3>
            <p>Enterprise-grade AES-256 encryption for all data.</p>
          </div>

          { }
          <div className="bento-item bento-wide glass">
            <div className="wide-layout">
              <div className="card-icon-wrapper green">
                <BarChart3 size={24} />
              </div>
              <div className="text-box">
                <h3>Actionable Insights</h3>
                <p>Our system automatically identifies deadlines, owners, and key decisions, visualizing them in an intuitive dashboard for your team to follow up.</p>
              </div>
            </div>
          </div>

          { }
          <div className="bento-item bento-small glass">
            <Globe size={20} className="muted-icon" />
            <span className="small-label">Global Scale</span>
          </div>

          { }
          <div className="bento-item bento-small glass">
            <Cpu size={20} className="muted-icon" />
            <span className="small-label">Edge Compute</span>
          </div>
        </div>
      </div>

      <style>{`
        .home-wrapper {
          position: relative;
          padding: 6rem 0;
          min-height: 100vh;
        }

        /* Decorative Elements */
        .decor-elements {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .decor-shape {
          position: absolute;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05));
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(40px);
          border-radius: 24% 76% 70% 30% / 30% 30% 70% 70%;
          animation: shapeFloat 20s infinite alternate ease-in-out;
        }
        .shape-1 {
          width: 400px; height: 400px;
          top: 10%; left: -5%;
        }
        .shape-2 {
          width: 300px; height: 300px;
          bottom: 20%; right: -5%;
          border-radius: 76% 24% 30% 70% / 70% 70% 30% 30%;
          animation-delay: -5s;
        }
        .shape-3 {
          width: 200px; height: 200px;
          top: 50%; left: 15%;
          animation-duration: 25s;
        }

        @keyframes shapeFloat {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          100% { transform: translateY(40px) rotate(15deg) scale(1.05); }
        }

        .hero-container {
          text-align: center;
          margin-bottom: 8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        h1 {
          font-size: 5.5rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 2rem;
          color: white;
          text-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .text-gradient {
          background: linear-gradient(135deg, #a855f7 0%, #f43f5e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.4));
        }

        .hero-subtitle {
          font-size: 1.4rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 750px;
          line-height: 1.6;
          margin-bottom: 4rem;
          font-weight: 500;
        }

        .action-hub {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem 2.5rem;
          border-radius: 3rem;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .main-cta-btn {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            border: none;
            padding: 1.1rem 2.5rem;
            border-radius: 1.75rem;
            font-size: 1.1rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-stats {
            display: flex;
            gap: 6rem;
            margin-top: 6rem;
        }

        .features-section {
            padding-top: 6rem;
            position: relative;
            z-index: 5;
        }

        /* Bento Grid */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 240px;
          gap: 1.5rem;
          margin-top: 4rem;
        }

        .bento-item {
          border-radius: 2rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .bento-item:hover {
          transform: translateY(-8px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .bento-large {
          grid-column: span 2;
          grid-row: span 2;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%) !important;
          justify-content: space-between;
        }

        .bento-wide {
          grid-column: span 2;
        }

        .bento-small {
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .bento-content h3 { font-size: 1.8rem; margin-bottom: 0.5rem; color: white; }
        .bento-item h3 { font-size: 1.25rem; color: #fff; }
        .bento-item p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; }

        .card-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
        }
        .purple { color: #818cf8; background: rgba(99, 102, 241, 0.1); }
        .blue { color: #60a5fa; background: rgba(59, 130, 246, 0.1); }
        .pink { color: #f472b6; background: rgba(244, 63, 94, 0.1); }
        .green { color: #34d399; background: rgba(16, 185, 129, 0.1); }

        .bento-stats {
          display: flex;
          gap: 2rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .b-stat span { display: block; font-size: 1.25rem; font-weight: 800; color: white; }
        .b-stat label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; }

        .wide-layout {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .muted-icon { color: rgba(255, 255, 255, 0.2); }
        .small-label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }

        @media (max-width: 1024px) {
            h1 { font-size: 3.8rem; }
            .hero-subtitle { font-size: 1.2rem; }
            .bento-grid {
              grid-template-columns: repeat(2, 1fr);
            }
        }
        @media (max-width: 768px) {
            .home-wrapper { padding: 4rem 0; }
            h1 { font-size: 2.5rem; margin-bottom: 1.5rem; }
            .hero-subtitle { font-size: 1rem; margin-bottom: 2.5rem; }
            .action-hub { flex-direction: column; width: 100%; padding: 1.5rem; border-radius: 2rem; gap: 1rem; }
            .duration-picker { width: 100%; text-align: left; }
            .select-container { width: 100%; }
            .divider-v { width: 100%; height: 1px; }
            .main-cta-btn { width: 100%; justify-content: center; }
            .hero-stats { gap: 2rem; flex-wrap: wrap; justify-content: center; margin-top: 3rem; }
        }
        @media (max-width: 640px) {
            .bento-grid {
              grid-template-columns: 1fr;
              grid-auto-rows: auto;
            }
            .bento-large, .bento-wide { grid-column: span 1; grid-row: span 1; }
            .bento-item { padding: 1.5rem; }
            .bento-content h3 { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;
