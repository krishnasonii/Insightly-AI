import React from 'react';
import { Sparkles, CheckCircle2, List, ClipboardList, Target } from 'lucide-react';

const AIInsightRenderer = ({ content }) => {
    if (!content) return null;

    const parseContent = (text) => {
        if (Array.isArray(text)) return text.map(t => ({ type: 'bullet', content: t }));

        const lines = text.split('\n').filter(line => line.trim() !== '');
        return lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) return { type: 'h1', content: trimmed.replace('# ', '') };
            if (trimmed.startsWith('## ')) return { type: 'h2', content: trimmed.replace('## ', '') };
            if (trimmed.startsWith('### ')) return { type: 'h3', content: trimmed.replace('### ', '') };
            if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                return { type: 'bullet', content: trimmed.replace(/^[-•]\s*/, '') };
            }
            return { type: 'paragraph', content: trimmed };
        });
    };

    const items = parseContent(content);

    const getIcon = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('overview') || lowerTitle.includes('summary')) return <Sparkles size={18} className="text-indigo-400" />;
        if (lowerTitle.includes('key point') || lowerTitle.includes('insights')) return <ClipboardList size={18} className="text-emerald-400" />;
        if (lowerTitle.includes('action item') || lowerTitle.includes('task')) return <CheckCircle2 size={18} className="text-amber-400" />;
        if (lowerTitle.includes('conclusion') || lowerTitle.includes('goal')) return <Target size={18} className="text-rose-400" />;
        return <List size={18} className="text-primary" />;
    };

    return (
        <div className="ai-insight-content">
            {items.map((item, index) => {
                switch (item.type) {
                    case 'h1':
                        return (
                            <div key={index} className="insight-header-main">
                                <h1>{item.content}</h1>
                                <div className="header-underline"></div>
                            </div>
                        );
                    case 'h2':
                        return (
                            <div key={index} className="insight-section-title">
                                {getIcon(item.content)}
                                <h2>{item.content}</h2>
                            </div>
                        );
                    case 'h3':
                        return <h3 key={index} className="insight-sub-title">{item.content}</h3>;
                    case 'bullet':
                        return (
                            <div key={index} className="insight-bullet">
                                <span className="bullet-dot"></span>
                                <p>{item.content}</p>
                            </div>
                        );
                    default:
                        return <p key={index} className="insight-paragraph">{item.content}</p>;
                }
            })}

            <style>{`
                .ai-insight-content {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    color: var(--text-main);
                    padding: 0.5rem;
                }
                .insight-header-main {
                    margin-bottom: 2rem;
                    text-align: center;
                }
                .insight-header-main h1 {
                    font-size: 1.75rem;
                    font-weight: 900;
                    background: var(--grad-main);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.02em;
                    margin-bottom: 0.5rem;
                }
                .header-underline {
                    height: 4px;
                    width: 60px;
                    background: var(--grad-main);
                    margin: 0 auto;
                    border-radius: 2px;
                    opacity: 0.6;
                }
                .insight-section-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin: 2rem 0 1rem 0;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 0.75rem;
                    border-left: 3px solid var(--primary);
                }
                .insight-section-title h2 {
                    font-size: 1rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-main);
                    margin: 0;
                }
                .insight-sub-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 1.5rem 0 0.75rem 0;
                }
                .insight-bullet {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 0.75rem;
                    padding-left: 0.5rem;
                }
                .bullet-dot {
                    min-width: 6px;
                    height: 6px;
                    background: var(--primary);
                    border-radius: 50%;
                    margin-top: 0.6rem;
                    box-shadow: 0 0 8px var(--primary);
                }
                .insight-bullet p {
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: var(--text-muted);
                    margin: 0;
                }
                .insight-paragraph {
                    font-size: 1rem;
                    line-height: 1.7;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                }
                
                @media (max-width: 768px) {
                    .insight-header-main h1 { font-size: 1.5rem; }
                    .insight-bullet p, .insight-paragraph { font-size: 0.9rem; }
                }
            `}</style>
        </div>
    );
};

export default AIInsightRenderer;
