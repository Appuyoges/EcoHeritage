import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { Map, Leaf, Users, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMapPage = () => {
    const [tooltipContent, setTooltipContent] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/sites');
                const data = await response.json();
                // Transform API data to map markers
                const siteMarkers = data.sites.filter(site => site.coordinates).map(site => ({
                    markerOffset: -15,
                    name: site.name,
                    coordinates: [site.coordinates.lng, site.coordinates.lat], // GeoJSON uses [lng, lat]
                    sustainability: site.sustainability
                }));
                setMarkers(siteMarkers);
            } catch (error) {
                console.error("Failed to fetch map data:", error);
            }
        };
        fetchSites();
    }, []);

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
                        Interactive Map
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '12px' }}>
                        <span style={{ color: 'white' }}>Explore </span>
                        <span className="gradient-text">Global Heritage</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#9ca3af' }}>
                        Discover sustainable heritage sites around the world.
                    </p>
                </motion.div>

                {/* Map Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card"
                    style={{ padding: '24px', height: '70vh', position: 'relative', overflow: 'hidden' }}
                >
                    <ComposableMap projection="geoMercator" projectionConfig={{ scale: 800, center: [78, 22] }}>
                        <ZoomableGroup>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="#27272a"
                                            stroke="#3f3f46"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none" },
                                                hover: { fill: "#3f3f46", outline: "none" },
                                                pressed: { fill: "#10b981", outline: "none" },
                                            }}
                                            onMouseEnter={() => {
                                                setTooltipContent(`${geo.properties.name}`);
                                            }}
                                            onMouseLeave={() => {
                                                setTooltipContent("");
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                            {markers.map(({ name, coordinates, markerOffset, sustainability }) => (
                                <Marker key={name} coordinates={coordinates}>
                                    <circle r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />
                                    <text
                                        textAnchor="middle"
                                        y={markerOffset}
                                        style={{ fontFamily: "system-ui", fill: "white", fontSize: "10px", fontWeight: "600" }}
                                    >
                                        {name}
                                    </text>
                                </Marker>
                            ))}
                        </ZoomableGroup>
                    </ComposableMap>

                    {/* Tooltip */}
                    {tooltipContent && (
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            fontSize: '14px',
                            pointerEvents: 'none'
                        }}>
                            {tooltipContent}
                        </div>
                    )}

                    {/* Legend */}
                    <div style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '24px',
                        background: 'rgba(24, 24, 27, 0.9)',
                        padding: '16px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '2px solid white' }} />
                            <span style={{ color: 'white', fontSize: '14px' }}>Heritage Site</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27272a', border: '1px solid #3f3f46' }} />
                            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Country</span>
                        </div>
                    </div>
                </motion.div>

                {/* Site List */}
                <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {markers.map((site, index) => (
                        <motion.div
                            key={site.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="glass-card"
                            style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Leaf style={{ width: '20px', height: '20px', color: '#10b981' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: 'white' }}>{site.name}</div>
                                    <div style={{ fontSize: '12px', color: '#10b981' }}>{site.sustainability}% Sustainable</div>
                                </div>
                            </div>
                            <Link to="/explore" style={{ color: '#71717a', hover: { color: 'white' } }}>
                                <ArrowRight style={{ width: '20px', height: '20px' }} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorldMapPage;
