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
  const BASE_URL = "https://carmanagementsystem-production.up.railway.app";

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const response = await axios.post("https://carmanagementsystem-production.up.railway.app/search", {
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
        <input
          type="text"
          placeholder="From Location"
          value={fromLoc}
          onChange={(e) => setFrom(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="To Location"
          value={toLoc}
          onChange={(e) => setTo(e.target.value)}
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

        <input
          type="number"
          placeholder="Car Type ID (optional)"
          value={carTypeId}
          onChange={(e) => setCarTypeId(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results as Cards */}
      {results.length > 0 && (
        <div className="cards-container">
          <h3>Available Rides</h3>

          <div className="card-grid">
            {results.map((item, index) => (
              <div className="ride-card" key={index}>
                
                {/* Car Image */}
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

                  <button className="book-button">
                    Book Now
                  </button>

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
