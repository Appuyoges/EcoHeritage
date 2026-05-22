import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Leaf,
    MapPin,
    Sparkles,
    TrendingDown,
    Users,
    ArrowRight,
    Play,
    Star,
    Zap,
    Globe,
    Shield,
    MessageCircle,
    Route,
    Utensils,
    Map
} from 'lucide-react';

const HomePage = () => {
    const [globalStats, setGlobalStats] = useState({
        "heritage_sites": "...",
        "carbon_saved": "...",
        "travelers": "...",
        "rating": "..."
    });
    const [featuredSites, setFeaturedSites] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Global Stats
                const statsResponse = await fetch('http://localhost:8000/api/users/stats/global');
                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setGlobalStats(statsData);
                }

                // Fetch Featured Sites (limit to 4)
                const sitesResponse = await fetch('http://localhost:8000/api/sites');
                if (sitesResponse.ok) {
                    const sitesData = await sitesResponse.json();
                    const topSites = sitesData.sites
                        .filter(s => s.rating > 4.5) // Simple logic for "Featured"
                        .slice(0, 4)
                        .map(s => ({
                            name: s.name,
                            location: s.location || s.state, // Fallback
                            image: s.image,
                            score: s.sustainability
                        }));
                    setFeaturedSites(topSites);
                }
            } catch (error) {
                console.error("Failed to fetch home data:", error);
            }
        };
        fetchData();
    }, []);

    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Planning',
            description: 'Smart recommendations based on your preferences and travel style.',
            gradient: 'from-violet-500 to-purple-600'
        },
        {
            icon: TrendingDown,
            title: 'Carbon Minimization',
            description: 'Optimize routes to reduce carbon footprint using ACO algorithms.',
            gradient: 'from-emerald-500 to-teal-600'
        },
        {
            icon: Users,
            title: 'Crowd Intelligence',
            description: 'Real-time predictions to help avoid overcrowded destinations.',
            gradient: 'from-amber-500 to-orange-600'
        },
        {
            icon: Utensils,
            title: 'Local Food Trails',
            description: 'Discover authentic cuisines and hidden food gems.',
            gradient: 'from-rose-500 to-pink-600'
        },
        {
            icon: Shield,
            title: 'Sustainability Scoring',
            description: 'Every destination rated using TOPSIS analysis.',
            gradient: 'from-cyan-500 to-blue-600'
        },
        {
            icon: MessageCircle,
            title: 'AI Travel Assistant',
            description: 'Chat naturally to plan your perfect eco-trip.',
            gradient: 'from-indigo-500 to-violet-600'
        }
    ];

    const stats = [
        { value: globalStats.heritage_sites, label: 'Heritage Sites', icon: MapPin },
        { value: globalStats.carbon_saved, label: 'CO₂ Saved', icon: Leaf },
        { value: globalStats.travelers, label: 'Travelers', icon: Users },
        { value: globalStats.rating, label: 'Rating', icon: Star }
    ];

    const sites = featuredSites.length > 0 ? featuredSites : [
        // Fallback or Skeleton would be better, but keeping simple
        { name: 'Loading...', location: '...', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', score: 0 }
    ];

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
    };

    const sectionStyle = {
        padding: '80px 0'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#09090b' }}>

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #115e59 100%)',
                position: 'relative',
                paddingTop: '80px'
            }}>
                {/* Background Elements */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />

                <div style={{ ...containerStyle, position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '100px',
                            color: '#34d399',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '24px'
                        }}>
                            <Zap style={{ width: '16px', height: '16px' }} />
                            AI-Powered Sustainable Tourism
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' }}
                    >
                        <span style={{ color: 'white' }}>Explore the World's </span>
                        <span className="gradient-text">Heritage</span>
                        <br />
                        <span style={{ color: 'white' }}>Travel </span>
                        <span className="gradient-text-accent">Sustainably</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '0 auto 40px' }}
                    >
                        Discover personalized heritage journeys with AI-optimized routes that minimize your carbon footprint while maximizing cultural experiences.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
                    >
                        <Link to="/plan" className="btn-primary" style={{ fontSize: '16px', padding: '16px 32px' }}>
                            Start Planning
                            <ArrowRight style={{ width: '20px', height: '20px' }} />
                        </Link>
                        <Link to="/chat" className="btn-secondary" style={{ fontSize: '16px', padding: '16px 32px' }}>
                            <Play style={{ width: '20px', height: '20px' }} />
                            Try AI Chat
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '80px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}
                    >
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="stats-card">
                                    <Icon style={{ width: '24px', height: '24px', color: '#34d399', margin: '0 auto 8px' }} />
                                    <div className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{stat.label}</div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* New Agents Section */}
            < section style={{ ...sectionStyle, background: '#09090b', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))' }} />
                <div style={containerStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="badge badge-eco" style={{ marginBottom: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <Zap style={{ width: '12px', height: '12px' }} />
                                New Feature
                            </span>
                            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '24px', lineHeight: 1.1 }}>
                                Meet Your <br />
                                <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}>Agentic AI Team</span>
                            </h2>
                            <p style={{ fontSize: '1.125rem', color: '#a1a1aa', marginBottom: '32px', lineHeight: '1.6' }}>
                                Experience the power of 5 specialized autonomous agents working together. From optimizing routes to predicting crowds and finding local food gems.
                            </p>
                            <Link to="/agents" className="btn-primary" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>
                                Launch Agent System
                                <ArrowRight style={{ width: '20px', height: '20px' }} />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}
                        >
                            {[
                                { icon: Map, label: 'Planner', color: '#3b82f6' },
                                { icon: Users, label: 'Crowd', color: '#f59e0b' },
                                { icon: Leaf, label: 'Eco', color: '#10b981' },
                                { icon: Utensils, label: 'Food', color: '#ef4444' }
                            ].map((item, i) => (
                                <div key={i} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                    <item.icon style={{ width: '32px', height: '32px', color: item.color }} />
                                    <div style={{ fontWeight: '600', color: 'white' }}>{item.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Features Section */}
            < section style={{ ...sectionStyle, background: '#09090b' }}>
                <div style={containerStyle}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '64px' }}
                    >
                        <span className="badge badge-eco" style={{ marginBottom: '16px' }}>
                            <Sparkles style={{ width: '12px', height: '12px' }} />
                            Features
                        </span>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '700', marginBottom: '16px' }}>
                            <span style={{ color: 'white' }}>Everything for </span>
                            <span className="gradient-text">Sustainable Travel</span>
                        </h2>
                        <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
                            Our multi-agent AI combines personalization, sustainability, and optimization.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="feature-card"
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '16px',
                                        background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '20px'
                                    }} className={`bg-gradient-to-br ${feature.gradient}`}>
                                        <Icon style={{ width: '28px', height: '28px', color: 'white' }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section >

            {/* Heritage Sites Section */}
            < section style={{ ...sectionStyle, background: '#0f0f11' }}>
                <div style={containerStyle}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '48px' }}
                    >
                        <div>
                            <span className="badge badge-heritage" style={{ marginBottom: '12px' }}>
                                <Globe style={{ width: '12px', height: '12px' }} />
                                Destinations
                            </span>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '700' }}>
                                <span style={{ color: 'white' }}>Popular </span>
                                <span className="gradient-text-accent">Heritage Sites</span>
                            </h2>
                        </div>
                        <Link to="/explore" style={{ color: '#10b981', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            View All Sites
                            <ArrowRight style={{ width: '16px', height: '16px' }} />
                        </Link>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {sites.map((site, index) => (
                            <motion.div
                                key={site.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="heritage-card"
                                style={{ cursor: 'pointer' }}
                            >
                                <div style={{ aspectRatio: '4/5', position: 'relative' }}>
                                    <img src={site.image} alt={site.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 20 }}>
                                        <span className="badge badge-eco">
                                            <Leaf style={{ width: '12px', height: '12px' }} />
                                            {site.score}%
                                        </span>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', zIndex: 20 }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{site.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                            <MapPin style={{ width: '14px', height: '14px' }} />
                                            {site.location}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section style={{ ...sectionStyle, background: '#09090b' }}>
                <div style={{ ...containerStyle, maxWidth: '800px' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card"
                        style={{ padding: '64px 48px', textAlign: 'center' }}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
                        }}>
                            <Leaf style={{ width: '40px', height: '40px', color: 'white' }} />
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '20px' }}>
                            <span style={{ color: 'white' }}>Ready to Travel </span>
                            <span className="gradient-text">Sustainably?</span>
                        </h2>
                        <p style={{ fontSize: '1.125rem', color: '#9ca3af', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                            Join thousands of eco-conscious travelers discovering the world's heritage.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                            <Link to="/plan" className="btn-primary">
                                Plan Your Trip
                                <ArrowRight style={{ width: '20px', height: '20px' }} />
                            </Link>
                            <Link to="/chat" className="btn-accent">
                                <MessageCircle style={{ width: '20px', height: '20px' }} />
                                Chat with AI
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* Footer */}
            < footer style={{ padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ ...containerStyle, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #047857)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf style={{ width: '20px', height: '20px', color: 'white' }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: '700', color: 'white' }}>EcoHeritage</div>
                            <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Sustainable Tourism</div>
                        </div>
                    </div>
                    <div style={{ color: '#71717a', fontSize: '0.875rem' }}>
                        © 2026 EcoHeritage • Made by Yoges for World Heritage
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default HomePage;
