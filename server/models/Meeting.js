const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    title: { type: String, default: 'New Meeting' },
    transcript: { type: String, default: "" },
    summary: [String],
    duration: String,
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Meeting', MeetingSchema);
