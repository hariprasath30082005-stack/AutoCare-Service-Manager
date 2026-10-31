
import React, { useState } from "react";
import {
  ShoppingCart, Menu, X, Search, Plus, Minus,
  Trash2, ArrowRight, CakeSlice, Truck,
  Leaf, Clock3, MapPin, Phone, Instagram,
  Heart, CheckCircle2
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "./App11.css";

const products = [
  {
    id: 1,
    name: "Chocolate Truffle Cake",
    category: "Cakes",
    price: 649,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900",
    tag: "Bestseller"
  },
  {
    id: 2,
    name: "Strawberry Cream Cake",
    category: "Cakes",
    price: 699,
    image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=900",
    tag: "Fresh"
  },
  {
    id: 3,
    name: "Chocolate Brownies",
    category: "Brownies",
    price: 249,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900",
    tag: "Popular"
  },
  {
    id: 4,
    name: "Butter Cookies",
    category: "Cookies",
    price: 199,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=900",
    tag: ""
  },
  {
    id: 5,
    name: "Vanilla Cupcakes",
    category: "Cupcakes",
    price: 299,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900",
    tag: "Popular"
  },
  {
    id: 6,
    name: "Red Velvet Cake",
    category: "Cakes",
    price: 799,
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=900",
    tag: "Premium"
  },
  {
    id: 7,
    name: "Fresh Baked Bread",
    category: "Bread",
    price: 149,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900",
    tag: "Fresh"
  },
  {
    id: 8,
    name: "Chocolate Cupcakes",
    category: "Cupcakes",
    price: 349,
    image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=900",
    tag: ""
  }
];

const categories = [
  "All", "Cakes", "Brownies", "Cookies", "Cupcakes", "Bread"
];

const money = (value) => "₹" + value.toLocaleString("en-IN");

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  address: z.string().trim().min(10, "Enter a complete delivery address"),
  date: z.date({ error: "Select a delivery date" }),
  note: z.string().optional()
});

