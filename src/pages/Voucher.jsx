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

  const voucherContentRef = useRef(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/booking/${bookingId}/voucher`
        );
        setBooking(response.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const downloadPDF = async () => {
    if (!booking || !voucherContentRef.current) return;

    const canvas = await html2canvas(voucherContentRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/jpeg');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    pdf.save(`voucher_${booking.id}.pdf`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!booking) return <p>Booking not found</p>;

  return (
    <div className="voucher-page">
      <div className="voucher-download-btn">
        <button onClick={downloadPDF}>Download PDF</button>
      </div>

      <div className="voucher-container" ref={voucherContentRef}>
        <h2>Booking Voucher</h2>

        <section className="booking-id-section">
          <h3>
            Booking ID: <strong>{booking.id}</strong>
          </h3>
        </section>

        <section className="voucher-section">
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> {booking.Name}</p>
          <p><strong>Email:</strong> {booking.Email}</p>
        </section>

        <section className="voucher-section">
          <h3>Trip Details</h3>
          <p><strong>Pickup:</strong> {booking.PickUpLocation}</p>
          <p><strong>Drop:</strong> {booking.DropLocation}</p>
          <p><strong>Date & Time:</strong> {new Date(booking.Date).toLocaleString()}</p>
          <p><strong>Status:</strong> {booking.Status}</p>
        </section>

        <section className="voucher-section">
          <h3>Vehicle Details</h3>
          {booking.car ? (
            <>
              <p><strong>Model:</strong> {booking.car.model}</p>
              <p><strong>Car Number:</strong> {booking.car.carNo}</p>
              <p><strong>Seats:</strong> {booking.car.noOfSeats}</p>
              <p><strong>AC / Non-AC:</strong> {booking.car.ac ? "AC" : "Non-AC"}</p>
            </>
          ) : (
            <p>Vehicle details not available</p>
          )}
        </section>

        <section className="voucher-section">
          <h3>Fare Details</h3>
          {booking.fare ? (
            <>
              <p><strong>Base Fare:</strong> ₹{booking.fare.fare}</p>
              <p><strong>Trip From:</strong> {booking.fare.FromLocation}</p>
              <p><strong>Trip To:</strong> {booking.fare.ToLocation}</p>
            </>
          ) : (
            <p>Fare details not available</p>
          )}
        </section>

        <section className="voucher-section">
          <h3>Driver Details</h3>
          {booking.driver ? (
            <>
              <p><strong>Name:</strong> {booking.driver.firstName} {booking.driver.lastName}</p>
              <p><strong>Licence:</strong> {booking.driver.licence}</p>
              <p><strong>Validity:</strong> {booking.driver.validity}</p>
            </>
          ) : (
            <p>Driver not assigned yet</p>
          )}
        </section>

        <div className="voucher-footer">
          Thank you for booking with us! Please keep this voucher handy.
        </div>
      </div>
    </div>
  );
};

export default Voucher;
