import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Leaf, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

const PredictiveDashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState('May');

    // Mock Data for 30 days
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const crowdData = days.map(d => 40 + Math.random() * 40 + (d % 7 === 0 || d % 7 === 6 ? 20 : 0)); // Higher on weekends
    const carbonData = days.map(d => 30 + Math.random() * 20);

    const getBarHeight = (val) => `${val}%`;
    const getBarColor = (val) => val > 70 ? '#ef4444' : val > 40 ? '#f59e0b' : '#10b981';

    return (
        <div className="glass-card" style={{ padding: '32px', marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge badge-eco">
                            <Leaf style={{ width: '12px', height: '12px' }} />
                            AI Forecast
                        </span>
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>Predictive "Time-Travel" Dashboard</h2>
                    <p style={{ color: '#a1a1aa' }}>AI-driven forecast for Crowd Levels & Carbon Footprint</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {['May', 'June', 'July'].map(m => (
                        <button
                            key={m}
                            onClick={() => setSelectedMonth(m)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '100px',
                                background: selectedMonth === m ? '#10b981' : 'rgba(255,255,255,0.05)',
                                color: selectedMonth === m ? 'white' : '#a1a1aa',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '32px' }}>
                {/* Graph */}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '24px', position: 'relative', height: '300px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                    {days.map((day, i) => (
                        <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', height: '100%', justifyContent: 'flex-end', position: 'relative', group: 'hover' }}>
                            {/* Tooltip (Hidden by default, shown on hover logic would go here in pure CSS or JS) */}

                            {/* Crowd Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: getBarHeight(crowdData[i]) }}
                                transition={{ delay: i * 0.02 }}
                                style={{ width: '100%', background: getBarColor(crowdData[i]), borderRadius: '4px', opacity: 0.8 }}
                            />
                            {/* Carbon Bar (Overlay) */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: getBarHeight(carbonData[i]) }}
                                transition={{ delay: i * 0.02 + 0.5 }}
                                style={{ width: '100%', background: '#3b82f6', borderRadius: '4px', position: 'absolute', bottom: 0, opacity: 0.4 }}
                            />
                        </div>
                    ))}

                    {/* Legend */}
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', padding: '12px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '12px', color: '#e4e4e7' }}>
                            <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '2px' }}></div>
                            Crowd Level
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e4e4e7' }}>
                            <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px', opacity: 0.6 }}></div>
                            Carbon Cost
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '600', marginBottom: '8px' }}>
                            <Sparkles style={{ width: '16px', height: '16px' }} />
                            Smart Recommendation
                        </div>
                        <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Visit Next Tuesday</p>
                        <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Predicted 40% less crowd and lowest carbon rates.</p>
                    </div>

                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '8px' }}>Projected Savings</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>$45</div>
                                <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center' }}>
                                    <ArrowDownRight style={{ width: '12px', height: '12px' }} /> 15% Cost
                                </div>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>12kg</div>
                                <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center' }}>
                                    <ArrowDownRight style={{ width: '12px', height: '12px' }} /> CO₂
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for the icon since I used it above but didn't import it in the component body
import { Sparkles } from 'lucide-react';

export default PredictiveDashboard;
