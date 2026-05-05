import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

/*
  Design System: "Linen & Ink" — ORCERAL
  ─────────────────────────────────────────────
  Font:        Be Vietnam Pro
  Background:  #F5EDE3  warm linen
  Surface:     #FFFFFF  pure white
  Primary:     #000000  black
  Nude border: #D4BFB0
  Muted tan:   #B89A82  labels / meta
  Accent:      #1A1A1A  dark grey for subtle depths
  Shape:       Sharp — 0px border-radius everywhere
*/

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const FONT = { fontFamily: "'Be Vietnam Pro', sans-serif" };

// ─── Shared UI Components ─────────────────────────────────

const inputBase =
  "w-full bg-[#FAF7F2] border border-[#D4BFB0] px-4 py-3 text-sm " +
  "text-black placeholder-[#B89A82]/50 outline-none " +
  "transition-all duration-300 focus:border-black focus:bg-white hover:border-[#B89A82]";

const Field = ({ label, error, children, className = "" }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label
      style={FONT}
      className={`text-[10px] font-medium tracking-[0.2em] uppercase select-none transition-colors duration-300 ${
        error ? "text-red-500" : "text-[#B89A82]"
      }`}
    >
      {error ? error : label}
    </label>
    {children}
  </div>
);

const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-6">
    <h3
      style={FONT}
      className="text-sm font-medium tracking-[0.15em] uppercase text-black mb-1"
    >
      {title}
    </h3>
    {subtitle && <p className="text-[11px] text-[#B89A82]">{subtitle}</p>}
  </div>
);

