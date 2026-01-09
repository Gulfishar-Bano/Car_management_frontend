// MockPaymentGateway.js
import React, { useState } from 'react';
import axios from 'axios';

const MockPaymentGateway = ({ amount, bookingId, onSuccess, onCancel }) => {
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Step 1: Create the Order
      const { data: order } = await axios.post(`${API_URL}/payment/create-order`, { amount });

      // Step 2: Artificial delay to simulate bank authorization
      await new Promise(res => setTimeout(res, 2500));

      // Step 3: Verify using your mock logic
      const verifyData = {
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(7)}`,
        razorpay_signature: 'mock_sig', 
      };

      const { data: result } = await axios.post(`${API_URL}/payment/verify`, verifyData);

      if (result.status === 'success') {
        onSuccess();
      }
    } catch (err) {
      alert("Payment Declined. Please check card details.");
    } finally {
      setIsProcessing(false);
    }
  };

 const MockPaymentGateway = ({ amount, onVerify, onCancel }) => {
  return (
    <div className="gateway-overlay">
      <div className="gateway-modal">
        <h2 style={{color: '#fff', marginBottom: '20px'}}>Secure Checkout</h2>
        <div className="amount-display" style={{fontSize: '24px', color: '#007bff', marginBottom: '30px'}}>
          Amount: ₹{amount}
        </div>
        
        <form className="gateway-form">
          <input type="text" placeholder="Cardholder Name" required className="luxury-input" />
          <input type="text" placeholder="Card Number" maxLength="16" required className="luxury-input" />
          
          <div style={{display: 'flex', gap: '10px'}}>
             <input type="text" placeholder="MM/YY" required className="luxury-input" />
             <input type="password" placeholder="CVV" maxLength="3" required className="luxury-input" />
          </div>

          <button onClick={onVerify} className="confirm-booking-btn" style={{marginTop: '20px'}}>
            Confirm & Pay ₹{amount}
          </button>
          
          <button onClick={onCancel} className="back-btn" style={{width: '100%', marginTop: '10px'}}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
};

export default MockPaymentGateway;