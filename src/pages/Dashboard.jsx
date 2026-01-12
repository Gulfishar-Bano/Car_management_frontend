import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CarismaMap from "./CarismaMap";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Swiper Styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Dashboard = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

  // --- STATES ---
  const [fromLoc, setFrom] = useState("");
  const [toLoc, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [popularDestinations, setPopularDestinations] = useState([]);

  // AI Chat States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", text: "Hello! I'm Carisma AI. Need help finding the perfect ride?" }
  ]);

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  const updateMapLocation = async (locationText, type) => {
    if (!locationText) return;
    const regionalSearch = `${locationText}, Bangalore, Karnataka, India`;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { format: 'json', q: regionalSearch, limit: 1 }
      });
      
      if (response.data.length > 0) {
        const result = response.data[0];
        const newCoords = { lat: Number(result.lat), lng: Number(result.lon) };
        if (type === "from") setPickupCoords(newCoords);
        else if (type === "to") setDropoffCoords(newCoords);
        setMapVisible(true);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/fare/list`);
        const allLocs = response.data.flatMap(item => [item.FromLocation, item.ToLocation]);
        setPopularDestinations([...new Set(allLocs)].filter(Boolean));
      } catch (error) {
        setPopularDestinations(["Bangalore Airport", "Indiranagar", "Koramangala", "Whitefield"]);
      }
    };
    fetchLocations();
  }, [BASE_URL]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!fromLoc || !toLoc) return alert("Please enter both locations");

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/fare/route`, {
        params: { from: fromLoc, to: toLoc },
      });
      // Delay slightly for the cool Lottie animation to be seen
      setTimeout(() => {
        navigate("/search-results", { 
          state: { 
            response: response.data, // Changed results to response to match your backend
            pickup: pickupCoords,
            dropoff: dropoffCoords,
            fromName: fromLoc,
            toName: toLoc
          } 
        });
      }, 1500);
    } catch (error) {
      console.error("Search API failed:", error);
      setLoading(false);
    }
  };

  const handleSelect = (value) => {
  if (activeField === "from") {
    setFrom(value);
    updateMapLocation(value, "from"); // Added "from" as the second argument
  }
  if (activeField === "to") {
    setTo(value);
    updateMapLocation(value, "to");   // Added "to" as the second argument
  }
  setActiveField(null);
};

  // --- Chatbot Logic ---
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatHistory(prev => [...prev, { role: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${BASE_URL}/ai/chat`, { message: userText });
      setChatHistory(prev => [...prev, { role: "ai", text: response.data.reply }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: "ai", text: "I'm having trouble connecting to my backend brain." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* 0. PREMIUM LOTTIE LOADER OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5, 5, 5, 0.95)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <div style={{ width: '300px' }}>
              <DotLottieReact src="https://lottie.host/80404618-97e0-4965-9856-11f67f474028/V8f6k7XyMh.lottie" loop autoplay />
            </div>
            <motion.h2 animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ color: '#007bff', letterSpacing: '4px' }}>
                OPTIMIZING YOUR ROUTE...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <section style={{ position: "relative", height: "90vh", width: "100%", overflow: "hidden" }}>
        <Swiper modules={[Autoplay, EffectFade]} effect="fade" autoplay={{ delay: 4000 }} loop style={{ height: "100%" }}>
          <SwiperSlide style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070")', backgroundSize: "cover", backgroundPosition: "center" }} />
          <SwiperSlide style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070")', backgroundSize: "cover", backgroundPosition: "center" }} />
        </Swiper>

        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, width: "95%", maxWidth: "1100px" }}>
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: "4rem", fontWeight: "800", textAlign: "center", marginBottom: "35px" }}>
            Drive the <span style={{ color: "#007bff" }}>Future.</span>
          </motion.h1>
          
          <div style={{ background: "rgba(15, 15, 15, 0.95)", padding: "30px", borderRadius: "32px", display: "flex", gap: "15px", alignItems: "center", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
             <div style={{ flex: 1, textAlign: "left", position: "relative" }}>
                <label style={{ fontSize: "11px", fontWeight: "800", color: "#007bff" }}>PICKUP</label>
                <input onFocus={() => setActiveField("from")} style={{ background: "#222", border: "none", color: "#fff", padding: "16px", borderRadius: "16px", width: "100%", outline: "none" }} placeholder="Where from?" value={fromLoc} onChange={(e) => setFrom(e.target.value)} />
                {activeField === "from" && (
                    <div style={{ position: "absolute", top: "110%", left: 0, right: 0, backgroundColor: "#1a1a1a", borderRadius: "16px", zIndex: 50, border: "1px solid #333", maxHeight: "200px", overflowY: "auto" }}>
                        {popularDestinations.filter(d => d.toLowerCase().includes(fromLoc.toLowerCase())).map((dest, i) => (
                            <div key={i} onClick={() => handleSelect(dest)} style={{ padding: "12px 18px", cursor: "pointer", borderBottom: "1px solid #222" }}>📍 {dest}</div>
                        ))}
                    </div>
                )}
             </div>

             <motion.button whileHover={{ rotate: 180 }} onClick={() => { setFrom(toLoc); setTo(fromLoc); }} style={{ background: "#333", color: "#fff", border: "none", width: "45px", height: "45px", borderRadius: "50%", cursor: "pointer",marginLeft:"15px",marginRight:"0px"}}>⇄</motion.button>

             <div style={{ flex: 1, textAlign: "left", position: "relative" }}>
                <label style={{ fontSize: "11px", fontWeight: "800", color: "#007bff" }}>DROPOFF</label>
                <input onFocus={() => setActiveField("to")} style={{ background: "#222", border: "none", color: "#fff", padding: "16px", borderRadius: "16px", width: "100%", outline: "none" }} placeholder="Where to?" value={toLoc} onChange={(e) => setTo(e.target.value)} />
                {activeField === "to" && (
                    <div style={{ position: "absolute", top: "110%", left: 0, right: 0, backgroundColor: "#1a1a1a", borderRadius: "16px", zIndex: 50, border: "1px solid #333", maxHeight: "200px", overflowY: "auto" }}>
                        {popularDestinations.filter(d => d.toLowerCase().includes(toLoc.toLowerCase())).map((dest, i) => (
                            <div key={i} onClick={() => handleSelect(dest)} style={{ padding: "12px 18px", cursor: "pointer", borderBottom: "1px solid #222" }}>📍 {dest}</div>
                        ))}
                    </div>
                )}
             </div>

             {/* PULSE SEARCH BUTTON */}
             <motion.button 
                onClick={handleSearch}
                animate={{ boxShadow: ["0px 0px 0px #007bff", "0px 0px 20px #007bff", "0px 0px 0px #007bff"] }}
                transition={{ repeat: Infinity, duration: 2 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ backgroundColor: "#007bff", color: "#fff", padding: "16px 35px", borderRadius: "16px", fontWeight: "bold", border: "none", cursor: "pointer" }}
             >
                Search
             </motion.button>
          </div>
        </div>
      </section>

      {/* 2. MAP PREVIEW SECTION */}
      {mapVisible && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "0 5%", maxWidth: "1100px", margin: "20px auto" }}>
          <div style={{ background: "rgba(20, 20, 20, 0.8)", backdropFilter: "blur(10px)", padding: "15px", borderRadius: "28px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <div style={{ height: "350px", width: "100%", borderRadius: "20px", overflow: "hidden" }}>
              <CarismaMap pickup={pickupCoords} dropoff={dropoffCoords} />
            </div>
          </div>
        </motion.section>
      )}

      {/* 3. BENTO SERVICES SECTION */}
      <section style={{ padding: "100px 5%", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "240px", gap: "24px" }}>
          <motion.div whileHover={{ scale: 1.02 }} style={{ gridColumn: "span 2", gridRow: "span 2", backgroundColor: "#1a1a1a", borderRadius: "32px", padding: "40px", backgroundImage: "url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070')", backgroundSize: "cover", position: "relative", overflow: "hidden" }}>
             <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
             <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <h3 style={{ fontSize: "2rem", margin: 0 }}>Elite Airport Transfer</h3>
                <p style={{ opacity: 0.8 }}>Priority pickup and luggage assistance.</p>
             </div>
          </motion.div>

          <motion.div whileHover={{ x: 10 }} style={{ gridColumn: "span 2", backgroundColor: "#007bff", borderRadius: "32px", padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.8rem", margin: 0 }}>Business Class</h3>
              <span style={{ fontSize: "60px" }}>💼</span>
          </motion.div>

          <div style={{ gridColumn: "span 1", backgroundColor: "#222", borderRadius: "32px", padding: "30px", border: "1px solid #333" }}>
              <span style={{ fontSize: "40px" }}>⚡</span>
              <h3 style={{ fontSize: "1.4rem", margin: "10px 0 0 0" }}>EV Fleet</h3>
          </div>

          <div style={{ gridColumn: "span 1", backgroundColor: "#fff", color: "#000", borderRadius: "32px", padding: "30px" }}>
              <span style={{ fontSize: "40px" }}>🐕</span>
              <h3 style={{ fontSize: "1.4rem", margin: "10px 0 0 0" }}>Pet Friendly</h3>
          </div>
        </div>
      </section>

      {/* 4. AI CHATBOT */}
     <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
  <AnimatePresence>
    {chatOpen ? (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.8, opacity: 0, y: 20 }} 
        style={{ width: "320px", height: "450px", backgroundColor: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", overflow: "hidden", color: "#333" }}
      >
        {/* Header */}
        <div style={{ padding: "15px", backgroundColor: "#007bff", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "600" }}>Carisma AI</span>
          <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        {/* Chat History Area */}
        <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#f8f9fa" }}>
          {chatHistory.map((msg, i) => (
            <div 
              key={i} 
              style={{ 
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start", 
                backgroundColor: msg.role === "user" ? "#007bff" : "#e9ecef", 
                color: msg.role === "user" ? "white" : "black", 
                padding: "10px 14px", 
                borderRadius: "15px", 
                fontSize: "13px",
                maxWidth: "85%",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
              }}
            >
              {msg.text}
            </div>
          ))}
          {isTyping && <div style={{ fontSize: "11px", color: "#888", fontStyle: "italic" }}>AI is typing...</div>}
        </div>

        {/* --- ADDED: THE TEXT BOX AREA --- */}
        <div style={{ padding: "15px", borderTop: "1px solid #eee", backgroundColor: "white", display: "flex", gap: "8px" }}>
          <input 
            type="text"
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..." 
            style={{ 
              flex: 1, 
              border: "1px solid #ddd", 
              borderRadius: "20px", 
              padding: "8px 15px", 
              outline: "none", 
              fontSize: "13px",
              color: "#333" 
            }}
          />
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage} 
            style={{ 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "50%", 
              width: "35px", 
              height: "35px", 
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            ➤
          </motion.button>
        </div>
      </motion.div>
    ) : (
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => setChatOpen(true)} 
        style={{ width: "65px", height: "65px", borderRadius: "50%", backgroundColor: "#007bff", border: "none", fontSize: "30px", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
      >
        🤖
      </motion.button>
    )}
  </AnimatePresence>
</div>
    </div>
  );
};

export default Dashboard;