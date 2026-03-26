import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Zap, Target, ShieldCheck, Sparkle, BarChart3, Globe, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [duration, setDuration] = useState('15');

  return (
    <div className="home-wrapper fade-in">
      {/* Decorative Elements */}
      <div className="decor-elements">
        <div className="decor-shape shape-1"></div>
        <div className="decor-shape shape-2"></div>
        <div className="decor-shape shape-3"></div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container split-layout slide-up">
          <div className="hero-text-content">
            <div className="badge-wrapper">
              <div className="new-badge">
                <Sparkle size={14} className="sparkle" />
                <span>New: Intelligent Meeting Mesh</span>
              </div>
            </div>
            <h1>AI Note Taking app <br /><span className="text-secondary">for Smarter</span> <br />Information Management</h1>
            <p className="hero-subtitle">
              Insightly AI is an AI note taking app that helps you keep up when meetings move fast. It listens, sorts what's important, and puts everything where it's easy to find later.
            </p>

            <div className="hero-action-group">
              <div className="action-hub glass">
                <div className="duration-picker">
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
                  <span>{user ? "Initialize Session" : "Get Started"}</span>
                  <ChevronRight size={20} className="arrow" />
                </Link>
              </div>

              <div className="hero-stats-mini">
                <div className="stat-mini">
                  <span className="stat-val">99.8%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-val">Real-time</span>
                  <span className="stat-label">Latency</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual-content">
            <div className="mockup-container">
              <div className="device-mockup laptop-frame slide-up" style={{ animationDelay: '0.2s' }}>
                <img src="/assets/dashboard_mockup.png" alt="Insightly AI Dashboard" className="mockup-img" />
              </div>
              <div className="device-mockup mobile-frame floating" style={{ animationDelay: '0.4s' }}>
                <img src="/assets/mobile_mockup.png" alt="Insightly AI Mobile" className="mockup-img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features section */}
      <div className="core-features-section">
        <div className="section-header-centered">
          <span className="section-tag">Core Capabilities</span>
          <h2>The future of meeting intelligence</h2>
        </div>

        <div className="core-grid">
          <div className="core-card">
            <div className="card-number">01</div>
            <h3>Conversation Analysis</h3>
            <p>With Insightly, reanalyse meetings for feasibility, user insights, decision arguments, investment opportunities, and more—instantly, all in one place.</p>
          </div>

          <div className="core-card highlighted">
            <div className="card-number">02</div>
            <h3>Content Querying</h3>
            <p>You can ask the AI meeting agent a question about any past discussion. It finds the right moment, quote, or document so you don't have to dig.</p>
          </div>

          <div className="core-card">
            <div className="card-number">03</div>
            <h3>Task Automation</h3>
            <p>Turn meetings into detailed reports and actionable tasks without lifting a finger. Insightly automates follow-ups, writes summaries, and saves you hours.</p>
          </div>
        </div>
      </div>

      <div className="advantage-section">
        <div className="advantage-container slide-up">
          <div className="advantage-text-content">
            <span className="section-tag">The Insightly Edge</span>
            <h2>Intelligence That Transforms Every Word into Action</h2>
            <p>
              Conversations are the heartbeat of your projects, but valuable insights often vanish once the call ends. 
              Insightly AI bridges the gap between talking and doing. Our engine doesn't just transcribe; it 
              interprets context, identifies key ownership, and organizes your data into a searchable brain for your entire team.
            </p>
          </div>
          <div className="advantage-actions">
            <button className="nav-arrow prev" title="Previous"><ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} /></button>
            <button className="nav-arrow next" title="Next"><ChevronRight size={24} /></button>
          </div>
        </div>
      </div>

      {/* Technical Features (Bento Grid) */}
      <div className="features-section">
        <div className="section-header">
          <h2>Engineered for Performance</h2>
          <p>Our comprehensive toolset ensures you never miss a beat.</p>
        </div>

        <div className="bento-grid">
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

          <div className="bento-item glass">
            <div className="card-icon-wrapper blue">
              <Target size={24} />
            </div>
            <h3>AI Summary</h3>
            <p>Distill long meetings into concise takeaways instantly.</p>
          </div>

          <div className="bento-item glass">
            <div className="card-icon-wrapper pink">
              <ShieldCheck size={24} />
            </div>
            <h3>Secured</h3>
            <p>Enterprise-grade AES-256 encryption for all data.</p>
          </div>

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

          <div className="bento-item bento-small glass">
            <Globe size={20} className="muted-icon" />
            <span className="small-label">Global Scale</span>
          </div>

          <div className="bento-item bento-small glass">
            <Cpu size={20} className="muted-icon" />
            <span className="small-label">Edge Compute</span>
          </div>
        </div>
      </div>

      <style>{`
        .home-wrapper {
          position: relative;
          padding: 4rem 0;
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

        .hero-section {
          width: 100%;
          margin-bottom: 8rem;
          padding: 4rem 0;
        }

        .hero-container.split-layout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4rem;
          text-align: left;
          position: relative;
          z-index: 10;
        }

        .hero-text-content {
          flex: 1;
          max-width: 600px;
        }

        .hero-visual-content {
          flex: 1.2;
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h1 {
          font-size: 4.5rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 2rem;
          color: white;
        }

        .text-secondary {
          color: #60a5fa;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 3.5rem;
          max-width: 550px;
        }

        .hero-action-group {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .action-hub {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0.75rem 0.75rem 0.75rem 1.5rem;
          border-radius: 4rem;
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .select-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
        }

        .select-container select {
          background: transparent;
          border: none;
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .main-cta-btn {
          background: #3b82f6;
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 3rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
        }

        .main-cta-btn:hover {
          transform: translateY(-3px);
          background: #2563eb;
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.3);
        }

        .divider-v {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
        }

        .hero-stats-mini {
          display: flex;
          gap: 3rem;
          padding-left: 1rem;
        }

        .stat-mini {
          display: flex;
          flex-direction: column;
        }

        .stat-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.25rem;
        }

        /* Mockup Visuals */
        .mockup-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .device-mockup {
          background: #1e293b;
          border-radius: 1.5rem;
          border: 8px solid #334155;
          overflow: hidden;
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
        }

        .mockup-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .laptop-frame {
          width: 80%;
          height: 350px;
          position: relative;
          z-index: 1;
          transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
        }

        .mobile-frame {
          width: 180px;
          height: 380px;
          position: absolute;
          bottom: -20px;
          right: 20px;
          z-index: 5;
          border: 8px solid #0f172a;
          border-radius: 2.5rem;
        }

        .floating {
          animation: floating 6s ease-in-out infinite;
        }

        @keyframes floating {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        /* Core Features */
        .core-features-section {
          padding: 8rem 0;
          position: relative;
          z-index: 10;
        }

        .section-header-centered {
          text-align: center;
          margin-bottom: 5rem;
        }

        .section-tag {
          color: #3b82f6;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 1rem;
        }

        .core-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .core-card {
          padding: 3.5rem 2.5rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 2rem;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .core-card:hover {
          background: rgba(15, 23, 41, 0.6);
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-10px);
        }

        .core-card.highlighted {
          border-color: #3b82f6;
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.1);
        }

        .card-number {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 1px solid #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #3b82f6;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .core-card h3 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
        }

        .core-card p {
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.7;
          font-size: 1.05rem;
        }

        /* Bento Grid Style */
        .features-section {
            padding-top: 6rem;
            position: relative;
            z-index: 5;
        }

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

        /* Responsive Fixes */
        @media (max-width: 1200px) {
          h1 { font-size: 3.5rem; }
          .hero-visual-content { height: 400px; }
          .laptop-frame { height: 300px; }
          .mobile-frame { height: 320px; width: 150px; }
        }

        @media (max-width: 1024px) {
          .hero-container.split-layout {
            flex-direction: column;
            text-align: center;
            gap: 5rem;
          }
          .hero-text-content {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-stats-mini {
            justify-content: center;
            padding: 0;
          }
          .core-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hero-section { padding: 2rem 0; }
          h1 { font-size: 2.8rem; }
          .hero-subtitle { font-size: 1.1rem; }
          .action-hub {
            flex-direction: column;
            width: 100%;
            border-radius: 2rem;
            padding: 1.5rem;
          }
          .divider-v { width: 100%; height: 1px; }
          .main-cta-btn { width: 100%; justify-content: center; }
          .core-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .hero-visual-content {
             height: 350px;
             width: 100%;
          }
          .laptop-frame { width: 90%; }
          .mobile-frame { right: 5%; bottom: -10px; }
          .features-section .section-header { text-align: center; }
        }

        @media (max-width: 640px) {
            .bento-grid {
              grid-template-columns: 1fr;
              grid-auto-rows: auto;
            }
            .bento-large, .bento-wide { grid-column: span 1; grid-row: span 1; }
            .bento-item { padding: 1.5rem; }
        }

        @media (max-width: 480px) {
           h1 { font-size: 2.2rem; }
           .core-card { padding: 2.5rem 1.5rem; }
           .core-card h3 { font-size: 1.6rem; }
        }

        /* Advantage Section */
        .advantage-section {
          padding: 8rem 0;
          position: relative;
        }

        .advantage-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .advantage-text-content {
          max-width: 800px;
        }

        .advantage-text-content h2 {
          font-size: 4rem;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
        }

        .advantage-text-content p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
        }

        .advantage-actions {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
        }

        .nav-arrow {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-arrow:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .advantage-container {
            flex-direction: column;
            align-items: flex-start;
          }
          .advantage-text-content h2 { font-size: 3rem; }
        }

        @media (max-width: 768px) {
          .advantage-section { padding: 4rem 0; }
          .advantage-text-content h2 { font-size: 2rem; }
          .advantage-text-content p { font-size: 1.1rem; }
          .advantage-actions { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Home;
