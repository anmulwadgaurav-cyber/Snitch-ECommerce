import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from "react-router";

/*
  Design System: "Linen & Ink" (from Stitch)
  ─────────────────────────────────────────────
  Font:           Be Vietnam Pro (Google Fonts)
  Background:     #F5EDE3  — warm linen
  Surface:        #FFFFFF  — pure white form panel
  Primary:        #000000  — black (text, button, focus)
  Nude border:    #D4BFB0  — input underlines, rules
  Muted tan:      #B89A82  — labels, placeholders, meta
  Sharp corners everywhere — 0px border-radius
*/

// ─── Google Font import injected once ──────────────────
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

// ─── Validation ─────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ fullname, email, contact, password }) {
  const e = {};
  if (!fullname.trim()) e.fullname = "Full name is required.";
  if (!email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
  if (!contact.trim()) e.contact = "Contact number is required.";
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(contact))
    e.contact = "Enter a valid phone number.";
  if (!password) e.password = "Password is required.";
  else if (password.length < 8)
    e.password = "Password must be at least 8 characters.";
  return e;
}

// ─── Field wrapper ──────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-2">
    <label
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#B89A82] select-none"
    >
      {label}
    </label>
    {children}
    {error && (
      <p
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        className="text-[11px] tracking-wide text-red-500 mt-0.5"
      >
        {error}
      </p>
    )}
  </div>
);

// ─── Shared underline input style ───────────────────────
const inputCls =
  "w-full bg-transparent border-b border-[#D4BFB0] pb-3 pt-1 text-sm " +
  "text-black placeholder-[#B89A82]/50 outline-none " +
  "transition-colors duration-300 focus:border-black";

