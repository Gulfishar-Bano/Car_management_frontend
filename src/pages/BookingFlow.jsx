
import React, { useState } from 'react';
import MockPayment from './Payment';

const BookingFlow = () => {
  const [step, setStep] = useState(1); 
  const [bookingData, setBookingData] = useState({ item: 'Car Rental', price: 500 });

  return (
    <div className="container">
      {step === 1 && (
        <div>
          <h2>Step 1: Booking Details</h2>
          <p>Selected: {bookingData.item}</p>
          <button onClick={() => setStep(2)}>Next: Review Booking</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Step 2: Confirm Your Selection</h2>
          <p>Please review your details for <strong>{bookingData.item}</strong>.</p>
          <p>Total to Pay: <strong>₹{bookingData.price}</strong></p>
          <div style={{ marginTop: '20px' }}>
           
             <MockPayment amount={bookingData.price} />
          </div>
          <button onClick={() => setStep(1)} style={{ marginTop: '10px' }}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;