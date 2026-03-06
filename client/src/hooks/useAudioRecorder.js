import { useState, useRef, useCallback } from "react";

export const useAudioRecorder = (onAudioData) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunksRef.current = []; 

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            });

            console.log('DEBUG: MediaRecorder started with mimeType:', mediaRecorder.mimeType);

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(1000); 
            setIsRecording(true);
        } catch (err) {
            console.error("Mic error:", err);
            alert("Mic permission denied or error occurred");
        }
    }, []);

    const stopRecording = useCallback((onStopCallback) => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.onstop = () => {
                
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                chunksRef.current = [];

                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                    streamRef.current = null;
                }

                setIsRecording(false);
                if (onStopCallback) onStopCallback(blob);
            };
            mediaRecorderRef.current.stop();
        } else {
            if (onStopCallback) onStopCallback(null);
        }
    }, []);

    return { isRecording, startRecording, stopRecording };
};
