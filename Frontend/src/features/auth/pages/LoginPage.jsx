import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/*
  Design System: "Linen & Ink"
  ─────────────────────────────────────────────
  Font:        Be Vietnam Pro
  Background:  #F5EDE3  warm linen
  Surface:     #FFFFFF  pure white panel
  Primary:     #000000  black
  Nude border: #D4BFB0  input underlines
  Muted tan:   #B89A82  labels / meta
  Shape:       Sharp — 0px border-radius everywhere
*/

// ─── Google Font ────────────────────────────────────────
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

// ─── Validation ─────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
  const e = {};
  if (!email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
  if (!password) e.password = "Password is required.";
  else if (password.length < 8)
    e.password = "Password must be at least 8 characters.";
  return e;
}

// ─── Reusable field wrapper ─────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-2">
    <label
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      className={`text-[10px] font-medium tracking-[0.2em] uppercase select-none transition-colors duration-300 ${
        error ? "text-red-500" : "text-[#B89A82]"
      }`}
    >
      {error ? error : label}
    </label>
    {children}
  </div>
);

// ─── Shared underline input style ───────────────────────
const inputCls =
  "w-full bg-transparent border-b border-[#D4BFB0] pb-2 pt-1 text-sm " +
  "text-black placeholder-[#B89A82]/50 outline-none " +
  "transition-colors duration-300 focus:border-black";

// ════════════════════════════════════════════════════════
//  LoginPage
// ════════════════════════════════════════════════════════
const LoginPage = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({ email: "", password: "" });

  // ui state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
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
      const user = await handleLogin(form);
      if (user.role === "buyer") {
        navigate("/"); // redirect to home on success
      } else if (user.role === "seller") {
        navigate("/seller/dashboard");
      }
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Layout ─────────────────────────────────────────────
  return (
    <>
      <FontLink />
      <div
        className="min-h-screen flex"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {/* ══ LEFT — Editorial image panel (desktop only) ══════ */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black flex-col">
          {/* Fashion editorial photo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80&auto=format&fit=crop')",
              filter: "grayscale(25%) contrast(1.1)",
            }}
          />
          {/* Deep gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-black/80" />

          {/* Brand mark — top */}
          <div className="relative z-10 p-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-1">
              Est. 2026
            </p>
            <h2 className="text-2xl font-extralight tracking-[0.4em] uppercase text-white">
              ORCERAL
            </h2>
          </div>

          {/* Quote — bottom */}
          <div className="relative z-10 mt-auto p-12">
            <div className="w-8 h-px bg-white/30 mb-6" />
            <blockquote className="text-white/80 text-lg font-extralight leading-relaxed tracking-wide max-w-xs">
              "Fashion is the armor to survive the reality of everyday life."
            </blockquote>
            <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-white/40">
              — Bill Cunningham
            </p>
          </div>
        </div>

        {/* ══ RIGHT — Login form panel ══════════════════════════ */}
        <div className="flex-1 bg-[#F5EDE3] flex items-center justify-center px-6 py-8 lg:px-0">
          <div className="w-full max-w-sm lg:max-w-md">
            {/* ── Header ── */}
            <div className="mb-8">
              {/* Mobile brand name */}
              <p className="lg:hidden text-[10px] tracking-[0.4em] uppercase text-[#B89A82] mb-4">
                Snitch
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#B89A82] mb-3">
                Welcome Back
              </p>
              <h1 className="text-4xl font-extralight tracking-[0.15em] uppercase text-black leading-tight">
                Sign In
              </h1>
              <div className="mt-5 w-8 h-px bg-[#D4BFB0]" />
            </div>

            {/* ── Server error banner ── */}
            {serverError && (
              <div className="mb-8 px-4 py-3.5 border border-[#D4BFB0] bg-white text-[11px] tracking-widest uppercase text-red-600">
                {serverError}
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

              {/* Password with show/hide toggle */}
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    autoComplete="current-password"
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

              {/* Forgot password */}
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-[10px] tracking-[0.18em] uppercase text-[#B89A82] hover:text-black underline underline-offset-4 decoration-[#D4BFB0] hover:decoration-black transition-all duration-200"
                >
                  Forgot password?
                </a>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[#D4BFB0]" />

              {/* CTA button */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className={
                  "w-full py-3.5 text-[11px] tracking-[0.35em] uppercase font-medium " +
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
                    Signing In
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* ── Or divider ── */}
            <div className="flex items-center gap-4 mt-5">
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
            <ContinueWithGoogle />

            {/* ── Footer ── */}
            <p className="mt-5 text-[10px] tracking-[0.2em] uppercase text-[#B89A82] text-center">
              New to Snitch?{" "}
              <Link
                to="/register"
                className="text-black underline underline-offset-4 decoration-[#D4BFB0] hover:decoration-black transition-all duration-200"
              >
                Create Account
              </Link>
            </p>

            {/* Fine-print */}
            <p className="mt-4 text-center text-[10px] text-[#B89A82]/60 tracking-wide leading-relaxed">
              Protected by industry-standard encryption.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
