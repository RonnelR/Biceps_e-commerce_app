import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import training from '../assets/dumbbells-2465478_1280.jpg'

const LandingPage = () => {
  const getYear = new Date().getFullYear();

  return (
    <div className="landing-page" style={{ margin: 0, padding: 0, width: "100%" }}>
      {/* ===== HEADER ===== */}
      <header className="header py-3 px-4 d-flex justify-content-between align-items-center sticky-top border-bottom border-warning" style={{ width: "100%" }}>
        <Link to="/" className="navbar-brand fw-bold fs-3 text-warning">
          BICEPS
        </Link>
        <nav className="d-flex gap-4 align-items-center">
          <Link className="nav-link" to="/home">
            Shop  
          </Link>
          <Link className="nav-link" to="/about">
            About
          </Link>
          <Link className="nav-link" to="/contact">
            Contact
          </Link>
          <Link to="/login">
            <button className="blueButton px-4 py-2 fw-semibold">
              Login
            </button>
          </Link>
        </nav>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section d-flex flex-column flex-md-row align-items-center justify-content-between py-5 px-4 px-md-5" style={{ width: "100%", maxWidth: "100vw", margin: 0 }}>
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hero-text col-md-6 text-center text-md-start"
        >
          <h1 className="display-5 fw-bold mb-3">
            Power Up Your <span>Strength</span>
          </h1>
          <p className="lead mb-4 text-secondary">
            Train smarter, recover faster, and perform better — all with premium
            fitness products designed for champions.
          </p>
          <Link to="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="blueButton fw-semibold px-4 py-2"
            >
              Start Shopping
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hero-image col-md-6 mt-4 mt-md-0 text-center"
        >
          <img
            src={training}
            alt="Fitness"
            className="img-fluid rounded-4 shadow-lg border border-warning"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section text-center py-5" style={{ width: "100%" }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fw-bold mb-5"
        >
          Why <span className="text-warning">Choose</span> Biceps?
        </motion.h2>

        <div className="container-fluid">
          <div className="row g-4">
            {[
              {
                title: "Premium Quality",
                text: "Only the best fitness gear and supplements, tested and trusted by pros.",
                icon: "🏋️‍♂️",
              },
              {
                title: "Seamless Experience",
                text: "Fast, responsive, and designed to give you the smoothest shopping experience.",
                icon: "⚡",
              },
              {
                title: "Trusted by Athletes",
                text: "Thousands of fitness lovers and athletes power their routines with Biceps.",
                icon: "🔥",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="col-md-4"
              >
                <div className="feature-card h-100 p-4">
                  <div className="display-4 mb-3">{feature.icon}</div>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-secondary">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section text-center py-5" style={{ width: "100%" }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="fw-bold mb-3"
        >
          Join the <span className="text-warning">Biceps</span> Revolution
        </motion.h2>
        <p className="lead mb-4 text-secondary">
          Step into the ultimate fitness community. Stay motivated, shop smart,
          and grow stronger together.
        </p>
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="blueButton px-5 py-2 fw-semibold"
          >
            Get Started
          </motion.button>
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer text-center py-5 border-top border-warning" style={{ backgroundColor: "#001f3f", color: "#ffc107", width: "100%", margin: 0, padding: "50px 0" }}>
        <h6 className="mb-3">
          BICEPS &copy; {getYear} | Stay Fit, Stay Strong 💪
        </h6>
        <p className="mb-3 text-light">
          Your ultimate fitness companion — gear, supplements, and motivation in one place.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/about" className="footer-link">
            About
          </Link>
          <span className="text-light">|</span>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
          <span className="text-light">|</span>
          <Link to="/privacy" className="footer-link">
            Privacy
          </Link>
        </div>
        <div className="mt-3">
          <a href="https://www.facebook.com" className="footer-link mx-2">Facebook</a>
          <a href="https://www.instagram.com" className="footer-link mx-2">Instagram</a>
          <a href="https://x.com" className="footer-link mx-2">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
