// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    const sessionId = 'user_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();

    function addMessage(sender, content, type = 'text', data = {}) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', `${sender}-message`);

        if (type === 'text') {
            messageContainer.textContent = content;
        } else if (type === 'product_info') {
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                <p>Description: ${data.description || 'N/A'}</p>
                <p>Price: ${data.price || 'N/A'}</p>
                <p>Availability: ${data.availability || 'N/A'}</p>
                <div class="actions">
                    ${(data.actions || []).map(action => `<button class="action-button" data-payload="${action.payload}">${action.text}</button>`).join('')}
                </div>
            `;
        } else if (type === 'order_status') {
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                <p>Order ID: ${data.orderId || 'N/A'}</p>
                <p>Status: <span class="status-badge status-${(data.status || 'unknown').toLowerCase().replace(' ', '-') }">${data.status || 'N/A'}</span></p>
                <p>Est. Delivery: ${data.estimatedDelivery || 'N/A'}</p>
            `;
        } else if (type === 'text_with_actions') {
             messageContainer.innerHTML = `
                <p>${content}</p>
                <div class="actions">
                    ${(data.actions || []).map(action => `<button class="action-button" data-payload="${action.payload}">${action.text}</button>`).join('')}
                </div>
            `;
        } else if (type === 'text_with_prompt') {
            messageContainer.innerHTML = `<p>${content}</p>`;
            if (data.suggestions && data.suggestions.length > 0) {
                messageContainer.innerHTML += `<p class="suggestions">Try: ${data.suggestions.map(s => `<span>${s}</span>`).join(', ')}</p>`;
            }
            userInput.focus();
        }
        else if (type === 'shipping_info') {
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                <p>Here are our shipping options:</p>
                <ul>
                    ${(data.options || []).map(opt => `<li><strong>${opt.type}:</strong> ${opt.cost}</li>`).join('')}
                </ul>
            `;
        } else if (type === 'delivery_time_info') {
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                <p>Typical delivery times:</p>
                <ul>
                    ${(data.deliveryZones || []).map(zone => `<li><strong>${zone.zone}:</strong> ${zone.time}</li>`).join('')}
                </ul>
            `;
        } else if (type === 'text_with_link') {
            messageContainer.innerHTML = `
                <p>${content}</p>
                <p><a href="${data.link_url}" target="_blank">${data.link_text || 'Click here'}</a> for more details.</p>
            `;
        } else if (type === 'payment_methods') {
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                <p>We accept the following payment methods:</p>
                <ul>
                    ${(data.accepted_methods || []).map(method => `<li>${method}</li>`).join('')}
                </ul>
                ${data.note ? `<p class="note">${data.note}</p>` : ''}
            `;
        } else if (type === 'business_hours') {
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                <p>${data.current_status || ''}</p>
                <p>Our regular hours are:</p>
                <ul>
                    ${(data.days || []).map(d => `<li><strong>${d.day}:</strong> ${d.hours}</li>`).join('')}
                </ul>
            `;
        } else if (type === 'location_info') {
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                <p>Address: ${data.address || 'N/A'}</p>
                ${data.map_link ? `<p><a href="${data.map_link}" target="_blank">View on Map</a></p>` : ''}
            `;
        } else if (type === 'promotions_info') {
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                ${data.current_promo ? `<p>Current Offer: ${data.current_promo}</p>` : ''}
                ${data.link_to_deals ? `<p><a href="${data.link_to_deals}" target="_blank">See all our deals!</a></p>` : ''}
            `;
        }
        // --- NEW: Human Handoff Response Type ---
        else if (type === 'human_handoff') {
            messageContainer.classList.add('handoff-message'); // Add a specific class for styling
            messageContainer.innerHTML = `
                <p><strong>${content}</strong></p>
                <p>${data.handoff_message || 'Connecting you to support...'}</p>
                ${data.support_link ? `<p><a href="${data.support_link}" target="_blank" class="handoff-link">Click here to start a live chat</a></p>` : ''}
                <p class="small-text">Please note: This is a simulation. In a real system, you would be connected to a human agent.</p>
            `;
            // Disable input and send button after handoff to simulate agent takeover
            userInput.disabled = true;
            sendButton.disabled = true;
            userInput.placeholder = "Conversation transferred to human agent.";
        }


        chatBox.appendChild(messageContainer);
        chatBox.scrollTop = chatBox.scrollHeight;

        if (data.actions && data.actions.length > 0) {
            messageContainer.querySelectorAll('.action-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const payload = event.target.dataset.payload;
                    userInput.value = payload;
                    sendMessage();
                });
            });
        }
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage('user', message);
        userInput.value = '';

        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message, sessionId: sessionId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessage('bot', data.reply, data.response_type, data.data);

        } catch (error) {
            console.error('Error sending message to chatbot:', error);
            addMessage('bot', 'Oops! I seem to be having trouble connecting. Please try again later.');
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    addMessage('bot', 'Hi there! I\'m your improved chatbot. How can I assist you today?');
});