import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Sparkles,
    MapPin,
    Leaf,
    Calendar,
    Wallet,
    ThumbsUp,
    ThumbsDown,
    Copy,
    Bot,
    User,
    ArrowRight,
    Clock
} from 'lucide-react';

const TripResultCard = ({ data }) => {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass-card"
            style={{
                marginTop: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 78, 59, 0.4))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '320px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{data.destination}</h3>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#d1fae5' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {data.duration}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Wallet size={12} /> {data.budget}</span>
                    </div>
                </div>
                <div style={{ background: '#10b981', color: '#064e3b', fontWeight: 'bold', fontSize: '12px', padding: '4px 8px', borderRadius: '8px' }}>
                    {data.eco_score} Eco Score
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6ee7b7', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Highlights</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {data.highlights.map((h, i) => (
                        <span key={i} style={{ fontSize: '12px', background: 'rgba(0,0,0,0.2)', color: 'white', padding: '4px 10px', borderRadius: '100px' }}>
                            {h}
                        </span>
                    ))}
                </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '14px', height: '36px' }}>
                View Full Itinerary <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
        </motion.div>
    );
};

const ChatbotPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: `Hello! I'm your AI Travel Assistant 🌿

I can help you plan sustainable heritage trips worldwide. Try asking me:

• "Plan a 5-day eco-friendly trip to Rajasthan"
• "What's the best time to visit Hampi?"
• "Suggest low-carbon transport from Delhi to Agra"`,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestions = [
        { icon: MapPin, text: 'Plan a heritage trip to Karnataka' },
        { icon: Leaf, text: 'Most eco-friendly destinations' },
        { icon: Calendar, text: 'Best time to visit Taj Mahal' },
        { icon: Wallet, text: 'Budget trip to Rajasthan' }
    ];

    const containerStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px'
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);



        // Fetch user profile for context if needed (Simplified: we assume it's available or fetched elsewhere)
        // For now, we'll use a mock user context if real one isn't passed from props
        const userContext = {
            name: "Yogeswaran S",
            level: "Eco Explorer",
            green_points: 2450,
            carbon_saved: "156 kg"
        };

        // Real API call
        try {
            const response = await fetch('http://localhost:8000/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    role: 'user',
                    context: userContext,
                    history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            const assistantMessage = {
                id: messages.length + 2,
                role: 'assistant',
                content: data.response,
                trip_data: data.trip_data,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: messages.length + 2,
                role: 'assistant',
                content: "I'm having trouble connecting to my AI brain right now. Please try again later.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSuggestionClick = (text) => {
        setInput(text);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', paddingTop: '100px', paddingBottom: '40px' }}>
            <div style={containerStyle}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '32px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span className="badge badge-eco">
                            <Sparkles style={{ width: '12px', height: '12px' }} />
                            AI-Powered Assistant
                        </span>
                        <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <Bot style={{ width: '12px', height: '12px' }} />
                            Context Aware
                        </span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
                        Travel Chat Assistant
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#9ca3af' }}>
                        Ask me about sustainable heritage travel personalized for you
                    </p>
                </motion.div>

                {/* Chat Container */}
                <div style={{
                    background: 'rgba(24, 24, 27, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    overflow: 'hidden'
                }}>

                    {/* Messages */}
                    <div style={{
                        height: 'calc(100vh - 450px)',
                        minHeight: '320px',
                        maxHeight: '480px',
                        overflowY: 'auto',
                        padding: '24px'
                    }}>
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        marginBottom: '20px',
                                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                                    }}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        background: message.role === 'user'
                                            ? 'linear-gradient(135deg, #10b981, #059669)'
                                            : 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                                    }}>
                                        {message.role === 'user' ? (
                                            <User style={{ width: '18px', height: '18px', color: 'white' }} />
                                        ) : (
                                            <Bot style={{ width: '18px', height: '18px', color: 'white' }} />
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div style={{ maxWidth: '75%' }}>
                                        <div style={{
                                            padding: '16px 20px',
                                            borderRadius: '20px',
                                            borderTopLeftRadius: message.role === 'assistant' ? '4px' : '20px',
                                            borderTopRightRadius: message.role === 'user' ? '4px' : '20px',
                                            background: message.role === 'user'
                                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                                : '#27272a',
                                            color: 'white',
                                            fontSize: '15px',
                                            lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {message.content}
                                        </div>

                                        {message.role === 'assistant' && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                {[ThumbsUp, ThumbsDown, Copy].map((Icon, i) => (
                                                    <button key={i} style={{
                                                        padding: '8px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#71717a',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <Icon style={{ width: '16px', height: '16px' }} />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {/* Render Trip Card if available */}
                                        {message.trip_data && (
                                            <div style={{ marginTop: '8px', width: '100%' }}>
                                                <TripResultCard data={message.trip_data} />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing Indicator */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ display: 'flex', gap: '12px' }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Bot style={{ width: '18px', height: '18px', color: 'white' }} />
                                </div>
                                <div style={{
                                    padding: '16px 20px',
                                    borderRadius: '20px',
                                    borderTopLeftRadius: '4px',
                                    background: '#27272a',
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center'
                                }}>
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                background: '#71717a',
                                                borderRadius: '50%'
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        {suggestions.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(s.text)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 16px',
                                        background: '#18181b',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '100px',
                                        color: '#9ca3af',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon style={{ width: '14px', height: '14px' }} />
                                    {s.text}
                                </button>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '20px 24px',
                        background: 'rgba(0,0,0,0.3)',
                        borderTop: '1px solid rgba(255,255,255,0.06)'
                    }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about sustainable travel..."
                                style={{
                                    flex: 1,
                                    padding: '16px 20px',
                                    background: '#27272a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '14px',
                                    color: '#fafafa',
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="btn-primary"
                                style={{ padding: '16px 20px', opacity: input.trim() && !isTyping ? 1 : 0.5 }}
                            >
                                <Send style={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            marginTop: '12px',
                            color: '#52525b',
                            fontSize: '12px'
                        }}>
                            <Sparkles style={{ width: '12px', height: '12px' }} />
                            Powered by Multi-Agent AI
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default ChatbotPage;
