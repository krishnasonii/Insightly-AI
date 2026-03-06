const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const auth = require('../middleware/auth');
const multer = require('multer');
const { createClient } = require('@deepgram/sdk');
const { generateSummary } = require('../services/ai.service');

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/transcribe', auth, upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No audio file provided' });
        }

        console.log(`DEBUG: Received audio file for transcription, size: ${req.file.size} bytes`);

        const { title, duration } = req.body;

        
        const response = await deepgram.listen.prerecorded.transcribeFile(
            req.file.buffer,
            {
                model: 'nova-2',
                smart_format: true,
                mimetype: req.file.mimetype,
            }
        );

        const transcriptText = response.result?.results?.channels[0]?.alternatives[0]?.transcript || "";

        if (!transcriptText || transcriptText.trim().length === 0) {
            console.log("DEBUG: Deepgram returned empty transcript.");
            return res.json({ msg: "Empty transcript captured", meeting: null });
        }

        console.log(`DEBUG: Transcription complete. Text length: ${transcriptText.length}`);

        
        const summary = await generateSummary(transcriptText);

        
        const newMeeting = new Meeting({
            user: req.user.id,
            title: title || `Meeting on ${new Date().toLocaleString()}`,
            transcript: transcriptText,
            summary: summary,
            duration: duration || "0:00",
            createdAt: new Date()
        });

        await newMeeting.save();
        console.log('Meeting saved to DB:', newMeeting._id);

        res.json({
            transcript: transcriptText,
            summary: summary,
            meetingId: newMeeting._id
        });

    } catch (err) {
        console.error('Transcription Route Error:', err);
        res.status(500).json({ msg: 'Server Error during transcription', error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching meetings for user:', req.user.id);
        const meetings = await Meeting.find({ user: req.user.id }).sort({ createdAt: -1 });
        console.log(`Found ${meetings.length} meetings`);
        res.json(meetings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/:id', auth, async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) return res.status(404).json({ msg: 'Meeting not found' });
        if (meeting.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        res.json(meeting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
