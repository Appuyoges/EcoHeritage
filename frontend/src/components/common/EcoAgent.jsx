import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Map, Compass, Zap } from 'lucide-react';

const EcoAgent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your Eco-Agent. I can help you navigate or plan your trip. Try saying 'Take me to the map' or 'Plan a trip'.", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const processCommand = async (text) => {
        setIsTyping(true);
        const lowerText = text.toLowerCase();
        let response = "I'm not sure how to help with that yet. Try asking me to navigate somewhere!";
        let action = null;

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Navigation Intents
        if (lowerText.includes('map') || lowerText.includes('world')) {
            response = "Navigating to the World Map...";
            action = () => navigate('/map');
        } else if (lowerText.includes('plan') || lowerText.includes('trip')) {
            response = "Opening the Trip Planner. Let's find a sustainable route!";
            action = () => navigate('/plan');
        } else if (lowerText.includes('home') || lowerText.includes('start')) {
            response = "Heading back to the Home page.";
            action = () => navigate('/');
        } else if (lowerText.includes('community') || lowerText.includes('social')) {
            response = "Taking you to the Community Hub.";
            action = () => navigate('/community');
        } else if (lowerText.includes('explore') || lowerText.includes('sites')) {
            response = "Let's explore some heritage sites.";
            action = () => navigate('/explore');
        } else if (lowerText.includes('carbon') || lowerText.includes('footprint')) {
            response = "Checking your Carbon Dashboard.";
            action = () => navigate('/carbon');
        } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
            response = "Hello there! Ready to explore sustainably?";
        }

        setMessages(prev => [...prev, { id: Date.now(), text: response, sender: 'ai' }]);
        setIsTyping(false);

        if (action) {
            setTimeout(() => {
                action();
            }, 800);
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const command = inputValue;
        setInputValue('');

        processCommand(command);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{
                            width: '350px',
                            height: '500px',
                            background: 'rgba(24, 24, 27, 0.95)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '20px',
                            marginBottom: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', background: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles style={{ width: '18px', height: '18px', color: 'white' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', color: 'white', fontSize: '14px' }}>Eco-Agent</div>
                                    <div style={{ fontSize: '11px', color: '#10b981' }}>Online • AI Assistant</div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                                <X style={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '80%',
                                        padding: '12px 16px',
                                        borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                        background: msg.sender === 'user' ? '#10b981' : 'rgba(255,255,255,0.05)',
                                        color: msg.sender === 'user' ? 'white' : '#e4e4e7',
                                        fontSize: '14px',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px 16px 16px 0' }}>
                                    <div className="typing-indicator" style={{ display: 'flex', gap: '4px' }}>
                                        <span style={{ width: '6px', height: '6px', background: '#a1a1aa', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                                        <span style={{ width: '6px', height: '6px', background: '#a1a1aa', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.16s' }}></span>
                                        <span style={{ width: '6px', height: '6px', background: '#a1a1aa', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.32s' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me to navigate..."
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,255,255,0.05)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        background: '#10b981',
                                        border: 'none',
                                        borderRadius: '12px',
                                        width: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white'
                                    }}
                                >
                                    <Send style={{ width: '18px', height: '18px' }} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                }}
            >
                {isOpen ? (
                    <X style={{ width: '28px', height: '28px', color: 'white' }} />
                ) : (
                    <Sparkles style={{ width: '28px', height: '28px', color: 'white' }} />
                )}
                {!isOpen && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', border: '2px solid #18181b' }}></span>
                )}
            </motion.button>

            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default EcoAgent;
