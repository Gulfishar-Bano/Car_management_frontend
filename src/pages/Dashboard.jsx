
import React, { useState, useEffect } from "react";
import "../App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

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

  // Get user name from token
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

 const handleSearch = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.get("http://localhost:3001/fare/route", {
      params: {
        from:fromLoc,
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


  return (<div className="container">
   

    {/* Carousel */}
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

    {/* Modern Search Box */}
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
        <input
          type="text"
          placeholder="From Location"
          value={fromLoc}
          onChange={(e) => setFrom(e.target.value)}
          required
          className="input-modern"
        />

        <input
          type="text"
          placeholder="To Location"
          value={ToLoc}
          onChange={(e) => setTo(e.target.value)}
          required
          className="input-modern"
        />

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

        <input
          type="number"
          placeholder="Car Type ID (optional)"
          value={carTypeId}
          onChange={(e) => setCarTypeId(e.target.value)}
          className="input-modern"
        />

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

    {/* No results message */}
    {results.length === 0 && !loading && (
      <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
        No results yet — search something 😊
      </p>
    )}
  </div>
  )


}

export default Dashboard;




