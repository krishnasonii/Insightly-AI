import React, { useMemo } from 'react';
import './Background.css';

const Background = () => {
    
    const stars = useMemo(() =>
        [...Array(50)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: `${Math.random() * 3}px`,
            duration: `${3 + Math.random() * 7}s`,
            delay: `${Math.random() * 5}s`
        })), []);

    const particles = useMemo(() =>
        [...Array(25)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: `${10 + Math.random() * 20}s`,
            delay: `${Math.random() * 10}s`
        })), []);

    return (
        <div className="background-engine">
            {}
            <div className="mesh-layer">
                <div className="sphere sphere-purple"></div>
                <div className="sphere sphere-indigo"></div>
                <div className="sphere sphere-pink"></div>
            </div>

            {}
            <div className="stars-layer">
                {stars.map(s => (
                    <div
                        key={s.id}
                        className="star"
                        style={{
                            left: s.left,
                            top: s.top,
                            width: s.size,
                            height: s.size,
                            animationDuration: s.duration,
                            animationDelay: s.delay
                        }}
                    />
                ))}
            </div>

            {}
            <div className="particles-layer">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="floating-particle"
                        style={{
                            left: p.left,
                            animationDuration: p.duration,
                            animationDelay: p.delay
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(Background);
