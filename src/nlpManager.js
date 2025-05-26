// src/nlpManager.js
const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');

const manager = new NlpManager({ languages: ['en'] });
const modelPath = path.join(__dirname, '..', 'model.nlp');

async function trainAndSaveModel() {
    console.log('Training NLP model with broader conversations...');

    // --- Greetings Intent ---
    manager.addDocument('en', 'hello', 'greetings.hello');
    manager.addDocument('en', 'hi', 'greetings.hello');
    manager.addDocument('en', 'hey there', 'greetings.hello');
    manager.addDocument('en', 'good morning', 'greetings.hello');
    manager.addDocument('en', 'good afternoon', 'greetings.hello');
    manager.addDocument('en', 'good evening', 'greetings.hello');
    manager.addDocument('en', 'greetings', 'greetings.hello');
    manager.addDocument('en', 'hola', 'greetings.hello');
    manager.addAnswer('en', 'greetings.hello', 'Hello! How can I help you today?');
    manager.addAnswer('en', 'greetings.hello', 'Hi there!');
    manager.addAnswer('en', 'greetings.hello', 'Greetings!');
    manager.addAnswer('en', 'greetings.hello', 'Hey, what can I do for you?');
    manager.addAnswer('en', 'greetings.hello', 'Hello! Nice to hear from you.');

    // --- Goodbye Intent ---
    manager.addDocument('en', 'goodbye', 'greetings.bye');
    manager.addDocument('en', 'bye', 'greetings.bye');
    manager.addDocument('en', 'see you later', 'greetings.bye');
    manager.addDocument('en', 'I must go', 'greetings.bye');
    manager.addDocument('en', 'farewell', 'greetings.bye');
    manager.addDocument('en', 'talk to you later', 'greetings.bye');
    manager.addDocument('en', 'I am leaving', 'greetings.bye');
    manager.addDocument('en', 'bye bye', 'greetings.bye');
    manager.addAnswer('en', 'greetings.bye', 'Goodbye! Have a great day!');
    manager.addAnswer('en', 'greetings.bye', 'See you soon!');
    manager.addAnswer('en', 'greetings.bye', 'Bye for now!');
    manager.addAnswer('en', 'greetings.bye', 'Catch you later!');
    manager.addAnswer('en', 'greetings.bye', 'Until next time!');

    // --- How Are You Intent (Chit-Chat) ---
    manager.addDocument('en', 'how are you', 'chitchat.howareyou');
    manager.addDocument('en', 'how are you doing', 'chitchat.howareyou');
    manager.addDocument('en', 'how do you feel', 'chitchat.howareyou');
    manager.addDocument('en', 'are you okay', 'chitchat.howareyou');
    manager.addDocument('en', "what's up", 'chitchat.howareyou');
    manager.addAnswer('en', 'chitchat.howareyou', 'I am just a program, but I am ready to help you!');
    manager.addAnswer('en', 'chitchat.howareyou', 'I\'m doing great! How can I assist you?');
    manager.addAnswer('en', 'chitchat.howareyou', 'As an AI, I don\'t have feelings, but I\'m functioning perfectly!');
    manager.addAnswer('en', 'chitchat.howareyou', 'All good here, thanks for asking! What can I do for you?');

    // --- What's Your Name Intent (Chit-Chat) ---
    manager.addDocument('en', 'what is your name', 'chitchat.name');
    manager.addDocument('en', 'who are you', 'chitchat.name');
    manager.addDocument('en', 'your name', 'chitchat.name');
    manager.addDocument('en', 'do you have a name', 'chitchat.name');
    manager.addAnswer('en', 'chitchat.name', 'I am a helpful AI assistant.');
    manager.addAnswer('en', 'chitchat.name', 'You can call me Chatbot.');
    manager.addAnswer('en', 'chitchat.name', 'I don\'t have a name, but I\'m here to help!');

    // --- What Can You Do Intent (Chit-Chat / Capabilities) ---
    manager.addDocument('en', 'what can you do', 'chitchat.capabilities');
    manager.addDocument('en', 'what are your functions', 'chitchat.capabilities');
    manager.addDocument('en', 'how can you help me', 'chitchat.capabilities');
    manager.addDocument('en', 'what services do you offer', 'chitchat.capabilities');
    manager.addAnswer('en', 'chitchat.capabilities', 'I can answer questions about products, orders, shipping, company info, and more. I can also connect you to a human agent if needed!');
    manager.addAnswer('en', 'chitchat.capabilities', 'I\'m here to assist you with information about our company and services.');
    manager.addAnswer('en', 'chitchat.capabilities', 'I can help with product details, order tracking, returns, and general inquiries.');

    // --- Tell Me a Joke Intent (Chit-Chat / Entertainment) ---
    manager.addDocument('en', 'tell me a joke', 'chitchat.joke');
    manager.addDocument('en', 'make me laugh', 'chitchat.joke');
    manager.addDocument('en', 'do you know any jokes', 'chitchat.joke');
    manager.addAnswer('en', 'chitchat.joke', 'Why don\'t scientists trust atoms? Because they make up everything!');
    manager.addAnswer('en', 'chitchat.joke', 'I told my wife she was drawing her eyebrows too high. She looked surprised.');
    manager.addAnswer('en', 'chitchat.joke', 'What do you call a fake noodle? An impasta!');

    // --- Affirmation Intent (Yes/Confirm) ---
    manager.addDocument('en', 'yes', 'affirmation.yes');
    manager.addDocument('en', 'yeah', 'affirmation.yes');
    manager.addDocument('en', 'correct', 'affirmation.yes');
    manager.addDocument('en', "that's right", 'affirmation.yes');
    manager.addDocument('en', 'ok', 'affirmation.yes');
    manager.addDocument('en', 'okay', 'affirmation.yes');
    manager.addDocument('en', 'affirmative', 'affirmation.yes');
    manager.addAnswer('en', 'affirmation.yes', 'Great! How else can I assist?');
    manager.addAnswer('en', 'affirmation.yes', 'Understood.');
    manager.addAnswer('en', 'affirmation.yes', 'Alright.');

    // --- Negation Intent (No/Deny) ---
    manager.addDocument('en', 'no', 'negation.no');
    manager.addDocument('en', 'nope', 'negation.no');
    manager.addDocument('en', "that's not right", 'negation.no');
    manager.addDocument('en', 'incorrect', 'negation.no');
    manager.addAnswer('en', 'negation.no', 'Okay, what can I do instead?');
    manager.addAnswer('en', 'negation.no', 'Understood. My apologies.');
    manager.addAnswer('en', 'negation.no', 'Got it. How can I clarify?');

    // --- Thanks Intent (Expressing Gratitude) ---
    manager.addDocument('en', 'thank you', 'thanks.thankyou');
    manager.addDocument('en', 'thanks', 'thanks.thankyou');
    manager.addDocument('en', 'many thanks', 'thanks.thankyou');
    manager.addDocument('en', 'thank you so much', 'thanks.thankyou');
    manager.addDocument('en', 'that helps a lot', 'thanks.thankyou');
    manager.addAnswer('en', 'thanks.thankyou', 'You\'re welcome!');
    manager.addAnswer('en', 'thanks.thankyou', 'Glad I could help!');
    manager.addAnswer('en', 'thanks.thankyou', 'Anytime!');
    manager.addAnswer('en', 'thanks.thankyou', 'My pleasure!');

    // --- Expressing Satisfaction (Positive Feedback) ---
    manager.addDocument('en', 'good job', 'feedback.positive');
    manager.addDocument('en', 'well done', 'feedback.positive');
    manager.addDocument('en', "you're great", 'feedback.positive');
    manager.addDocument('en', 'excellent', 'feedback.positive');
    manager.addDocument('en', 'you helped me a lot', 'feedback.positive');
    manager.addAnswer('en', 'feedback.positive', 'Thank you! I\'m happy to assist.');
    manager.addAnswer('en', 'feedback.positive', 'I\'m glad I could be helpful!');
    manager.addAnswer('en', 'feedback.positive', 'That\'s great to hear!');

    // --- Expressing Dissatisfaction (Negative Feedback) ---
    manager.addDocument('en', 'I am upset', 'feedback.negative');
    manager.addDocument('en', 'this is bad', 'feedback.negative');
    manager.addDocument('en', 'you are not helping', 'feedback.negative');
    manager.addDocument('en', 'I am angry', 'feedback.negative');
    manager.addDocument('en', 'this is frustrating', 'feedback.negative');
    manager.addAnswer('en', 'feedback.negative', 'I\'m sorry to hear that. How can I improve or connect you with someone who can help better?');
    manager.addAnswer('en', 'feedback.negative', 'My apologies. Please tell me more about what\'s wrong so I can try to fix it, or I can connect you to a human agent.');
    manager.addAnswer('en', 'feedback.negative', 'I understand your frustration. Would you like me to connect you with a customer service representative?');

    // --- Ask for Repetition/Clarification Intent ---
    manager.addDocument('en', 'can you repeat that', 'clarification.repeat');
    manager.addDocument('en', 'say that again', 'clarification.repeat');
    manager.addDocument('en', 'what did you just say', 'clarification.repeat');
    manager.addAnswer('en', 'clarification.repeat', 'Certainly. What part would you like me to repeat?');
    manager.addAnswer('en', 'clarification.repeat', 'Could you tell me which part you\'d like me to reiterate?');

    manager.addDocument('en', 'what do you mean', 'clarification.meaning');
    manager.addDocument('en', 'can you explain that', 'clarification.meaning');
    manager.addDocument('en', 'I don\'t understand', 'clarification.meaning');
    manager.addAnswer('en', 'clarification.meaning', 'I meant to say [rephrase your previous answer]. Is that clearer?');
    manager.addAnswer('en', 'clarification.meaning', 'Could you tell me what specifically is unclear so I can rephrase?');

    // --- Apology Intent ---
    manager.addDocument('en', 'I am sorry', 'apology.sorry');
    manager.addDocument('en', 'my apologies', 'apology.sorry');
    manager.addDocument('en', 'sorry', 'apology.sorry');
    manager.addAnswer('en', 'apology.sorry', 'No worries at all. How can I help now?');
    manager.addAnswer('en', 'apology.sorry', 'It\'s alright. What can I do for you?');

    // --- Inactivity/Engagement Check ---
    manager.addDocument('en', 'are you there', 'engagement.check');
    manager.addDocument('en', 'hello?', 'engagement.check');
    manager.addDocument('en', 'you still there', 'engagement.check');
    manager.addDocument('en', 'is anyone there', 'engagement.check');
    manager.addAnswer('en', 'engagement.check', 'Yes, I\'m here! How can I assist you further?');
    manager.addAnswer('en', 'engagement.check', 'I am still active. What do you need?');

    // --- Availability/Readiness Check ---
    manager.addDocument('en', 'are you busy', 'availability.check');
    manager.addDocument('en', 'can you help me now', 'availability.check');
    manager.addDocument('en', 'are you available', 'availability.check');
    manager.addAnswer('en', 'availability.check', 'I am always available to help!');
    manager.addAnswer('en', 'availability.check', 'Yes, I\'m ready to assist you.');
    manager.addAnswer('en', 'availability.check', 'I\'m an AI, so I don\'t get busy! How can I help?');

    // --- Product Inquiry Intent with Entity ---
    manager.addDocument('en', 'tell me about your products', 'product.inquiry');
    manager.addDocument('en', 'what do you sell?', 'product.inquiry');
    manager.addDocument('en', 'do you have a product called %productName%?', 'product.inquiry');
    manager.addDocument('en', 'what is a %productName%?', 'product.inquiry');
    manager.addDocument('en', 'I am interested in %productName%', 'product.inquiry');
    manager.addDocument('en', 'info about %productName%', 'product.inquiry');
    manager.addDocument('en', 'tell me about your %productName%s', 'product.inquiry');
    manager.addDocument('en', 'do you sell %productName%?', 'product.inquiry');
    manager.addAnswer('en', 'product.inquiry', 'We offer a variety of products. What are you interested in?');
    manager.addAnswer('en', 'product.inquiry', 'I can tell you about {{productName}}. What specifically would you like to know?');
    manager.addAnswer('en', 'product.inquiry', 'Yes, we have {{productName}}! What would you like to know about it?');

    // --- Support Query Intent ---
    manager.addDocument('en', 'I need help', 'support.query');
    manager.addDocument('en', 'can you assist me?', 'support.query');
    manager.addDocument('en', 'I have a problem with my order', 'support.query');
    manager.addDocument('en', 'how can I contact support?', 'support.query');
    manager.addDocument('en', 'my order is delayed', 'support.query');
    manager.addDocument('en', 'I have a billing issue', 'support.query');
    manager.addDocument('en', 'I need customer service', 'support.query');
    manager.addAnswer('en', 'support.query', 'I can help with common issues. What seems to be the problem?');
    manager.addAnswer('en', 'support.query', 'Please describe your issue, or visit our support page at example.com/support.');
    manager.addAnswer('en', 'support.query', 'I can connect you to a support agent. What is your issue about?');

    // --- Order Status (with context for order ID) ---
    manager.addDocument('en', 'what is the status of my order?', 'order.status');
    manager.addDocument('en', 'where is my order?', 'order.status');
    manager.addDocument('en', 'track my order', 'order.status');
    manager.addDocument('en', 'has my order shipped?', 'order.status');
    manager.addDocument('en', 'order status', 'order.status');
    manager.addAnswer('en', 'order.status', 'Please provide your order number so I can check its status for you.', { context: 'get_order_id' });
    manager.addAnswer('en', 'order.status', 'To track your order, I\'ll need your order ID. Can you provide it?', { context: 'get_order_id' });

    // --- Provide Order ID (responds when context is 'get_order_id') ---
    manager.addDocument('en', 'my order number is %orderId%', 'order.id.provided', ['get_order_id']);
    manager.addDocument('en', 'it is %orderId%', 'order.id.provided', ['get_order_id']);
    manager.addDocument('en', 'order %orderId%', 'order.id.provided', ['get_order_id']);
    manager.addDocument('en', '%orderId%', 'order.id.provided', ['get_order_id']);
    manager.addRegexEntity('en', 'orderId', /\b(?:[A-Z]{2,3}\d{6,10}|ORD-\d{4,}|#\d{5,})\b/i);
    manager.addAnswer('en', 'order.id.provided', 'Thanks! Let me check on order {{orderId}} for you. Please wait a moment...');
    manager.addAnswer('en', 'order.id.provided', 'Got it, looking up order {{orderId}} now.');

    // --- Company Info ---
    manager.addDocument('en', 'tell me about your company', 'company.info');
    manager.addDocument('en', 'what is your mission?', 'company.info');
    manager.addDocument('en', 'who are you?', 'company.info');
    manager.addDocument('en', 'about us', 'company.info');
    manager.addDocument('en', 'what do you do?', 'company.info');
    manager.addAnswer('en', 'company.info', 'We are a leading provider of innovative solutions in the tech industry. Our mission is to empower individuals and businesses with cutting-edge products.');
    manager.addAnswer('en', 'company.info', 'We specialize in high-quality electronics and software development. Is there something specific you\'d like to know?');

    // --- Product Details (context from product.inquiry) ---
    manager.addDocument('en', 'tell me more about it', 'product.details', ['product.inquiry']);
    manager.addDocument('en', 'what are the features?', 'product.details', ['product.inquiry']);
    manager.addDocument('en', 'specifications', 'product.details', ['product.inquiry']);
    manager.addAnswer('en', 'product.details', 'For the {{productName}}, it has [feature A], [feature B], and [feature C].');
    manager.addAnswer('en', 'product.details', 'The key features of our {{productName}} include: High Resolution Display, Long Battery Life, and Fast Processor.');

    // --- Shipping & Delivery ---
    manager.addDocument('en', 'how much is shipping?', 'shipping.cost');
    manager.addDocument('en', 'what are your shipping fees?', 'shipping.cost');
    manager.addDocument('en', 'delivery cost', 'shipping.cost');
    manager.addAnswer('en', 'shipping.cost', 'Standard shipping within Ghana is ¢25.00. Express shipping is ¢50.00.');
    manager.addAnswer('en', 'shipping.cost', 'Shipping costs vary based on your location and selected delivery speed. Standard shipping is ¢25.00.');

    manager.addDocument('en', 'how long does delivery take?', 'shipping.delivery_time');
    manager.addDocument('en', 'when will my order arrive?', 'shipping.delivery_time');
    manager.addDocument('en', 'estimated delivery time', 'shipping.delivery_time');
    manager.addAnswer('en', 'shipping.delivery_time', 'Standard delivery typically takes 3-5 business days. Express delivery is usually 1-2 business days.');
    manager.addAnswer('en', 'shipping.delivery_time', 'For deliveries within Accra, expect your order in 1-2 business days. Outside Accra, it can take 3-5 business days.');

    // --- Returns & Refunds ---
    manager.addDocument('en', 'what is your return policy?', 'returns.policy');
    manager.addDocument('en', 'can I return a product?', 'returns.policy');
    manager.addDocument('en', 'how do I return an item?', 'returns.policy');
    manager.addAnswer('en', 'returns.policy', 'You can return most items within 30 days of purchase, provided they are in their original condition. Please visit our returns page for full details.');

    manager.addDocument('en', 'how do I get a refund?', 'returns.refund');
    manager.addDocument('en', 'when will I receive my money back?', 'returns.refund');
    manager.addDocument('en', 'refund process', 'returns.refund');
    manager.addAnswer('en', 'returns.refund', 'Refunds are processed within 5-7 business days after we receive and inspect your returned item.');

    // --- Payment & Billing ---
    manager.addDocument('en', 'what payment methods do you accept?', 'payment.methods');
    manager.addDocument('en', 'how can I pay?', 'payment.methods');
    manager.addDocument('en', 'do you accept mobile money?', 'payment.methods');
    manager.addAnswer('en', 'payment.methods', 'We accept Visa, MasterCard, Mobile Money (MTN, Vodafone, AirtelTigo), and Bank Transfers.');
    manager.addAnswer('en', 'payment.methods', 'You can pay using credit/debit cards or various Mobile Money platforms.');

    manager.addDocument('en', 'I have a billing question', 'payment.billing_issue');
    manager.addDocument('en', 'my bill is incorrect', 'payment.billing_issue');
    manager.addDocument('en', 'dispute a charge', 'payment.billing_issue');
    manager.addAnswer('en', 'payment.billing_issue', 'For billing issues, please contact our support team directly with your invoice number.');

    // --- Product Recommendation ---
    manager.addDocument('en', 'recommend a product', 'product.recommendation');
    manager.addDocument('en', 'what do you suggest?', 'product.recommendation');
    manager.addDocument('en', 'help me choose a product', 'product.recommendation');
    manager.addDocument('en', 'what is popular?', 'product.recommendation');
    manager.addAnswer('en', 'product.recommendation', 'Certainly! To help me recommend something, what kind of product are you looking for? (e.g., "a laptop for gaming", "headphones for travel")');
    manager.addAnswer('en', 'product.recommendation', 'I can help with that! Are you interested in electronics, home goods, or something else?');

    // --- Business Hours / Location ---
    manager.addDocument('en', 'what are your business hours?', 'company.hours');
    manager.addDocument('en', 'when are you open?', 'company.hours');
    manager.addDocument('en', 'what time do you close?', 'company.hours');
    manager.addAnswer('en', 'company.hours', 'Our physical store is open Monday to Friday from 9 AM to 5 PM, and Saturdays from 10 AM to 2 PM. We are closed on Sundays.');
    manager.addAnswer('en', 'company.hours', 'You can reach us online 24/7, but our customer service team is available from 9 AM to 5 PM on weekdays.');

    manager.addDocument('en', 'where are you located?', 'company.location');
    manager.addDocument('en', 'what is your address?', 'company.location');
    manager.addDocument('en', 'do you have a physical store?', 'company.location');
    manager.addAnswer('en', 'company.location', 'Our main office is located in Accra, Ghana. We operate primarily online, but you can visit us at [Your Full Address Here] during business hours.');
    manager.addAnswer('en', 'company.location', 'Yes, we have a physical location in Accra. You can find us at [Your Street Address].');

    // --- Promotions / Discounts ---
    manager.addDocument('en', 'do you have any promotions?', 'promotions.query');
    manager.addDocument('en', 'are there any discounts?', 'promotions.query');
    manager.addDocument('en', 'what are your current deals?', 'promotions.query');
    manager.addAnswer('en', 'promotions.query', 'Yes, we currently have a 10% discount on all laptops this week! Check our homepage for more exciting deals.');
    manager.addAnswer('en', 'promotions.query', 'Keep an eye on our "Deals" section on the website for the latest promotions and discounts!');

    // --- Technical Support ---
    manager.addDocument('en', 'I have a technical issue', 'tech_support.query');
    manager.addDocument('en', 'I need help with a device', 'tech_support.query');
    manager.addDocument('en', 'my product is not working', 'tech_support.query');
    manager.addAnswer('en', 'tech_support.query', 'I can help with basic troubleshooting. What kind of device is it, and what problem are you experiencing?');
    manager.addAnswer('en', 'tech_support.query', 'Please describe your technical issue in more detail. You might also find solutions in our online knowledge base at example.com/tech-support.');

    // --- Human Handoff Intent ---
    manager.addDocument('en', 'I want to talk to a human', 'handoff.human');
    manager.addDocument('en', 'connect me to an agent', 'handoff.human');
    manager.addDocument('en', 'speak to a representative', 'handoff.human');
    manager.addDocument('en', 'can I talk to someone?', 'handoff.human');
    manager.addDocument('en', 'I need to speak to support', 'handoff.human');
    manager.addDocument('en', 'live chat', 'handoff.human');
    manager.addAnswer('en', 'handoff.human', 'Please wait while I connect you to a human agent. This may take a moment.');
    manager.addAnswer('en', 'handoff.human', 'Connecting you to live support now. Please hold on.');


    // Train the model
    await manager.train();
    console.log('NLP model trained.');

    // Save the trained model to a file
    manager.save(modelPath);
    console.log(`NLP model saved to ${modelPath}`);
}

async function loadModel() {
    try {
        if (fs.existsSync(modelPath)) {
            manager.load(modelPath);
            console.log(`NLP model loaded from ${modelPath}`);
        } else {
            console.warn('No trained model found. Training from scratch...');
            await trainAndSaveModel();
        }
    } catch (error) {
        console.error('Error loading or training model:', error);
        // Fallback to training if load fails for any reason
        await trainAndSaveModel();
    }
}

async function processMessage(text, context) {
    const result = await manager.process('en', text, context);

    // If confidence is low, and it's not already a handoff intent, suggest handoff
    // Increased threshold slightly for low confidence to catch more nuances with new intents
    if (result.score < 0.6 && result.intent !== 'None' && result.intent !== 'handoff.human' && !result.answer) {
        result.answer = "I'm not quite sure how to help with that. Would you like me to connect you to a human agent?";
        result.intent = 'low_confidence_fallback_suggest_handoff'; // Custom intent for this case
    } else if (!result.answer) {
        // Default fallback if no answer is found even with an intent, or if intent is 'None'
        result.answer = "I'm still learning and don't have a specific answer for that yet. Can I help with something else?";
    }

    const entities = result.entities || [];
    const productNameEntity = entities.find(e => e.entity === 'productName');
    const orderIdEntity = entities.find(e => e.entity === 'orderId');

    if (productNameEntity) {
        result.answer = result.answer.replace(/\{\{productName\}\}/g, productNameEntity.sourceText);
    }
    if (orderIdEntity) {
        result.answer = result.answer.replace(/\{\{orderId\}\}/g, orderIdEntity.sourceText);
    }

    return result;
}

module.exports = {
    loadModel,
    processMessage
};