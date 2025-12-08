import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Search.css";
import ViewerCounter from "../components/ViewerCounter";


const RideCard = ({ item, BASE_URL, handleBook }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="ride-card">
      <img
        src={`${BASE_URL}${item.car?.imageUrl}`}
        alt={item.car?.model || "Car Image"}
        className="car-image"
      />
      
      <div className="card-content">
        <h4>{item.car?.model}</h4>
        <p><strong>Car No:</strong> {item.car?.carNo}</p>
        <p><strong>AC:</strong> {item.car?.ac ? "Yes" : "No"}</p>
        <p><strong>Seats:</strong> {item.car?.noOfSeats}</p>
        <p><strong>Base Fare:</strong> ₹{item.fare}</p>
        <p><strong>Final Fare:</strong> ₹{item.finalFare}</p>

       
        <div style={{ height: '30px', position: 'relative' }}>
        <ViewerCounter 
  carId={item.car?._id || item.car?.id} 
  visible={isHovered}
/>

        </div>

        <button
          className="book-button"
          onMouseEnter={() => setIsHovered(true)}
         npx create-react-app admin-frontend onMouseLeave={() => setIsHovered(false)}
          onClick={() => handleBook(item)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};


const SearchResults = () => {
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
          {results.map((item, index) => (
            <RideCard 
              key={item.car?.id || index} 
              item={item} 
              BASE_URL={BASE_URL} 
              handleBook={handleBook} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;