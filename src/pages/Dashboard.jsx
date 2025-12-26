import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Swiper Styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";


const Dashboard = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

  // Search States
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

  // Fetch initial locations for autocomplete
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/fare/list`);
        const allLocs = response.data.flatMap(item => [item.FromLocation, item.ToLocation]);
        const uniqueLocations = [...new Set(allLocs)].filter(Boolean);
        setPopularDestinations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setPopularDestinations(["Bangalore", "Airport", "Downtown", "Station"]);
      }
    };
    fetchLocations();
  }, [BASE_URL]);

  // --- Search Logic (Hits Backend) ---
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!fromLoc || !toLoc) return alert("Please enter both locations");

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/fare/route`, {
        params: {
          from: fromLoc,
          to: toLoc,
          // You can add date/ac here if you add inputs for them later
        },
      });
      navigate("/search-results", { state: { results: response.data } });
    } catch (error) {
      console.error("Search API failed:", error);
      alert("Search failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // --- Flip Logic ---
  const handleFlip = () => {
    const temp = fromLoc;
    setFrom(toLoc);
    setTo(temp);
  };

  const handleSelect = (value) => {
    if (activeField === "from") setFrom(value);
    if (activeField === "to") setTo(value);
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
    <div style={{ backgroundColor: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ position: "relative", height: "90vh", width: "100%", overflow: "hidden" }}>
        <Swiper modules={[Autoplay, EffectFade, Pagination]} effect="fade" autoplay={{ delay: 2000 }} loop style={{ height: "100%" }}>
          <SwiperSlide style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070")', backgroundSize: "cover", backgroundPosition: "center" }} />
          <SwiperSlide style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542362567-b052600529d4?auto=format&fit=crop&q=80&w=2070")', backgroundSize: "cover", backgroundPosition: "center" }} />
        <SwiperSlide style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2070")', backgroundSize: "cover", backgroundPosition: "center" }} />
<SwiperSlide style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2070")', backgroundSize: "cover", backgroundPosition: "center" }} />
<SwiperSlide style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2070")', backgroundSize: "cover", backgroundPosition: "center" }} />
<SwiperSlide style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2070")', backgroundSize: "cover", backgroundPosition: "center" }} />
        
        </Swiper>

        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, width: "95%", maxWidth: "1100px", textAlign: "center" }}>
          <h1 style={{ fontSize: "4rem", fontWeight: "800", marginBottom: "35px" }}>Drive the <span style={{ color: "#007bff" }}>Future.</span></h1>
          
          <div style={{ background: "rgba(15, 15, 15, 0.95)", padding: "30px", borderRadius: "32px", display: "flex", gap: "15px", alignItems: "center", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
             
             {/* FROM */}
             <div style={{ flex: 1, textAlign: "left", position: "relative" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#007bff", marginBottom: "8px" }}>PICKUP</label>
                <input 
                    onFocus={() => setActiveField("from")}
                    onBlur={() => setTimeout(() => setActiveField(null), 200)}
                    style={{ background: "#222", border: "none", color: "#fff", padding: "16px", borderRadius: "16px", width: "100%", outline: "none" }} 
                    placeholder="Where from?" 
                    value={fromLoc}
                    onChange={(e) => setFrom(e.target.value)}
                />
                {activeField === "from" && (
                    <div style={{ position: "absolute", top: "110%", left: 0, right: 0, backgroundColor: "#1a1a1a", borderRadius: "16px", zIndex: 50, border: "1px solid #333", maxHeight: "200px", overflowY: "auto" }}>
                        {popularDestinations.filter(d => d.toLowerCase().includes(fromLoc.toLowerCase())).map((dest, i) => (
                            <div key={i} onClick={() => handleSelect(dest)} style={{ padding: "12px 18px", cursor: "pointer", borderBottom: "1px solid #222" }}>📍 {dest}</div>
                        ))}
                    </div>
                )}
             </div>

             {/* FLIP BUTTON */}
             <button onClick={handleFlip} style={{ background: "#333", color: "#fff", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "18px", marginTop: "20px" }}>⇄</button>

             {/* TO */}
             <div style={{ flex: 1, textAlign: "left", position: "relative" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#007bff", marginBottom: "8px" }}>DROPOFF</label>
                <input 
                  onFocus={() => setActiveField("to")}
                  onBlur={() => setTimeout(() => setActiveField(null), 200)}
                  style={{ background: "#222", border: "none", color: "#fff", padding: "16px", borderRadius: "16px", width: "100%", outline: "none" }} 
                  placeholder="Where to?" 
                  value={toLoc}
                  onChange={(e) => setTo(e.target.value)}
                />
                {activeField === "to" && (
                    <div style={{ position: "absolute", top: "110%", left: 0, right: 0, backgroundColor: "#1a1a1a", borderRadius: "16px", zIndex: 50, border: "1px solid #333", maxHeight: "200px", overflowY: "auto" }}>
                        {popularDestinations.filter(d => d.toLowerCase().includes(toLoc.toLowerCase())).map((dest, i) => (
                            <div key={i} onClick={() => handleSelect(dest)} style={{ padding: "12px 18px", cursor: "pointer", borderBottom: "1px solid #222" }}>📍 {dest}</div>
                        ))}
                    </div>
                )}
             </div>

             <button 
                onClick={handleSearch}
                disabled={loading}
                style={{ backgroundColor: "#007bff", color: "#fff", padding: "16px 35px", borderRadius: "16px", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "20px" }}
             >
                {loading ? "Searching..." : "Search"}
             </button>
          </div>
        </div>
      </section>
 {/* 2. DESIGNED BENTO SERVICES SECTION */}
      <section style={{ padding: "100px 5%", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px" }}>
            <div>
                <h2 style={{ fontSize: "3rem", fontWeight: "800", margin: 0 }}>Explore Services</h2>
                <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Premium mobility solutions tailored for you.</p>
            </div>
            <button style={{ background: "transparent", color: "#007bff", border: "1px solid #007bff", padding: "10px 25px", borderRadius: "30px", fontWeight: "600" }}>View All</button>
        </div>

        {/* The Grid Layout */}
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(4, 1fr)", 
            gridAutoRows: "240px", 
            gap: "24px" 
        }}>
          {/* Main Large Card */}
          <div style={{ gridColumn: "span 2", gridRow: "span 2", backgroundColor: "#1a1a1a", borderRadius: "32px", padding: "40px", backgroundImage: "url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070')", backgroundSize: "cover", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
              <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <h3 style={{ fontSize: "2rem", margin: "0 0 10px 0" }}>Elite Airport Transfer</h3>
                <p style={{ opacity: 0.8 }}>Priority pickup and luggage assistance.</p>
              </div>
          </div>

          {/* Business Card */}
          <div style={{ gridColumn: "span 2", gridRow: "span 1", backgroundColor: "#007bff", borderRadius: "32px", padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "transform 0.3s" }}>
              <div>
                <h3 style={{ fontSize: "1.8rem", margin: 0 }}>Business Class</h3>
                <p style={{ margin: "5px 0 0 0" }}>Work on the go in silence.</p>
              </div>
              <span style={{ fontSize: "60px" }}>💼</span>
          </div>

          {/* EV Card */}
          <div style={{ gridColumn: "span 1", gridRow: "span 1", backgroundColor: "#222", borderRadius: "32px", padding: "30px", border: "1px solid #333" }}>
              <span style={{ fontSize: "40px", display: "block", marginBottom: "15px" }}>⚡</span>
              <h3 style={{ fontSize: "1.4rem", margin: 0 }}>EV Fleet</h3>
              <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>Zero emission travel.</p>
          </div>

          {/* Pet Friendly Card */}
          <div style={{ gridColumn: "span 1", gridRow: "span 1", backgroundColor: "#fff", color: "#000", borderRadius: "32px", padding: "30px" }}>
              <span style={{ fontSize: "40px", display: "block", marginBottom: "15px" }}>🐕</span>
              <h3 style={{ fontSize: "1.4rem", margin: 0 }}>Pet Friendly</h3>
              <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>Travel with your best friend.</p>
          </div>
        </div>
      </section>

      {/* 3. FLOATING AI CHATBOT UI */}
      <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
        {!chatOpen ? (
          <button onClick={() => setChatOpen(true)} style={{ borderRadius: "50%", width: "65px", height: "65px", backgroundColor: "#007bff", color: "white", border: "none", fontSize: "30px", cursor: "pointer", boxShadow: "0 6px 15px rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            🤖
          </button>
        ) : (
          <div style={{ width: "320px", height: "450px", backgroundColor: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #ddd" }}>
            <div style={{ padding: "15px", backgroundColor: "#007bff", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" }}>
              <span>Carisma AI Assistant</span>
              <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
            
            <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#f9f9f9" }}>
              {chatHistory.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%", padding: "10px", borderRadius: "15px", fontSize: "14px", backgroundColor: msg.role === "user" ? "#007bff" : "#e4e6eb", color: msg.role === "user" ? "white" : "black" }}>
                  {msg.text}
                </div>
              ))}
              {isTyping && <div style={{ fontSize: "12px", color: "#aaa" }}>AI is typing...</div>}
            </div>

            <div style={{ padding: "10px", borderTop: "1px solid #eee", display: "flex", gap: "5px", backgroundColor: "white" }}>
              <input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about car types..." 
                style={{ flex: 1, border: "1px solid #ddd", borderRadius: "20px", padding: "8px 15px", outline: "none", color: "#333" }}
              />
              <button onClick={handleSendMessage} style={{ backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "50%", width: "35px", height: "35px", cursor: "pointer" }}>➤</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;