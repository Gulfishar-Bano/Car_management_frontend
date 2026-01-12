import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookings";
import "./Booking.css";
import confetti from 'canvas-confetti';
import MockPaymentGateway from "./Payment";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride || {};

  const [userDetails, setUserDetails] = useState({ Name: "", Email: "", Date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isBookingCreated, setIsBookingCreated] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);
  const [finalAmount, setFinalAmount] = useState(0);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const fireCelebration = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({ 
        ...defaults, 
        particleCount, 
        colors: ['#007bff', '#ffffff'],
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        colors: ['#007bff', '#ffffff'],
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      });
    }, 250);
  };

  const handleBooking = async () => {
  setError("");
  if (!userDetails.Name || !userDetails.Email || !userDetails.Date) {
    setError("All fields are required.");
    return;
  }

  
  const payload = {
    Name: userDetails.Name,
    Email: userDetails.Email,
    PickUpLocation: ride.FromLocation,
    DropLocation: ride.ToLocation,
    Date: userDetails.Date,
    carId: ride.car?.id || ride.car?._id,
    fareId: ride.fareId || ride.id,
  };

  try {
    setLoading(true);
    const response = await createBooking(payload);
    const booking = response.data || response;   // support both formats

if (booking.id) {
  setConfirmedBookingId(booking.id);
  setFinalAmount(ride.finalFare || ride.fare);
  setIsBookingCreated(true);
}
    
   
  } catch (err) {
    setError("Booking failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

 
  return (
    <div className="premium-booking-page">
      <div className="booking-glass-container">
        
        <div className="booking-summary-panel">
          <div className="brand-badge">Carisma Luxury</div>
          <h2>Reservation Summary</h2>
          
          <div className="summary-details">
            <div className="detail-item">
              <span>Route</span>
              <p>{ride.FromLocation || "Not Selected"} → {ride.ToLocation || "Not Selected"}</p>
            </div>
            <div className="detail-item">
              <span>Selected Vehicle</span>
              <p>{ride.car?.model || "Premium Sedan"}</p>
            </div>
            <div className="detail-item">
              <span>Service Type</span>
              <p>Chauffeur Driven</p>
            </div>
          </div>

          <div className="price-breakdown">
            <div className="total-row">
              <span>Total Investment</span>
              <p>₹{ride.finalFare || ride.fare || "0"}</p>
            </div>
          </div>
        </div>

        <div className="booking-form-panel">
          <h3>Personal Details</h3>
          <p className="form-subtitle">Complete your luxury booking below.</p>

          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" name="Name" placeholder="Enter your name"
              value={userDetails.Name} onChange={handleChange} 
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" name="Email" placeholder="name@example.com"
              value={userDetails.Email} onChange={handleChange} 
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label>Pickup Date & Time</label>
            <input 
              type="datetime-local" name="Date"
              value={userDetails.Date} onChange={handleChange} 
            />
          </div>

          {error && <div className="error-pill">{error}</div>}

          {/* RESTORED BUTTON */}
          <button 
            className="confirm-booking-btn" 
            onClick={handleBooking} 
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Reservation"}
          </button>
        </div>

        {/* Modal appears when isBookingCreated is true */}
        {isBookingCreated && (
          <MockPaymentGateway 
            amount={finalAmount}
            onCancel={() => setIsBookingCreated(false)}
            onVerify={() => {
               setIsBookingCreated(false);
               fireCelebration();
               setTimeout(() => {
                 navigate(`/voucher/${confirmedBookingId}`);
               }, 2500);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Booking;