import { useState } from "react";
import "./App2.css";

const destinations = [
{
id: 1,
name: "Bali",
country: "Indonesia",
category: "Beach",
price: 24999,
rating: "4.9",
days: "5 Days / 4 Nights",
image:
"https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",
description:
"Discover tropical beaches, beautiful temples and peaceful island escapes.",
},
{
id: 2,
name: "Swiss Alps",
country: "Switzerland",
category: "Mountain",
price: 58999,
rating: "4.9",
days: "7 Days / 6 Nights",
image:
"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1000&q=85",
description:
"Experience magnificent mountains, alpine villages and scenic landscapes.",
},
{
id: 3,
name: "Maldives",
country: "Indian Ocean",
category: "Beach",
price: 42999,
rating: "5.0",
days: "4 Days / 3 Nights",
image:
"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=85",
description:
"Escape to turquoise lagoons, tropical islands and beautiful ocean views.",
},
{
id: 4,
name: "Kyoto",
country: "Japan",
category: "Culture",
price: 36999,
rating: "4.8",
days: "6 Days / 5 Nights",
image:
"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
description:
"Explore traditional streets, peaceful gardens and Japanese heritage.",
},
{
id: 5,
name: "Santorini",
country: "Greece",
category: "Beach",
price: 54999,
rating: "4.9",
days: "6 Days / 5 Nights",
image:
"https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1000&q=85",
description:
"Enjoy whitewashed villages, blue domes and Mediterranean sunsets.",
},
{
id: 6,
name: "Dubai",
country: "United Arab Emirates",
category: "City",
price: 28999,
rating: "4.7",
days: "4 Days / 3 Nights",
image:
"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85",
description:
"Discover iconic architecture, desert adventures and city experiences.",
},
];

