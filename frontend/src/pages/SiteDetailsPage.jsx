import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Star,
    Leaf,
    Users,
    Clock,
    ArrowLeft,
    Calendar,
    Info,
    Camera,
    MessageCircle,
    Share2,
    Heart,
    Bus,
    Train,
    Plane,
    Check
} from 'lucide-react';
import BookingModal from '../components/common/BookingModal';
import PredictiveDashboard from '../components/common/PredictiveDashboard';
import ARScanner from '../components/common/ARScanner';

const SiteDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isAROpen, setIsAROpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchSiteData = async () => {
            try {
                setLoading(true);
                // Ensure id matches the backend expected format (e.g., lower case, underscores if needed)
                // The frontend routing likely passes "Red Fort" or "red_fort". 
                // Using the ID directly is safest if URLs are constructed correctly.
                const response = await fetch(`http://localhost:8000/api/sites/${id}`);

                if (!response.ok) {
                    throw new Error('Site not found');
                }

                const data = await response.json();

                // Transform API data to UI format if necessary or use directly
                // API returns: { id, name, location, image, sustainability, crowd_level, description, eco_tips, ... }
                // UI expects: { id, name, location, image, sustainability, crowdLevel, fullDescription, gallery, ... }

                setSiteData({
                    ...data,
                    // Map API fields to UI expected fields
                    fullDescription: data.description, // API has description
                    crowdLevel: data.crowd_level ? data.crowd_level.charAt(0).toUpperCase() + data.crowd_level.slice(1) : 'Medium',
                    carbonScore: data.sustainability > 90 ? 'Very Low' : 'Low Impact',
                    gallery: [
                        data.image,
                        // Add placeholders if API doesn't have gallery yet
                        'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400',
                        'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400',
                        'https://images.unsplash.com/photo-1518182170546-0766bc6f9213?w=400'
                    ],
                    tags: ['Heritage', 'History', 'Culture', 'Architecture'], // Default tags
                    transport: [ // Mock transport options suitable for India context till API provides it
                        { mode: 'Train', name: 'Indian Railways', carbon: '2kg', time: 'Var', icon: Train },
                        { mode: 'Bus', name: 'Electric Bus', carbon: '1.5kg', time: 'Var', icon: Bus },
                        { mode: 'Car', name: 'EV Taxi', carbon: '3kg', time: 'Var', icon: Bus }
                    ],
                    ecoTips: data.eco_tips || ['Respect local culture', 'Dispose waste responsibly']
                });
            } catch (err) {
                console.error("Error fetching site:", err);
                setError(err.message);
                // Fallback to offline/mock if needed, or just show error
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSiteData();
        }
    }, [id]);

    const containerStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            Loading Heritage Site...
        </div>
    );

    if (error || !siteData) return (
        <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexDirection: 'column', gap: '16px' }}>
            <h2>Site Not Found</h2>
            <Link to="/explore" style={{ color: '#10b981' }}>Back to Explore</Link>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', paddingTop: '80px', paddingBottom: '60px' }}>
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                siteName={siteData.name}
                basePrice={siteData.entry_fee || 50}
            />
            <ARScanner isOpen={isAROpen} onClose={() => setIsAROpen(false)} />

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        style={{
                            position: 'fixed',
                            top: '100px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '100px',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                            fontWeight: '600'
                        }}
                    >
                        <Check style={{ width: '18px', height: '18px' }} />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Image */}
            <div style={{ height: '60vh', position: 'relative', width: '100%' }}>
                <img
                    src={siteData.image}
                    alt={siteData.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #09090b 0%, transparent 80%)' }} />

                <div style={{ ...containerStyle, position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: '40px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '24px', textDecoration: 'none', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '100px', backdropFilter: 'blur(4px)' }}>
                            <ArrowLeft style={{ width: '16px', height: '16px' }} />
                            Back to Explore
                        </Link>

                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
                            <div>
                                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '800', color: 'white', lineHeight: 1.1, marginBottom: '16px' }}>
                                    {siteData.name}
                                </h1>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', color: '#e4e4e7' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin style={{ width: '18px', height: '18px', color: '#10b981' }} />
                                        {siteData.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Star style={{ width: '18px', height: '18px', color: '#fbbf24', fill: '#fbbf24' }} />
                                        {siteData.rating} ({siteData.reviews.toLocaleString()} reviews)
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setIsAROpen(true)}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', cursor: 'pointer' }}
                                    title="Start AR Guide"
                                >
                                    <Camera style={{ width: '20px', height: '20px' }} />
                                </button>
                                <button
                                    onClick={() => showToast("Link copied to clipboard!")}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                                >
                                    <Share2 style={{ width: '20px', height: '20px' }} />
                                </button>
                                <button
                                    onClick={() => showToast("Added to your favorites!")}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                                >
                                    <Heart style={{ width: '20px', height: '20px' }} />
                                </button>
                                <button
                                    className="btn-primary"
                                    style={{ padding: '0 32px' }}
                                    onClick={() => setIsBookingOpen(true)}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div style={containerStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '40px' }}>

                    {/* Main Content */}
                    <div style={{ flex: '2', minWidth: '60%' }}>
                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '32px' }}>
                            {['About', 'Sustainability', 'Transport', 'Reviews', 'Forecast'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    style={{
                                        padding: '16px 0',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === tab.toLowerCase() ? '2px solid #10b981' : '2px solid transparent',
                                        color: activeTab === tab.toLowerCase() ? '#10b981' : '#71717a',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {activeTab === 'about' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '16px' }}>About {siteData.name}</h2>
                                    <p style={{ color: '#a1a1aa', lineHeight: '1.8', marginBottom: '32px' }}>
                                        {siteData.fullDescription}
                                    </p>

                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Gallery</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                                        {siteData.gallery.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`Gallery ${i}`}
                                                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', cursor: 'pointer' }}
                                                onClick={() => showToast("Opening full screen gallery...")}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sustainability' && (
                                <div>
                                    <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                                        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                                            <Leaf style={{ width: '32px', height: '32px', color: '#10b981', margin: '0 auto 12px' }} />
                                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>{siteData.sustainability}%</div>
                                            <div style={{ color: '#a1a1aa', fontSize: '14px' }}>Sustainability Score</div>
                                        </div>
                                        <div style={{ flex: 1, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                                            <Users style={{ width: '32px', height: '32px', color: '#f59e0b', margin: '0 auto 12px' }} />
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{siteData.crowdLevel}</div>
                                            <div style={{ color: '#a1a1aa', fontSize: '14px' }}>Crowd Level</div>
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Eco-Friendly Tips</h3>
                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {siteData.ecoTips.map((tip, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d4d4d8', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
                                                <Check style={{ width: '16px', height: '16px', color: '#10b981' }} />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'transport' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '24px' }}>Getting There Sustainably</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {siteData.transport.map((option, i) => {
                                            const Icon = option.icon;
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Icon style={{ width: '24px', height: '24px', color: 'white' }} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '600', color: 'white' }}>{option.name}</div>
                                                            <div style={{ fontSize: '14px', color: '#a1a1aa' }}>{option.mode} • {option.time}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: '700', color: '#10b981' }}>{option.carbon} CO₂</div>
                                                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Footprint</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '24px' }}>Traveler Reviews</h2>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                                        <MessageCircle style={{ width: '48px', height: '48px', color: '#3f3f46', margin: '0 auto 16px' }} />
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>No reviews yet</h3>
                                        <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>Be the first to leave a review for this sustainable destination.</p>
                                        <button onClick={() => showToast("Review form opening...")} className="btn-secondary">Write a Review</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'forecast' && (
                                <PredictiveDashboard />
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '24px' }}>Plan Your Visit</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Best Time to Visit</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                        <Calendar style={{ width: '16px', height: '16px', color: '#10b981' }} />
                                        {siteData.bestTime}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Opening Hours</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                        <Clock style={{ width: '16px', height: '16px', color: '#10b981' }} />
                                        06:00 AM - 05:30 PM
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Entry Fee</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                        <Info style={{ width: '16px', height: '16px', color: '#10b981' }} />
                                        $45 (Adults)
                                    </div>
                                </div>

                                <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                                <button
                                    className="btn-primary"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => setIsBookingOpen(true)}
                                >
                                    Check Availability
                                </button>
                                <button
                                    onClick={() => showToast("Added to your upcoming trip!")}
                                    className="btn-secondary"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                >
                                    Add to Itinerary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteDetailsPage;
