const { createClient } = require('@deepgram/sdk');
const { generateSummary } = require('../services/ai.service');
const Meeting = require('../models/Meeting');


const roomStates = {};

module.exports = (io) => {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    io.on('connection', (socket) => {
        console.log(`[VIDEO] Socket connected: ${socket.id} (User: ${socket.user?.id})`);

        socket.on('join-room', (roomId) => {
            if (!roomId) return;

            console.log(`[VIDEO] User ${socket.id} joining room ${roomId}`);
            socket.join(roomId);

            
            if (!roomStates[roomId]) {
                roomStates[roomId] = {
                    hostId: socket.id,
                    hostUserId: socket.user.id,
                    users: new Set([socket.id]),
                    participants: new Set([socket.user.id]),
                    transcript: "",
                    isSummarizing: false,
                    startTime: new Date()
                };
                console.log(`[VIDEO] Room ${roomId} created. Host: ${socket.id}`);
            } else {
                roomStates[roomId].users.add(socket.id);
                roomStates[roomId].participants.add(socket.user.id);
            }

            const state = roomStates[roomId];
            const isHost = state.hostId === socket.id;

            
            socket.emit('room-ready', {
                roomId,
                isHost,
                participants: Array.from(state.users).filter(id => id !== socket.id)
            });

            
            socket.to(roomId).emit('user-joined', socket.id);

            
            socket.emit('all-users', Array.from(state.users).filter(id => id !== socket.id));
        });

        
        socket.on('sending-signal', (payload) => {
            io.to(payload.userToSignal).emit('user-joined-signal', {
                signal: payload.signal,
                callerID: payload.callerID
            });
        });

        socket.on('returning-signal', (payload) => {
            io.to(payload.callerID).emit('receiving-returned-signal', {
                signal: payload.signal,
                id: socket.id
            });
        });

        
        socket.on('audio-chunk', async ({ roomId, audio }) => {
            const state = roomStates[roomId];
            if (!state || !audio) return;

            try {
                const buffer = Buffer.from(audio);
                const response = await deepgram.listen.prerecorded.transcribeFile(
                    buffer,
                    {
                        model: 'nova-2',
                        smart_format: true,
                        mimetype: 'audio/webm',
                    }
                );

                const text = response.result?.results?.channels[0]?.alternatives[0]?.transcript || "";
                if (text.trim()) {
                    state.transcript += " " + text;
                    io.in(roomId).emit('partial-transcript', {
                        text,
                        sender: socket.user.id,
                        username: socket.user.username || 'Participant'
                    });
                }
            } catch (err) {
                console.error(`[VIDEO] Transcription error in ${roomId}:`, err.message);
            }
        });

        const finalizeMeeting = async (roomId, title) => {
            const state = roomStates[roomId];
            if (!state || state.isSummarizing) return;

            state.isSummarizing = true;
            console.log(`[VIDEO] Finalizing meeting for ${roomId}...`);

            try {
                const transcript = state.transcript.trim() || "No discussion captured.";
                const summaryText = await generateSummary(transcript);

                const durationMs = new Date() - state.startTime;
                const durationStr = `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;

                const newMeeting = new Meeting({
                    user: state.hostUserId, 
                    host: state.hostUserId,
                    participants: Array.from(state.participants),
                    title: title || `Meeting ${roomId} - ${new Date().toLocaleDateString()}`,
                    transcript: transcript,
                    summary: [summaryText],
                    duration: durationStr,
                    status: 'ended'
                });

                await newMeeting.save();

                io.in(roomId).emit('meeting-ended', {
                    meetingId: newMeeting._id,
                    summary: summaryText
                });

                console.log(`[VIDEO] Room ${roomId} finalized and saved.`);
                delete roomStates[roomId];
            } catch (err) {
                console.error(`[VIDEO] Finalization error for ${roomId}:`, err);
                state.isSummarizing = false;
                io.in(roomId).emit('meeting-error', 'Failed to generate summary');
            }
        };

        socket.on('end-meeting', ({ roomId, title }) => {
            const state = roomStates[roomId];
            if (state && state.hostId === socket.id) {
                finalizeMeeting(roomId, title);
            } else {
                socket.emit('error', 'Only the host can end the meeting');
            }
        });

        socket.on('disconnecting', () => {
            const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);

            rooms.forEach(roomId => {
                const state = roomStates[roomId];
                if (!state) return;

                state.users.delete(socket.id);
                console.log(`[VIDEO] User ${socket.id} leaving ${roomId}. Users left: ${state.users.size}`);

                if (state.users.size === 0) {
                    
                    if (state.transcript.length > 50 && !state.isSummarizing) {
                        finalizeMeeting(roomId, "Auto-ended Meeting");
                    } else {
                        delete roomStates[roomId];
                    }
                } else if (state.hostId === socket.id) {
                    
                    const nextHost = Array.from(state.users)[0];
                    state.hostId = nextHost;
                    io.to(roomId).emit('host-changed', nextHost);
                    console.log(`[VIDEO] Host changed to ${nextHost} in ${roomId}`);
                }

                socket.to(roomId).emit('user-left', socket.id);
            });
        });

        socket.on('disconnect', () => {
            console.log(`[VIDEO] Socket disconnected: ${socket.id}`);
        });
    });
};
