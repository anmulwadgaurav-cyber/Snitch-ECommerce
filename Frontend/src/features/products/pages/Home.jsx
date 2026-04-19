import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const defaultImage = product.images?.[0]?.url;
  const hoverImage = product.images?.[1]?.url || defaultImage;

  return (
    <div
      className="group cursor-pointer flex flex-col gap-4 font-main"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => {
          navigate(`/product/${product._id}`);
        }}
        className="relative aspect-3/4 w-full overflow-hidden bg-brand-bg"
      >
        {defaultImage ? (
          <>
            {/* Base Image */}
            <img
              src={defaultImage}
              alt={product.title}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${isHovered ? "opacity-0" : "opacity-100"}`}
            />
            {/* Hover Image */}
            <img
              src={hoverImage}
              alt={`${product.title} alternate view`}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${isHovered ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-secondary">
            No Image
          </div>
        )}

        {/* Quick Add Button - Appears on Hover */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button className="w-full bg-brand-bg/95 backdrop-blur-sm text-brand-primary py-3 font-semibold uppercase tracking-widest text-xs hover:bg-brand-accent1 hover:text-white transition-colors duration-300">
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col space-y-1 mt-2">
        <h3 className="text-sm font-medium text-brand-primary uppercase tracking-widest truncate">
          {product.title}
        </h3>
        <p className="text-sm font-medium text-brand-secondary">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: product.price?.currency || "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(product.price?.amount || 0)}
        </p>
      </div>
    </div>
  );
};

const Home = () => {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAllProducts() {
      setIsLoading(true);
      await handleGetAllProducts();
      setIsLoading(false);
    }
    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary font-main">
      {/* Simple Header with SNITCH logo */}
      <nav
        className="w-full px-12 py-5 flex items-center justify-between border-b"
        style={{ borderColor: "var(--color-brand-secondary)20" }}
      >
        <div className="flex items-center gap-4">
          {/* SNITCH Logo text reference */}
          <h1 className="text-3xl font-black tracking-[0.2em] uppercase text-brand-primary">
            Snitch
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase font-semibold text-brand-secondary">
          <a href="#new" className="hover:text-brand-accent1 transition-colors">
            New Arrivals
          </a>
          <a
            href="#collection"
            className="hover:text-brand-accent1 transition-colors"
          >
            Collection
          </a>
          <a
            href="#about"
            className="hover:text-brand-accent1 transition-colors"
          >
            About
          </a>
        </div>
        <div className="flex items-center gap-4 text-brand-primary">
          <button className="hover:text-brand-accent1 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
          <button className="hover:text-brand-accent1 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-brand-primary flex items-center justify-center overflow-hidden">
        <img
          src="https://ik.imagekit.io/ochzwoeqp/snitch/modelTwo_LPa9BxgBv.jpg"
          alt="Snitch Collection Hero"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-primary/90 via-brand-primary/40 to-transparent"></div>

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <span className="text-brand-accent1 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4">
            Spring / Summer 2026
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-brand-bg tracking-widest uppercase mb-6 drop-shadow-xl">
            The Essentials
          </h1>
          <p className="text-brand-secondary justify-center max-w-xl mx-auto text-sm md:text-base tracking-widest font-medium mb-10 block">
            Redefining modern streetwear with sharp cuts and minimalist
            aesthetics.
          </p>
          <button className="px-10 py-4 bg-brand-accent1 text-brand-bg text-xs md:text-sm uppercase tracking-widest font-bold hover:bg-brand-accent2 transition-colors duration-300 w-max">
            Shop The Collection
          </button>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b pb-6 gap-4"
          style={{ borderColor: "var(--color-brand-secondary)40" }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-widest uppercase text-brand-primary">
              New Arrivals
            </h2>
            <p className="text-sm text-brand-secondary mt-2 tracking-wide font-medium">
              Latest additions to our catalog
            </p>
          </div>
          <button className="text-xs text-brand-secondary uppercase tracking-widest font-bold hover:text-brand-accent1 transition-colors self-start md:self-auto">
            View All Products &rarr;
          </button>
        </div>

        {isLoading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-bg border-t-brand-accent1 rounded-full animate-spin"></div>
            <p className="text-xs text-brand-secondary uppercase tracking-widest font-bold">
              Loading Collection...
            </p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-brand-primary/5 rounded-full p-8 mb-6">
              <svg
                className="w-8 h-8 text-brand-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-black text-brand-primary tracking-widest uppercase mb-2">
              No Products Found
            </h3>
            <p className="text-sm text-brand-secondary max-w-md">
              We couldn't find any products at the moment. Please check back
              later for new drops.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
