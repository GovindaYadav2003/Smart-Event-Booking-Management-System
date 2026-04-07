import { useState, useEffect } from "react";
import "./App.css"; // Ensure your advanced CSS is in this file

function App() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);

  // --- Logic remains untouched ---
  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Connection to backend failed"));
  }, []);

  const bookEvent = async (event) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Check index.html script tag.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      const options = {
        key: "rzp_test_SZsdRrAIjWC1TS", 
        amount: data.amount,
        currency: data.currency,
        name: "Event Booking",
        description: event.name,
        order_id: data.id,
        handler: async function (response) {
          await fetch("http://localhost:5000/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: event.name,
              paymentId: response.razorpay_payment_id
            })
          });

          alert("✅ Booking Successful!");
          setBookings(prev => [...prev, event]);
        },
        prefill: { name: "Govinda", email: "test@example.com", contact: "9999999999" },
        theme: { color: "#2563eb" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const cancelBooking = (index) => {
    setBookings(prev => prev.filter((_, i) => i !== index));
  };

  // --- UI updated for MNC look ---
  return (
    <div className="app-container">
      <h1>🎉 Smart Event Booking</h1>
      
      <input 
        className="search-input"
        placeholder="Search for premium events..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
      />
      
      <div className="main-content">
        {/* Left Section: Event Listing */}
        <div className="events-section">
          <h2 style={{ marginBottom: "24px", fontWeight: "700" }}>Available Events</h2>
          {events.filter(e => e.name.toLowerCase().includes(search.toLowerCase())).map((e, i) => (
            <div key={i} className="event-card">
              <div className="event-info">
                <h3>{e.name}</h3>
                <p>📅 {e.date || "Scheduled for 2026"}</p>
              </div>
              <button className="btn-primary" onClick={() => bookEvent(e)}>
                Book Now
              </button>
            </div>
          ))}
          {events.length === 0 && <p style={{color: "var(--text-muted)"}}>No events found in database.</p>}
        </div>
        
        {/* Right Section: Modern Sidebar */}
        <aside className="bookings-panel">
          <h2>My Schedule</h2>
          {bookings.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>No active bookings yet.</p>
          ) : (
            bookings.map((b, i) => (
              <div key={i} className="booking-item">
                <span>✅ {b.name}</span>
                <button className="btn-cancel" onClick={() => cancelBooking(i)}>
                  Cancel
                </button>
              </div>
            ))
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;