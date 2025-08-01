import { useState, useRef, useEffect } from 'react'
import './AppStyles.css';
const suggestions = [
    {
        icon: '🌤️',
        title: 'Weather forecast',
        text: 'What the weather like in Kyiv?',
    },
    {
        icon: '💊',
        title: 'Stock information',
        text: 'Do you have an aspirin in stock?',
    },
    {
        icon: '🚑',
        title: 'The incident happened',
        text: 'There was a car accident. We need pain relief, antibiotics, wound care.  How many medicines do we need for 10 people?',
    },
    {
        icon: '📄',
        title: 'Drug information',
        text: 'What are the analogs for XYLOCAINE?',
    },
];

interface RequestModel {
    Request: string;
}

interface ResponseModel {
    response: string;
}

const API_URL = "https://skynetassistantsagentapi20250725153455-bne6c7gudbdcdeek.eastus-01.azurewebsites.net//query";

const splitAssistantResponse = (response: string): string => {
    const userIdx = response.indexOf('[user]');
    const assistantIdx = response.indexOf('[assistant]');
    const metadataIdx = response.indexOf('Metadata');

    if (userIdx === -1 || assistantIdx === -1 || metadataIdx === -1) {
        // If any marker is missing, return as is
        return response;
    }

    const part2 = response.substring(assistantIdx, metadataIdx).trim();
    const part3 = response.substring(metadataIdx).trim();

    return `${part2}\n${part3}`;
};

    function App() {
        const [input, setInput] = useState('');
        const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
        const [loading, setLoading] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            inputRef.current?.focus();
        }, []);

        useEffect(() => {
            if (!loading) {
                inputRef.current?.focus();
            }
        }, [loading]);

        const handleSend = async () => {
            if (!input.trim() || loading) return;
            setLoading(true);
            const userMessage = { role: 'user' as const, text: input };
            setMessages(prev => [...prev, userMessage]);
            const req: RequestModel = { Request: input };
            setInput('');
            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req),
                });
                if (!res.ok) throw new Error('Network response was not ok');
                const data: ResponseModel = await res.json();
                setMessages(prev => [...prev, { role: 'assistant' as const, text: splitAssistantResponse(data.response) }]);
            } catch (error) {
                setMessages(prev => [...prev, { role: 'assistant' as const, text: 'Error: ' + (error as Error).message }]);
            }
            setLoading(false);
        };

        return (
            <div className="skynet-main-container">
                {/* Loading Overlay */}
                {/* Remove LoadingOverlay import */}
                <div className="skynet-inner-container">
                    <h2 className="skynet-title">Skynet Assistants medicine Agent</h2>
                    {/* Waiting label */}
                    {loading && (
                        <div className="skynet-loading-label">
                            Waiting for response
                        </div>
                    )}
                    {/* Suggestion Cards */}
                    <div className="skynet-suggestions">
                        {suggestions.map((s, idx) => (
                            <div
                                key={idx}
                                onClick={() => setInput(s.text)}
                                className="skynet-suggestion-card"
                            >
                                <div className="skynet-suggestion-icon">{s.icon}</div>
                                <div className="skynet-suggestion-title">{s.title}</div>
                                <div className="skynet-suggestion-text">{s.text}</div>
                            </div>
                        ))}
                    </div>
                    {/* Chat Messages */}
                    <div className="skynet-chat-area">
                        {messages.length === 0 && <div className="skynet-chat-empty">No messages yet.</div>}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`skynet-chat-message${msg.role === 'user' ? ' user' : ''}`}
                            >
                                <pre style={{ 
                                    whiteSpace: 'pre-wrap', 
                                    wordWrap: 'break-word',
                                    margin: 0,
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit',
                                    lineHeight: 'inherit'
                                }}>
                                    {msg.text}
                                </pre>
                            </div>
                        ))}
                    </div>
                    {/* Input */}
                    <div className="skynet-input-row">
                        <input
                            ref={inputRef}
                            className="skynet-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="skynet-send-btn"
                        >
                            {loading ? 'Waiting for response' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

export default App
