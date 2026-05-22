import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Leaf,
    TrendingDown,
    Car,
    Train,
    Bus,
    Footprints,
    Bike,
    BarChart3,
    Award,
    Globe,
    Zap,
    ArrowDown,
    Minus
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const CarbonDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const userID = "user_001"; // Hardcoded for demo until Auth is built

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch user stats from User API
                const response = await fetch(`http://localhost:8000/api/users/${userID}/stats`);
                const data = await response.json();

                // Fetch carbon specific data (mocking the chart data structure from the stats)
                setStats({
                    totalCarbon: parseInt(data.total_carbon_saved),
                    savedCarbon: parseInt(data.total_carbon_saved),
                    avgTouristCarbon: parseInt(data.total_carbon_saved) * 2, // Mock comparison
                    breakdown: [
                        { name: 'Transport', value: 45, color: '#10b981' }, // Data derived/mocked for visual
                        { name: 'Accommodation', value: 30, color: '#3b82f6' },
                        { name: 'Food', value: 15, color: '#f59e0b' },
                        { name: 'Activities', value: 10, color: '#8b5cf6' }
                    ],
                    dailyData: [
                        { day: 'Day 1', carbon: 8, avg: 15 },
                        { day: 'Day 2', carbon: 12, avg: 18 },
                        { day: 'Day 3', carbon: 5, avg: 14 },
                        { day: 'Day 4', carbon: 15, avg: 20 },
                        { day: 'Day 5', carbon: 5, avg: 12 }
                    ],
                    transportModes: [
                        { mode: 'Train', carbon: 8, percentage: 35, icon: Train },
                        { mode: 'Electric Bus', carbon: 6, percentage: 25, icon: Bus },
                        { mode: 'Walking', carbon: 0, percentage: 25, icon: Footprints },
                        { mode: 'Cycle', carbon: 0, percentage: 10, icon: Bike }
                    ]
                });
            } catch (err) {
                console.error("Failed to fetch carbon stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Loading State
    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            Crunching Carbon Numbers...
        </div>
    );

    // Fallback if fetch failed
    const tripData = stats || {
        totalCarbon: 0, savedCarbon: 0, avgTouristCarbon: 0,
        breakdown: [], dailyData: [], transportModes: []
    };

    const savingsPercentage = tripData.avgTouristCarbon > 0
        ? Math.round((tripData.savedCarbon / tripData.avgTouristCarbon) * 100)
        : 0;

    const ecoAchievements = [
        { icon: Leaf, title: 'Eco Explorer', desc: 'Completed 5 low-carbon trips', earned: true },
        { icon: Train, title: 'Rail Rider', desc: 'Used trains for 80% of travel', earned: true },
        { icon: Footprints, title: 'Walking Wonder', desc: '50km covered on foot', earned: true },
        { icon: Globe, title: 'Planet Protector', desc: 'Saved 100kg CO₂', earned: false },
        { icon: Bike, title: 'Cycle Champion', desc: 'Used cycling for local travel', earned: false }
    ];

    const containerStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
    };

    const statCardStyle = {
        background: 'rgba(24, 24, 27, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '20px',
        padding: '24px'
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}>
                    <p style={{ color: 'white', fontWeight: '500', marginBottom: '4px' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, fontSize: '14px' }}>
                            {entry.name}: {entry.value} kg CO₂
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={containerStyle}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '48px' }}
                >
                    <span className="badge badge-eco" style={{ marginBottom: '16px' }}>
                        <BarChart3 style={{ width: '12px', height: '12px' }} />
                        Carbon Tracker
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '12px' }}>
                        <span style={{ color: 'white' }}>Your </span>
                        <span className="gradient-text">Carbon Dashboard</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#9ca3af' }}>
                        Track, analyze, and reduce your travel carbon footprint.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}
                >
                    {/* Total Carbon */}
                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Leaf style={{ width: '24px', height: '24px', color: 'white' }} />
                            </div>
                            <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ArrowDown style={{ width: '16px', height: '16px' }} />
                                38%
                            </span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{tripData.totalCarbon} kg</div>
                        <div style={{ color: '#71717a', fontSize: '14px' }}>Total Carbon Emissions</div>
                    </div>

                    {/* Carbon Saved */}
                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingDown style={{ width: '24px', height: '24px', color: 'white' }} />
                            </div>
                            <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Zap style={{ width: '16px', height: '16px' }} />
                                Great!
                            </span>
                        </div>
                        <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{tripData.savedCarbon} kg</div>
                        <div style={{ color: '#71717a', fontSize: '14px' }}>Carbon Saved</div>
                    </div>

                    {/* Average Tourist */}
                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Globe style={{ width: '24px', height: '24px', color: 'white' }} />
                            </div>
                            <span style={{ color: '#71717a', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Minus style={{ width: '16px', height: '16px' }} />
                                Avg
                            </span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{tripData.avgTouristCarbon} kg</div>
                        <div style={{ color: '#71717a', fontSize: '14px' }}>Average Tourist Emissions</div>
                    </div>

                    {/* Better Than Average */}
                    <div style={{ ...statCardStyle, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Award style={{ width: '24px', height: '24px', color: 'white' }} />
                            </div>
                            <span style={{ color: '#a78bfa', fontSize: '14px', fontWeight: '500' }}>Top 15%</span>
                        </div>
                        <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{savingsPercentage}%</div>
                        <div style={{ color: '#71717a', fontSize: '14px' }}>Better Than Average</div>
                    </div>
                </motion.div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    {/* Daily Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card"
                        style={{ padding: '24px' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '24px' }}>Daily Carbon Comparison</h3>
                        <div style={{ height: '240px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={tripData.dailyData}>
                                    <defs>
                                        <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="avg" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAvg)" name="Average Tourist" />
                                    <Area type="monotone" dataKey="carbon" stroke="#10b981" fillOpacity={1} fill="url(#colorCarbon)" name="Your Trip" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Your Trip</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Average Tourist</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card"
                        style={{ padding: '24px' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '24px' }}>Emissions Breakdown</h3>
                        <div style={{ height: '240px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={tripData.breakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {tripData.breakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
                            {tripData.breakdown.map((item) => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }} />
                                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>{item.name}: {item.value} kg</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Transport Modes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card"
                    style={{ padding: '24px', marginBottom: '32px' }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '24px' }}>Transport Modes Used</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                        {tripData.transportModes.map((transport) => {
                            const Icon = transport.icon;
                            return (
                                <div key={transport.mode} style={{ textAlign: 'center', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
                                    <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon style={{ width: '24px', height: '24px', color: '#10b981' }} />
                                    </div>
                                    <div style={{ color: 'white', fontWeight: '500', marginBottom: '4px' }}>{transport.mode}</div>
                                    <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '700' }}>{transport.percentage}%</div>
                                    <div style={{ fontSize: '12px', color: '#71717a' }}>{transport.carbon} kg CO₂</div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card"
                    style={{ padding: '24px' }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '24px' }}>Eco Achievements</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                        {ecoAchievements.map((achievement) => {
                            const Icon = achievement.icon;
                            return (
                                <div
                                    key={achievement.title}
                                    style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        background: achievement.earned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                                        border: achievement.earned ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                                        opacity: achievement.earned ? 1 : 0.5
                                    }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        margin: '0 auto 12px',
                                        borderRadius: '16px',
                                        background: achievement.earned ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon style={{ width: '28px', height: '28px', color: 'white' }} />
                                    </div>
                                    <div style={{ color: 'white', fontWeight: '500', marginBottom: '4px' }}>{achievement.title}</div>
                                    <div style={{ fontSize: '12px', color: '#71717a' }}>{achievement.desc}</div>
                                    {achievement.earned && (
                                        <span style={{
                                            display: 'inline-block',
                                            marginTop: '8px',
                                            padding: '4px 12px',
                                            borderRadius: '100px',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            color: '#10b981',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            Earned!
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CarbonDashboardPage;
