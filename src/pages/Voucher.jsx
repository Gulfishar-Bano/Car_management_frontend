import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Voucher.css';
import CarismaMap from './CarismaMap';

const Voucher = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderMap, setRenderMap] = useState(false);
  const voucherRef = useRef(null);

  useEffect(() => {
    const fetchBookingAndCoords = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/booking/${bookingId}/voucher`
        );
        const data = response.data;

        const getCoords = async (loc) => {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc + ", Karnataka, India")}`
          );
          return res.data.length > 0 
            ? { lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) } 
            : null;
        };

        const pickupCoords = await getCoords(data.PickUpLocation);
        const dropoffCoords = await getCoords(data.DropLocation);

        setBooking({ ...data, pickupCoords, dropoffCoords });
      } catch (err) {
        setError("Failed to fetch voucher details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingAndCoords();
  }, [bookingId]);

  useEffect(() => {
    if (booking?.pickupCoords && booking?.dropoffCoords) {
      const timer = setTimeout(() => setRenderMap(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [booking]);

  const handleDownload = async () => {
  const element = voucherRef.current;
  if (!element) return;

  // 1️⃣ Hide map before capture
  const mapElements = element.querySelectorAll('.hide-in-pdf');
  mapElements.forEach(el => (el.style.display = 'none'));

  await new Promise(resolve => setTimeout(resolve, 300));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#050505",
    logging: false
  });

  // 2️⃣ Restore map after capture
  mapElements.forEach(el => (el.style.display = 'block'));

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pdfWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
  pdf.save(`Carisma_Voucher_${bookingId}.pdf`);
};

  if (loading) return <div className="loading-state">Preparing your luxury voucher...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="voucher-page-wrapper">
      <div className="action-bar">
        <button className="download-btn-premium" onClick={handleDownload}>
          Download Digital Pass
        </button>
      </div>

      <div className="ticket-container" ref={voucherRef}>
        <div className="ticket-header">
          <div className="brand-group">
            <span className="premium-label">CARISMA PREMIUM</span>
            <h2>Travel Voucher</h2>
          </div>
          <div className="id-badge">
            <span>BOOKING ID</span>
            <p>#{booking.id || bookingId}</p>
          </div>
        </div>

        <div className="ticket-body">
          {/* FIXED: Height reduced to 280px to stop it from occupying the whole page */}
          {renderMap ? (
            <div
  className="voucher-map-container hide-in-pdf"
  style={{
    height: "280px",
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "25px",
    border: "1px solid rgba(255,255,255,0.1)"
  }}
>

              <CarismaMap 
                key={`map-${booking.pickupCoords.lat}-${booking.dropoffCoords.lat}`} 
                pickup={booking.pickupCoords} 
                dropoff={booking.dropoffCoords} 
              />
            </div>
          ) : (
            <div style={{ height: "280px", background: "#111", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "25px" }}>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>📍 Dropping location pins...</p>
            </div>
          )}

          <div className="journey-timeline">
            {/* ... journey timeline content ... */}
            <div className="timepoint">
              <div className="dot"></div>
              <div className="time-info">
                <span>PICKUP</span>
                <h3>{booking.PickUpLocation}</h3>
                <p>{new Date(booking.Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            <div className="duration-connector">
              <div className="dashed-line"></div>
              <div className="trip-badge">🚗</div>
            </div>

            <div className="timepoint">
              <div className="dot destination"></div>
              <div className="time-info">
                <span>DROPOFF</span>
                <h3>{booking.DropLocation}</h3>
                <p>Estimated Arrival: {new Date(new Date(booking.Date).getTime() + 60*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>

          <div className="premium-specs-grid">
            <div className="spec-card">
              <label>PRIMARY PASSENGER</label>
              <p>{booking.Name || "Guest"}</p>
              <small>{booking.Email}</small>
            </div>
            <div className="spec-card">
              <label>VEHICLE CATEGORY</label>
              <p>{booking.car?.model || "Premium Sedan"}</p>
              <small>{booking.car?.carNo} • {booking.car?.ac ? 'Climate Controlled' : 'Standard'}</small>
            </div>
            <div className="spec-card">
              <label>BOOKING STATUS</label>
              <p className="status-highlight">{booking.Status}</p>
            </div>
            <div className="spec-card fare-highlight">
              <label>TOTAL INVESTMENT</label>
              <p>₹{booking.fare?.fare || booking.finalFare || booking.totalFare || "N/A"}</p>
              <small>Inclusive of GST & Tolls</small>
            </div>
          </div>
        </div>

        <div className="security-line">
          THIS IS AN ELECTRONICALLY GENERATED PASS. NO SIGNATURE REQUIRED.
        </div>
      </div>
    </div>
  );
};

export default Voucher;