import React, { useState, useEffect, useCallback } from "react"; // FIXED
import "../App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import debounce from "lodash.debounce";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const [fromLoc, setFrom] = useState("");
  const [ToLoc, setTo] = useState("");
  const [date, setDate] = useState("");
  const [ac, setAc] = useState("");
  const [carTypeId, setCarTypeId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const slides = [
    {
      img: "https://media.istockphoto.com/id/1344954298/photo/family-with-dog-in-the-car.jpg?s=612x612&w=0&k=20&c=anIzsubkI7wzUiSHC_gUIVyJuSX2KXJ1-Lu5c25CCzA=",
      title: "Welcome to Car Management",
      desc: "Manage your fleet efficiently",
    },
    {
      img: "https://media.istockphoto.com/id/1473771646/photo/a-young-man-buys-a-new-car.jpg?s=612x612&w=0&k=20&c=oLbi2keSg8g8-GSlJQ0wqHz-lAht8rqxaEQyviuyDPk=",
      title: "Add Cars Easily",
      desc: "Book Cars in one click",
    },
    {
      img: "https://media.istockphoto.com/id/1410978545/photo/young-beautiful-woman-traveling-by-car-in-the-mountains-summer-vacation-and-adventure.jpg?s=612x612&w=0&k=20&c=wfQiudz-g1m0EHpjctcdw7g62GwnBrIa5Iax0LJTAGY=",
      title: "Search Rides",
      desc: "Find available rides instantly",
    },
  ];

  const fetchSuggestions = useCallback(
    debounce(async (value, type) => {
      try {
        const res = await axios.get(`${BASE_URL}/search/autocomplete`, {
          params: { name: value },
        });
        
        if (type === "from") {
          setFromSuggestions(res.data);
        } else {
          setToSuggestions(res.data);
        }
      } catch (err) {
        console.error("Autocomplete API failed:", err);
      }
    }, 500), 
    [BASE_URL]
  );

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFrom(value);
    if (value.length >= 2) {
      fetchSuggestions(value, "from");
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setTo(value);
    if (value.length >= 2) {
      fetchSuggestions(value, "to");
    } else {
      setToSuggestions([]);
    }
  };

  useEffect(() => {
    return () => fetchSuggestions.cancel();
  }, [fetchSuggestions]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(BASE_URL + "/fare/route", {
        params: {
          from: fromLoc,
          to: ToLoc,
          date,
          ac: ac === "yes",
          carTypeId: carTypeId ? Number(carTypeId) : undefined,
        },
      });

      setResults(response.data);
      navigate("/search-results", { state: { results: response.data } });
    } catch (error) {
      console.error(error);
      alert("Search failed");
    }

    setLoading(false);
  };

  const SuggestionList = ({ suggestions, setValue, setSuggestions }) => (
    <ul
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "0 0 8px 8px",
        zIndex: 10,
        listStyle: "none",
        padding: 0,
        margin: 0,
        maxHeight: "200px",
        overflowY: "auto",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {suggestions.map((item, index) => (
        <li
          key={index}
          onClick={() => {
            setValue(item.location);
            setSuggestions([]); 
          }}
          style={{
            padding: "10px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
        >
          {item.location}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        style={{
          width: "100%",
          height: "500px",
          marginBottom: "30px",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                backgroundImage: `url(${slide.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                textShadow: "2px 2px 5px rgba(0,0,0,0.6)",
              }}
            >
              <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>
                {slide.title}
              </h2>
              <p style={{ fontSize: "20px" }}>{slide.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "25px",
          borderRadius: "12px",
          background: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Find Your Ride
        </h2>

        <form
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
          onSubmit={handleSearch}
        >
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="From Location"
              value={fromLoc}
              onChange={handleFromChange}
              required
              className="input-modern"
            />
            {fromSuggestions.length > 0 && (
              <SuggestionList 
                suggestions={fromSuggestions}
                setValue={setFrom}
                setSuggestions={setFromSuggestions}
              />
            )}
          </div>
          
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="To Location"
              value={ToLoc}
              onChange={handleToChange}
              required
              className="input-modern"
            />
            {toSuggestions.length > 0 && (
              <SuggestionList 
                suggestions={toSuggestions}
                setValue={setTo}
                setSuggestions={setToSuggestions}
              />
            )}
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input-modern"
          />

          <select
            value={ac}
            onChange={(e) => setAc(e.target.value)}
            className="input-modern"
          >
            <option value="">AC Preference</option>
            <option value="yes">AC</option>
            <option value="no">Non-AC</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              gridColumn: "1 / 3",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              background: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {results.length === 0 && !loading && (
        <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
          No results yet — search something 😊
        </p>
      )}
    </div>
  );
};

export default Dashboard;