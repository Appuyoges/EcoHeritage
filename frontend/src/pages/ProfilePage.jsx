import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Leaf,
    Calendar,
    Trophy,
    Target,
    Zap,
    Globe,
    Camera,
    Settings,
    Edit2,
    Share2,
    Award,
    TrendingUp,
    X,
    CheckCircle,
    Star,
    Heart,
    Wind,
    Sun,
    Tent,
    Twitter,
    Instagram,
    Linkedin,
    ExternalLink
} from 'lucide-react';

// --- Background Component ---
const BackgroundDecor = () => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#09090b' }} />
        <div style={{
            position: 'absolute', top: -100, left: -100, width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)', borderRadius: '50%'
        }} />
        <div style={{
            position: 'absolute', bottom: -100, right: -100, width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)', borderRadius: '50%'
        }} />
    </div>
);

// --- Sub-Components ---

const StatCard = ({ label, value, icon: Icon, color, subtext }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="glass-card"
        style={{
            padding: '24px', borderRadius: '24px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '16px',
                background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color
            }}>
                <Icon size={24} />
            </div>
            {subtext && <span style={{ fontSize: '12px', color: '#a1a1aa', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '100px' }}>{subtext}</span>}
        </div>
        <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', lineHeight: 1.2 }}>{value}</div>
            <div style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>{label}</div>
        </div>
    </motion.div>
);

