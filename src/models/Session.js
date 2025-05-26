const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    lastIntent: {
        type: String,
        default: null
    },
    lastEntities: {
        type: Array,
        default: []
    },
    conversationHistory: {
        type: Array,
        default: []
    },
    context: { // For node-nlp's internal context
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Automatically delete sessions after 24 hours (or adjust as needed)
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Update 'updatedAt' field on every save
sessionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;