import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map,
    Calendar,
    Users,
    ArrowRight,
    Search,
    MapPin,
    Globe,
    Navigation,
    Sparkles
} from 'lucide-react';

// Reusable Autocomplete Component (Same as AgenticAiPage)
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
                <Icon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: label === 'Starting From' ? '#3b82f6' : '#ef4444', width: '18px', zIndex: 10 }} />
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
                        background: '#27272a',
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

const TripPlannerPage = () => {
    const [originCity, setOriginCity] = useState('');
    const [destCity, setDestCity] = useState('');
    const [date, setDate] = useState('');
    const [travelers, setTravelers] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState(null);

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

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('http://localhost:8000/api/trips/plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    destination: destCity,
                    start_date: date || new Date().toISOString().split('T')[0],
                    end_date: "", // Planner agent calculates based on duration usually, or we can add end_date picker
                    travelers: parseInt(travelers),
                    budget_type: "standard",
                    interests: [],
                    eco_preference: "high"
                }),
            });

            if (!response.ok) throw new Error('Failed to generate plan');

            const data = await response.json();

            setGeneratedPlan({
                title: `Eco-Trip to ${data.destination}`,
                carbonFootprint: data.carbon_saved, // Mapping API response to UI
                itinerary: data.days.map(day => ({
                    day: day.day,
                    activity: day.title + ": " + day.places.join(", "),
                    icon: MapPin
                }))
            });
        } catch (error) {
            console.error("Planning error:", error);
            // Fallback to sample for demo if backend is offline/error
            fetch('http://localhost:8000/api/trips/sample')
                .then(res => res.json())
                .then(data => {
                    setGeneratedPlan({
                        title: `Eco-Trip to ${data.destination}`,
                        carbonFootprint: data.carbon_saved,
                        itinerary: data.days.map(day => ({
                            day: day.day,
                            activity: day.title + ": " + day.places.join(", "),
                            icon: MapPin
                        }))
                    });
                })
                .catch(e => console.error("Fallback failed", e));
        } finally {
            setIsGenerating(false);
        }
    };

    const containerStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={containerStyle}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '40px' }}
                >
                    <span className="badge badge-eco" style={{ marginBottom: '16px' }}>
                        <Map style={{ width: '12px', height: '12px' }} />
                        AI Trip Planner
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '12px' }}>
                        <span style={{ color: 'white' }}>Plan Your </span>
                        <span className="gradient-text">Eco-Journey</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
                        Select any destination in India. Our AI optimizes for the lowest carbon footprint.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ flex: 1 }}
                    >
                        {/* Origin Input */}
                        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', position: 'relative', zIndex: 30 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                                    <Navigation style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>Starting From</h3>
                            </div>
                            <LocationCombobox
                                label=""
                                icon={Search}
                                value={originCity}
                                onChange={setOriginCity}
                                options={locations}
                                placeholder="Search City (e.g. Delhi, Mumbai)"
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', margin: '-36px 0', position: 'relative', zIndex: 20 }}>
                            <div style={{ background: '#09090b', padding: '8px', borderRadius: '50%' }}>
                                <div style={{ width: '40px', height: '40px', background: '#27272a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <ArrowRight style={{ transform: 'rotate(90deg)', color: '#71717a' }} />
                                </div>
                            </div>
                        </div>

                        {/* Destination Input */}
                        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
                                    <MapPin style={{ width: '20px', height: '20px', color: '#10b981' }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>Destination</h3>
                            </div>
                            <LocationCombobox
                                label=""
                                icon={Search}
                                value={destCity}
                                onChange={setDestCity}
                                options={locations}
                                placeholder="Search Heritage Site (e.g. Taj Mahal)"
                            />
                        </div>

                        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', position: 'relative', zIndex: 5 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '8px' }}>Travel Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#10b981' }} />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '8px' }}>Travelers</label>
                                    <div style={{ position: 'relative' }}>
                                        <Users style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#10b981' }} />
                                        <select
                                            value={travelers}
                                            onChange={(e) => setTravelers(e.target.value)}
                                            style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none' }}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Travelers</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!destCity || !originCity || isGenerating}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '16px',
                                fontSize: '1.125rem',
                                opacity: (!destCity || !originCity || isGenerating) ? 0.5 : 1,
                                cursor: (!destCity || !originCity || isGenerating) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isGenerating ? (
                                <>
                                    <Sparkles className="animate-spin" style={{ width: '20px', height: '20px' }} />
                                    Generating Itinerary...
                                </>
                            ) : (
                                <>
                                    <Sparkles style={{ width: '20px', height: '20px' }} />
                                    Generate Eco-Plan
                                </>
                            )}
                        </button>
                    </motion.div>

                    {/* Results Placeholder */}
                    <div style={{ flex: 1 }}>
                        {generatedPlan ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card"
                                style={{ padding: '32px', height: '100%' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{generatedPlan.title}</h2>
                                        <div style={{ color: '#10b981', fontWeight: '500' }}>{generatedPlan.carbonFootprint} Carbon Footprint</div>
                                    </div>
                                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                                        <Globe style={{ width: '24px', height: '24px', color: '#10b981' }} />
                                    </div>
                                </div>

                                {/* Route Map Visualization */}
                                <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <iframe
                                        width="100%"
                                        height="200"
                                        frameBorder="0"
                                        scrolling="no"
                                        marginHeight="0"
                                        marginWidth="0"
                                        src={`https://maps.google.com/maps?saddr=${encodeURIComponent(originCity)}&daddr=${encodeURIComponent(destCity)}&t=&z=4&ie=UTF8&iwloc=&output=embed`}
                                        style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
                                    ></iframe>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {generatedPlan.itinerary.map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <div style={{ width: '32px', height: '32px', background: '#27272a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        {item.day}
                                                    </div>
                                                    {i < generatedPlan.itinerary.length - 1 && (
                                                        <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
                                                    )}
                                                </div>
                                                <div style={{ paddingBottom: '24px' }}>
                                                    <div style={{ fontWeight: '600', color: 'white', marginBottom: '4px' }}>Day {item.day}</div>
                                                    <div style={{ color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Icon style={{ width: '16px', height: '16px' }} />
                                                        {item.activity}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '24px', color: '#52525b', flexDirection: 'column', gap: '16px' }}>
                                <Globe style={{ width: '48px', height: '48px', opacity: 0.2 }} />
                                <p>Your itinerary will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripPlannerPage;
