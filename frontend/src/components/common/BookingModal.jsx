import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Train, Plane, Bus, Check, Leaf, CreditCard, ArrowRight } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, siteName, basePrice }) => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        date: '',
        guests: 2,
        transport: 'train',
        paymentMethod: 'card'
    });
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const transportOptions = [
        { id: 'train', label: 'Electric Train', icon: Train, price: 45, carbon: '12kg', time: '3.5h' },
        { id: 'bus', label: 'Eco Bus', icon: Bus, price: 25, carbon: '4kg', time: '5h' },
        { id: 'plane', label: 'Flight', icon: Plane, price: 120, carbon: '140kg', time: '1h' }
    ];

    const totalPrice = (basePrice * bookingData.guests) +
        (transportOptions.find(t => t.id === bookingData.transport)?.price || 0) * bookingData.guests;

    const handleBooking = async () => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStep(3); // Success step
        setIsProcessing(false);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: '#18181b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <X style={{ width: '20px', height: '20px' }} />
                </button>

                {/* Content */}
                <div style={{ padding: '32px' }}>
                    {step === 1 && (
                        <>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                                Book Your Trip
                            </h2>
                            <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>To {siteName}</p>

                            {/* Date & Guests */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#71717a', marginBottom: '8px' }}>Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#10b981' }} />
                                        <input
                                            type="date"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '12px 12px 12px 40px',
                                                background: '#27272a',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#71717a', marginBottom: '8px' }}>Guests</label>
                                    <div style={{ position: 'relative' }}>
                                        <Users style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#10b981' }} />
                                        <select
                                            value={bookingData.guests}
                                            onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                                            style={{
                                                width: '100%',
                                                padding: '12px 12px 12px 40px',
                                                background: '#27272a',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                outline: 'none',
                                                appearance: 'none'
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(n => (
                                                <option key={n} value={n}>{n} Guests</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Transport */}
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#71717a', marginBottom: '12px' }}>Select Transport</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {transportOptions.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = bookingData.transport === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setBookingData({ ...bookingData, transport: option.id })}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '16px',
                                                    background: isSelected ? 'rgba(16, 185, 129, 0.1)' : '#27272a',
                                                    border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Icon style={{ width: '20px', height: '20px', color: isSelected ? '#10b981' : '#a1a1aa' }} />
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: 'white', fontSize: '14px' }}>{option.label}</div>
                                                        <div style={{ fontSize: '12px', color: '#71717a' }}>{option.time} • {option.carbon} CO₂</div>
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: '600', color: 'white' }}>+${option.price}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!bookingData.date}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    opacity: !bookingData.date ? 0.5 : 1,
                                    cursor: !bookingData.date ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Continue to Payment (${totalPrice})
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '24px' }}>
                                Payment
                            </h2>

                            <div style={{ background: '#27272a', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#a1a1aa', fontSize: '14px' }}>
                                    <span>Entry Tickets ({bookingData.guests}x)</span>
                                    <span>${basePrice * bookingData.guests}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#a1a1aa', fontSize: '14px' }}>
                                    <span>Transport ({bookingData.guests}x)</span>
                                    <span>${(transportOptions.find(t => t.id === bookingData.transport)?.price || 0) * bookingData.guests}</span>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'white', fontSize: '18px' }}>
                                    <span>Total</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={isProcessing}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {isProcessing ? 'Processing...' : `Pay $${totalPrice}`}
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                            >
                                Back
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <Check style={{ width: '40px', height: '40px', color: 'white' }} />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', marginBottom: '12px' }}>
                                Booking Confirmed!
                            </h2>
                            <p style={{ color: '#a1a1aa', marginBottom: '32px' }}>
                                Your trip to {siteName} has been booked successfully.
                            </p>

                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '100px', color: '#10b981', marginBottom: '32px' }}>
                                <Leaf style={{ width: '16px', height: '16px' }} />
                                <span>You saved 24kg CO₂ with this trip!</span>
                            </div>

                            <button
                                onClick={onClose}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                View Itinerary
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BookingModal;
