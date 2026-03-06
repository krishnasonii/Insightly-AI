import React from 'react';
import { Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer slide-up">
            <div className="container footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <Sparkles size={24} className="sparkle-icon" />
                        <span>Insightly AI</span>
                    </div>
                    <p>Transforming meetings into actionable intelligence through AI power.</p>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h4>Product</h4>
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it Works</a>
                        <a href="#pricing">Pricing</a>
                    </div>
                    <div className="link-group">
                        <h4>Company</h4>
                        <a href="#about">About Us</a>
                        <a href="#careers">Careers</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div className="link-group">
                        <h4>Resources</h4>
                        <a href="#blog">Blog</a>
                        <a href="#docs">Documentation</a>
                        <a href="#help">Help Center</a>
                    </div>
                </div>

                <div className="footer-social">
                    <h4>Stay Connected</h4>
                    <div className="social-icons">
                        <a href="https://github.com/krishnasonii" aria-label="GitHub"><Github size={20} /></a>
                        <a href="https://www.linkedin.com/in/krishna-soni-5b1a212b9/" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        <a href="mailto:krishnasoni.8596@gmail.com" aria-label="Email"><Mail size={20} /></a>
                        <a href="https://wa.me/918676859672" aria-label="WhatsApp" className="whatsapp-link" target="_blank" rel="noopener noreferrer">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Insightly AI Industries. All rights reserved.</p>
                <div className="bottom-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                </div>
            </div>

            <style>{`
                .footer {
                    background: var(--background);
                    border-top: 1px solid var(--surface-border);
                    padding: 5rem 0 2rem;
                    margin-top: 5rem;
                }
                .footer-content {
                    display: grid;
                    grid-template-columns: 1.5fr 3fr 1fr;
                    gap: 4rem;
                    margin-bottom: 4rem;
                }
                .footer-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-weight: 800;
                    background: var(--grad-main);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .sparkle-icon {
                    color: var(--primary);
                    filter: drop-shadow(0 0 5px var(--primary-glow));
                }
                .footer-brand p {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    line-height: 1.6;
                }
                .footer-links {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }
                .link-group {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .link-group h4, .footer-social h4 {
                    color: var(--text-main);
                    font-size: 1rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }
                .link-group a {
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: color 0.2s ease;
                }
                .link-group a:hover {
                    color: var(--primary);
                }
                .social-icons {
                    display: flex;
                    gap: 1.25rem;
                }
                .social-icons a {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                    color: var(--text-muted);
                    transition: all 0.3s ease;
                    border: 1px solid var(--surface-border);
                }
                .social-icons a:hover {
                    background: var(--primary);
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-glow);
                }
                .social-icons a.whatsapp-link:hover {
                    background: #25D366;
                    border-color: #25D366;
                }
                .footer-bottom {
                    border-top: 1px solid var(--surface-border);
                    padding-top: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0 auto;
                    max-width: 1280px;
                    padding-left: 2rem;
                    padding-right: 2rem;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                }
                .bottom-links {
                    display: flex;
                    gap: 2rem;
                }
                .bottom-links a {
                    color: var(--text-muted);
                    text-decoration: none;
                }
                .bottom-links a:hover {
                    text-decoration: underline;
                }
                @media (max-width: 1024px) {
                    .footer-content {
                        grid-template-columns: 1fr 1fr;
                        gap: 3rem;
                    }
                }
                @media (max-width: 768px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                    }
                    .footer-links {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .footer-bottom {
                        flex-direction: column;
                        gap: 1.5rem;
                        text-align: center;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
