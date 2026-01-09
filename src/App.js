import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";
import Voucher from "./pages/Voucher";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BookingFlow from "./pages/BookingFlow";
import MockPaymentGateway from "./pages/Payment";
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <Router>
      <Routes>

        
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/search-results"
          element={
            <Layout>
              <SearchResults />
            </Layout>
          }
        />

        <Route
          path="/booking"
          element={
            <Layout>
              <Booking />
            </Layout>
          }
        />
          <Route path="/checkout" element={<BookingFlow />} />
      
        
   
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      <Route path="/About" element={<About/>}/>
      <Route path="/Contact" element={<Contact/>}/>
      
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/voucher/:bookingId" element={<Voucher />} />

      </Routes>
    </Router>
  );
}

export default App;
