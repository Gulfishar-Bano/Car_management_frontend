import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Voucher.css';

const Voucher = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const voucherRef = useRef(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/booking/${bookingId}/voucher`
        );
        setBooking(response.data);
      } catch (err) {
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleDownload = async () => {
    const element = voucherRef.current;
    const canvas = await html2canvas(element, { scale: 3, backgroundColor: '#050505' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
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
        {/* Header Stub */}
        <div className="ticket-header">
          <div className="brand-group">
            <span className="premium-label">CARISMA PREMIUM</span>
            <h2>Travel Voucher</h2>
          </div>
          <div className="id-badge">
            <span>BOOKING ID</span>
            <p>#{booking.id}</p>
          </div>
        </div>
/* Inside Voucher.js - Ticket Body Section */
<div className="ticket-body">
  {/* Modern Journey Timeline */}
  <div className="journey-timeline">
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
      <div className="trip-badge">
        <i>🚗</i>
       
      </div>
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
      <p>{booking.Name}</p>
      <small>{booking.Email}</small>
    </div>
    <div className="spec-card">
      <label>VEHICLE CATEGORY</label>
      <p>{booking.car?.model}</p>
      <small>{booking.car?.carNo} • {booking.car?.ac ? 'Climate Controlled' : 'Standard'}</small>
    </div>
    <div className="spec-card">
      <label>BOOKING STATUS</label>
      <p className="status-highlight">{booking.Status}</p>
    </div>
   <div className="spec-card fare-highlight">
      <label>TOTAL INVESTMENT</label>
      <p>
        ₹{booking.fare?.fare || booking.finalFare || booking.totalFare || "N/A"}
      </p>
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