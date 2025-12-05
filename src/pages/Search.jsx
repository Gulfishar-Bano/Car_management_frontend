import React, { useState } from "react";
import axios from "axios";
import "./Search.css";

const Search = () => {
  const [fromLoc, setFrom] = useState("");
  const [toLoc, setTo] = useState("");
  const [date, setDate] = useState("");
  const [ac, setAc] = useState("");
  const [carTypeId, setCarTypeId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [suggestions, setSuggestions] = useState([]);

  
  const handleFromChange = async (e) => {
    const value = e.target.value;
      console.log("Typing:", value);
    setFrom(value);

    if (value.length >= 2) {
      try {
            console.log("Calling autocomplete API..."); 
        const res = await axios.get(`${BASE_URL}/search/autocomplete`, {
          params: { name: value },
        });
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
  };

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/search`, {
        fromLoc,
        toLoc,
        date,
        ac: ac === "yes",
        carTypeId: carTypeId ? Number(carTypeId) : undefined,
      });

      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert("Search failed");
    }

    setLoading(false);
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Find Your Ride</h2>

      <form className="search-form" onSubmit={handleSearch}>
        
        {/* FROM LOCATION */}
       <div className="input-wrapper">
  <input
    type="text"
    placeholder="From Location"
    value={fromLoc}
    
  onChange={(e) => {
        console.log("INLINE TEST SUCCESS:", e.target.value);
        setFrom(e.target.value);
    }}
    required
  />

  {suggestions.length > 0 && (
    <ul className="suggestions-list">
      {suggestions.map((item, index) => (
        <li
          key={index}
          onClick={() => {
            setFrom(item.location);
            setSuggestions([]);
          }}
        >
          {item.location}
        </li>
      ))}
    </ul>
  )}
</div>

        TO LOCATION
        <input
          type="text"
          placeholder="To Location"
          value={toLoc}
          onChange={handleToChange}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <select value={ac} onChange={(e) => setAc(e.target.value)}>
          <option value="">AC Preference</option>
          <option value="yes">AC</option>
          <option value="no">Non-AC</option>
        </select>

       

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="cards-container">
          <h3>Available Rides</h3>

          <div className="card-grid">
            {results.map((item, index) => (
              <div className="ride-card" key={index}>
                <img
                  src={`${BASE_URL}${item.car?.imageUrl}`}
                  alt="car"
                  className="car-image"
                />

                <div className="card-content">
                  <h4>{item.car?.model}</h4>
                  <p><strong>Car No:</strong> {item.car?.carNo}</p>
                  <p><strong>AC:</strong> {item.car?.ac ? "Yes" : "No"}</p>
                  <p><strong>Seats:</strong> {item.car?.seats}</p>
                  <p><strong>Base Fare:</strong> ₹{item.fare}</p>
                  <p><strong>Final Fare:</strong> ₹{item.finalFare}</p>
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>Token:</strong> {item.token}</p>

                  <button className="book-button">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && (
        <p className="no-results">No results yet — search something 😊</p>
      )}
    </div>
  );
};

export default Search;
