import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Search.css";
import ViewerCounter from "../components/ViewerCounter";

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
        
        {/* Only render or show when isHovered prop is true */}
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
              e.stopPropagation(); // Stops the card click from firing when booking
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
  const [hoveredCarId, setHoveredCarId] = useState(null); // Track which ID is hovered
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const handleBook = (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue booking.");
      navigate("/login");
      return;
    }
    navigate("/booking", { state: { ride: item } });
  };

  return (
    <div className="results-container">
      <h2>Available Rides</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="card-grid">
          {results.map((item, index) => {
            const carId = item.car?.id || item.car?._id || index;
            return (
              <div 
                key={carId}
                onMouseEnter={() => setHoveredCarId(carId)} // Set ID on hover
                onMouseLeave={() => setHoveredCarId(null)}  // Clear on leave
              >
                <RideCard 
                  item={item} 
                  BASE_URL={BASE_URL} 
                  handleBook={handleBook}
                  isHovered={hoveredCarId === carId} // Pass comparison as prop
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

