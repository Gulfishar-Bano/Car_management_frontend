import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { data: order } = await axios.post(`${API_URL}/payment/create-order`, { 
        amount: state?.amount 
      });

      await new Promise((res) => setTimeout(res, 2000));

      const verifyData = {
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(7)}`,
        razorpay_signature: "mock_sig",
      };

      await axios.post(`${API_URL}/payment/verify`, verifyData);
      navigate(`/voucher/${state.bookingId}`);
    } catch (err) {
      alert("Payment Failed. Please check your bank details.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- PREMIUM STYLES ---
  const styles = {
    fullPage: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "20px"
    },
    card: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.7)",
      borderRadius: "32px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "450px",
      padding: "40px"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    summaryBox: {
      background: "#f1f5f9",
      borderRadius: "20px",
      padding: "20px",
      marginBottom: "30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    input: {
      width: "100%",
      background: "#fff",
      border: "1px solid #e2e8f0",
      padding: "16px",
      borderRadius: "14px",
      fontSize: "15px",
      outline: "none",
      marginBottom: "15px",
      transition: "border 0.2s ease",
      boxSizing: "border-box"
    },
    row: {
      display: "flex",
      gap: "15px"
    },
    payBtn: {
      width: "100%",
      backgroundColor: "#007bff",
      color: "white",
      padding: "18px",
      borderRadius: "14px",
      border: "none",
      fontSize: "16px",
      fontWeight: "800",
      cursor: "pointer",
      marginTop: "10px",
      boxShadow: "0 10px 20px rgba(0, 123, 255, 0.2)",
      transition: "all 0.3s ease"
    },
    secureBadge: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      color: "#64748b",
      fontSize: "12px",
      marginTop: "20px"
    }
  };

  return (
    <div style={styles.fullPage}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>💳</div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0, color: "#1e293b" }}>Checkout</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>Complete your premium ride booking</p>
        </div>

        <div style={styles.summaryBox}>
          <div>
            <span style={{ fontSize: "12px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: "700" }}>Booking ID</span>
            <span style={{ fontWeight: "700", color: "#0f172a" }}>#{state?.bookingId || "0000"}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "12px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: "700" }}>Amount</span>
            <span style={{ fontWeight: "800", color: "#007bff", fontSize: "20px" }}>₹{state?.amount}</span>
          </div>
        </div>

        <form onSubmit={handlePayment}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px", paddingLeft: "5px" }}>CARD NUMBER</label>
            <input type="text" placeholder="xxxx xxxx xxxx xxxx" required style={styles.input} />
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px", paddingLeft: "5px" }}>EXPIRY</label>
              <input type="text" placeholder="MM/YY" required style={styles.input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px", paddingLeft: "5px" }}>CVV</label>
              <input type="password" placeholder="***" required style={styles.input} />
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              ...styles.payBtn, 
              opacity: isProcessing ? 0.7 : 1,
              cursor: isProcessing ? "not-allowed" : "pointer" 
            }} 
            disabled={isProcessing}
          >
            {isProcessing ? "Verifying Transaction..." : `Confirm Payment`}
          </button>
        </form>

        <div style={styles.secureBadge}>
          <span>🔒</span>
          <span>SSL Secure 256-bit Encrypted Payment</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;