function App11() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Replace with your bakery WhatsApp number:
  // Country code + phone number, without + or spaces.
  const whatsappNumber = "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      date: null,
      note: ""
    }
  });

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "All" || product.category === category;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const deliveryFee =
    subtotal === 0 || subtotal >= 999 ? 0 : 49;

  const total = subtotal + deliveryFee;

  const addToCart = (product) => {
    setCart((previous) => {
      const existing = previous.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });

    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (id, change) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((previous) =>
      previous.filter((item) => item.id !== id)
    );
    toast.info("Product removed from cart");
  };

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
    setMenuOpen(false);
  };

  const placeOrder = (customer) => {
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      toast.error("Configure bakery WhatsApp number first");
      return;
    }

    const items = cart.map(
      (item) =>
        `${item.name} x ${item.quantity} = ${money(
          item.price * item.quantity
        )}`
    ).join("\n");

    const message = [
      "Hello Homemade Bakery!",
      "I would like to request an order.",
      "",
      "CUSTOMER DETAILS",
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Address: ${customer.address}`,
      `Delivery Date: ${dayjs(customer.date).format("DD MMM YYYY")}`,
      `Instructions: ${customer.note || "None"}`,
      "",
      "ORDER DETAILS",
      items,
      "",
      `Subtotal: ${money(subtotal)}`,
      `Estimated Delivery: ${money(deliveryFee)}`,
      `Estimated Total: ${money(total)}`,
      "",
      "Please confirm availability, delivery and payment."
    ].join("\n");

    const url =
      `https://wa.me/${whatsappNumber}?text=` +
      encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
    toast.info("WhatsApp opened. Send your order request.");
  };

  return (
    <div className="bakery11">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <div className="bakery11-topbar">
        ✨ Freshly baked with love • Free delivery above ₹999
      </div>

      <header className="bakery11-header">
        <div className="bakery11-container bakery11-navbar">
          <button
            className="bakery11-logo"
            onClick={() => goTo("home11")}
          >
            <CakeSlice size={30} />
            Homemade<span>Bakery</span>
          </button>

          <nav className={
            "bakery11-navlinks " +
            (menuOpen ? "bakery11-nav-open" : "")
          }>
            <button onClick={() => goTo("home11")}>Home</button>
            <button onClick={() => goTo("products11")}>Our Menu</button>
            <button onClick={() => goTo("about11")}>About Us</button>
            <button onClick={() => goTo("contact11")}>Contact</button>
          </nav>

          <div className="bakery11-nav-actions">
            <button
              className="bakery11-cart-button"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="bakery11-cart-count">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="bakery11-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="home11" className="bakery11-hero">
          <div className="bakery11-container bakery11-hero-grid">
            <div className="bakery11-hero-text">
              <div className="bakery11-eyebrow">
                ♡ BAKED FRESH, MADE WITH LOVE
              </div>

              <h1>
                A little slice of
                <span> happiness.</span>
              </h1>

              <p>
                Discover delicious homemade cakes, brownies,
                cookies and sweet treats. Freshly prepared
                to make every celebration special.
              </p>

              <div className="bakery11-hero-actions">
                <button
                  className="bakery11-primary"
                  onClick={() => goTo("products11")}
                >
                  Explore Our Menu <ArrowRight size={18} />
                </button>

                <button
                  className="bakery11-secondary"
                  onClick={() => goTo("about11")}
                >
                  Our Story
                </button>
              </div>

              <div className="bakery11-hero-stats">
                <div><strong>100%</strong><span>Homemade</span></div>
                <div><strong>8+</strong><span>Sweet Treats</span></div>
                <div><strong>Fresh</strong><span>Every Order</span></div>
              </div>
            </div>

            <div className="bakery11-hero-image">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200"
                alt="Homemade celebration cake"
              />
              <div className="bakery11-image-label">
                ⭐ Fresh & Delicious
              </div>
            </div>
          </div>
        </section>

        <section className="bakery11-features">
          <div className="bakery11-container bakery11-features-grid">
            <div>
              <Heart />
              <section>
                <strong>Homemade Goodness</strong>
                <small>Made with care</small>
              </section>
            </div>

            <div>
              <Truck />
              <section>
                <strong>Local Delivery</strong>
                <small>Fresh to your doorstep</small>
              </section>
            </div>

            <div>
              <Leaf />
              <section>
                <strong>Quality Ingredients</strong>
                <small>Prepared with care</small>
              </section>
            </div>

            <div>
              <Clock3 />
              <section>
                <strong>Freshly Prepared</strong>
                <small>Made for your order</small>
              </section>
            </div>
          </div>
        </section>

        <section
          id="products11"
          className="bakery11-products-section"
        >
          <div className="bakery11-container">
            <div className="bakery11-section-heading">
              <span>OUR SWEET COLLECTION</span>
              <h2>Something sweet for everyone</h2>
              <p>
                Explore our delicious homemade bakery collection.
              </p>
            </div>

            <div className="bakery11-toolbar">
              <div className="bakery11-categories">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="bakery11-search">
                <Search size={20} />
                <input
                  type="search"
                  placeholder="Search bakery items..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="bakery11-products-grid">
              {filteredProducts.map((product) => (
                <article
                  className="bakery11-product-card"
                  key={product.id}
                >
                  <div className="bakery11-product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.tag && (
                      <span className="bakery11-product-tag">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <div className="bakery11-product-details">
                    <small>{product.category}</small>
                    <h3>{product.name}</h3>
                    <p>⭐ Freshly baked with love</p>

                    <div className="bakery11-product-bottom">
                      <strong>{money(product.price)}</strong>
                      <button onClick={() => addToCart(product)}>
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bakery11-no-results">
                No products found. Try another search.
              </div>
            )}
          </div>
        </section>

        <section id="about11" className="bakery11-about">
          <div className="bakery11-container bakery11-about-grid">
            <div className="bakery11-about-image">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1000"
                alt="Freshly baked pastries"
                loading="lazy"
              />
            </div>

            <div className="bakery11-about-text">
              <span>OUR STORY</span>
              <h2>Every bake has a little love inside.</h2>
              <p>
                At Homemade Bakery, we believe the sweetest
                memories are made with delicious homemade food.
              </p>
              <p>
                From celebration cakes to everyday treats,
                we prepare our bakery favorites with care
                and attention.
              </p>

              <button
                className="bakery11-primary"
                onClick={() => goTo("products11")}
              >
                Order Your Favorites <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="bakery11-banner">
          <div className="bakery11-container">
            <CakeSlice size={42} />
            <h2>Make every celebration sweeter!</h2>
            <p>
              Choose your favorite treats and request an order today.
            </p>
            <button onClick={() => goTo("products11")}>
              Shop Now <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <footer id="contact11" className="bakery11-footer">
        <div className="bakery11-container bakery11-footer-grid">
          <div>
            <h3>🧁 Homemade Bakery</h3>
            <p>
              Bringing homemade happiness to every celebration,
              one delicious treat at a time.
            </p>
          </div>

          <div className="bakery11-footer-links">
            <h4>Quick Links</h4>
            <button onClick={() => goTo("home11")}>Home</button>
            <button onClick={() => goTo("products11")}>Our Menu</button>
            <button onClick={() => goTo("about11")}>About Us</button>
          </div>

          <div className="bakery11-contact">
            <h4>Contact Us</h4>
            <p><MapPin size={17} /> Chennai, Tamil Nadu</p>
            <p><Phone size={17} /> Phone number to be added</p>
            <p><Instagram size={17} /> Instagram details to be added</p>
          </div>
        </div>

        <div className="bakery11-footer-bottom">
          © {new Date().getFullYear()} Homemade Bakery.
          All rights reserved.
        </div>
      </footer>

      {cartOpen && (
        <div
          className="bakery11-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="bakery11-cart-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bakery11-panel-header">
              <div>
                <h2>Your Cart</h2>
                <p>{cartCount} items selected</p>
              </div>
              <button onClick={() => setCartOpen(false)}>
                <X />
              </button>
            </div>

            <div className="bakery11-cart-items">
              {cart.length === 0 ? (
                <div className="bakery11-empty-cart">
                  <ShoppingCart size={52} />
                  <h3>Your cart is empty</h3>
                  <p>Add some delicious treats!</p>
                  <button
                    className="bakery11-primary"
                    onClick={() => {
                      setCartOpen(false);
                      goTo("products11");
                    }}
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    className="bakery11-cart-item"
                    key={item.id}
                  >
                    <img src={item.image} alt={item.name} />

                    <div className="bakery11-cart-info">
                      <h4>{item.name}</h4>
                      <strong>{money(item.price)}</strong>

                      <div className="bakery11-quantity">
                        <button onClick={() =>
                          updateQuantity(item.id, -1)
                        }>
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() =>
                          updateQuantity(item.id, 1)
                        }>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      className="bakery11-delete"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={19} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="bakery11-cart-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>

                <div>
                  <span>Estimated Delivery</span>
                  <strong>
                    {deliveryFee === 0
                      ? "Free"
                      : money(deliveryFee)}
                  </strong>
                </div>

                <div className="bakery11-cart-total">
                  <span>Estimated Total</span>
                  <strong>{money(total)}</strong>
                </div>

                <button
                  className="bakery11-primary bakery11-full-button"
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div
          className="bakery11-overlay bakery11-checkout-overlay"
          onClick={() => setCheckoutOpen(false)}
        >
          <div
            className="bakery11-checkout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bakery11-panel-header">
              <div>
                <h2>Checkout</h2>
                <p>Enter your delivery details</p>
              </div>
              <button onClick={() => setCheckoutOpen(false)}>
                <X />
              </button>
            </div>

            <form
              className="bakery11-checkout-form"
              onSubmit={handleSubmit(placeOrder)}
              noValidate
            >
              <label>
                Full Name *
                <input
                  {...register("name")}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <small className="bakery11-error">
                    {errors.name.message}
                  </small>
                )}
              </label>

              <label>
                Phone Number *
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="10-digit mobile number"
                />
                {errors.phone && (
                  <small className="bakery11-error">
                    {errors.phone.message}
                  </small>
                )}
              </label>

              <label>
                Delivery Address *
                <textarea
                  rows="3"
                  {...register("address")}
                  placeholder="House number, street, city"
                />
                {errors.address && (
                  <small className="bakery11-error">
                    {errors.address.message}
                  </small>
                )}
              </label>

              <label>
                Preferred Delivery Date *
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      minDate={new Date()}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Choose delivery date"
                      className="bakery11-date-input"
                      wrapperClassName="bakery11-date-wrapper"
                    />
                  )}
                />
                {errors.date && (
                  <small className="bakery11-error">
                    {errors.date.message}
                  </small>
                )}
              </label>

              <label>
                Special Instructions
                <textarea
                  rows="2"
                  {...register("note")}
                  placeholder="Cake message, customization..."
                />
              </label>

              <div className="bakery11-checkout-total">
                <span>Estimated Total</span>
                <strong>{money(total)}</strong>
              </div>

              <button
                className="bakery11-primary bakery11-full-button"
                type="submit"
                disabled={isSubmitting}
              >
                Continue to WhatsApp <ArrowRight size={18} />
              </button>

              <p className="bakery11-checkout-note">
                <CheckCircle2 size={15} />
                Your order is confirmed only after the bakery
                accepts your request.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App11;
