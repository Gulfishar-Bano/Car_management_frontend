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

function App() {
  return (
    <Router>
      <Routes>

        {/* Pages WITH layout (header + footer) */}
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

        {/* Pages WITHOUT layout (full screen / no header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      <Route path="/About" element={<About/>}/>
      <Route path="/Contact" element={<Contact/>}/>
        {/* Voucher usually needs NO header/footer */}
        <Route path="/voucher/:bookingId" element={<Voucher />} />

      </Routes>
    </Router>
  );
}

export default App;
