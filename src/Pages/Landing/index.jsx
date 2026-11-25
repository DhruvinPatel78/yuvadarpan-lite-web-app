import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const COVER_SRC = `${process.env.PUBLIC_URL || ""}/landing/yuva-darpan-cover.jpg`;

export default function Landing() {
  return (
    <main className="landing-page">
      <div className="landing-bg" aria-hidden="true">
        <span className="landing-bg__wash" />
        <span className="landing-bg__texture" />
        <span className="landing-bg__mandala landing-bg__mandala--tl" />
        <span className="landing-bg__mandala landing-bg__mandala--br" />
        <span className="landing-bg__glow landing-bg__glow--left" />
        <span className="landing-bg__glow landing-bg__glow--right" />
      </div>

      <div className="landing-stage">
        <section className="landing-book-col" aria-label="Yuva Darpan book">
          <div className="landing-book-scene">
            <div className="landing-book">
              <div className="landing-book__back" aria-hidden="true" />
              <div className="landing-book__pages" aria-hidden="true" />
              <div className="landing-book__spine" aria-hidden="true" />
              <div className="landing-book__cover">
                <img
                  src={COVER_SRC}
                  alt="યુવા દર્પણ — યુવક-યુવતી પરિચય પુસ્તિકા 2026"
                  width={764}
                  height={1024}
                  decoding="async"
                  fetchPriority="high"
                />
                <span className="landing-book__watermark-mask" aria-hidden="true" />
                <span className="landing-book__gloss" aria-hidden="true" />
              </div>
            </div>
            <div className="landing-book__shadow" aria-hidden="true" />
          </div>
        </section>

        <section className="landing-copy">
          <span className="landing-badge">✦ DIGITAL</span>
          <h1 className="landing-title">યુવા દર્પણ</h1>
          <div className="landing-ornament" aria-hidden="true" />

          <div className="landing-actions">
            <Link to="/login" className="landing-btn landing-btn--primary">
              Login
            </Link>
            <Link to="/register" className="landing-btn landing-btn--secondary">
              Sign up
            </Link>
          </div>

          <p className="landing-foot">© {new Date().getFullYear()} Yuvadarpan</p>
        </section>
      </div>
    </main>
  );
}
