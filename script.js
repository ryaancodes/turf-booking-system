// 1. Preload 6 turfs if not already stored
if (!localStorage.getItem("turfs")) {
  const sampleTurfs = [
    {
      name: "KickOff Turf",
      location: "Bandra",
      price: 750,
      slots: ["6 AM", "7 AM", "8 AM", "5 PM", "6 PM"]
    },
    {
      name: "GoalRush Grounds",
      location: "Worli",
      price: 1000,
      slots: ["7 AM", "8 AM", "9 AM", "4 PM", "5 PM"]
    },
    {
      name: "Arena Five",
      location: "Goregaon",
      price: 700,
      slots: ["6 AM", "7 AM", "8 AM", "6 PM", "7 PM"]
    },
    {
      name: "The SportZone",
      location: "Malad",
      price: 650,
      slots: ["6 AM", "8 AM", "10 AM", "6 PM", "7 PM"]
    },
    {
      name: "GreenField Hub",
      location: "Juhu",
      price: 620,
      slots: ["6 AM", "7 AM", "9 AM", "5 PM", "6 PM"]
    },
    {
      name: "Turf Titans",
      location: "Andheri",
      price: 720,
      slots: ["7 AM", "8 AM", "9 AM", "6 PM", "7 PM"]
    }
  ];
  localStorage.setItem("turfs", JSON.stringify(sampleTurfs));
}

// 2. Load turf dropdown and render turf cards
function loadTurfDropdown() {
  const turfs = JSON.parse(localStorage.getItem("turfs"));
  const dropdown = document.getElementById("turfDropdown");
  if (dropdown) {
    dropdown.innerHTML = '<option value="">-- Select Turf --</option>';
    turfs.forEach((turf, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${turf.name} (${turf.location}) - ₹${turf.price}`;
      dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", () => {
      const selectedIndex = dropdown.value;
      const slotDropdown = document.getElementById("slotDropdown");
      slotDropdown.innerHTML = '<option value="">-- Select Slot --</option>';
      if (selectedIndex !== "") {
        turfs[selectedIndex].slots.forEach(slot => {
          const opt = document.createElement("option");
          opt.value = slot;
          opt.textContent = slot;
          slotDropdown.appendChild(opt);
        });
      }
    });
  }

  const container = document.getElementById("turfDetailsContainer");
  if (container) {
    container.innerHTML = "";
    const imageFiles = ["turf1.jpg", "turf2.jpg", "turf3.jpg", "turf4.jpg", "turf5.jpg", "turf6.jpg"];
    turfs.forEach((turf, index) => {
      const card = document.createElement("div");
      card.className = "turf-card fade-in";
      card.innerHTML = `
        <img src="images/${imageFiles[index]}" class="turf-img" alt="${turf.name}">
        <h2>${turf.name}</h2>
        <p><strong>Location:</strong> ${turf.location}</p>
        <p><strong>Price:</strong> ₹${turf.price}</p>
        <p><strong>Slots:</strong> ${turf.slots.join(", ")}</p>
      `;
      container.appendChild(card);
    });
  }
}

// 3. Booking logic
function setupBooking() {
  const btn = document.getElementById("bookNowBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const turfs = JSON.parse(localStorage.getItem("turfs"));
    const turfIndex = document.getElementById("turfDropdown").value;
    const date = document.getElementById("bookingDate").value;
    const slot = document.getElementById("slotDropdown").value;
    const name = document.getElementById("userName").value;

    if (!name || !date || turfIndex === "" || slot === "") {
      alert("Please fill all fields.");
      return;
    }

    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      alert("You can't book for a past date!");
      return;
    }

    const turf = turfs[turfIndex];
    const newBooking = {
      name,
      date,
      slot,
      turfName: turf.name,
      location: turf.location,
      price: turf.price,
      time: new Date().toLocaleString()
    };

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    window.location.href = "payment.html";
  });
}

// 4. Render bookings
function renderBookings() {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const container = document.getElementById("bookingContainer");
  if (!container) return;

  container.innerHTML = "";
  bookings.forEach(b => {
    const card = document.createElement("div");
    card.className = "turf-card fade-in";
    card.innerHTML = `
      <h2>${b.turfName}</h2>
      <p><strong>Name:</strong> ${b.name}</p>
      <p><strong>Date:</strong> ${b.date}</p>
      <p><strong>Slot:</strong> ${b.slot}</p>
      <p><strong>Location:</strong> ${b.location}</p>
      <p><strong>Price:</strong> ₹${b.price}</p>
      <p><em>Booked on: ${b.time}</em></p>
    `;
    container.appendChild(card);
  });
}

// 5. Enforce min date on booking calendar
function enforceMinDate() {
  const dateInput = document.getElementById("bookingDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }
}

// INIT
loadTurfDropdown();
setupBooking();
renderBookings();
enforceMinDate();