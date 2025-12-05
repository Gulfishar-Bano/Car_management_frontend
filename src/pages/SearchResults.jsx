import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Search.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  console.log("Search Results Data:", results);

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
            
            <div className="ride-card" key={index}>
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

                <button
                  className="book-button"
                  onClick={() => handleBook(item)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
