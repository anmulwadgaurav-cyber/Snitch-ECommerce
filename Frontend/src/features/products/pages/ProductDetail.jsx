import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import { current } from "@reduxjs/toolkit";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const FONT = { fontFamily: "'Be Vietnam Pro', sans-serif" };

const Navbar = () => (
  <nav className="h-20 border-b border-[#D4BFB0] bg-[#F5EDE3] flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
    <div className="flex gap-10 items-center">
      <Link
        to="/"
        className="text-2xl tracking-[0.2em] font-medium text-black uppercase"
      >
        ORCERAL
      </Link>
      <div className="hidden md:flex gap-8 mt-1">
        <Link
          to="#"
          className="text-[10px] tracking-[0.15em] font-bold uppercase text-black hover:text-[#B89A82] transition-colors"
        >
          MEN
        </Link>
        <Link
          to="#"
          className="text-[10px] tracking-[0.15em] font-bold uppercase text-black hover:text-[#B89A82] transition-colors"
        >
          WOMEN
        </Link>
        <Link
          to="#"
          className="text-[10px] tracking-[0.15em] font-bold uppercase text-black hover:text-[#B89A82] transition-colors"
        >
          NEW IN
        </Link>
      </div>
    </div>
    <div className="flex gap-6 items-center">
      <button className="text-black hover:text-[#B89A82] transition-colors">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
      <Link
        to="/login"
        className="text-black hover:text-[#B89A82] transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </Link>
      <button className="text-black hover:text-[#B89A82] transition-colors relative">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center font-bold">
          0
        </span>
      </button>
    </div>
  </nav>
);

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetailsById } = useProduct();
  const { handleAddItem } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const normalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const availableAttributes = useMemo(() => {
    if (!product?.variants) return {};
    const attrs = {};
    product.variants.forEach((variant) => {
      Object.entries(variant.attributes || {}).forEach(([key, val]) => {
        const nKey = normalize(key);
        if (!attrs[nKey]) attrs[nKey] = new Set();
        // keep the first casing encountered
        const existing = Array.from(attrs[nKey]).find(
          (e) => String(e).toLowerCase() === String(val).toLowerCase(),
        );
        if (!existing) {
          attrs[nKey].add(val);
        }
      });
    });
    return Object.fromEntries(
      Object.entries(attrs).map(([k, v]) => [k, Array.from(v)]),
    );
  }, [product]);

  useEffect(() => {
    if (
      product?.variants?.length > 0 &&
      Object.keys(selectedAttributes).length === 0
    ) {
      const firstVarAttrs = product.variants[0].attributes || {};
      const initialSelection = {};
      Object.entries(firstVarAttrs).forEach(([k, v]) => {
        initialSelection[normalize(k)] = v;
      });
      setSelectedAttributes(initialSelection);
    }
  }, [product, selectedAttributes]);

  const handleAttributeSelect = (key, value) => {
    if (!product?.variants) return;
    const mergedSelection = { ...selectedAttributes, [key]: value };

    let bestVariant = product.variants.find((v) => {
      return Object.entries(mergedSelection).every(([sk, sv]) => {
        const ok = Object.keys(v.attributes || {}).find(
          (vk) => normalize(vk) === sk,
        );
        return (
          ok &&
          String(v.attributes[ok]).toLowerCase() === String(sv).toLowerCase()
        );
      });
    });

    if (!bestVariant) {
      bestVariant = product.variants.find((v) => {
        const ok = Object.keys(v.attributes || {}).find(
          (vk) => normalize(vk) === key,
        );
        return (
          ok &&
          String(v.attributes[ok]).toLowerCase() === String(value).toLowerCase()
        );
      });
    }

    if (bestVariant) {
      const newSelection = {};
      Object.entries(bestVariant.attributes || {}).forEach(([k, v]) => {
        newSelection[normalize(k)] = v;
      });
      setSelectedAttributes(newSelection);
    }
  };

  const currentVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return (
      product.variants.find((v) => {
        const varKeys = Object.keys(v.attributes || {});
        const selKeys = Object.keys(selectedAttributes);
        if (varKeys.length !== selKeys.length) return false;

        return varKeys.every((vk) => {
          const nk = normalize(vk);
          return (
            String(v.attributes[vk]).toLowerCase() ===
            String(selectedAttributes[nk]).toLowerCase()
          );
        });
      }) || product.variants[0]
    );
  }, [product, selectedAttributes]);

  useEffect(() => {
    setActiveImage(0);
  }, [currentVariant]);

  const displayImages =
    currentVariant?.images?.length > 0
      ? currentVariant.images
      : product?.images;
  const displayPrice = currentVariant?.price?.amount
    ? currentVariant.price
    : product?.price;
  const safeActiveImage =
    displayImages && activeImage < displayImages.length ? activeImage : 0;

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const data = await handleGetProductDetailsById(productId);
        setProduct(data);
      } catch (error) {
        console.log("Error fetching products", error);
      }
    }
    fetchProductDetails();
  }, [productId]);

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayImages?.length) {
      setActiveImage((prev) => {
        const current = prev < displayImages.length ? prev : 0;
        return current === 0 ? displayImages.length - 1 : current - 1;
      });
    }
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayImages?.length) {
      setActiveImage((prev) => {
        const current = prev < displayImages.length ? prev : 0;
        return current === displayImages.length - 1 ? 0 : current + 1;
      });
    }
  };

  if (!product) {
    return (
      <>
        <FontLink />
        <div
          className="min-h-screen bg-[#F5EDE3] flex flex-col font-['Be_Vietnam_Pro'] selection:bg-[#D4BFB0] selection:text-black"
          style={FONT}
        >
          <Navbar />
          <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 md:px-12 py-8 md:py-16 animate-pulse">
            {/* Breadcrumbs Skeleton */}
            <div className="mb-10 flex items-center gap-3">
              <div className="h-3 w-12 bg-[#D4BFB0]/40 rounded-sm"></div>
              <span className="text-[#D4BFB0]/40">/</span>
              <div className="h-3 w-20 bg-[#D4BFB0]/40 rounded-sm"></div>
              <span className="text-[#D4BFB0]/40">/</span>
              <div className="h-3 w-32 bg-[#D4BFB0]/40 rounded-sm"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
              {/* Left: Image Gallery Skeleton */}
              <div className="w-full lg:w-[55%] flex flex-col md:flex-row gap-4 h-auto lg:h-[80vh]">
                {/* Thumbnails Skeleton */}
                <div className="flex md:flex-col gap-4 overflow-hidden md:w-[100px] shrink-0 order-2 md:order-1">
                  {[1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="w-20 h-24 md:w-full md:h-[120px] shrink-0 bg-[#D4BFB0]/30"
                    ></div>
                  ))}
                </div>
                {/* Main Image Skeleton */}
                <div className="flex-1 bg-[#D4BFB0]/30 order-1 md:order-2 h-[60vh] md:h-full"></div>
              </div>

              {/* Right: Product Info Skeleton */}
              <div className="w-full lg:w-[45%] flex flex-col pt-4 lg:pt-10">
                {/* Title */}
                <div className="h-10 w-3/4 bg-[#D4BFB0]/40 mb-6"></div>
                {/* Price */}
                <div className="h-8 w-1/4 bg-[#D4BFB0]/40 mb-8"></div>

                {/* Divider */}
                <div className="w-12 h-px bg-[#D4BFB0] mb-8"></div>

                {/* Description */}
                <div className="space-y-3 mb-12">
                  <div className="h-4 w-full bg-[#D4BFB0]/30"></div>
                  <div className="h-4 w-full bg-[#D4BFB0]/30"></div>
                  <div className="h-4 w-5/6 bg-[#D4BFB0]/30"></div>
                  <div className="h-4 w-4/6 bg-[#D4BFB0]/30"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <div className="flex-1 h-14 bg-[#D4BFB0]/40"></div>
                  <div className="flex-1 h-14 bg-[#D4BFB0]/60"></div>
                </div>

                {/* Accordions */}
                <div className="mt-16 border-t border-[#D4BFB0]">
                  <div className="py-6 border-b border-[#D4BFB0] flex justify-between items-center">
                    <div className="h-3 w-32 bg-[#D4BFB0]/40"></div>
                    <div className="h-4 w-4 bg-[#D4BFB0]/40"></div>
                  </div>
                  <div className="py-6 border-b border-[#D4BFB0] flex justify-between items-center">
                    <div className="h-3 w-24 bg-[#D4BFB0]/40"></div>
                    <div className="h-4 w-4 bg-[#D4BFB0]/40"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="border-t border-[#D4BFB0] bg-[#FAF7F2] py-12 mt-12 animate-pulse">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="h-6 w-32 bg-[#D4BFB0]/40"></div>
              <div className="flex gap-6">
                <div className="h-3 w-16 bg-[#D4BFB0]/40"></div>
                <div className="h-3 w-16 bg-[#D4BFB0]/40"></div>
              </div>
            </div>
          </footer>
        </div>
      </>
    );
  }

  return (
    <>
      <FontLink />
      <div
        className="min-h-screen bg-[#F5EDE3] flex flex-col font-['Be_Vietnam_Pro'] selection:bg-[#D4BFB0] selection:text-black"
        style={FONT}
      >
        <Navbar />

        <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 md:px-12 py-8 md:py-16">
          {/* Breadcrumbs */}
          <div className="mb-10 flex items-center gap-3 text-[10px] tracking-[0.15em] font-medium uppercase text-[#B89A82]">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/" className="hover:text-black transition-colors">
              New Arrivals
            </Link>
            <span>/</span>
            <span className="text-black">{product.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-[55%] flex flex-col md:flex-row gap-4 h-auto lg:h-[80vh]">
              {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
              {displayImages && displayImages.length > 1 && (
                <div className="flex md:flex-col gap-4 overflow-auto md:w-[100px] shrink-0 no-scrollbar order-2 md:order-1">
                  {displayImages.map((img, idx) => (
                    <button
                      key={img._id || idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-24 md:w-full md:h-[120px] shrink-0 border transition-all duration-300 ${
                        safeActiveImage === idx
                          ? "border-black"
                          : "border-[#D4BFB0] hover:border-black/50"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 bg-[#FAF7F2] border border-[#D4BFB0] overflow-hidden order-1 md:order-2 h-[60vh] md:h-full relative group">
                {displayImages && displayImages.length > 0 ? (
                  <>
                    <img
                      src={displayImages[safeActiveImage]?.url}
                      alt={product.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Navigation Arrows */}
                    {displayImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm border border-[#D4BFB0] flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white shadow-sm"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm border border-[#D4BFB0] flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white shadow-sm"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[#B89A82]">
                    <span className="text-[12px] tracking-widest uppercase font-medium">
                      No Image Available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="w-full lg:w-[45%] flex flex-col pt-4 lg:pt-10">
              <h1 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase text-black mb-4 leading-tight">
                {product.title}
              </h1>

              <div className="text-xl md:text-2xl font-medium tracking-[0.1em] text-black uppercase mb-8">
                {displayPrice?.currency}{" "}
                {displayPrice?.amount?.toLocaleString()}
              </div>

              <div className="w-12 h-px bg-[#D4BFB0] mb-8"></div>

              {/* Attributes Selection */}
              {Object.keys(availableAttributes).length > 0 && (
                <div className="mb-8 space-y-6">
                  {Object.entries(availableAttributes).map(
                    ([attrKey, values]) => (
                      <div key={attrKey}>
                        <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#B89A82] uppercase mb-3">
                          {attrKey}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {values.map((val, idx) => {
                            const isSelected =
                              String(
                                selectedAttributes[attrKey],
                              ).toLowerCase() === String(val).toLowerCase();
                            return (
                              <button
                                key={idx}
                                onClick={() =>
                                  handleAttributeSelect(attrKey, val)
                                }
                                className={`px-4 py-2 text-[11px] font-bold tracking-[0.1em] uppercase transition-all duration-300 border ${
                                  isSelected
                                    ? "border-black bg-black text-white"
                                    : "border-[#D4BFB0] bg-transparent text-black hover:border-black"
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              <div className="prose prose-sm text-[#5A4F46] font-light leading-relaxed mb-12">
                <p className="text-sm">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem({
                      productId: productId,
                      variantId: currentVariant._id,
                    });
                  }}
                  className="flex-1 bg-transparent border border-black text-black px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300"
                >
                  Add to Cart
                </button>
                <button className="flex-1 bg-black border border-black text-white px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#B89A82] hover:border-[#B89A82] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(212,191,176,0.6)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
                  Buy Now
                </button>
              </div>

              {/* Accordions / Extra Info (Static for design) */}
              <div className="mt-16 border-t border-[#D4BFB0]">
                <div className="py-6 border-b border-[#D4BFB0] flex justify-between items-center cursor-pointer group">
                  <span className="text-[11px] tracking-[0.15em] font-bold uppercase text-black group-hover:text-[#B89A82] transition-colors">
                    Shipping & Returns
                  </span>
                  <svg
                    className="w-4 h-4 text-black group-hover:text-[#B89A82] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
                <div className="py-6 border-b border-[#D4BFB0] flex justify-between items-center cursor-pointer group">
                  <span className="text-[11px] tracking-[0.15em] font-bold uppercase text-black group-hover:text-[#B89A82] transition-colors">
                    Fabric & Care
                  </span>
                  <svg
                    className="w-4 h-4 text-black group-hover:text-[#B89A82] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#D4BFB0] bg-[#FAF7F2] py-12 mt-12">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl tracking-[0.2em] font-medium text-black uppercase">
              ORCERAL
            </div>
            <div className="flex gap-6">
              <Link
                to="#"
                className="text-[10px] tracking-[0.15em] font-bold text-black uppercase hover:text-[#B89A82] transition-colors"
              >
                Instagram
              </Link>
              <Link
                to="#"
                className="text-[10px] tracking-[0.15em] font-bold text-black uppercase hover:text-[#B89A82] transition-colors"
              >
                Twitter
              </Link>
            </div>
            <p className="text-[10px] tracking-[0.15em] text-[#B89A82] uppercase font-medium">
              © 2026 Orceral Studio.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ProductDetail;