function App2() {
const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");
const [wishlist, setWishlist] = useState([]);
const [selected, setSelected] = useState(null);
const [booking, setBooking] = useState(null);
const [guests, setGuests] = useState("2");
const [travelDate, setTravelDate] = useState("");
const [customerName, setCustomerName] = useState("");
const [email, setEmail] = useState("");
const [toast, setToast] = useState("");
const [toastType, setToastType] = useState("success");

const showToast = (message, type = "success") => {
setToast(message);
setToastType(type);


window.setTimeout(() => {
  setToast((current) => (current === message ? "" : current));
}, 3000);


};

const filteredDestinations = destinations.filter((place) => {
const matchesSearch =
place.name.toLowerCase().includes(search.toLowerCase()) ||
place.country.toLowerCase().includes(search.toLowerCase());


const matchesCategory =
  category === "All" || place.category === category;

return matchesSearch && matchesCategory;


});

const toggleWishlist = (id) => {
const alreadySaved = wishlist.includes(id);


setWishlist((previous) =>
  alreadySaved
    ? previous.filter((item) => item !== id)
    : [...previous, id]
);

showToast(
  alreadySaved
    ? "Removed from your wishlist"
    : "Added to your wishlist"
);

};

const openBooking = (place) => {
setBooking(place);
setSelected(null);
setCustomerName("");
setEmail("");
setTravelDate("");
setGuests("2");
};

const handleBooking = (event) => {
event.preventDefault();

if (!customerName.trim() || !email.trim() || !travelDate) {
  showToast("Please complete all booking details.", "error");
  return;
}

showToast(`Trip request submitted for ${booking.name}!`);
setBooking(null);


};


const scrollToDestinations = () => {
document.getElementById("app2-destinations")?.scrollIntoView({
behavior: "smooth",
});
};

return ( <div className="trip"> <header className="navbar"> <a className="brand" href="#app2-home">
Travel at a Time <span>.</span> </a>

    <nav className="nav-links">
      <a href="#app2-home">Home</a>
      <a href="#app2-destinations">Destinations</a>
      <a href="#app2-story">Our Story</a>
    </nav>

    <button className="nav-book" onClick={scrollToDestinations}>
      Explore Trips <span>↗</span>
    </button>
  </header>

  <main>
    <section className="hero" id="app2-home">
      <div className="hero-overlay" />

      <div className="hero-content">
        <span className="eyebrow hero-eyebrow">
          <span className="eyebrow-line" />
          TRAVEL BEYOND ORDINARY
        </span>

        <h1>
          The world is
          <br />
          yours to <em>discover.</em>
        </h1>

        <p className="hero-description">
          Extraordinary destinations. Meaningful journeys.
          Memories that stay with you forever.
        </p>

        <button className="primary-button" onClick={scrollToDestinations}>
          Explore destinations <span>↗</span>
        </button>

        <div className="hero-bottom">
          <div>
            <strong>120+</strong>
            <span>Destinations</span>
          </div>
          <div>
            <strong>15k+</strong>
            <span>Happy travellers</span>
          </div>
          <div>
            <strong>4.9/5</strong>
            <span>Guest rating</span>
          </div>
        </div>
      </div>

      <div className="hero-caption">
        <span>01 / 06</span>
        <span>Find your somewhere.</span>
      </div>
    </section>

    <section className="search-section">
      <div className="search-intro">
        <span className="eyebrow">YOUR NEXT CHAPTER</span>
        <h2>Where to next?</h2>
      </div>

      <div className="search-panel">
        <label className="search-field">
          <span className="field-icon">⌕</span>
          <span className="search-field-content">
            <small>DESTINATION</small>
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </span>
        </label>

        <div className="search-divider" />

        <label className="search-field">
          <span className="field-icon">♧</span>
          <span className="search-field-content">
            <small>TRAVELLERS</small>
            <select
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
            >
              <option value="1">1 Traveller</option>
              <option value="2">2 Travellers</option>
              <option value="3">3 Travellers</option>
              <option value="4">4 Travellers</option>
              <option value="5">5 Travellers</option>
            </select>
          </span>
        </label>

        <button className="search-button" onClick={scrollToDestinations}>
          Find your trip <span>↗</span>
        </button>
      </div>
    </section>

    <section className="destinations-section" id="app2-destinations">
      <div className="section-heading">
        <div>
          <span className="eyebrow">CURATED FOR YOU</span>
          <h2>
            Places that stay <em>with you.</em>
          </h2>
          <p>
            Handpicked escapes for your next unforgettable adventure.
          </p>
        </div>

        <div className="destination-count">
          <strong>
            {String(filteredDestinations.length).padStart(2, "0")}
          </strong>
          <span>DESTINATIONS</span>
        </div>
      </div>

      <div className="category-filters">
        {["All", "Beach", "Mountain", "Culture", "City"].map((item) => (
          <button
            key={item}
            className={category === item ? "filter active" : "filter"}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}

        {wishlist.length > 0 && (
          <span className="wishlist-count">
            ♥ {wishlist.length} saved
          </span>
        )}
      </div>

      {filteredDestinations.length > 0 ? (
        <div className="destination-grid">
          {filteredDestinations.map((place, index) => (
            <article
              className="destination-card"
              key={place.id}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="card-image-wrap">
                <img
                  src={place.image}
                  alt={place.name}
                  className="card-image"
                  loading="lazy"
                />

                <span className="card-category">{place.category}</span>

                <button
                  className={
                    wishlist.includes(place.id)
                      ? "wishlist-button saved"
                      : "wishlist-button"
                  }
                  aria-label={`Save ${place.name}`}
                  onClick={() => toggleWishlist(place.id)}
                >
                  {wishlist.includes(place.id) ? "♥" : "♡"}
                </button>

                <div className="image-bottom">
                  <span>★ {place.rating}</span>
                  <span>{place.days}</span>
                </div>
              </div>

              <div className="card-content">
                <span className="card-country">{place.country}</span>
                <h3>{place.name}</h3>
                <p>{place.description}</p>

                <div className="card-footer">
                  <div className="price">
                    <small>STARTING FROM</small>
                    <strong>
                      ₹{place.price.toLocaleString("en-IN")}
                    </strong>
                    <span>/ person</span>
                  </div>

                  <button
                    className="arrow-button"
                    aria-label={`View ${place.name}`}
                    onClick={() => setSelected(place)}
                  >
                    ↗
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div> 
      ) : (
        <div className="empty-state">
          <span>⌕</span>
          <h3>No destinations found</h3>
          <p>Try another destination or category.</p>
          <button
            className="primary-button dark-button"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>

    <section className="experience-section" id="app2-story">
      <div className="experience-image">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=85"
          alt="Beautiful lake surrounded by mountains"
          loading="lazy"
        />
        <span className="experience-image-label">
          THE ART OF SLOW TRAVEL
        </span>
      </div>

      <div className="experience-content">
        <span className="eyebrow">TRAVEL, REIMAGINED</span>
        <h2>
          Not just places.
          <br />
          <em>Perspectives.</em>
        </h2>
        <p>
          We believe the best journeys aren't measured in miles,
          but in moments. Discover thoughtful escapes, hidden gems
          and experiences worth remembering.
        </p>

        <div className="experience-points">
          <div>
            <span>01</span>
            <div>
              <strong>Thoughtfully curated</strong>
              <p>Every destination chosen with care.</p>
            </div>
          </div>
          <div>
            <span>02</span>
            <div>
              <strong>Made for you</strong>
              <p>Journeys that match your travel style.</p>
            </div>
          </div>
          <div>
            <span>03</span>
            <div>
              <strong>Moments that matter</strong>
              <p>Experiences beyond the ordinary.</p>
            </div>
          </div>
        </div>

        <button className="text-link" onClick={scrollToDestinations}>
          Find your next escape <span>↗</span>
        </button>
      </div>
    </section>

    <section className="newsletter">
      <span className="eyebrow">A LITTLE INSPIRATION</span>
      <h2>
        Let the world <em>surprise you.</em>
      </h2>
      <p>Your next great story starts with a destination.</p>
      <button className="primary-button" onClick={scrollToDestinations}>
        Start exploring <span>↗</span>
      </button>
    </section>
  </main>

  <footer className="footer">
    <a className="brand footer-brand" href="#app2-home">
      Travel at a Time<span>.</span>
    </a>
    <p>Travel beautifully. Travel meaningfully.</p>
    <span>© 2026 Travel at a Time. Travel inspiration for everyone.</span>
  </footer>

  {selected && (
    <div className="modal-backdrop" onClick={() => setSelected(null)}>
      <div
        className="destination-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${selected.name} destination details`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={() => setSelected(null)}
          aria-label="Close details"
        >
          ×
        </button>

        <img src={selected.image} alt={selected.name} />

        <div className="modal-body">
          <span className="eyebrow">{selected.country}</span>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>

          <div className="modal-info">
            <span>★ {selected.rating} guest rating</span>
            <span>{selected.days}</span>
          </div>

          <div className="modal-price">
            <span>Starting from</span>
            <strong>₹{selected.price.toLocaleString("en-IN")}</strong>
            <span>/ person</span>
          </div>

          <button
            className="primary-button modal-book"
            onClick={() => openBooking(selected)}
          >
            Book this journey <span>↗</span>
          </button>
        </div>
      </div>
    </div>
  )}

  {booking && (
    <div className="modal-backdrop" onClick={() => setBooking(null)}>
      <div
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Booking request form"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={() => setBooking(null)}
          aria-label="Close booking"
        >
          ×
        </button>

        <span className="eyebrow">YOUR JOURNEY STARTS HERE</span>
        <h2>
          Plan your <em>escape.</em>
        </h2>
        <p className="booking-subtitle">
          Destination: <strong>{booking.name}</strong>
        </p>

        <form onSubmit={handleBooking}>
          <label>
            Full name
            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Enter your name"
              required
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Preferred travel date
            <input
              type="date"
              value={travelDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => setTravelDate(event.target.value)}
              required
            />
          </label>

          <label>
            Travellers
            <select
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
            >
              <option value="1">1 Traveller</option>
              <option value="2">2 Travellers</option>
              <option value="3">3 Travellers</option>
              <option value="4">4 Travellers</option>
              <option value="5">5 Travellers</option>
            </select>
          </label>

          <div className="booking-total">
            <span>Estimated package price</span>
            <strong>
              ₹{(booking.price * Number(guests)).toLocaleString("en-IN")}
            </strong>
            <small>Demo estimate; final price may vary.</small>
          </div>

          <button className="primary-button modal-book" type="submit">
            Submit trip request <span>↗</span>
          </button>
        </form>
      </div>
    </div>
  )}

  {toast && (
    <div
      className={`toast ${toastType === "error" ? "toast-error" : ""}`}
      role="status"
    >
      <span>{toastType === "error" ? "!" : "✓"}</span>
      {toast}
    </div>
  )}
</div>


);
}

export default App2;
