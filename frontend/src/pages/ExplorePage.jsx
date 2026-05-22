import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Search,
    MapPin,
    Leaf,
    Users,
    Star,
    Grid,
    List,
    Heart,
    Clock,
    ChevronDown,
    Sparkles
} from 'lucide-react';

const ExplorePage = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [sortBy, setSortBy] = useState('sustainability');

    // Dynamic Data Fetching with React Query
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['heritage-sites', selectedRegion, sortBy, searchQuery],
        queryFn: async () => {
            let url = `http://localhost:8000/api/sites/?sort_by=${sortBy}`;
            if (selectedRegion !== 'all') url += `&region=${selectedRegion}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        },
        keepPreviousData: true
    });

    const heritageSites = data?.sites || [];

    const regions = [
        { id: 'all', name: 'All Regions' },
        { id: 'north', name: 'North India' },
        { id: 'south', name: 'South India' },
        { id: 'east', name: 'East India' },
        { id: 'west', name: 'West India' },
        { id: 'central', name: 'Central India' },
        { id: 'northeast', name: 'Northeast India' }
    ];

    const filteredSites = heritageSites;

    const containerStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
    };

    const getCrowdColor = (level) => {
        if (level === 'low') return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
        if (level === 'high') return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
        return { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' };
    };

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={containerStyle}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '40px' }}
                >
                    <span className="badge badge-heritage" style={{ marginBottom: '16px' }}>
                        <Sparkles style={{ width: '12px', height: '12px' }} />
                        Discover India
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '12px' }}>
                        <span style={{ color: 'white' }}>Explore </span>
                        <span className="gradient-text-accent">Heritage Sites</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#9ca3af' }}>
                        Discover India's 40+ UNESCO World Heritage Sites and sustainable destinations.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card"
                    style={{ padding: '24px', marginBottom: '32px' }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                        {/* Search */}
                        <div style={{ flex: '1 1 300px', position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#71717a' }} />
                            <input
                                type="text"
                                placeholder="Search heritage sites..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field"
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>

                        {/* Region Filter */}
                        <div style={{ position: 'relative', minWidth: '180px' }}>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="input-field"
                                style={{ paddingRight: '40px', appearance: 'none', cursor: 'pointer' }}
                            >
                                {regions.map(region => (
                                    <option key={region.id} value={region.id}>{region.name}</option>
                                ))}
                            </select>
                            <ChevronDown style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#71717a', pointerEvents: 'none' }} />
                        </div>

                        {/* Sort */}
                        <div style={{ position: 'relative', minWidth: '180px' }}>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input-field"
                                style={{ paddingRight: '40px', appearance: 'none', cursor: 'pointer' }}
                            >
                                <option value="sustainability">Most Sustainable</option>
                                <option value="rating">Highest Rated</option>
                                <option value="crowd">Least Crowded</option>
                            </select>
                            <ChevronDown style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#71717a', pointerEvents: 'none' }} />
                        </div>

                        {/* View Toggle */}
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
                            <button
                                onClick={() => setViewMode('grid')}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: viewMode === 'grid' ? '#10b981' : 'transparent',
                                    color: viewMode === 'grid' ? 'white' : '#9ca3af'
                                }}
                            >
                                <Grid style={{ width: '20px', height: '20px' }} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: viewMode === 'list' ? '#10b981' : 'transparent',
                                    color: viewMode === 'list' ? 'white' : '#9ca3af'
                                }}
                            >
                                <List style={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#9ca3af' }}>
                            <MapPin style={{ width: '16px', height: '16px', color: '#10b981' }} />
                            <span>{filteredSites.length} sites found</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#9ca3af' }}>
                            <Leaf style={{ width: '16px', height: '16px', color: '#10b981' }} />
                            <span>Avg sustainability: {filteredSites.length > 0 ? Math.round(filteredSites.reduce((a, b) => a + b.sustainability, 0) / filteredSites.length) : 0}%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Loading & Error States */}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ width: '40px', height: '40px', border: '4px solid rgba(16, 185, 129, 0.3)', borderTopColor: '#10b981', borderRadius: '50%', margin: '0 auto' }}
                        />
                    </div>
                )}

                {isError && (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#ef4444' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Error loading sites</h3>
                        <p>Please try again later or check your connection.</p>
                        <button onClick={() => refetch()} className="btn-primary" style={{ marginTop: '16px' }}>Retry</button>
                    </div>
                )}

                {/* Grid */}
                {!isLoading && !isError && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
                        gap: '24px'
                    }}>
                        {filteredSites.map((site, index) => {
                            const crowdStyle = getCrowdColor(site.crowd_level || 'medium');
                            return (
                                <Link to={`/explore/${site.id}`} key={site.id} style={{ textDecoration: 'none', display: 'block' }}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="heritage-card"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div style={{ aspectRatio: viewMode === 'grid' ? '4/5' : '16/6', position: 'relative' }}>
                                            <img
                                                src={site.image}
                                                alt={site.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/800x600/27272a/10b981?text=${encodeURIComponent(site.name)}`;
                                                }}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)', zIndex: 10 }} />

                                            {/* Top Badges */}
                                            <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', zIndex: 20 }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '6px 12px',
                                                    borderRadius: '100px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    background: crowdStyle.bg,
                                                    color: crowdStyle.color
                                                }}>
                                                    <Users style={{ width: '12px', height: '12px' }} />
                                                    {site.crowd_level}
                                                </span>
                                                <span className="badge badge-eco">
                                                    <Leaf style={{ width: '12px', height: '12px' }} />
                                                    {site.sustainability}%
                                                </span>
                                            </div>

                                            {/* Favorite */}
                                            <button style={{
                                                position: 'absolute',
                                                top: '16px',
                                                right: '16px',
                                                zIndex: 30,
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'rgba(0,0,0,0.5)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0.7
                                            }} onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}>
                                                <Heart style={{ width: '20px', height: '20px', color: 'white' }} />
                                            </button>

                                            {/* Content */}
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', zIndex: 20 }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{site.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '12px' }}>
                                                    <MapPin style={{ width: '14px', height: '14px' }} />
                                                    {site.location}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Star style={{ width: '16px', height: '16px', color: '#fbbf24', fill: '#fbbf24' }} />
                                                        <span style={{ color: 'white', fontWeight: '500' }}>{site.rating}</span>
                                                        <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>({site.reviews?.toLocaleString()})</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                                        <Clock style={{ width: '14px', height: '14px' }} />
                                                        {site.best_time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {filteredSites.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '80px 0' }}
                    >
                        <MapPin style={{ width: '64px', height: '64px', color: '#3f3f46', margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>No sites found</h3>
                        <p style={{ color: '#9ca3af' }}>Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;
