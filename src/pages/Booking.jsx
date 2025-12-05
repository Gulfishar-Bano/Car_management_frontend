import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookings";
import "./Booking.css";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ride = location.state?.ride || {}; 

  console.log("Ride received:", ride);

  const [userDetails, setUserDetails] = useState({
    Name: "",
    Email: "",
    Date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    setError("");

    // 1. Basic validation check
    if (!userDetails.Name || !userDetails.Email || !userDetails.Date) {
      setError("Please fill all required fields.");
      return;
    }
    
    // 2. Extract Car ID and Fare ID from the received ride object
    const carId = ride.car?.id;
    // Assuming the fare ID is stored directly on the 'ride' object, 
    // perhaps from the search result.
    const fareId = ride.fareId || ride.id; 

    // 3. Add validation for the required hidden IDs
    if (!carId || !fareId) { 
      setError("Missing car selection or fare details. Please go back and try again.");
      return;
    }

    // 4. Construct the Payload
    const payload = {
      Name: userDetails.Name,
      Email: userDetails.Email,
      PickUpLocation: ride.FromLocation,
      DropLocation: ride.ToLocation,
      Date: userDetails.Date, 
      
      // ✅ Corrected fields for the Backend DTO
      carId: carId,       
      fareId: fareId,    
    };

    console.log("Payload sent:", payload);

    // 5. API Call and Navigation
    try {
      setLoading(true);
      const response = await createBooking(payload);
      console.log("Booking response:", response);

      const bookingId = response.id;
      
      if (!bookingId) {
        setError("Booking ID missing from backend.");
        return;
      }
      
      navigate(`/voucher/${bookingId}`, {
        state: { bookingId },
      });

    } catch (err) {
      console.error("Booking error:", err);
     
      setError(err.response?.data?.message || "Could not complete booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <h2>Confirm Your Booking</h2>

      <div className="ride-summary">
        <p><strong>From:</strong> {ride.from || "N/A"}</p>
        <p><strong>To:</strong> {ride.to || "N/A"}</p>
        <p><strong>Car Model:</strong> {ride.car?.model || "N/A"}</p>
        {/* Displaying the fare value, even though we send the fare ID */}
        <p><strong>Total Fare:</strong> ₹{ride.finalFare || ride.fare || "N/A"}</p>
      </div>

      <div className="booking-form">
      
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={userDetails.Name}
          onChange={handleChange}
        />

       
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={userDetails.Email}
          onChange={handleChange}
        />

      
        <input
          type="datetime-local"
          name="Date"
          value={userDetails.Date}
          onChange={handleChange}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button className="confirm-btn" onClick={handleBooking} disabled={loading}>
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default Booking;