let events = [
  { name: "Music Concert", date: "2026-05-10" },
  { name: "Tech Conference", date: "2026-05-20" },
  { name: "Art Workshop", date: "2026-05-25" }
];

let bookings = [];

// DISPLAY EVENTS
function displayEvents(data = events) {
  let container = document.getElementById("eventContainer");
  container.innerHTML = "";

  data.forEach((event, index) => {
    container.innerHTML += `
      <div class="event-card">
        <h3>${event.name}</h3>
        <p>Date: ${event.date}</p>
        <button onclick="bookEvent(${index})">Book</button>
      </div>
    `;
  });
}

// SEARCH
function searchEvent() {
  let value = document.getElementById("search").value.toLowerCase();

  let filtered = events.filter(e =>
    e.name.toLowerCase().includes(value)
  );

  displayEvents(filtered);
}

// BOOK
function bookEvent(index) {
  let event = events[index];
  bookings.push(event);
  displayBookings();
  paymentUI(event);
}

// DISPLAY BOOKINGS
function displayBookings() {
  let list = document.getElementById("bookingList");
  list.innerHTML = "";

  bookings.forEach((b, i) => {
    list.innerHTML += `
      <li>
        ${b.name}
        <button onclick="cancelBooking(${i})">Cancel</button>
      </li>
    `;
  });
}

// CANCEL
function cancelBooking(i) {
  bookings.splice(i, 1);
  displayBookings();
}

// PAYMENT UI
function paymentUI(event) {
  let confirmPay = confirm(`Pay ₹500 for ${event.name}?`);

  if (confirmPay) {
    alert("Payment Successful ✅");
  } else {
    alert("Payment Cancelled ❌");
  }
}

// CALENDAR
function loadCalendar() {
  let cal = document.getElementById("calendar");
  let today = new Date();
  cal.innerHTML = `<h3 style="padding:10px;">📅 Today: ${today.toDateString()}</h3>`;
}

// INIT
displayEvents();
loadCalendar();