// ════════════════════════════════════════════════════════
//  RegisterPage
// ════════════════════════════════════════════════════════
const RegisterPage = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  // form data
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  // ui state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      await handleRegister(form);
      setSuccess(true);
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 3000); // 3 seconds for user to see the success message, after which user will be redirected to the home page
    }
  };

  // ── Success state ──────────────────────────────────────
  if (success) {
    return (
      <>
        <FontLink />
        <div
          className="min-h-screen bg-[#F5EDE3] flex items-center justify-center"
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          <div className="text-center space-y-6 px-8">
            {/* Sharp checkmark box */}
            <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B89A82] mb-3">
                Registration Complete
              </p>
              <h1 className="text-4xl font-extralight tracking-[0.2em] uppercase text-black">
                Welcome to Snitch
              </h1>
            </div>
            <div className="w-8 h-px bg-[#D4BFB0] mx-auto" />
            <p className="text-sm text-[#B89A82] tracking-wide font-light">
              Your account has been created successfully.
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── Main layout ────────────────────────────────────────
  return (
    <>
      <FontLink />
      <div
        className="min-h-screen flex"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {/* ══ LEFT — Editorial image panel (hidden on mobile) ══ */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black flex-col">
          {/* Dark fashion-editorial background with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80&auto=format&fit=crop')",
              filter: "grayscale(30%) contrast(1.1)",
            }}
          />
          {/* Deep gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

          {/* Top brand mark */}
          <div className="relative z-10 p-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-1">
              Est. 2024
            </p>
            <h2 className="text-2xl font-extralight tracking-[0.4em] uppercase text-white">
              Snitch
            </h2>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 mt-auto p-12">
            <div className="w-8 h-px bg-white/30 mb-6" />
            <blockquote className="text-white/80 text-lg font-extralight leading-relaxed tracking-wide max-w-xs">
              "Style is a way to say who you are without having to speak."
            </blockquote>
            <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-white/40">
              — Rachel Zoe
            </p>
          </div>
        </div>

        {/* ══ RIGHT — Registration form panel ══════════════════ */}
        <div className="flex-1 bg-[#F5EDE3] flex items-center justify-center px-6 py-16 lg:px-0">
          <div className="w-full max-w-sm lg:max-w-md">
            {/* ── Header ── */}
            <div className="mb-12">
              {/* Mobile-only brand name */}
              <p className="lg:hidden text-[10px] tracking-[0.4em] uppercase text-[#B89A82] mb-6">
                Snitch
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#B89A82] mb-3">
                Create Account
              </p>
              <h1 className="text-4xl font-extralight tracking-[0.15em] uppercase text-black leading-tight">
                Join Us
              </h1>
              <div className="mt-5 w-8 h-px bg-[#D4BFB0]" />
            </div>

            {/* ── Server error ── */}
            {serverError && (
              <div className="mb-8 px-4 py-3.5 border border-[#D4BFB0] bg-white text-[11px] tracking-widest uppercase text-red-600">
                {serverError}
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Full Name */}
              <Field label="Full Name" error={errors.fullname}>
                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className={inputCls}
                  style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                />
              </Field>

              {/* Email */}
              <Field label="Email Address" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  className={inputCls}
                  style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                />
              </Field>

              {/* Contact */}
              <Field label="Contact Number" error={errors.contact}>
                <input
                  id="contact"
                  type="tel"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className={inputCls}
                  style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                />
              </Field>

              {/* Password with show/hide toggle */}
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className={inputCls + " pr-16"}
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-0 bottom-3 text-[10px] tracking-[0.18em] uppercase text-[#B89A82] hover:text-black transition-colors duration-200 select-none"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>

              {/* Password strength indicator */}
              {form.password.length > 0 && (
                <div className="flex gap-1 -mt-4">
                  {[1, 2, 3, 4].map((i) => {
                    const strength = Math.min(
                      Math.floor(form.password.length / 3),
                      4,
                    );
                    return (
                      <div
                        key={i}
                        className="h-px flex-1 transition-colors duration-300"
                        style={{
                          backgroundColor:
                            i <= strength
                              ? strength <= 1
                                ? "#D4BFB0"
                                : strength <= 2
                                  ? "#B89A82"
                                  : strength <= 3
                                    ? "#808080"
                                    : "#000000"
                              : "#EDE0D4",
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Register as Seller — custom sharp checkbox */}
              <label
                htmlFor="isSeller"
                className="flex items-center gap-4 cursor-pointer group select-none pt-1"
              >
                <input
                  id="isSeller"
                  type="checkbox"
                  name="isSeller"
                  checked={form.isSeller}
                  onChange={handleChange}
                  className="sr-only"
                />
                {/* Square indicator — no border-radius */}
                <span
                  className={
                    "w-4 h-4 flex-shrink-0 flex items-center justify-center border transition-all duration-200 " +
                    (form.isSeller
                      ? "bg-black border-black"
                      : "bg-transparent border-[#D4BFB0] group-hover:border-black/40")
                  }
                >
                  {form.isSeller && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#B89A82] group-hover:text-black transition-colors duration-200">
                  Register as Seller
                </span>
              </label>

              {/* Divider */}
              <div className="w-full h-px bg-[#D4BFB0]" />

              {/* CTA button */}
              <button
                id="register-submit"
                type="submit"
                disabled={isLoading}
                className={
                  "w-full py-4 text-[11px] tracking-[0.35em] uppercase font-medium " +
                  "transition-all duration-300 " +
                  (isLoading
                    ? "bg-[#D4BFB0] text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-[#1a1a1a] active:scale-[0.99]")
                }
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-80"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Creating Account
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* ── Or divider ── */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-px bg-[#D4BFB0]" />
              <span
                className="text-[9px] tracking-[0.3em] uppercase text-[#B89A82] select-none"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                Or
              </span>
              <div className="flex-1 h-px bg-[#D4BFB0]" />
            </div>

            {/* ── Continue with Google ── */}
            <a
              id="register-google"
              href={"/api/auth/google"}
              className="mt-4 w-full py-3.5 flex items-center justify-center gap-3 border border-[#D4BFB0] bg-transparent text-[11px] tracking-[0.25em] uppercase text-black hover:border-black hover:bg-white transition-all duration-300 active:scale-[0.99]"
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              {/* Google G logo */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M44.5 20H24v8.5h11.8C34.1 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 2.9l6.4-6.4C34.5 5.9 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-7.9 19.7-20 0-1.3-.1-2.7-.2-4z"
                />
                <path
                  fill="#34A853"
                  d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3 0 5.8 1.1 7.9 2.9l6.4-6.4C34.5 5.9 29.5 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 44c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.6 35.4 26.9 36 24 36c-5.6 0-10.1-2.9-11.8-7.5l-7 5.4C8.6 39.8 15.8 44 24 44z"
                />
                <path
                  fill="#EA4335"
                  d="M44.5 20H24v8.5h11.8c-.9 2.6-2.7 4.8-5 6.3l6.5 5.3C41.3 36.7 44.5 31 44.5 24c0-1.3-.1-2.7-.2-4z"
                />
              </svg>
              Continue with Google
            </a>

            {/* ── Footer ── */}
            <p className="mt-8 text-[10px] tracking-[0.2em] uppercase text-[#B89A82] text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-black underline underline-offset-4 decoration-[#D4BFB0] hover:decoration-black transition-all duration-200"
              >
                Sign In
              </a>
            </p>

            {/* Fine-print policy */}
            <p className="mt-6 text-center text-[10px] text-[#B89A82]/60 tracking-wide leading-relaxed">
              By registering, you agree to our{" "}
              <a
                href="/terms"
                className="underline hover:text-[#B89A82] transition-colors duration-200"
              >
                Terms
              </a>{" "}
              &amp;{" "}
              <a
                href="/privacy"
                className="underline hover:text-[#B89A82] transition-colors duration-200"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
