import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookings";
import "./Booking.css";
import confetti from 'canvas-confetti';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride || {};

  const [userDetails, setUserDetails] = useState({ Name: "", Email: "", Date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Function to fire the celebration
  const fireCelebration = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

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

    // 1. Validation
    if (!userDetails.Name || !userDetails.Email || !userDetails.Date) {
      setError("All fields are required to reserve your ride.");
      return;
    }

    const carId = ride.car?.id || ride.car?._id;
    const fareId = ride.fareId || ride.id;

    if (!carId || !fareId) {
      setError("Selection error. Please restart the search.");
      return;
    }

    // 2. Construct Payload
    const payload = {
      Name: userDetails.Name,
      Email: userDetails.Email,
      PickUpLocation: ride.FromLocation,
      DropLocation: ride.ToLocation,
      Date: userDetails.Date,
      carId,
      fareId,
    };

    try {
      setLoading(true);
      const response = await createBooking(payload);
      const bookingId = response.id;

      if (bookingId) {
        // 🎊 Success! Fire celebration
        fireCelebration();

       
        setTimeout(() => {
          navigate(`/voucher/${bookingId}`, { state: { bookingId } });
        }, 2200);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      setError(err.response?.data?.message || "Booking failed. Please check your connection.");
      setLoading(false); // Only stop loading if there is an error
    }
    // Note: setLoading(false) is not in finally because we want the button 
    // to stay "Processing..." during the confetti animation.
  };

  return (
    <div className="premium-booking-page">
      <div className="booking-glass-container">
        {/* Left Side: Summary Card */}
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

        {/* Right Side: Form */}
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

          <button 
            className="confirm-booking-btn" 
            onClick={handleBooking} 
            disabled={loading}
          >
            {loading ? "Processing Reservation..." : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;