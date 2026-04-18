import React, { useState, useRef, useCallback } from "react";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiUploadCloud2Line,
  RiAddLine,
  RiCloseLine,
  RiImageLine,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiGlobalLine,
  RiStoreLine,
  RiCheckLine,
  RiLoader4Line,
  RiUserLine,
  RiBellLine,
} from "@remixicon/react";
import { useProduct } from "../hook/useProduct.js";
import { Link, useNavigate } from "react-router";

/* ─── constants ──────────────────────────────────────────────────── */
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "JPY"];
const MAX_IMAGES = 7;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 10;

/* ─── helpers ────────────────────────────────────────────────────── */
function readFileAsDataURL(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

/* ─── sub-components ─────────────────────────────────────────────── */

/** Single image preview slot */
const ImageSlot = ({ src, onRemove, isEmpty }) => {
  if (isEmpty) {
    return (
      <div className="relative aspect-square bg-brand-bg border border-dashed border-brand-secondary/30 flex items-center justify-center group cursor-pointer hover:border-brand-accent1/50 transition-colors duration-200">
        <RiAddLine
          className="text-brand-secondary/40 group-hover:text-brand-accent1/60 transition-colors"
          size={20}
        />
      </div>
    );
  }
  return (
    <div className="relative aspect-square bg-brand-bg overflow-hidden group">
      <img
        src={src}
        alt="product preview"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/30 transition-all duration-200 flex items-center justify-center">
        <button
          type="button"
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-accent1 text-white p-1 hover:bg-brand-accent2"
        >
          <RiCloseLine size={14} />
        </button>
      </div>
      {/* uploaded indicator */}
      <span className="absolute bottom-1 right-1 bg-brand-accent1 text-white p-0.5">
        <RiCheckLine size={10} />
      </span>
    </div>
  );
};

/** Label + field wrapper */
const FormField = ({ label, required, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold uppercase tracking-widest text-brand-secondary">
      {label}
      {required && <span className="text-brand-accent1 ml-1">*</span>}
    </label>
    {children}
  </div>
);

/** Section heading with left red bar */
const SectionHeading = ({ children }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-0.5 h-5 bg-brand-accent1" />
    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">
      {children}
    </span>
  </div>
);

/* ─── main component ──────────────────────────────────────────────── */
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  /* form state */
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });
  const [images, setImages] = useState([]); // array of { file, preview }
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  /* handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const processFiles = useCallback(
    async (files) => {
      const valid = Array.from(files).filter((f) => {
        if (!ACCEPTED_TYPES.includes(f.type)) return false;
        if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
        return true;
      });

      const remaining = MAX_IMAGES - images.length;
      const toAdd = valid.slice(0, remaining);

      const withPreviews = await Promise.all(
        toAdd.map(async (file) => ({
          file,
          preview: await readFileAsDataURL(file),
        })),
      );
      setImages((prev) => [...prev, ...withPreviews]);
    },
    [images.length],
  );

  const handleFileInput = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Product title is required";
    if (!formData.description.trim())
      errs.description = "Description is required";
    if (
      !formData.priceAmount ||
      isNaN(formData.priceAmount) ||
      Number(formData.priceAmount) <= 0
    )
      errs.priceAmount = "Enter a valid price";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("priceAmount", formData.priceAmount);
      fd.append("priceCurrency", formData.priceCurrency);
      images.forEach(({ file }) => fd.append("images", file));

      await handleCreateProduct(fd);
      navigate("/seller/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* slot grid — always 7 slots */
  const slots = Array.from({ length: MAX_IMAGES }, (_, i) => images[i] ?? null);

  /* ─── render ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-brand-bg font-main flex flex-col">
      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-brand-secondary/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* logo */}
          <span className="text-xl font-black uppercase tracking-tighter text-brand-primary">
            Snitch
            <span className="text-brand-accent1">.</span>
          </span>

          {/* nav links */}
          <nav className="hidden lg:flex items-center gap-8">
            {["Dashboard", "Products", "Inventory", "Orders"].map((item) => (
              <button
                key={item}
                className="text-xs font-semibold uppercase tracking-widest text-brand-secondary hover:text-brand-primary transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* right actions */}
          <div className="flex items-center gap-3">
            <button className="text-brand-secondary hover:text-brand-primary transition-colors p-2">
              <RiBellLine size={20} />
            </button>
            <div className="w-8 h-8 bg-brand-primary flex items-center justify-center">
              <RiUserLine size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Page body ───────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-10">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            to="/seller/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-secondary hover:text-brand-primary transition-colors duration-200 group"
          >
            <RiArrowLeftLine
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            Dashboard
          </Link>
          <span className="text-brand-secondary/40 text-xs">/</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
            Create Product
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* ── LEFT COLUMN — Media ──────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* page title */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-brand-primary leading-tight mb-2">
                  Create New
                  <br />
                  <span className="text-brand-accent1">Product</span>
                </h1>
                <p className="text-sm text-brand-secondary leading-relaxed">
                  Fill in the details below to list your product on Snitch
                  marketplace.
                </p>
              </div>

              {/* drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() =>
                  images.length < MAX_IMAGES && fileInputRef.current?.click()
                }
                className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[220px]
                  ${
                    isDragging
                      ? "border-brand-accent1 bg-brand-accent1/5"
                      : "border-brand-secondary/30 hover:border-brand-accent1/50 bg-white/60"
                  }
                  ${images.length >= MAX_IMAGES ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div
                  className={`p-4 ${isDragging ? "bg-brand-accent1/10" : "bg-brand-accent1/5"} transition-colors duration-200`}
                >
                  <RiUploadCloud2Line
                    size={36}
                    className={`transition-colors duration-200 ${isDragging ? "text-brand-accent1" : "text-brand-accent1/70"}`}
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-brand-primary">
                    {isDragging
                      ? "Drop images here"
                      : "Drag & drop up to 7 images"}
                  </p>
                  <p className="text-xs text-brand-secondary mt-1">
                    PNG, JPG, WEBP — up to {MAX_SIZE_MB}MB each
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={images.length >= MAX_IMAGES}
                  className="mt-1 px-5 py-2 bg-brand-accent1 hover:bg-brand-accent2 text-white text-xs font-bold uppercase tracking-widest transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Browse Files
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={images.length >= MAX_IMAGES}
                />

                {/* counter badge */}
                <span className="absolute top-3 right-3 text-[10px] font-bold text-brand-secondary">
                  {images.length}/{MAX_IMAGES}
                </span>
              </div>

              {/* image preview slots grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {slots.map((slot, idx) =>
                  slot ? (
                    <ImageSlot
                      key={idx}
                      src={slot.preview}
                      onRemove={() => removeImage(idx)}
                      isEmpty={false}
                    />
                  ) : (
                    <ImageSlot key={idx} isEmpty />
                  ),
                )}
              </div>

              {/* tip */}
              <p className="text-xs text-brand-secondary/60 leading-relaxed">
                <span className="text-brand-accent1 font-semibold">Tip:</span>{" "}
                High quality images (1200×1200px or higher) significantly
                improve conversion rates.
              </p>
            </div>

            {/* ── RIGHT COLUMN — Form ──────────────────────────── */}
            <div className="lg:col-span-3">
              <div className="bg-white shadow-[0px_20px_60px_rgba(43,45,66,0.06)] p-8 sm:p-10 flex flex-col gap-8">
                {/* ── Product Details ─────────────────────────── */}
                <div>
                  <SectionHeading>
                    <RiFileTextLine size={14} className="inline mr-1" />
                    Product Details
                  </SectionHeading>

                  <div className="flex flex-col gap-6">
                    {/* Title */}
                    <FormField label="Product Title" required>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-brand-secondary/60">
                          <RiStoreLine size={16} />
                        </span>
                        <input
                          id="title"
                          name="title"
                          type="text"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Oversized Graphic Tee"
                          className={`w-full pl-9 pr-3 py-3 bg-brand-bg text-brand-primary text-sm placeholder:text-brand-secondary/50 border focus:outline-none focus:border-brand-accent1 focus:ring-0 transition-colors duration-200
                            ${errors.title ? "border-brand-accent1" : "border-brand-secondary/20"}`}
                        />
                      </div>
                      {errors.title && (
                        <span className="text-xs text-brand-accent1 font-medium">
                          {errors.title}
                        </span>
                      )}
                    </FormField>

                    {/* Description */}
                    <FormField label="Description" required>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe your product — material, fit, sizing guide, wash care..."
                        className={`w-full px-3 py-3 bg-brand-bg text-brand-primary text-sm placeholder:text-brand-secondary/50 border focus:outline-none focus:border-brand-accent1 resize-none transition-colors duration-200 leading-relaxed
                          ${errors.description ? "border-brand-accent1" : "border-brand-secondary/20"}`}
                      />
                      {errors.description && (
                        <span className="text-xs text-brand-accent1 font-medium">
                          {errors.description}
                        </span>
                      )}
                    </FormField>
                  </div>
                </div>

                {/* thin divider */}
                <div className="h-px bg-brand-secondary/10" />

                {/* ── Pricing ─────────────────────────────────── */}
                <div>
                  <SectionHeading>
                    <RiMoneyDollarCircleLine
                      size={14}
                      className="inline mr-1"
                    />
                    Pricing
                  </SectionHeading>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price Amount */}
                    <FormField label="Amount" required>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-brand-secondary/60 text-xs font-bold">
                          {formData.priceCurrency === "INR"
                            ? "₹"
                            : formData.priceCurrency === "EUR"
                              ? "€"
                              : formData.priceCurrency === "GBP"
                                ? "£"
                                : formData.priceCurrency === "JPY"
                                  ? "¥"
                                  : "$"}
                        </span>
                        <input
                          id="priceAmount"
                          name="priceAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.priceAmount}
                          onChange={handleChange}
                          placeholder="0.00"
                          className={`w-full pl-7 pr-3 py-3 bg-brand-bg text-brand-primary text-sm placeholder:text-brand-secondary/50 border focus:outline-none focus:border-brand-accent1 transition-colors duration-200
                            ${errors.priceAmount ? "border-brand-accent1" : "border-brand-secondary/20"}`}
                        />
                      </div>
                      {errors.priceAmount && (
                        <span className="text-xs text-brand-accent1 font-medium">
                          {errors.priceAmount}
                        </span>
                      )}
                    </FormField>

                    {/* Currency */}
                    <FormField label="Currency">
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-brand-secondary/60">
                          <RiGlobalLine size={16} />
                        </span>
                        <select
                          id="priceCurrency"
                          name="priceCurrency"
                          value={formData.priceCurrency}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-3 bg-brand-bg text-brand-primary text-sm border border-brand-secondary/20 focus:outline-none focus:border-brand-accent1 transition-colors duration-200 appearance-none cursor-pointer"
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {/* custom chevron */}
                        <span className="absolute right-3 pointer-events-none text-brand-secondary/50">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="currentColor"
                          >
                            <path
                              d="M2 4l4 4 4-4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </FormField>
                  </div>
                </div>

                {/* thin divider */}
                <div className="h-px bg-brand-secondary/10" />

                {/* ── CTA ─────────────────────────────────────── */}
                <button
                  id="publish-product-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-brand-accent1 hover:bg-brand-accent2 text-white text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(239,35,60,0.25)] hover:shadow-[0_4px_30px_rgba(239,35,60,0.35)]"
                >
                  {isSubmitting ? (
                    <>
                      <RiLoader4Line size={18} className="animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      Publish Product
                      <RiArrowRightLine
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                <p className="text-xs text-brand-secondary/60 text-center -mt-4">
                  Your product will be reviewed and listed within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-brand-secondary/10 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black uppercase tracking-tighter text-brand-primary">
            Snitch<span className="text-brand-accent1">.</span>
          </span>
          <p className="text-xs text-brand-secondary/60">
            © {new Date().getFullYear()} Snitch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CreateProduct;
