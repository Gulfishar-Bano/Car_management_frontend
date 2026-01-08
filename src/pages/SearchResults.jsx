import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Search.css";
import ViewerCounter from "../components/ViewerCounter";
import CarismaMap from "../pages/CarismaMap"; 

const RideCard = ({ item, BASE_URL, handleBook, isHovered }) => {
  return (
    <div className={`ride-stage-card ${isHovered ? 'active' : ''}`}>
      <div className="stage-visual">
        <img
          src={`${BASE_URL}${item.car?.imageUrl}`}
          alt={item.car?.model}
          className="stage-image"
        />
        <div className="stage-overlay"></div>
        {isHovered && (
          <div className="live-viewer-wrapper">
            <ViewerCounter 
              carId={item.car?._id || item.car?.id} 
              visible={true} 
            />
          </div>
        )}
      </div>

      <div className="stage-content">
        <div className="brand-tag">Carisma Premium</div>
        <h3 className="car-model-name">{item.car?.model}</h3>
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Car No</span>
            <span className="spec-value">{item.car?.carNo}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Seats</span>
            <span className="spec-value">{item.car?.noOfSeats} Passengers</span>
          </div>
        </div>

        <div className="booking-footer">
          <div className="price-tag">
            <span className="amount">₹{item.finalFare}</span>
            <span className="per-trip">TOTAL FARE</span>
          </div>
          <button 
            className="book-now-premium" 
            onClick={(e) => {
              e.stopPropagation();
              handleBook(item);
            }}
          >
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const [hoveredCarId, setHoveredCarId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { results = [], pickup, dropoff, fromName, toName } = location.state || {};
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  return (
    <div className="search-page-wrapper" style={{ display: "flex", backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      
      {/* LEFT SIDE: SCROLLABLE LIST */}
      <div className="results-list-side" style={{ flex: "1.2", padding: "40px 5%", overflowY: "auto" }}>
        <div className="results-header" style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#fff", fontSize: "2rem", marginBottom: "5px" }}>Available Rides</h2>
          <p style={{ color: "white", fontSize: "20px" }}>
            {fromName} ➔ {toName}
          </p>
        </div>

        {results.length === 0 ? (
          <p style={{ color: "#fff" }}>No results found.</p>
        ) : (
          <div className="card-grid" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {results.map((item, index) => {
              const carId = item.car?.id || item.car?._id || index;
              return (
                <div 
                  key={carId}
                  onMouseEnter={() => setHoveredCarId(carId)}
                  onMouseLeave={() => setHoveredCarId(null)}
                >
                  <RideCard 
                    item={item} 
                    BASE_URL={BASE_URL} 
                    handleBook={() => navigate("/booking", { state: { ride: item } })}
                    isHovered={hoveredCarId === carId}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT SIDE: STICKY MAP SIDEBAR */}
      <div className="map-sidebar-side" style={{ 
          flex: "0.8", 
          position: "sticky", 
          top: "0", 
          height: "100vh", 
          padding: "20px", 
          display: "flex", 
          flexDirection: "column", 
          overflowY: "auto", // Allows sidebar cards to scroll if needed
          borderLeft: "1px solid rgba(255,255,255,0.1)" 
      }}>
        
        {/* MAP CONTAINER - Fixed Height back to original look */}
        <div style={{ 
            height: "350px", 
            width: "100%", 
            borderRadius: "24px", 
            overflow: "hidden", 
            flexShrink: 0, // Prevents map from squishing
            boxShadow: "0 0 40px rgba(0,0,0,0.5)" 
        }}>
          <CarismaMap pickup={pickup} dropoff={dropoff} />
        </div>

        {/* TRIP INSIGHTS CARD */}
        <div className="trip-insight-card" style={{ 
            marginTop: "20px", 
            padding: "20px", 
            background: "#1a1a1a", 
            borderRadius: "24px", 
            border: "1px solid rgba(255,255,255,0.1)" 
        }}>
          <h4 style={{ color: "#007bff", fontSize: "20px", marginBottom: "15px" }}>TRIP INSIGHTS</h4>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Route</span>
            <span style={{ fontWeight: "600", color: "#007bff" }}>{fromName} to {toName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Date</span>
            <span style={{ color: "#007bff" }}>{new Date().toLocaleDateString()}</span>
          </div>
          <hr style={{ borderColor: "rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <p style={{ fontSize: "16px", color: "#4caf50", margin: 0 }}>
            ✔ Free cancellation until 2 hours before pickup
          </p>
        </div>

        {/* SAFETY FEATURES CARD */}
        <div className="safety-features-card" style={{ 
            marginTop: "20px", 
            padding: "20px", 
            background: "#1a1a1a", 
            borderRadius: "24px", 
            border: "1px solid rgba(0, 123, 255, 0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}>
          <h4 style={{ color: "#007bff", fontSize: "20px", letterSpacing: "1px", marginBottom: "15px" }}>
            CARISMA PROMISE
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "18px", color: "rgba(255,255,255,0.8)" }}>
            <li style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              🛡️ <span><strong>Verified Professional Drivers</strong></span>
            </li>
            <li style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              🧼 <span><strong>Deep Cleaned & Sanitized Cars</strong></span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              💳 <span><strong>Transparent Pricing</strong></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;