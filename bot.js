// AI ბოტის ლოგიკა და ინტერფეისი

document.addEventListener('DOMContentLoaded', () => {
    // ჩატის HTML სტრუქტურის დინამიური შექმნა
    const botHTML = `
        <div id="aiChatWidget" class="chat-widget">
            <button id="chatToggleBtn" class="chat-toggle-btn" onclick="toggleChatWindow()">
                💬 <span class="chat-badge-dot"></span>
            </button>
            
            <div id="chatWindow" class="chat-window">
                <div class="chat-header">
                    <div class="chat-title">
                        🤖 <strong>MINI MARKET AI ასისტენტი</strong>
                        <small style="display:block; font-size:10px; opacity:0.8;">ონლაინ რეჟიმშია</small>
                    </div>
                    <span class="chat-close" onclick="toggleChatWindow()">✕</span>
                </div>
                
                <div id="chatMessages" class="chat-messages">
                    <div class="msg bot-msg">
                        გამარჯობა! 👋 მე ვარ MINI MARKET-ის AI ასისტენტი.  במה დაგეხმაროთ?
                    </div>
                </div>
                
                <div class="chat-quick-replies">
                    <button onclick="sendQuickReply('საათები')">🕒 საათები</button>
                    <button onclick="sendQuickReply('მისამართი')">📍 მისამართი</button>
                    <button onclick="sendQuickReply('მიწოდება')">🚚 მიწოდება</button>
                    <button onclick="connectToOperator()" class="operator-btn">👨‍💼 ოპერატორი</button>
                </div>
                
                <div class="chat-input-area">
                    <input type="text" id="chatInput" placeholder="ჩაწერთ კითხვა..." onkeypress="handleChatKeyPress(event)">
                    <button onclick="sendChatMessage()">➔</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', botHTML);
});

// ჩატის ფანჯრის გახსნა/დახურვა
function toggleChatWindow() {
    const chatWin = document.getElementById('chatWindow');
    if (chatWin) {
        chatWin.style.display = (chatWin.style.display === 'flex') ? 'none' : 'flex';
    }
}

// შეტყობინების გაგზავნა
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user-msg');
    input.value = '';

    // AI პასუხის სიმულაცია
    setTimeout(() => {
        processAiResponse(text);
    }, 500);
}

function sendQuickReply(text) {
    addMessage(text, 'user-msg');
    setTimeout(() => {
        processAiResponse(text);
    }, 400);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// შეტყობინების დამატება ეკრანზე
function addMessage(text, className) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${className}`;
    msgDiv.innerHTML = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// AI პასუხების ლოგიკა
function processAiResponse(userText) {
    const query = userText.toLowerCase();

    if (query.includes('საათ') || query.includes('დრო') || query.includes('როდის')) {
        addMessage('🕒 მაღაზია მუშაობს ყოველდღე **10:00-დან 17:50-მდე**.', 'bot-msg');
    } 
    else if (query.includes('მისამართ') || query.includes('სად') || query.includes('მდებარე')) {
        addMessage('📍 მდებარეობა: **ქ. ახალციხე, იაძის ქუჩა N2**.', 'bot-msg');
    } 
    else if (query.includes('მიწოდება') || query.includes('ტაქსი') || query.includes('მოტანა') || query.includes('ფასი')) {
        addMessage('🚚 **მიწოდების პირობები:**<br>• ახალციხე: 3-6 ₾<br>• სოფლები: 10-20 ₾<br>• 200 ₾-ზე მეტზე: ** უფასო!**', 'bot-msg');
    } 
    else if (query.includes('პრიზ') || query.includes('ყავა') || query.includes('ლატინო')) {
        addMessage('🎁 დიახ! ჩვენთან ზოგიერთ პროდუქტზე (მაგალითად: სომხური ყავა ლატინო) ამოდის სპეციალური პრიზები!', 'bot-msg');
    } 
    else if (query.includes('ოპერატორ') || query.includes('ადამიან') || query.includes('დაკავშირ') || query.includes('whatsapp') || query.includes('ვატსაპ')) {
        connectToOperator();
    } 
    else {
        addMessage('🤔 ამ კითხვაზე ზუსტი პასუხი არ მაქვს. გსურთ გადაგიყვანოთ პირდაპირ **ოპერატორთან WhatsApp-ში**?', 'bot-msg');
        addMessage(`<button onclick="connectToOperator()" class="btn-whatsapp-link">💬 გადასვლა WhatsApp (+995 500 22 48 22)</button>`, 'bot-msg');
    }
}

// WhatsApp-ზე გადამისამართება
function connectToOperator() {
    const phoneNumber = "995500224822";
    const message = encodeURIComponent("გამარჯობა, MINI MARKET-ის საიტიდან გწერთ, მჭირდება ოპერატორის დახმარება.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    addMessage('🔗 გ გადამისამართებთ ოპერატორთან WhatsApp-ში...', 'bot-msg');
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1000);
}
