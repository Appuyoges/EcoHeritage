import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf,
    Map,
    MessageCircle,
    User,
    Menu,
    X,
    Compass,
    BarChart3,
    Sparkles,
    Users,
    Bot
} from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'Home', icon: Compass },
        { path: '/agents', label: 'AI Agents', icon: Bot },
        { path: '/plan', label: 'Plan Trip', icon: Map },
        { path: '/map', label: 'World Map', icon: Compass },
        { path: '/explore', label: 'Explore', icon: Sparkles },
        { path: '/community', label: 'Community', icon: Users },
        { path: '/carbon', label: 'Carbon', icon: BarChart3 },
        { path: '/chat', label: 'AI Chat', icon: MessageCircle },
    ];

    return (
        <>
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    transition: 'all 0.3s ease',
                    backgroundColor: isScrolled ? 'rgba(9, 9, 11, 0.9)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : 'none'
                }}
            >
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

                        {/* Logo */}
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                            <div style={{
                                width: '42px',
                                height: '42px',
                                background: 'linear-gradient(135deg, #10b981, #047857)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                            }}>
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <div style={{ display: 'none' }} className="sm-show">
                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>EcoHeritage</div>
                                <div style={{ fontSize: '11px', color: '#71717a', marginTop: '-2px' }}>Sustainable Tourism</div>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div style={{ display: 'none', alignItems: 'center', gap: '4px' }} className="md-show">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 16px',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s',
                                            color: isActive ? '#10b981' : '#a1a1aa',
                                            background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                            border: isActive ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <Icon style={{ width: '16px', height: '16px' }} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Side */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link
                                to="/profile"
                                style={{
                                    display: 'none',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                                className="md-show"
                            >
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    background: 'linear-gradient(135deg, #fbbf24, #ea580c)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User style={{ width: '14px', height: '14px', color: 'white' }} />
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#e4e4e7' }}>Profile</span>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    cursor: 'pointer',
                                    display: 'block'
                                }}
                                className="md-hide"
                            >
                                {isMobileMenuOpen ? (
                                    <X style={{ width: '20px', height: '20px', color: '#e4e4e7' }} />
                                ) : (
                                    <Menu style={{ width: '20px', height: '20px', color: '#e4e4e7' }} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            position: 'fixed',
                            top: '72px',
                            left: '16px',
                            right: '16px',
                            zIndex: 40,
                            background: 'rgba(24, 24, 27, 0.98)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '12px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                        }}
                        className="md-hide"
                    >
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        textDecoration: 'none',
                                        marginBottom: '4px',
                                        color: isActive ? '#10b981' : '#a1a1aa',
                                        background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                                    }}
                                >
                                    <Icon style={{ width: '20px', height: '20px' }} />
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '8px', paddingTop: '8px' }}>
                            <Link
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    textDecoration: 'none',
                                    color: '#a1a1aa'
                                }}
                            >
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    background: 'linear-gradient(135deg, #fbbf24, #ea580c)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User style={{ width: '14px', height: '14px', color: 'white' }} />
                                </div>
                                My Profile
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CSS for responsive display */}
            <style>{`
                .sm-show { display: block !important; }
                .md-show { display: flex !important; }
                .md-hide { display: block !important; }
                
                @media (max-width: 640px) {
                    .sm-show { display: none !important; }
                }
                
                @media (max-width: 768px) {
                    .md-show { display: none !important; }
                }
                
                @media (min-width: 769px) {
                    .md-hide { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
