import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Square, Copy, FileText, Volume2, Video, Clock } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import AIInsightRenderer from '../components/AIInsightRenderer';
import socket from '../utils/socket';
import { jsPDF } from 'jspdf';
import api from '../api/axios';

const LiveRecap = () => {
    console.log('[DEBUG] LiveRecap: Rendering');
    const navigate = useNavigate();
    const [timer, setTimer] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isVoiceLoading, setIsVoiceLoading] = useState(false);
    const transcriptEndRef = useRef(null);

    const { isRecording, startRecording, stopRecording: stopMic } = useAudioRecorder();

    useEffect(() => {
        if (!socket.connected) {
            socket.auth = { token: localStorage.getItem("token") };
            socket.connect();
        }

        socket.on("meeting-saved", () => {
            setIsSaving(false);
            navigate('/history');
        });

        socket.on("voice-summary", (data) => {
            setIsVoiceLoading(false);
            const blob = new Blob([data.audio], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
            setSummary(data.summary);
        });

        socket.on("voice-summary-error", (err) => {
            setIsVoiceLoading(false);
            alert(err);
        });

        return () => {
            socket.off("meeting-saved");
            socket.off("voice-summary");
            socket.off("voice-summary-error");
        };
    }, [navigate]);

    const handleStart = () => {
        setTranscript("");
        setSummary("");
        setTimer(0);
        startRecording();
    };

    const handleStop = () => {
        setIsSaving(true);
        stopMic(async (blob) => {
            if (!blob) {
                setIsSaving(false);
                return;
            }

            const mins = Math.floor(timer / 60);
            const secs = timer % 60;
            const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;

            const formData = new FormData();
            formData.append('audio', blob, 'recording.webm');
            formData.append('title', `Meeting on ${new Date().toLocaleDateString()}`);
            formData.append('duration', durationStr);

            try {
                const response = await api.post('/api/meetings/transcribe', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.transcript) {
                    setTranscript(response.data.transcript);
                    setSummary(response.data.summary);
                } else {
                    alert(response.data.msg || "Transcription failed");
                }
            } catch (err) {
                console.error("Transcription Error:", err);
                alert("Failed to transcribe audio.");
            } finally {
                setIsSaving(false);
            }
        });
    };

    const handleVoiceSummarize = () => {
        if (!transcript) return alert("No content to summarize yet.");
        setIsVoiceLoading(true);
        socket.emit("summarize-to-voice", { text: transcript });
    };

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const copySummary = () => {
        const textToCopy = Array.isArray(summary) ? summary.join("\n") : (summary || "");
        navigator.clipboard.writeText(textToCopy);
        alert("Summary Copied!");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Insightly Meeting Summary", 20, 20);
        doc.text(`Duration: ${formatTime(timer)}`, 20, 30);
        let y = 40;
        const summaryItems = Array.isArray(summary) ? summary : (summary ? summary.split("\n").filter(Boolean) : []);
        summaryItems.forEach(item => { doc.text(`• ${item}`, 20, y); y += 8; });
        doc.save("meeting-summary.pdf");
    };

    return (
        <div className="live-wrapper">
            <div className="live-container">
                <div className="main-panel">
                    <div className="live-header glass">
                        <div className="session-info">
                            <div className="badge-live">
                                <span className={`pulse-dot ${isRecording ? 'active' : ''}`}></span>
                                <span>{isRecording ? 'LIVE SESSION' : 'READY TO START'}</span>
                            </div>
                            <h2>Intelligent Meeting Capture</h2>
                        </div>
                        <div className="timer-badge">
                            <Clock size={20} />
                            <span>{formatTime(timer)}</span>
                        </div>
                    </div>

                    <div className="transcript-board glass">
                        <div className="board-header">
                            <h3>Real-time Transcript</h3>
                            <div className="header-icon"><Video size={20} /></div>
                        </div>
                        <div className="transcript-scroll">
                            {transcript ? (
                                <div className="transcript-item">
                                    <span className="speaker">Main Channel</span>
                                    <p className="text">{transcript}</p>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>{isRecording ? "Listening and transcribing..." : "Initialize the session to start capturing insights."}</p>
                                </div>
                            )}
                            <div ref={transcriptEndRef} />
                        </div>
                    </div>
                </div>

                <div className="side-panel">
                    <div className="control-card glass">
                        <h3>Session Control</h3>
                        <div className="btn-group">
                            {!isRecording ? (
                                <button className="btn-control btn-start" onClick={handleStart}>
                                    Initialize Capture
                                </button>
                            ) : (
                                <button className={`btn-control btn-danger ${isSaving ? 'disabled' : ''}`} onClick={handleStop} disabled={isSaving}>
                                    <Square size={18} fill="currentColor" />
                                    <span>{isSaving ? 'Processing...' : 'Stop & Finalize'}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="control-card glass summary-card">
                        <h3>AI Insights</h3>
                        <div className="summary-content">
                            {summary ? (
                                <AIInsightRenderer content={summary} />
                            ) : (
                                <p className="empty-state">AI insights will appear here once the session is finalized.</p>
                            )}
                        </div>
                        <div className="utility-bar">

                            <button className="btn-util" onClick={copySummary} title="Copy Summary">
                                <Copy size={18} />
                            </button>
                            <button className={`btn-util ${isVoiceLoading ? 'loading' : ''}`} onClick={handleVoiceSummarize} disabled={isVoiceLoading}>
                                <Volume2 size={18} />
                            </button>
                            <button className="btn-util" onClick={exportPDF} title="Export PDF">
                                <FileText size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .live-wrapper { padding-top: 1rem; animation: fadeIn 0.8s ease-out; }
                .live-container { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; height: calc(100vh - 180px); }
                .main-panel { display: flex; flex-direction: column; gap: 1.5rem; height: 100%; min-height: 0; }
                .live-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; border-radius: 1.5rem; }
                .badge-live { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; }
                .pulse-dot { width: 8px; height: 8px; background: #94a3b8; border-radius: 50%; transition: all 0.3s ease; }
                .pulse-dot.active { background: #ef4444; box-shadow: 0 0 10px #ef4444; animation: pulse 2s infinite; }
                .badge-live span { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.1em; }
                .session-info h2 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); }
                .timer-badge { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; background: rgba(99, 102, 241, 0.1); border-radius: 1.25rem; color: var(--primary); font-family: monospace; font-size: 1.5rem; font-weight: 700; }
                
                .transcript-board { flex: 1; display: flex; flex-direction: column; padding: 2rem; border-radius: 1.5rem; min-height: 0; transition: all 0.3s ease; }
                .board-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .board-header h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .header-icon { color: var(--primary); opacity: 0.5; }
                .transcript-scroll { flex: 1; overflow-y: auto; padding-right: 1rem; }
                .speaker { display: block; font-size: 0.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; }
                .text { font-size: 1.15rem; line-height: 1.6; color: var(--text-main); }
                .empty-state { text-align: center; color: var(--text-muted); padding-top: 5rem; font-style: italic; }

                .side-panel { display: flex; flex-direction: column; gap: 1.5rem; }
                .control-card { padding: 1.5rem; border-radius: 1.5rem; }
                .control-card h3 { font-size: 0.9rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 1.5rem; letter-spacing: 0.05em; }
                .btn-control { width: 100%; padding: 1rem; border-radius: 1rem; border: none; font-size: 1rem; font-weight: 700; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
                .btn-start { background: var(--grad-main); color: white; box-shadow: var(--shadow-glow); }
                .btn-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
                .btn-danger:hover { background: #ef4444; color: white; transform: translateY(-3px); }
                .btn-control:hover:not(.disabled) { transform: translateY(-3px); filter: brightness(1.1); }

                .summary-card { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
                .summary-content { flex: 1; overflow-y: auto; margin-bottom: 1.5rem; scrollbar-width: thin; scrollbar-color: var(--primary) transparent; }
                .summary-content::-webkit-scrollbar { width: 6px; }
                .summary-content::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }

                .utility-bar { display: flex; gap: 0.75rem; border-top: 1px solid var(--surface-border); pt: 1.5rem; }
                .btn-util { flex: 1; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--surface-border); border-radius: 0.75rem; color: var(--text-muted); transition: all 0.3s ease; }
                .btn-util:hover { background: var(--primary); color: white; border-color: var(--primary); transform: translateY(-2px); }
                
                @media (max-width: 1024px) { 
                    .live-container { grid-template-columns: 1fr; height: auto; padding-bottom: 2rem; } 
                    .live-wrapper { padding: 1rem; }
                }
                @media (max-width: 768px) {
                    .live-header { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.25rem; }
                    .timer-badge { width: 100%; justify-content: center; font-size: 1.25rem; }
                    .transcript-board { height: 400px; padding: 1.25rem; }
                    .text { font-size: 1rem; }
                    .control-card { padding: 1.25rem; }
                    .utility-bar { flex-wrap: wrap; }
                    .btn-util { min-width: 40px; }
                }
            `}</style>
        </div >
    );
};

export default LiveRecap;