const SidebarItem = ({ active, icon, label }) => (
  <button
    type="button"
    className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-medium tracking-[0.15em] uppercase transition-all duration-300 ${
      active
        ? "bg-black text-white"
        : "text-[#B89A82] hover:bg-[#EBE0D3] hover:text-black"
    }`}
  >
    {icon}
    {label}
  </button>
);

const CURRENCIES = ["INR", "USD", "EUR", "JPY", "GBP"];
const MAX_IMAGES = 7;

// ════════════════════════════════════════════════════════
//  CreateProduct Page
// ════════════════════════════════════════════════════════
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (serverError) setServerError("");
  };

  const addFiles = useCallback(
    (files) => {
      const valid = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );
      const slots = MAX_IMAGES - images.length;
      const toAdd = valid.slice(0, slots);
      if (!toAdd.length) return;
      const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
      setImages((p) => [...p, ...toAdd]);
      setPreviews((p) => [...p, ...newPreviews]);
      if (errors.images) setErrors((p) => ({ ...p, images: "" }));
    },
    [images, errors],
  );

  const removeImage = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setImages((p) => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
    setActiveIdx((prev) =>
      Math.max(0, prev === idx ? prev - 1 : prev > idx ? prev - 1 : prev),
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Product name required";
    if (!form.description.trim())
      e.description = "Product description required";
    if (!form.priceAmount) e.priceAmount = "Price amount required";
    else if (isNaN(form.priceAmount) || Number(form.priceAmount) <= 0)
      e.priceAmount = "Invalid price amount";
    if (!images.length) e.images = "At least one image is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("priceAmount", form.priceAmount);
      fd.append("priceCurrency", form.priceCurrency);
      images.forEach((img) => fd.append("images", img));
      await handleCreateProduct(fd);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <FontLink />
        <div
          className="min-h-screen bg-[#F5EDE3] flex items-center justify-center"
          style={FONT}
        >
          <div className="text-center space-y-8 px-8 animate-fade-in">
            <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.4em] uppercase text-[#B89A82] mb-4">
                Success
              </p>
              <h1 className="text-5xl font-light tracking-[0.1em] uppercase text-black">
                Product Live
              </h1>
            </div>
            <div className="w-12 h-px bg-[#D4BFB0] mx-auto" />
            <p className="text-sm text-[#B89A82] font-light">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#F5EDE3] flex" style={FONT}>
        {/* ══ Main Content ══════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Topbar */}
          <header className="h-20 border-b border-[#D4BFB0] bg-[#F5EDE3] flex items-center justify-between px-8 lg:px-12 sticky top-0 z-20">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => navigate("/seller/dashboard")}
                className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-medium text-[#B89A82] hover:text-black transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <div className="h-4 w-[1px] bg-[#D4BFB0] hidden sm:block"></div>

              <h1 className="text-xl lg:text-2xl font-light tracking-[0.15em] uppercase text-black">
                New Listing
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden sm:block px-6 py-3 text-[10px] tracking-[0.2em] uppercase font-medium border border-[#D4BFB0] text-black hover:bg-[#EBE0D3] transition-colors">
                Save Draft
              </button>
              <button
                form="product-form"
                type="submit"
                disabled={isLoading}
                className={
                  "px-6 py-3 text-[10px] tracking-[0.2em] uppercase font-medium transition-all " +
                  (isLoading
                    ? "bg-[#D4BFB0] text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-[#1A1A1A] active:scale-[0.98]")
                }
              >
                {isLoading ? "Publishing..." : "Publish Product"}
              </button>
            </div>
          </header>

          {/* Form Area */}
          <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
            {serverError && (
              <div className="mb-8 p-4 border border-red-200 bg-red-50 text-[11px] tracking-widest uppercase text-red-600 flex items-center gap-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {serverError}
              </div>
            )}

            <form
              id="product-form"
              onSubmit={handleSubmit}
              noValidate
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 max-w-7xl mx-auto"
            >
              {/* Left Column: Details */}
              <div className="space-y-8">
                {/* General Info Card */}
                <div className="bg-white p-8 border border-[#D4BFB0] shadow-[4px_4px_0px_0px_rgba(212,191,176,0.3)]">
                  <SectionHeading
                    title="General Information"
                    subtitle="Basic details about your product."
                  />

                  <div className="space-y-6">
                    <Field label="Product Name" error={errors.title}>
                      <input
                        id="title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Classic Oxford Shirt"
                        className={inputBase}
                      />
                    </Field>

                    <Field label="Description" error={errors.description}>
                      <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Detail the fabric, fit, and care instructions..."
                        rows={6}
                        className={inputBase + " resize-y min-h-[120px]"}
                      />
                    </Field>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-white p-8 border border-[#D4BFB0] shadow-[4px_4px_0px_0px_rgba(212,191,176,0.3)]">
                  <SectionHeading
                    title="Pricing & Currency"
                    subtitle="Set your base price."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Base Price" error={errors.priceAmount}>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B89A82] select-none pointer-events-none font-medium">
                          {form.priceCurrency === "INR"
                            ? "₹"
                            : form.priceCurrency === "USD"
                              ? "$"
                              : form.priceCurrency === "EUR"
                                ? "€"
                                : form.priceCurrency === "JPY"
                                  ? "¥"
                                  : "£"}
                        </span>
                        <input
                          id="priceAmount"
                          type="number"
                          name="priceAmount"
                          value={form.priceAmount}
                          onChange={handleChange}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={inputBase + " pl-10"}
                        />
                      </div>
                    </Field>

                    <Field label="Currency" error={errors.priceCurrency}>
                      <select
                        id="priceCurrency"
                        name="priceCurrency"
                        value={form.priceCurrency}
                        onChange={handleChange}
                        className={
                          inputBase + " cursor-pointer appearance-none"
                        }
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' viewBox='0 0 10 6'%3E%3Cpath stroke='%231A1A1A' stroke-width='1.5' d='M1 1l4 4 4-4'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 16px center",
                        }}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>

              {/* Right Column: Media */}
              <div className="flex flex-col h-full">
                <div className="flex-1 bg-white p-8 border border-[#D4BFB0] shadow-[4px_4px_0px_0px_rgba(212,191,176,0.3)] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3
                        style={FONT}
                        className="text-sm font-medium tracking-[0.15em] uppercase text-black mb-1"
                      >
                        Media
                      </h3>
                      <p className="text-[11px] text-[#B89A82]">
                        First image is the cover.
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-widest ${errors.images ? "text-red-500" : "text-[#B89A82]"}`}
                    >
                      {images.length}/{MAX_IMAGES}
                    </span>
                  </div>

                  {/* Preview + Vertical Thumbnail Strip */}
                  <div className="flex gap-3 flex-1 min-h-[420px]">
                    {/* Main Preview */}
                    <div
                      className={`flex-1 relative overflow-hidden group bg-[#FAF7F2] border transition-colors duration-300 ${errors.images ? "border-red-500" : "border-[#D4BFB0]"}`}
                    >
                      {previews.length > 0 ? (
                        <>
                          <img
                            src={previews[activeIdx] ?? previews[0]}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                          {activeIdx === 0 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <span className="text-white text-[10px] tracking-widest uppercase font-medium">
                                Cover Image
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className={`absolute inset-0 flex flex-col items-center justify-center transition-colors duration-300 ${errors.images ? "text-red-500" : "text-[#B89A82]"}`}
                        >
                          <svg
                            className="w-12 h-12 mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a.75.75 0 00.75-.75V6.375a2.625 2.625 0 00-2.625-2.625H4.875A2.625 2.625 0 002.25 6.375V20.25A.75.75 0 003 21z"
                            />
                          </svg>
                          <p className="text-[10px] tracking-[0.2em] uppercase font-medium">
                            {errors.images ? errors.images : "No media"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Vertical Thumbnail Strip (right side) */}
                    <div className="w-[72px] shrink-0 flex flex-col gap-2 overflow-y-auto">
                      {previews.map((src, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveIdx(idx)}
                          className={`group/thumb relative w-[72px] h-[72px] shrink-0 cursor-pointer border transition-all duration-200 ${
                            activeIdx === idx
                              ? "border-black ring-1 ring-black"
                              : "border-[#D4BFB0] hover:border-black/50"
                          }`}
                        >
                          <img
                            src={src}
                            alt={`Thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute inset-0 m-auto w-6 h-6 bg-black text-white flex items-center justify-center shadow-md hover:bg-red-500 transition-all z-10 opacity-0 scale-75 group-hover/thumb:opacity-100 group-hover/thumb:scale-100 rounded-sm"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {/* Add Photo — square button */}
                      {images.length < MAX_IMAGES && (
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-[72px] h-[72px] shrink-0 border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-300 ${
                            isDragging
                              ? "border-black bg-[#F5EDE3]"
                              : "border-[#D4BFB0] hover:border-black hover:bg-[#FAF7F2]"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 transition-colors duration-300 ${isDragging ? "text-black" : "text-[#B89A82]"}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => addFiles(e.target.files)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
