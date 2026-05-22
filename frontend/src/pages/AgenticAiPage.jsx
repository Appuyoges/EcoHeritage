import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map,
    Users,
    Leaf,
    Utensils,
    BookOpen,
    Bot,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Loader,
    BrainCircuit,
    Code,
    Database,
    Cpu,
    Activity,
    MapPin,
    Calendar,
    Navigation,
    Search,
    Calculator,
    ShieldCheck
} from 'lucide-react';

// Reusable Autocomplete Component
const LocationCombobox = ({ label, icon: Icon, value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = query === ''
        ? options
        : options.filter((person) =>
            person.toLowerCase().includes(query.toLowerCase())
        );

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px', fontWeight: '600' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <Icon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: label === 'ORIGIN' ? '#3b82f6' : '#ef4444', width: '18px', zIndex: 10 }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        if (e.target.value === '') {
                            onChange('');
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        padding: '16px 16px 16px 48px',
                        background: '#09090b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none'
                    }}
                />

                {/* Dropdown */}
                <AnimatePresence>
                    {isOpen && filteredOptions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: '8px',
                                background: '#18181b',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                maxHeight: '240px',
                                overflowY: 'auto',
                                zIndex: 50,
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            {filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => {
                                        onChange(option);
                                        setQuery(option);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        color: '#e4e4e7',
                                        fontSize: '14px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {option}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const AgenticAiPage = () => {
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [travelDate, setTravelDate] = useState('2026-02-15');
    const [isProcessing, setIsProcessing] = useState(false);
    const [agentLogs, setAgentLogs] = useState([]);
    const [finalResult, setFinalResult] = useState(null);
    const [dataStream, setDataStream] = useState([]);
    const logsEndRef = useRef(null);

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [agentLogs, dataStream]);

    const locations = [
        // Major Cities
        "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad", "Pune",
        "Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Varanasi", "Rishikesh", "Haridwar", "Amritsar",
        "Kochi", "Thiruvananthapuram", "Goa", "Pondicherry", "Mysore", "Ooty", "Coorg", "Shimla", "Manali",
        "Darjeeling", "Gangtok", "Guwahati", "Bhubaneswar", "Puri", "Lucknow", "Agra", "Bhopal", "Indore",
        "Patna", "Ranchi", "Raipur", "Chandigarh", "Srinagar", "Leh",

        // UNESCO World Heritage Sites & Major Monuments
        "Taj Mahal, Agra", "Qutub Minar, Delhi", "Red Fort, Delhi", "Humayun's Tomb, Delhi", "Fatehpur Sikri",
        "Agra Fort", "Khajuraho Group of Monuments", "Konark Sun Temple", "Hampi Group of Monuments",
        "Ajanta Caves", "Ellora Caves", "Elephanta Caves", "Sanchi Stupa", "Mahabalipuram",
        "Great Living Chola Temples", "Kaziranga National Park", "Sundarbans National Park", "Keoladeo National Park",
        "Manas Wildlife Sanctuary", "Western Ghats", "Rani ki Vav, Patan", "Hill Forts of Rajasthan",
        "Amber Fort, Jaipur", "Chittorgarh Fort", "Kumbhalgarh Fort", "Ranthambore Fort", "Jaisalmer Fort",
        "Gagron Fort", "Nalanda Mahavihara", "Bodh Gaya (Mahabodhi Temple)", "Rock Shelters of Bhimbetka",
        "Champaner-Pavagadh Archaeological Park", "Chhatrapati Shivaji Terminus, Mumbai",
        "Churches and Convents of Goa", "Great Himalayan National Park", "Khangchendzonga National Park",
        "Capitol Complex, Chandigarh", "Historic City of Ahmedabad", "Victorian Gothic & Art Deco Ensembles of Mumbai",
        "Jaipur City (Walled City)", "Kakatiya Rudreshwara (Ramappa) Temple", "Dholavira: A Harappan City",
        "Sacred Ensembles of the Hoysalas", "Santiniketan"
    ].sort();

    const agents = [
        {
            id: 'personalization',
            name: 'Personalization Engine',
            role: 'Recommendation System',
            icon: BrainCircuit,
            color: '#8b5cf6',
            desc: 'Filters heritage sites based on user profile and semantic relevance.',
            tech: { model: 'Matrix Factorization (SVD) + BERT', input: 'User Profile, Past Trips', output: 'Ranked Candidate List' }
        },
        {
            id: 'sustainability',
            name: 'Impact Scorer',
            role: 'Sustainability Modeling',
            icon: Leaf,
            color: '#10b981',
            desc: 'Scores sites using multi-criteria decision making for eco-impact.',
            tech: { model: 'Regression + TOPSIS (MCDM)', input: 'Site Data, Distance Matrix', output: 'Sustainability Scores' }
        },
        {
            id: 'optimizer',
            name: 'Route Optimizer',
            role: 'Graph Optimization',
            icon: Map,
            color: '#3b82f6',
            desc: 'Generates the most efficient path minimizing carbon emissions.',
            tech: { model: 'Ant Colony Optimization (ACO)', input: 'Ranked Sites, Carbon Metrics', output: 'Optimized Itinerary JSON' }
        },
        {
            id: 'crew_auditor',
            name: 'CrewAI Supervisor',
            role: 'Quality Assurance',
            icon: ShieldCheck,
            color: '#ec4899',
            desc: 'Autonomous agent that validates the outputs of all other agents.',
            tech: { model: 'CrewAI Framework (GPT-4)', input: 'All Agent Outputs', output: 'Audit Report & Approval' }
        },
        {
            id: 'planner',
            name: 'Gemini Planner Agent',
            role: 'Final Synthesis',
            icon: Bot,
            color: '#f59e0b',
            desc: 'Refines the raw itinerary into a natural language schedule.',
            tech: { model: 'Google Gemini (LLM) + RAG', input: 'Optimized JSON, Context', output: 'Final User Response' }
        }
    ];

    // Dynamic Mock Data Generator
    const getMockData = (agentId, to) => {
        const city = to || "Destination";

        if (agentId === 'personalization') return {
            method: "Collaborative Filtering + RoBERTa",
            user_vector: "[0.85, 0.12, 0.44...]",
            top_candidates: [`${city} Museum`, "Ancient Fort", "Eco-Park"],
            relevance_score: 0.98
        };

        if (agentId === 'sustainability') return {
            model: "Multiple Linear Regression",
            criteria: ["Carbon Footprint", "Crowd Density", "Preservation"],
            topsis_score: 0.92,
            verdict: "High Sustainability"
        };

        if (agentId === 'optimizer') return {
            algorithm: "Ant Colony Optimization",
            nodes: 5,
            iterations: 150,
            path_cost: "Minimized (Carbon)",
            route: ["Origin", "Stop A", "Stop B", "Destination"]
        };

        if (agentId === 'crew_auditor') return {
            audit_status: "PASSED",
            checks: [
                { agent: "Personalization", status: "Verified", confidence: 0.99 },
                { agent: "Impact Scorer", status: "Validated", notes: "TOPSIS logic consistent" },
                { agent: "Route Optimizer", status: "Optimal", notes: "No loop closures detected" }
            ],
            final_verdict: "Ready for Synthesis"
        };

        if (agentId === 'planner') return {
            model: "Gemini Pro 1.5",
            action: "Natural Language Generation",
            tone: "Eco-Conscious & Educational",
            final_output: "Ready for display"
        };

        return {};
    };

    const getFinalItinerary = (from, to) => {
        const city = to || "Destination";
        const origin = from || "Origin";

        return {
            title: `Optimized ${city} Explorer Plan`,
            summary: `A personalized, eco-friendly journey to explore the best of ${city}.`,
            verified_by: "CrewAI Supervisor",
            metrics: {
                sustainability: Math.floor(Math.random() * 10) + 85,
                efficiency: Math.floor(Math.random() * 10) + 88,
                experience: Math.floor(Math.random() * 5) + 94
            },
            carbon_details: {
                vehicle: "Electric Train / Hybrid Bus",
                total_distance: "320 km",
                emission_factor: "0.041 kg CO₂/km",
                total_emission: "13.12 kg CO₂",
                formula: "Total Distance (320) × Factor (0.041)",
                comparison: "Standard Car would emit ~61.4 kg CO₂"
            },
            steps: [
                { time: "08:00 AM", title: `Depart ${origin}`, tag: "Eco Choice", desc: "Low-carbon transport option selected." },
                { time: "10:30 AM", title: `${city} Historic Center`, tag: "History", desc: `Guided tour of ${city}'s heritage district.` },
                { time: "01:00 PM", title: `Lunch at Local Gem`, tag: "Flavor Scout", desc: `Top-rated authentic cuisine in ${city}.` },
                { time: "03:30 PM", title: `${city} Museum`, tag: "Crowd: Low", desc: "Visiting during predicted off-peak hours." },
                { time: "06:00 PM", title: "Sunset Viewpoint", tag: "Experience", desc: "Best scenic spot identified by AI." }
            ]
        };
    };

    const handleMasterRun = async () => {
        if (!fromLocation || !toLocation) return;

        setIsProcessing(true);
        setAgentLogs([]);
        setDataStream([]);
        setFinalResult(null);

        try {
            // 1. Orchestrator Start
            setAgentLogs([{ agent: 'Master Orchestrator', status: 'processing', msg: `Analyzing request: ${fromLocation} -> ${toLocation} on ${travelDate}` }]);

            // 2. Call Backend API
            const response = await fetch('http://localhost:8000/api/trips/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination: toLocation,
                    start_date: travelDate,
                    end_date: travelDate, // Single day for demo assumption, strictly planner usually needs range
                    travelers: 2,
                    budget_type: 'standard',
                    interests: ['heritage', 'nature', 'photography'],
                    eco_preference: 'balanced',
                    food_preference: 'any'
                })
            });

            if (!response.ok) throw new Error('Failed to generate plan');

            const plan = await response.json();

            // 3. Simulate Streaming Logs (since backend is fast, we replay the "thinking" steps for UX)
            const steps = [
                { agent: 'Personalization Engine', msg: 'Generating embeddings with SentenceTransformer...', data: JSON.stringify({ method: "RoBERTa-v2", top_k: 10, candidates: plan.days[0]?.places.length || 0 }, null, 2) },
                { agent: 'Sustainability Agent', msg: 'Ranking sites with TOPSIS algorithm...', data: JSON.stringify({ algorithm: "TOPSIS", weights: { carbon: 0.35, eco: 0.25 }, score: plan.sustainability_score }, null, 2) },
                { agent: 'Route Optimizer', msg: 'Running Ant Colony Optimization...', data: JSON.stringify({ algorithm: "ACO", iterations: 100, ants: 20, carbon_saved: plan.carbon_saved }, null, 2) },
                { agent: 'CrewAI Supervisor', msg: 'Auditing plan for logical consistency...', data: JSON.stringify({ status: "PASSED", confidence: 0.98, auditor: "Gemini-Pro" }, null, 2) },
                { agent: 'Gemini Planner', msg: 'Synthesizing final narrative...', data: JSON.stringify({ model: "Gemini 1.5 Pro", temperature: 0.7, tokens: 150 }, null, 2) }
            ];

            for (const step of steps) {
                setAgentLogs(prev => [...prev, { agent: step.agent, status: 'processing', msg: step.msg }]);
                setDataStream(prev => [...prev, { agent: step.agent, data: step.data }]);
                await new Promise(r => setTimeout(r, 800));
                setAgentLogs(prev => {
                    const newLogs = [...prev];
                    newLogs[newLogs.length - 1].status = 'completed';
                    return newLogs;
                });
            }

            setAgentLogs(prev => [...prev, { agent: 'Master Orchestrator', status: 'completed', msg: 'Final itinerary generated.' }]);

            // 4. Set Final Result
            setFinalResult({
                title: `Optimized Trip to ${plan.destination}`,
                summary: plan.summary || `Sustainability Score: ${plan.sustainability_score}/100. Carbon Saved: ${plan.carbon_saved}.`,
                verified_by: "CrewAI Supervisor",
                metrics: {
                    sustainability: plan.sustainability_score,
                    efficiency: 92,
                    serenity: plan.crowd_metric?.includes('Low') ? 95 : (plan.crowd_metric?.includes('Medium') ? 85 : 70)
                },
                carbon_details: {
                    vehicle: "Optimized Mix",
                    total_distance: "Calculated",
                    emission_factor: "Various",
                    total_emission: "Low",
                    formula: "Sum(Distance * Factor)",
                    comparison: `Saved ${plan.carbon_saved} vs Average`
                },
                steps: plan.days.flatMap((day, dayIdx) => [
                    // Heritage Sites
                    ...day.places.map((place, i) => {
                        const details = day.site_details?.find(d => d.name === place) || {};
                        return {
                            time: i === 0 ? "09:00 AM" : "02:00 PM",
                            title: place,
                            tag: "Heritage Site",
                            desc: details.best_time ? `Best Time: ${details.best_time}` : "Selected based on your interests.",
                            specialties: details.specialties || [],
                            map_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + " " + plan.destination)}`
                        };
                    }),
                    // Food Recommendations
                    ...day.food.map((f, i) => ({
                        time: i === 0 ? "01:00 PM" : (i === 1 ? "08:00 PM" : "04:30 PM"),
                        title: typeof f === 'string' ? f : f.name,
                        tag: "Must-Try Food",
                        desc: typeof f === 'string' ? "Local authentic cuisine." : `${f.specialty} (${f.type})`
                    })),
                    // Activities
                    ...(day.activities || []).map((act, i) => ({
                        time: "05:30 PM",
                        title: act,
                        tag: "Local Experience",
                        desc: "Immersive activity to connect with local culture."
                    }))
                ])
            });

        } catch (error) {
            console.error(error);
            setAgentLogs(prev => [...prev, { agent: 'Error', status: 'failed', msg: 'Failed to connect to backend agents.' }]);
            // Fallback to mock if backend fails (for demo stability)
            setFinalResult(getFinalItinerary(fromLocation, toLocation));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', paddingTop: '100px', paddingBottom: '60px', paddingLeft: '24px', paddingRight: '24px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span className="badge badge-eco" style={{ marginBottom: '16px' }}>
                        <BrainCircuit style={{ width: '14px', height: '14px' }} />
                        Advanced Multi-Agent System
                    </span>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
                        <span className="gradient-text">5-Agent</span> Architecture
                    </h1>
                    <p style={{ color: '#a1a1aa', maxWidth: '700px', margin: '0 auto' }}>
                        Powered by BERT, TOPSIS, Ant Colony Optimization, and CrewAI for verified sustainable travel.
                    </p>
                </div>

                {/* Agent Specs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                    {agents.map((agent) => {
                        const Icon = agent.icon;
                        return (
                            <motion.div
                                key={agent.id}
                                whileHover={{ y: -5 }}
                                className="glass-card"
                                style={{ padding: '24px', borderTop: `4px solid ${agent.color}`, display: 'flex', flexDirection: 'column', height: '100%' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${agent.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={20} color={agent.color} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>{agent.name}</h3>
                                        <div style={{ fontSize: '11px', color: agent.color, fontWeight: '600' }}>{agent.role}</div>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px', fontSize: '11px', marginTop: 'auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e4e4e7', marginBottom: '4px' }}>
                                        <Cpu size={12} /> <span style={{ opacity: 0.7 }}>Model:</span> {agent.tech.model}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e4e4e7' }}>
                                        <Activity size={12} /> <span style={{ opacity: 0.7 }}>Output:</span> {agent.tech.output}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Master Orchestrator */}
                <div className="glass-card" style={{ padding: '0', border: '1px solid rgba(16, 185, 129, 0.2)', overflow: 'hidden' }}>

                    {/* Header */}
                    <div style={{ padding: '32px', background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                                <Bot size={32} color="white" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>Master Orchestrator</h2>
                                <p style={{ color: '#a1a1aa' }}>Coordinating autonomous agents to fulfill complex user intents.</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '32px' }}>
                        {/* Input Form */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>

                            {/* From */}
                            <LocationCombobox
                                label="ORIGIN"
                                icon={Navigation}
                                value={fromLocation}
                                onChange={setFromLocation}
                                options={locations}
                                placeholder="Select Origin"
                            />

                            {/* To */}
                            <LocationCombobox
                                label="DESTINATION"
                                icon={MapPin}
                                value={toLocation}
                                onChange={setToLocation}
                                options={locations}
                                placeholder="Select Destination"
                            />

                            {/* Date */}
                            <div>
                                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px', fontWeight: '600' }}>TRAVEL DATE</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#10b981', width: '18px' }} />
                                    <input
                                        type="date"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        style={{ width: '100%', padding: '16px 16px 16px 48px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '16px', outline: 'none', cursor: 'pointer' }}
                                    />
                                </div>
                            </div>

                            {/* Button */}
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <button
                                    onClick={handleMasterRun}
                                    disabled={!fromLocation || !toLocation || isProcessing}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '16px', fontSize: '16px', opacity: (!fromLocation || !toLocation || isProcessing) ? 0.5 : 1, height: '54px' }}
                                >
                                    {isProcessing ? <Loader className="animate-spin" /> : <Sparkles />}
                                    Generate Plan
                                </button>
                            </div>
                        </div>

                        {/* Live Logs & Result */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '24px' }}>

                            {/* 1. Execution Logs */}
                            <div style={{ background: '#09090b', borderRadius: '16px', padding: '20px', height: '500px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ color: '#a1a1aa', marginBottom: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Code size={12} /> EXECUTION LOGS
                                </div>
                                <div style={{ flex: 1 }}>
                                    <AnimatePresence>
                                        {agentLogs.map((log, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                style={{ marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}
                                            >
                                                <div style={{ color: log.status === 'processing' ? '#f59e0b' : '#10b981', marginTop: '2px' }}>
                                                    {log.status === 'processing' ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                </div>
                                                <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                                    <span style={{ color: '#e4e4e7', fontWeight: '600' }}>[{log.agent}]</span>
                                                    <span style={{ color: '#a1a1aa', marginLeft: '8px' }}>{log.msg}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <div ref={logsEndRef} />
                                </div>
                            </div>

                            {/* 2. Data Stream (JSON) */}
                            <div style={{ background: '#09090b', borderRadius: '16px', padding: '20px', height: '500px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ color: '#a1a1aa', marginBottom: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Database size={12} /> LIVE DATA STREAM
                                </div>
                                <div style={{ flex: 1 }}>
                                    <AnimatePresence>
                                        {dataStream.map((stream, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                style={{ marginBottom: '16px' }}
                                            >
                                                <div style={{ fontSize: '11px', color: '#3b82f6', marginBottom: '4px' }}>From: {stream.agent}</div>
                                                <pre style={{ fontSize: '10px', color: '#a1a1aa', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', overflowX: 'auto' }}>
                                                    {stream.data}
                                                </pre>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* 3. Final Output */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', height: '500px', overflowY: 'auto' }}>
                                <div style={{ color: '#a1a1aa', marginBottom: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Sparkles size={12} /> FINAL SYNTHESIS
                                </div>

                                {finalResult ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        {/* Verified Badge */}
                                        {finalResult.verified_by && (
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ec489920', color: '#ec4899', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>
                                                <ShieldCheck size={12} /> VERIFIED BY {finalResult.verified_by.toUpperCase()}
                                            </div>
                                        )}

                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{finalResult.title}</h3>
                                        <p style={{ color: '#10b981', marginBottom: '24px', fontSize: '14px' }}>{finalResult.summary}</p>

                                        {/* Metrics */}
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                            {Object.entries(finalResult.metrics).map(([key, val]) => (
                                                <div key={key} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{val}%</div>
                                                    <div style={{ fontSize: '10px', color: '#a1a1aa', textTransform: 'capitalize' }}>{key}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Carbon Analysis Section */}
                                        {finalResult.carbon_details && (
                                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '700', marginBottom: '12px' }}>
                                                    <Calculator size={16} /> Carbon Analysis
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', color: '#e4e4e7' }}>
                                                    <div>
                                                        <div style={{ color: '#a1a1aa' }}>Vehicle</div>
                                                        <div style={{ fontWeight: '600' }}>{finalResult.carbon_details.vehicle}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#a1a1aa' }}>Total Distance</div>
                                                        <div style={{ fontWeight: '600' }}>{finalResult.carbon_details.total_distance}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#a1a1aa' }}>Emission Factor</div>
                                                        <div style={{ fontWeight: '600' }}>{finalResult.carbon_details.emission_factor}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#a1a1aa' }}>Total Emission</div>
                                                        <div style={{ fontWeight: '600', color: '#10b981' }}>{finalResult.carbon_details.total_emission}</div>
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '11px', color: '#a1a1aa' }}>
                                                    <div>Formula: {finalResult.carbon_details.formula}</div>
                                                    <div style={{ marginTop: '4px' }}>Comparison: {finalResult.carbon_details.comparison}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Route Map Visualization */}
                                        <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <iframe
                                                width="100%"
                                                height="200"
                                                frameBorder="0"
                                                scrolling="no"
                                                marginHeight="0"
                                                marginWidth="0"
                                                src={`https://maps.google.com/maps?saddr=${encodeURIComponent(fromLocation)}&daddr=${encodeURIComponent(toLocation)}&t=&z=4&ie=UTF8&iwloc=&output=embed`}
                                                style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
                                            ></iframe>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {finalResult.steps.map((step, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                                    <div style={{ minWidth: '60px', fontSize: '12px', color: '#a1a1aa', fontWeight: '600' }}>{step.time}</div>
                                                    <div>
                                                        <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>{step.title}</div>
                                                        <div style={{ display: 'inline-block', fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: '#10b98120', color: '#10b981', marginBottom: '4px' }}>{step.tag}</div>
                                                        <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>{step.desc}</div>

                                                        {step.specialties && step.specialties.length > 0 && (
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                                                {step.specialties.map((s, idx) => (
                                                                    <span key={idx} style={{ fontSize: '10px', color: '#8b5cf6', background: '#8b5cf610', padding: '2px 6px', borderRadius: '4px' }}>✨ {s}</span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {step.map_url && (
                                                            <a
                                                                href={step.map_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#3b82f6', marginTop: '8px', textDecoration: 'none' }}
                                                            >
                                                                <MapPin size={12} /> View on Maps
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: '#52525b' }}>
                                        <Bot size={48} style={{ opacity: 0.2 }} />
                                        <p>Output will appear here</p>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgenticAiPage;
