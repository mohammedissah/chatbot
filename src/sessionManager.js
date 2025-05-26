// src/sessionManager.js
const mongoose = require('mongoose');
const Session = require('./models/Session'); // Import the Session model

// No need for the in-memory 'sessions' object anymore
// const sessions = {};

async function getSessionContext(sessionId) {
    let session = await Session.findOne({ sessionId: sessionId });

    if (!session) {
        // Create a new session if it doesn't exist
        session = new Session({
            sessionId: sessionId,
            lastIntent: null,
            lastEntities: [],
            conversationHistory: [],
            context: {}
        });
        await session.save();
    }
    return session;
}

async function updateSessionContext(sessionId, newContext) {
    // Find the session and update it. 'findOneAndUpdate' can create if not found.
    // The 'context' field needs careful merging as node-nlp relies on it.
    const updatedSession = await Session.findOneAndUpdate(
        { sessionId: sessionId },
        {
            $set: {
                lastIntent: newContext.lastIntent,
                lastEntities: newContext.lastEntities,
                conversationHistory: newContext.conversationHistory,
                // Merge context from node-nlp with existing context
                context: { ...(newContext.context || {}) }
            }
        },
        { new: true, upsert: true } // Return the updated document and create if it doesn't exist
    );
    return updatedSession;
}

module.exports = {
    getSessionContext,
    updateSessionContext
};