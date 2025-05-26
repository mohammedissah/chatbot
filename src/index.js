// src/index.js
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const mongoose = require('mongoose'); // <-- Add this line

const { loadModel, processMessage } = require('./nlpManager');
const { getSessionContext, updateSessionContext } = require('./sessionManager');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI; // <-- Get URI from .env

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
console.log(`Web UI available at http://localhost:${port}/`);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log(`Swagger UI available at http://localhost:${port}/api-docs`);

(async () => {
    // Connect to MongoDB Atlas
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            // Removed useFindAndModify and useCreateIndex as they are true by default in Mongoose 6+
        });
        console.log('Connected to MongoDB Atlas!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit if DB connection fails
    }

    // Load NLP model after successful DB connection
    await loadModel();

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})();

app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'The "message" field is required.' });
    }
    if (!sessionId) {
        return res.status(400).json({ error: 'The "sessionId" field is required.' });
    }

    // Retrieve session data from MongoDB
    const sessionData = await getSessionContext(sessionId);
    let nlpContext = sessionData.context || {}; // Ensure context is initialized

    const nlpResult = await processMessage(message, nlpContext);

    let responseText = nlpResult.answer;
    let responseType = 'text';
    let data = {};

    // --- Intent-based responses ---
    // (Your existing intent handling logic remains largely the same)
    if (nlpResult.intent === 'greetings.hello') {
        responseText = nlpResult.answer;
    } else if (nlpResult.intent === 'greetings.bye') {
        responseText = nlpResult.answer;
    } // ... continue with all your other else if blocks for intents ...
    else if (nlpResult.intent === 'product.inquiry') {
        // ... (your existing product inquiry logic) ...
        // Example: hardcoded product info for demonstration
        data = {
            name: 'Laptop X',
            description: 'A powerful laptop for everyday use.',
            price: '$1200',
            availability: 'In stock',
            actions: [
                { type: 'button', text: 'View Details', payload: 'view_details_laptop_x' },
                { type: 'link', text: 'Buy Now', url: 'https://example.com/buy-laptop-x' }
            ]
        };
        responseType = 'product_info';
        // Check for specific product name entity if present and adjust data accordingly
        const productName = nlpResult.entities.find(e => e.entity === 'productName');
        if (productName) {
            data.name = productName.sourceText; // Update product name in response
        }
    } else if (nlpResult.intent === 'order.status') {
        const orderIdEntity = nlpResult.entities.find(e => e.entity === 'orderId');
        if (orderIdEntity) {
            const orderId = orderIdEntity.sourceText;
            // In a real application, you'd query a database here for order status
            const status = 'shipped'; // Placeholder
            const deliveryDate = '2025-06-01'; // Placeholder
            responseText = `The status for your order ${orderId} is: ${status}. Estimated delivery: ${deliveryDate}.`;
            responseType = 'order_status';
            data = {
                orderId: orderId,
                status: status,
                deliveryDate: deliveryDate
            };
        } else {
            responseText = nlpResult.answer;
            responseType = 'text_with_prompt';
            data = {
                prompt_message: "Please provide your order ID.",
                suggestions: ["My order is 12345", "What is my order status?"]
            };
        }
    } else if (nlpResult.intent === 'shipping.inquiry') {
        responseText = nlpResult.answer;
        responseType = 'shipping_info';
        data = {
            policy_summary: "Free standard shipping on all orders over $50.",
            details_link: "https://example.com/shipping-policy"
        };
    } else if (nlpResult.intent === 'returns.policy') {
        responseText = nlpResult.answer;
        responseType = 'text_with_link';
        data = {
            link_text: "Our Return Policy",
            url: "https://example.com/returns-policy"
        };
    } else if (nlpResult.intent === 'payment.methods') {
        responseText = nlpResult.answer;
        responseType = 'payment_methods';
        data = {
            methods: ["Visa", "Mastercard", "American Express", "PayPal"],
            note: "We also accept cash on delivery in select areas."
        };
    } else if (nlpResult.intent === 'business.hours') {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const hours = {
            0: "Closed", // Sunday
            1: "9 AM - 5 PM", // Monday
            2: "9 AM - 5 PM",
            3: "9 AM - 5 PM",
            4: "9 AM - 5 PM",
            5: "9 AM - 4 PM", // Friday
            6: "10 AM - 2 PM" // Saturday
        };
        const hoursToday = hours[dayOfWeek];
        const hoursDetail = `Today (${now.toLocaleDateString('en-US', { weekday: 'long' })}): ${hoursToday}. Our general hours are Mon-Fri 9 AM - 5 PM, Sat 10 AM - 2 PM.`;
        responseText = nlpResult.answer;
        responseType = 'business_hours';
        data = {
            current_status: hoursDetail
        };
    } else if (nlpResult.intent === 'company.location') {
        responseText = nlpResult.answer;
        responseType = 'location_info';
        data = {
            address: '123 Tech Avenue, Innovation City, Accra, Ghana', // Actual address
            map_link: 'https://www.google.com/maps/search/?api=1&query=123+Tech+Avenue,+Accra' // Actual map link
        };
    } else if (nlpResult.intent === 'promotions.query') {
        responseText = nlpResult.answer;
        responseType = 'promotions_info';
        data = {
            current_promo: 'Enjoy 10% off all gaming accessories this week with code GAMENOW!',
            link_to_deals: 'https://example.com/deals' // Actual deals link
        };
    } else if (nlpResult.intent === 'handoff.human' || nlpResult.intent === 'low_confidence_fallback_suggest_handoff') {
        responseText = nlpResult.answer;
        responseType = 'human_handoff';
        data = {
            handoff_message: "Please click the link below to connect with a human agent.",
            support_link: "https://example.com/live-chat" // Actual support link
        };
    } else if (nlpResult.intent === 'None') {
        // Handle 'None' intent explicitly for now if you want a specific fallback
        responseText = "I'm sorry, I don't understand. Can you rephrase that or ask something else?";
        responseType = 'text';
    }
    else {
        // Fallback for any other intent that wasn't explicitly handled above
        responseText = nlpResult.answer || "I'm still learning and don't have a specific answer for that yet. Can I help with something else?";
        responseType = 'text';
    }


    // Update session data in MongoDB
    await updateSessionContext(sessionId, {
        lastIntent: nlpResult.intent,
        lastEntities: nlpResult.entities,
        conversationHistory: [...sessionData.conversationHistory, { user: message, bot: responseText, type: responseType }],
        context: nlpContext // Ensure the context for node-nlp is passed
    });

    res.json({
        reply: responseText,
        intent: nlpResult.intent,
        entities: nlpResult.entities,
        score: nlpResult.score,
        response_type: responseType,
        data: data
    });
});