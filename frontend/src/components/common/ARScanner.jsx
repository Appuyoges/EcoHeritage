import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Volume2, VolumeX, Scan, Info, ChevronRight } from 'lucide-react';

const ARScanner = ({ isOpen, onClose }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            // Fallback for demo if camera fails or is denied
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setScannedData({
                name: "Temple of the Sun",
                era: "15th Century",
                description: "This semi-circular tower was dedicated to Inti, the Sun God. The stonework here is some of the finest in Machu Picchu, showing the importance of this spiritual site.",
                audio: "Playing audio guide..."
            });
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'black', display: 'flex', flexDirection: 'column' }}>
            {/* Camera View */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                />

                {/* Fallback Overlay if no camera (for demo) */}
                <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800) center/cover', opacity: 0.3, zIndex: -1 }} />

                {/* UI Overlays */}
                <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: '100px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Scan style={{ width: '16px', height: '16px', color: '#10b981' }} />
                        AR Mode Active
                    </div>
                    <button onClick={onClose} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>

                {/* Scanning Reticle */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '250px', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981', borderRadius: '4px 0 0 0' }} />
                    <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '4px solid #10b981', borderRight: '4px solid #10b981', borderRadius: '0 4px 0 0' }} />
                    <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981', borderRadius: '0 0 0 4px' }} />
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981', borderRadius: '0 0 4px 0' }} />

                    {isScanning && (
                        <motion.div
                            animate={{ height: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ width: '100%', background: 'linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.5), transparent)', position: 'absolute' }}
                        />
                    )}
                </div>

                {/* Scan Button */}
                {!scannedData && (
                    <div style={{ position: 'absolute', bottom: '40px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={handleScan}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '4px solid white',
                                background: 'transparent',
                                padding: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ width: '100%', height: '100%', background: 'white', borderRadius: '50%' }} />
                        </button>
                    </div>
                )}
            </div>

            {/* Info Panel */}
            <AnimatePresence>
                {scannedData && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        style={{ background: '#18181b', padding: '24px', borderRadius: '24px 24px 0 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{scannedData.name}</h2>
                                <div style={{ color: '#10b981', fontSize: '14px' }}>{scannedData.era}</div>
                            </div>
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        </div>

                        <p style={{ color: '#a1a1aa', lineHeight: '1.6', marginBottom: '24px' }}>
                            {scannedData.description}
                        </p>

                        <button
                            onClick={() => setScannedData(null)}
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Scan Another Object
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ARScanner;