const ProfilePage = () => {
    const [toast, setToast] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [recentTrips, setRecentTrips] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: '', email: '', bio: '', location: '', twitter: '', instagram: ''
    });

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/users/user_001');
                const userData = await response.json();

                // Fetch parallel data
                const [tripsRes, achRes, leadRes] = await Promise.all([
                    fetch('http://localhost:8000/api/users/user_001/trips'),
                    fetch('http://localhost:8000/api/users/user_001/achievements'),
                    fetch('http://localhost:8000/api/users/leaderboard?limit=5')
                ]);

                if (tripsRes.ok) setRecentTrips((await tripsRes.json()).trips || []);
                if (achRes.ok) setAchievements((await achRes.json()).achievements || []);
                if (leadRes.ok) setLeaderboard((await leadRes.json()).leaderboard || []);

                setUser({
                    ...userData,
                    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600',
                    joined: userData.join_date || 'January 2025',
                    socials: userData.social_links || { twitter: '', instagram: '' }
                });

                setEditForm({
                    name: userData.name,
                    email: userData.email,
                    bio: userData.bio || '',
                    location: userData.location || '',
                    twitter: userData.social_links?.twitter || '',
                    instagram: userData.social_links?.instagram || ''
                });

            } catch (error) {
                console.error("Fetch error:", error);
                showToast("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleSaveProfile = async () => {
        try {
            const updatedUser = {
                ...user,
                name: editForm.name,
                email: editForm.email,
                bio: editForm.bio,
                location: editForm.location,
                social_links: { twitter: editForm.twitter, instagram: editForm.instagram }
            };

            await fetch('http://localhost:8000/api/users/user_001', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });

            setUser(updatedUser);
            setIsEditing(false);
            showToast("Profile Updated!");
        } catch (error) {
            showToast("Update failed");
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', background: '#09090b', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!user) return null;

    const achievementIcons = { Leaf, MapPin, Trophy, Target, Star, Globe, Zap, Heart };

    return (
        <div style={{ minHeight: '100vh', padding: '120px 40px 40px', position: 'relative', color: 'white' }}>
            <BackgroundDecor />

            {/* Grid Layout */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 3fr', gap: '32px', position: 'relative', zIndex: 1 }}>

                {/* --- LEFT COLUMN: IDENTITY --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Identity Card */}
                    <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ position: 'relative', marginBottom: '24px' }}>
                            <img
                                src={user.avatar}
                                alt={user.name}
                                style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #10b981' }}
                            />
                            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#10b981', borderRadius: '50%', padding: '8px', border: '4px solid #09090b' }}>
                                <Camera size={16} />
                            </div>
                        </div>

                        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>{user.name}</h1>
                        <p style={{ color: '#a1a1aa', fontSize: '1rem', marginBottom: '16px' }}>@{user.email.split('@')[0]}</p>

                        {user.bio && (
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', fontSize: '14px', lineHeight: 1.6, color: '#d4d4d8', marginBottom: '24px', width: '100%' }}>
                                "{user.bio}"
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                            <MapPin size={14} color="#10b981" /> {user.location || 'Global Citizen'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', fontSize: '14px', marginBottom: '24px' }}>
                            <Calendar size={14} color="#3b82f6" /> Joined {user.joined}
                        </div>

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                            {user.social_links?.twitter && (
                                <a href="#" className="btn-secondary" style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                    <Twitter size={18} />
                                </a>
                            )}
                            {user.social_links?.instagram && (
                                <a href="#" className="btn-secondary" style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                    <Instagram size={18} />
                                </a>
                            )}
                            <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ height: '40px', padding: '0 20px', borderRadius: '100px', fontSize: '14px' }}>
                                Edit Profile
                            </button>
                        </div>

                        {/* XP Progress */}
                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', fontWeight: '600', color: '#a1a1aa' }}>
                                <span>LEVEL {Math.floor(user.green_points / 1000) + 1}</span>
                                <span style={{ color: '#10b981' }}>{user.green_points % 1000} / 1000 XP</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(user.green_points % 1000) / 10}%` }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mini Leaderboard */}
                    <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Top Travelers</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {leaderboard.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: i === 0 ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 'bold'
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>
                                        {item.name} {item.is_current_user && <span style={{ color: '#10b981' }}>(You)</span>}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#10b981' }}>{item.points} pts</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* --- RIGHT COLUMN: DASHBOARD --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* 1. Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                        <StatCard label="Green Points" value={user.green_points} icon={Zap} color="#f59e0b" subtext="Top 5%" />
                        <StatCard label="CO2 Saved" value={user.carbon_saved} icon={Leaf} color="#10b981" subtext="~12 Trees" />
                        <StatCard label="Trips Completed" value={user.trips_completed} icon={Globe} color="#3b82f6" />
                        <StatCard label="Favorite Sites" value={user.favorite_sites} icon={Heart} color="#ec4899" />
                    </div>

                    {/* 2. Badges Showcase (Bento Box) */}
                    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Recent Achievements</h2>
                            <button className="btn-secondary" style={{ fontSize: '12px', height: '32px', padding: '0 16px' }}>View All</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                            {achievements.map((ach) => {
                                const Icon = achievementIcons[ach.icon] || Trophy;
                                return (
                                    <div key={ach.id} style={{
                                        background: ach.earned ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${ach.earned ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                                        borderRadius: '16px', padding: '20px', textAlign: 'center', opacity: ach.earned ? 1 : 0.6
                                    }}>
                                        <div style={{ width: '40px', height: '40px', margin: '0 auto 12px', background: ach.earned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon size={20} color={ach.earned ? '#10b981' : '#71717a'} />
                                        </div>
                                        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{ach.title}</div>
                                        <div style={{ fontSize: '11px', color: '#a1a1aa' }}>{ach.earned ? ach.earned_date : `${ach.progress}%`}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Journey History */}
                    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>Journey Log</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {recentTrips.map((trip) => (
                                <div key={trip.id} style={{
                                    display: 'flex', gap: '20px', alignItems: 'center',
                                    padding: '20px', background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'background 0.2s'
                                }}>
                                    <img src={trip.image} alt={trip.destination} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{trip.destination}</h3>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <span className="badge badge-eco"><Leaf size={12} /> {trip.carbon_saved}</span>
                                            </div>
                                        </div>
                                        <div style={{ color: '#a1a1aa', fontSize: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <span>{trip.date}</span>
                                            <span>•</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {Array.isArray(trip.sites) ? trip.sites.length : 1} Sites</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* --- MODALS & TOAST --- */}

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', bottom: '40px', right: '40px',
                            background: '#10b981', color: 'black', padding: '12px 24px',
                            borderRadius: '100px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 100
                        }}
                    >
                        <CheckCircle size={18} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card"
                            style={{ width: '500px', maxWidth: '90%', padding: '32px', borderRadius: '24px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Edit Profile</h2>
                                <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>Full Name</label>
                                        <input className="input-field" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>Email</label>
                                        <input className="input-field" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>Bio</label>
                                    <textarea rows="3" value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontFamily: 'inherit' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>Location</label>
                                    <input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>Twitter</label>
                                        <input placeholder="@username" value={editForm.twitter} onChange={e => setEditForm({ ...editForm, twitter: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}>Instagram</label>
                                        <input placeholder="@username" value={editForm.instagram} onChange={e => setEditForm({ ...editForm, instagram: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
                                    </div>
                                </div>
                                <button onClick={handleSaveProfile} className="btn-primary" style={{ marginTop: '16px', justifyContent: 'center' }}>Save Changes</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
