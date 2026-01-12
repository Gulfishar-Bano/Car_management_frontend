import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {useAuth} from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth(); 
  const navigate = useNavigate();

 useEffect(() => {
    const fetchBookings = async () => {
      try {
        const targetEmail = user?.email || user?.Email;
        if (!targetEmail) return;

       
        const res = await axios.get(`http://localhost:3001/booking/user/${targetEmail}`);
        
        console.log("Response from server:", res.data);

      
        if (res.data && res.data.results) {
          const rawData = res.data.results;
          
        
          const finalData = Array.isArray(rawData) ? rawData : [rawData];
          setBookings(finalData);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Error fetching bookings", err);
        setBookings([]); 
      }
    };
    fetchBookings();
  }, [user]);
 return (
  <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", padding: "120px 10%", color: "#fff" }}>
    <h2 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>
      My <span style={{ color: "#007bff" }}>Reservations</span>
    </h2>
    
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {bookings.length > 0 ? (
        bookings.map((b, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={b.id} // Changed from b._id to b.id
            style={{ 
              background: "rgba(255,255,255,0.05)", 
              padding: "25px", 
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <p style={{ color: "#007bff", fontSize: "12px", fontWeight: "bold", margin: 0 }}>
                {new Date(b.Date).toLocaleDateString()} at {new Date(b.Date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <h3 style={{ margin: "5px 0" }}>
                {b.PickUpLocation} → {b.DropLocation}
              </h3>
              <p style={{ opacity: 0.6, margin: 0 }}>
                Vehicle: {b.car?.model || "Standard Car"} ({b.car?.carNo})
              </p>
              
            <p style={{ fontSize: "13px", color: "#aaa", marginTop: "5px" }}>
  Driver: {b.driver ? (
    `${b.driver.firstName} ${b.driver.lastName} (${b.driver.phone})`
  ) : (
    <span style={{ fontStyle: "italic", color: "#ffc107" }}>Yet to be assigned</span>
  )}
</p>
            </div>
            <div style={{ textAlign: "right" }}>
              
              <h2 style={{ margin: 0 }}>₹{b.fare?.fare || "----"}</h2>
              <span style={{ 
                fontSize: "12px", 
                color: b.Status === "Confirmed" ? "#28a745" : "#ffc107" 
              }}>
                ● {b.Status}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    {/* VOUCHER SHORTCUT */}
    <button 
      onClick={() =>navigate(`/voucher/${b.id}`)}
       
      style={{
        padding: "8px 15px",
        borderRadius: "8px",
        border: "1px solid #007bff",
        background: "transparent",
        color: "#007bff",
        cursor: "pointer",
        fontSize: "13px",
        transition: "0.3s"
      }}
      onMouseOver={(e) => e.target.style.background = "rgba(0,123,255,0.1)"}
      onMouseOut={(e) => e.target.style.background = "transparent"}
    >
      View Voucher
    </button>

    {/* NEW BOOKING SHORTCUT */}
    <button 
      onClick={() => window.location.href = "/"}
      style={{
        padding: "8px 15px",
        borderRadius: "8px",
        border: "none",
        background: "#007bff",
        color: "#fff",
        cursor: "pointer",
        fontSize: "13px"
      }}
    >
      Book Again
    </button>
  </div>

          </motion.div>
        ))
      ) : (
        <p style={{ opacity: 0.5 }}>No reservations found for your account.</p>
      )}
    </div>
  </div>
);
};

export default MyBookings;