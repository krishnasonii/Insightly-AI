import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import { Camera, Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare, Shield, Zap, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';
import AIInsightRenderer from '../components/AIInsightRenderer';

const VideoCall = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [joined, setJoined] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [peers, setPeers] = useState([]);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [transcript, setTranscript] = useState([]);
    const [summary, setSummary] = useState(null);
    const [isEnding, setIsEnding] = useState(false);

    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const userStream = useRef();
    const recorderRef = useRef();
    const chunkIntervalRef = useRef();
    const currentRoomId = useRef('');
    const processedPeers = useRef(new Set());

    useEffect(() => {
        socketRef.current = io(API_BASE_URL, {
            auth: { token: localStorage.getItem('token') },
            transports: ['websocket'],
            reconnectionAttempts: 10
        });

        const socket = socketRef.current;

        socket.on('connect', () => console.log('[VIDEO] Socket connected:', socket.id));
        socket.on('room-ready', (data) => setIsHost(data.isHost));

        socket.on('all-users', users => {
            const newPeers = [];
            users.forEach(userID => {
                if (!processedPeers.current.has(userID)) {
                    const peer = createPeer(userID, socket.id, userStream.current);
                    peersRef.current.push({ peerID: userID, peer });
                    newPeers.push({ peerID: userID, peer });
                    processedPeers.current.add(userID);
                }
            });
            setPeers(prev => [...prev, ...newPeers]);
        });

        socket.on('user-joined-signal', payload => {
            if (!processedPeers.current.has(payload.callerID)) {
                const peer = addPeer(payload.signal, payload.callerID, userStream.current);
                peersRef.current.push({ peerID: payload.callerID, peer });
                processedPeers.current.add(payload.callerID);
                setPeers(prev => [...prev, { peerID: payload.callerID, peer }]);
            }
        });

        socket.on('receiving-returned-signal', payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            if (item) item.peer.signal(payload.signal);
        });

        socket.on('user-left', id => {
            const peerObj = peersRef.current.find(p => p.peerID === id);
            if (peerObj) peerObj.peer.destroy();
            const filteredPeers = peersRef.current.filter(p => p.peerID !== id);
            peersRef.current = filteredPeers;
            processedPeers.current.delete(id);
            setPeers(filteredPeers);
        });

        socket.on('partial-transcript', (data) => {
            setTranscript(prev => [...prev, {
                username: data.username,
                text: data.text,
                isMe: data.sender === socketRef.current.id
            }]);
        });

        socket.on('meeting-ended', (data) => {
            setSummary(data.summary);
            setIsEnding(false);
            stopStreaming();
        });

        return () => {
            stopStreaming();
            peersRef.current.forEach(p => p.peer.destroy());
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (joined && userStream.current && userVideo.current) {
            userVideo.current.srcObject = userStream.current;
        }
    }, [joined]);

    const stopStreaming = () => {
        if (userStream.current) {
            userStream.current.getTracks().forEach(track => track.stop());
        }
        clearInterval(chunkIntervalRef.current);
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
            recorderRef.current.stop();
        }
    };

    const startAudioStreaming = (stream) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const dest = audioContext.createMediaStreamDestination();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(dest);
            const recorder = new MediaRecorder(dest.stream, { mimeType: 'audio/webm' });
            recorderRef.current = recorder;
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0 && socketRef.current?.connected) {
                    socketRef.current.emit('audio-chunk', { roomId: currentRoomId.current, audio: e.data });
                }
            };
            chunkIntervalRef.current = setInterval(() => {
                if (recorder.state === 'recording') {
                    recorder.stop();
                    recorder.start();
                }
            }, 5000);
            recorder.start();
        } catch (err) {
            console.error('[VIDEO] Transcript streaming failed:', err.message);
        }
    };

    const joinRoom = async () => {
        if (!roomId) return alert('Enter a room ID');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });
            userStream.current = stream;
            currentRoomId.current = roomId;
            setJoined(true);
            socketRef.current.emit('join-room', roomId);
            startAudioStreaming(stream);
        } catch (err) {
            console.error('[VIDEO] Media setup failed:', err);
            alert('Could not access camera or microphone.');
        }
    };

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', signal => socketRef.current.emit('sending-signal', { userToSignal, callerID, signal }));
        return peer;
    };

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', signal => socketRef.current.emit('returning-signal', { signal, callerID }));
        peer.signal(incomingSignal);
        return peer;
    };

    const toggleAudio = () => {
        if (userStream.current) {
            const enabled = !audioEnabled;
            userStream.current.getAudioTracks().forEach(t => t.enabled = enabled);
            setAudioEnabled(enabled);
        }
    };

    const toggleVideo = () => {
        if (userStream.current) {
            const enabled = !videoEnabled;
            userStream.current.getVideoTracks().forEach(t => t.enabled = enabled);
            setVideoEnabled(enabled);
        }
    };

    const endMeeting = () => {
        if (window.confirm('End meeting for all?')) {
            setIsEnding(true);
            socketRef.current.emit('end-meeting', { roomId: currentRoomId.current });
        }
    };

    const leaveMeeting = () => {
        stopStreaming();
        setJoined(false);
        setPeers([]);
        peersRef.current.forEach(p => p.peer.destroy());
        peersRef.current = [];
        processedPeers.current.clear();
        currentRoomId.current = '';
        setIsHost(false);
        navigate('/dashboard');
    };

    if (summary) {
        return (
            <div className="summary-overlay">
                <div className="summary-card glass shadow-glow animate-slide-up">
                    <div className="summary-header">
                        <div className="icon-badge primary">
                            <Sparkles size={24} />
                        </div>
                        <h2>Meeting Insights</h2>
                    </div>
                    <div className="summary-content">
                        <AIInsightRenderer content={summary} />
                    </div>

                    <button className="btn-action primary" onClick={() => navigate('/history')}>
                        Finish & View History
                    </button>
                </div>
            </div>
        );
    }

    if (!joined) {
        return (
            <div className="video-join-wrapper">
                <div className="video-join-card glass shadow-glow animate-fade-in">
                    <div className="join-header">
                        <div className="icon-badge main">
                            <Video size={32} />
                        </div>
                        <h1>Room Engine</h1>
                        <p>Synchronize your team in our encrypted meeting mesh.</p>
                    </div>
                    <div className="join-input-group">
                        <input
                            type="text"
                            placeholder="Connect to Room ID..."
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                        />
                        <button className="btn-join" onClick={joinRoom}>
                            <Zap size={20} />
                            <span>Initialize Session</span>
                        </button>
                    </div>
                    <div className="join-footer">
                        <div className="status-item">
                            <Shield size={16} />
                            <span>E2E Encrypted</span>
                        </div>
                        <div className="status-divider" />
                        <div className="status-item">
                            <Users size={16} />
                            <span>Network Ready</span>
                        </div>
                    </div>
                </div>
                <style>{`
                    .video-join-wrapper {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 4rem 1rem;
                        background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
                    }
                    .video-join-card {
                        width: 100%;
                        max-width: 500px;
                        padding: 4rem;
                        border-radius: 3rem;
                        text-align: center;
                    }
                    .join-header h1 {
                        font-size: 2.5rem;
                        font-weight: 900;
                        color: var(--text-main);
                        letter-spacing: -0.05em;
                        margin-bottom: 0.5rem;
                    }
                    .join-header p {
                        color: var(--text-muted);
                        font-size: 1.1rem;
                        line-height: 1.6;
                        margin-bottom: 3rem;
                    }
                    .icon-badge.main {
                        width: 80px;
                        height: 80px;
                        background: var(--grad-main);
                        color: white;
                        border-radius: 2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 2rem;
                        box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3);
                    }
                    .join-input-group {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .join-input-group input {
                        padding: 1.25rem 1.5rem;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid var(--surface-border);
                        border-radius: 1.25rem;
                        color: var(--text-main);
                        font-size: 1.1rem;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        text-align: center;
                    }
                    .join-input-group input:focus {
                        border-color: var(--primary);
                        background: rgba(99, 102, 241, 0.1);
                        outline: none;
                        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                    }
                    .btn-join {
                        background: var(--grad-main);
                        color: white;
                        border: none;
                        padding: 1.25rem;
                        border-radius: 1.25rem;
                        font-size: 1.1rem;
                        font-weight: 800;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
                        transition: all 0.3s ease;
                    }
                    .btn-join:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3);
                    }
                    .join-footer {
                        margin-top: 3rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 1.5rem;
                        color: var(--text-muted);
                        font-size: 0.85rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .status-item {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    .status-divider {
                        width: 4px;
                        height: 4px;
                        background: var(--surface-border);
                        border-radius: 50%;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="video-layout animate-fade-in">
            <div className="video-main-panel">
                <div className="video-grid glass">
                    <div className="video-card self shadow-glow">
                        <video playsInline muted ref={userVideo} autoPlay />
                        <div className="video-info">
                            <span className="badge">YOU {isHost ? '(Host)' : ''}</span>
                            {!audioEnabled && <MicOff size={16} className="text-red-500" />}
                        </div>
                    </div>
                    {peers.map((peerObj) => (
                        <VideoComponent key={peerObj.peerID} peer={peerObj.peer} id={peerObj.peerID} />
                    ))}
                </div>

                <div className="video-controls-wrapper glass">
                    <div className="controls-group">
                        <button className={`btn-control ${!audioEnabled ? 'active-off' : ''}`} onClick={toggleAudio}>
                            {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                        </button>
                        <button className={`btn-control ${!videoEnabled ? 'active-off' : ''}`} onClick={toggleVideo}>
                            {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                        </button>
                    </div>

                    <div className="divider-v" />

                    <div className="controls-group">
                        {isHost ? (
                            <button className="btn-end" onClick={endMeeting} disabled={isEnding}>
                                <PhoneOff size={24} />
                                <span>Terminate Engine</span>
                            </button>
                        ) : (
                            <button className="btn-leave" onClick={leaveMeeting}>
                                <PhoneOff size={24} />
                                <span>Leave Session</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="video-side-panel glass">
                <div className="side-header">
                    <h3>Live Intelligence</h3>
                    <div className="status-badge">
                        <span className="pulse-dot" />
                        LIVE
                    </div>
                </div>
                <div className="transcript-area">
                    {transcript.length === 0 && (
                        <div className="empty-transcript">
                            <Sparkles size={40} />
                            <p>Initializing AI Insights...</p>
                        </div>
                    )}
                    {transcript.map((t, i) => (
                        <div key={i} className={`transcript-bubble ${t.isMe ? 'is-me' : ''}`}>
                            <span className="sender">{t.username || 'System Peer'}</span>
                            <p className="message">{t.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .video-layout {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 1.5rem;
                    height: calc(100vh - 180px);
                }
                .video-main-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    height: 100%;
                }
                .video-grid {
                    flex: 1;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 1.5rem;
                    padding: 1.5rem;
                    border-radius: 2.5rem;
                    overflow-y: auto;
                    align-content: start;
                }
                .video-card {
                    position: relative;
                    aspect-ratio: 16/9;
                    background: #000;
                    border-radius: 2rem;
                    overflow: hidden;
                    border: 1px solid var(--surface-border);
                }
                .video-card video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .video-card.self {
                    border: 2px solid var(--primary);
                }
                .video-info {
                    position: absolute;
                    bottom: 1.25rem;
                    left: 1.25rem;
                    right: 1.25rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 10;
                }
                .video-info .badge {
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                }

                .video-controls-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    padding: 1rem 2rem;
                    border-radius: 2rem;
                    margin: 0 auto;
                    width: fit-content;
                }
                .controls-group {
                    display: flex;
                    gap: 1rem;
                }
                .btn-control {
                    width: 56px;
                    height: 56px;
                    border-radius: 1.25rem;
                    border: 1px solid var(--surface-border);
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .btn-control:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }
                .btn-control.active-off {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                }
                .divider-v {
                    width: 1px;
                    height: 40px;
                    background: var(--surface-border);
                }
                .btn-end, .btn-leave {
                    padding: 0 2rem;
                    height: 56px;
                    border-radius: 1.25rem;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 800;
                    color: white;
                    transition: all 0.3s ease;
                }
                .btn-end {
                    background: #ef4444;
                    box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
                }
                .btn-leave {
                    background: #f59e0b;
                    box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2);
                }
                @media (max-width: 1024px) {
                    .video-layout { grid-template-columns: 1fr; height: auto; }
                    .video-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); padding: 1rem; }
                    .video-side-panel { height: 500px; }
                }
                @media (max-width: 768px) {
                    .video-controls-wrapper { padding: 0.75rem 1rem; width: 100%; border-radius: 1.5rem; gap: 1rem; }
                    .btn-control { width: 48px; height: 48px; border-radius: 1rem; }
                    .btn-end, .btn-leave { padding: 0 1.25rem; height: 48px; font-size: 0.9rem; }
                    .video-grid { grid-template-columns: 1fr; }
                    .video-info .badge { font-size: 0.65rem; padding: 0.4rem 0.75rem; }
                }
                @media (max-width: 480px) {
                    .btn-end span, .btn-leave span { display: none; }
                    .btn-end, .btn-leave { width: 48px; padding: 0; justify-content: center; }
                }

                .video-side-panel {
                    display: flex;
                    flex-direction: column;
                    border-radius: 2.5rem;
                    overflow: hidden;
                }
                .side-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--surface-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .side-header h3 {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--text-main);
                }
                .status-badge {
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                    padding: 0.4rem 0.8rem;
                    border-radius: 2rem;
                    font-size: 0.7rem;
                    font-weight: 900;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .pulse-dot {
                    width: 6px;
                    height: 6px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                .transcript-area {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .empty-transcript {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: var(--text-muted);
                    opacity: 0.3;
                    text-align: center;
                }
                .transcript-bubble {
                    padding: 1.25rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--surface-border);
                    border-radius: 1.5rem;
                    border-bottom-left-radius: 0.25rem;
                }
                .transcript-bubble.is-me {
                    background: rgba(99, 102, 241, 0.05);
                    border-color: rgba(99, 102, 241, 0.2);
                    border-bottom-left-radius: 1.5rem;
                    border-bottom-right-radius: 0.25rem;
                }
                .sender {
                    font-size: 0.7rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    color: var(--primary);
                    margin-bottom: 0.4rem;
                    display: block;
                    letter-spacing: 0.05em;
                }
                .message {
                    font-size: 0.95rem;
                    line-height: 1.5;
                    color: var(--text-main);
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .summary-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.9);
                    backdrop-filter: blur(20px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .summary-card {
                    width: 100%;
                    max-width: 800px;
                    max-height: 80vh;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--surface-border);
                    border-radius: 3rem;
                    padding: 4rem;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .summary-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .summary-header h2 {
                    font-size: 2rem;
                    font-weight: 900;
                    color: var(--text-main);
                }
                .summary-content {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 1rem;
                    margin-bottom: 2rem;
                    scrollbar-width: thin;
                    scrollbar-color: var(--primary) transparent;
                }
                .summary-content::-webkit-scrollbar { width: 6px; }
                .summary-content::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }

                .btn-action {
                    width: 100%;
                    padding: 1.25rem;
                    border-radius: 1.25rem;
                    font-weight: 800;
                    border: none;
                    transition: all 0.3s ease;
                }
                .btn-action.primary {
                    background: var(--grad-main);
                    color: white;
                }
            `}</style>
        </div>
    );
};

const VideoComponent = ({ peer, id }) => {
    const videoRef = useRef();
    useEffect(() => {
        const handleStream = (stream) => { if (videoRef.current) videoRef.current.srcObject = stream; };
        peer.on('stream', handleStream);
        if (peer.streams && peer.streams[0]) handleStream(peer.streams[0]);
        return () => peer.off('stream', handleStream);
    }, [peer, id]);

    return (
        <div className="video-card shadow-glow">
            <video playsInline ref={videoRef} autoPlay onLoadedMetadata={(e) => e.target.play()} />
            <div className="video-info">
                <span className="badge">PEER: {id.slice(0, 4)}</span>
            </div>
        </div>
    );
};

export default VideoCall;
