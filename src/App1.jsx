import { useState } from "react";
import "./App1.css";

function App1() {
  // ================= STATE =================

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Guests");

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("");
  const [showAmenities, setShowAmenities] = useState(false);

  // ================= ROOMS DATA =================

  const rooms = [
    {
      name: "Deluxe Room",
      price: "₹3,999",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
      description: "Comfortable room with a beautiful city view.",
    },
    {
      name: "Executive Suite",
      price: "₹5,999",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
      description: "Spacious suite with premium facilities.",
    },
    {
      name: "Luxury Room",
      price: "₹7,999",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      description: "Luxury stay with modern design and comfort.",
    },
    {
      name: "Premium Suite",
      price: "₹8,999",
      image:
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80",
      description: "Elegant suite with premium interiors.",
    },
    {
      name: "Family Room",
      price: "₹6,499",
      image:
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80",
      description: "Spacious room perfect for families.",
    },
    {
      name: "Royal Suite",
      price: "₹12,999",
      image:
        "https://images.unsplash.com/photo-1781881110598-f28f2773d4eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDd8TThqVmJMYlRSd3N8fGVufDB8fHx8fA%3D%3D",
      description: "Experience the ultimate luxury and comfort.",
    },
  ];

  // ================= TOAST FUNCTION =================

  const showToast = (message, type) => {
    setToast(message);
    setToastType(type);

    setTimeout(() => {
      setToast("");
      setToastType("");
    }, 3000);
  };

  // ================= SEARCH FUNCTION =================

  const handleSearch = () => {
    if (!location || !checkIn || !checkOut) {
      showToast("Please fill all booking details", "error");
      return;
    }

    showToast(
      `Rooms available in ${location} for ${guests}`,
      "success"
    );
  };

  // ================= BOOK ROOM FUNCTION =================

  const handleBooking = (roomName) => {
    showToast(
      `${roomName} booking selected successfully!`,
      "success"
    );
  };

  // ================= BOOK NOW FUNCTION =================

  const handleBookNow = () => {
    showToast("Booking section opened", "success");

    document.getElementById("home").scrollIntoView({
      behavior: "smooth",
    });
  };

  // ================= UI =================

  return (
    <div className="hotel-app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          LUXORA<span>HOTELS</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#rooms">Rooms</a>
          <a href="#facilities">Facilities</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <button
          className="nav-button"
          onClick={handleBookNow}
        >
          Book Now
        </button>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-content">

          <p className="small-title">
            WELCOME TO LUXORA
          </p>

          <h1>
            Your Perfect Stay
            <br />
            Starts Here
          </h1>

          <p className="hero-text">
            Experience comfort, luxury and unforgettable
            moments at Luxora Hotels.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              document
                .getElementById("rooms")
                .scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Explore Rooms
          </button>

        </div>


        {/* ================= BOOKING BOX ================= */}

        <div className="booking-box">

          {/* LOCATION */}

          <div className="booking-item">

            <label>Location</label>

            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              className={
                location ? "valid" : "invalid"
              }
            />

          </div>


          {/* CHECK IN */}

          <div className="booking-item">

            <label>Check-in</label>

            <input
              type="date"
              value={checkIn}
              onChange={(e) =>
                setCheckIn(e.target.value)
              }
              className={
                checkIn ? "valid" : "invalid"
              }
            />

          </div>


          {/* CHECK OUT */}

          <div className="booking-item">

            <label>Check-out</label>

            <input
              type="date"
              value={checkOut}
              onChange={(e) =>
                setCheckOut(e.target.value)
              }
              className={
                checkOut ? "valid" : "invalid"
              }
            />

          </div>


          {/* GUESTS */}

          <div className="booking-item">

            <label>Guests</label>

            <select
              value={guests}
              onChange={(e) =>
                setGuests(e.target.value)
              }
            >
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4 Guests</option>
              <option>5 Guests</option>
            </select>

          </div>


          {/* SEARCH */}

          <button
            className="search-button"
            onClick={handleSearch}
          >
            Search Rooms
          </button>

        </div>

      </section>


      {/* ================= ROOMS ================= */}

      <section
        className="rooms-section"
        id="rooms"
      >

        <div className="section-heading">

          <p>OUR ROOMS</p>

          <h2>
            Choose Your Perfect Room
          </h2>

          <span>
            Designed for comfort, relaxation and a memorable stay.
          </span>

        </div>


        <div className="room-container">

          {rooms.map((room) => (

            <div
              className="room-card"
              key={room.name}
            >

              <img
                src={room.image}
                alt={room.name}
              />

              <div className="room-content">

                <h3>
                  {room.name}
                </h3>

                <p>
                  {room.description}
                </p>

                <div className="room-bottom">

                  <div>

                    <strong>
                      {room.price}
                    </strong>

                    <small>
                      / night
                    </small>

                  </div>

                  <button
                    onClick={() =>
                      handleBooking(room.name)
                    }
                  >
                    Book Room
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= FACILITIES ================= */}

      <section
        className="facilities"
        id="facilities"
      >

        <div className="section-heading">

          <p>OUR FACILITIES</p>

          <h2>
            Everything You Need
          </h2>

        </div>


        <div className="facility-container">

          <div className="facility-card">

            <img
              src="https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1000&q=90"
              alt="Swimming Pool"
            />

          </div>


          <div className="facility-card">

            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=90"
              alt="Restaurant"
            />

          </div>


          <div className="facility-card">

            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=90"
              alt="Hotel Spa"
            />

          </div>


          <div className="facility-card">

            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=90"
              alt="Hotel Gym"
            />

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        className="about"
        id="about"
      >

        <div className="about-image">

          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
            alt="Luxury Hotel"
          />

        </div>


        <div className="about-content">

          <p>ABOUT LUXORA</p>

          <h2>
            A Place Where
            <br />
            Comfort Meets Luxury
          </h2>

          <p className="about-text">
            Luxora Hotels offers a perfect combination
            of modern luxury, warm hospitality and
            comfortable rooms for every type of traveler.
          </p>

          <button
            onClick={() =>
              showToast(
                "Welcome to Luxora Hotels!",
                "success"
              )
            }
          >
            Discover More
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer id="contact">

        <div className="footer-logo">
          LUXORA HOTELS
        </div>

        <p>
          Your comfort is our priority.
        </p>

        <div className="footer-links">
          Home &nbsp; | &nbsp;
          Rooms &nbsp; | &nbsp;
          Facilities &nbsp; | &nbsp;
          Contact
        </div>


        {/* AMENITIES BUTTON */}

        <button
          className="amenities-button"
          onClick={() =>
            setShowAmenities(true)
          }
        >
          View Amenities
        </button>


        <hr />

        <p className="copyright">
          © 2026 Luxora Hotels. All Rights Reserved.
        </p>

      </footer>


      {/* ================= AMENITIES SIDE POPUP ================= */}

      {showAmenities && (

        <div
          className="amenities-overlay"
          onClick={() =>
            setShowAmenities(false)
          }
        >

          <div
            className="amenities-panel"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="amenities-close"
              onClick={() =>
                setShowAmenities(false)
              }
            >
              ×
            </button>


            <p className="amenities-small-title">
              HOTEL AMENITIES
            </p>

            <h2>
              Everything You Need
            </h2>

            <p className="amenities-description">
              Enjoy our comfortable and convenient
              hotel facilities during your stay.
            </p>


            <div className="amenities-grid">

              {/* FAN */}

              <div className="amenity-card">

                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Ceeiling_fan.JPG"
                  alt="Ceiling Fan"
                />

                <h3>Fan</h3>

                <p>
                  Ceiling fan available
                </p>

              </div>


              {/* AC */}

              <div className="amenity-card">

                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Air_Conditioner_1.jpg"
                  alt="Air Conditioner"
                />

                <h3>
                  Air Conditioner
                </h3>

                <p>
                  Cool and comfortable rooms
                </p>

              </div>


              {/* CAR PARKING */}

              <div className="amenity-card">

                <img
                  src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=500&q=80"
                  alt="Car Parking"
                />

                <h3>
                  Car Parking
                </h3>

                <p>
                  Safe parking for cars
                </p>

              </div>


              {/* BIKE PARKING */}

              <div className="amenity-card">

                <img
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80"
                  alt="Bike Parking"
                />

                <h3>
                  Bike Parking
                </h3>

                <p>
                  Dedicated bike parking
                </p>

              </div>


              {/* WIFI */}

              <div className="amenity-card">

                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80"
                  alt="WiFi"
                />

                <h3>
                  Free Wi-Fi
                </h3>

                <p>
                  High-speed internet access
                </p>

              </div>


              {/* HEATER */}

              <div className="amenity-card">

                <img
                  src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Electric_Heater.jpg"
                  alt="Room Heater"
                />

                <h3>
                  Room Heater
                </h3>

                <p>
                  Warm and cozy rooms
                </p>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ================= TOAST ================= */}

      {toast && (

        <div className={`toast ${toastType}`}>
          {toast}
        </div>

      )}

    </div>
  );
}

export default App1;