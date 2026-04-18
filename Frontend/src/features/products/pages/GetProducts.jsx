import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  RiAddLine,
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiBellLine,
  RiBox3Line,
  RiMore2Fill,
  RiUserLine,
  RiDashboardLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import { useProduct } from "../hook/useProduct";
import { useDispatch, useSelector } from "react-redux";
import { setSellerProducts } from "../state/product.slice";

const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

const GetProducts = () => {
  const { handleGetSellerProduct } = useProduct();

  const products = useSelector((state) => state.product.sellerProducts);

  // In real implementation:
  useEffect(() => {
    const fetchProducts = async () => {
      // setIsLoading(true);
      try {
        await handleGetSellerProduct();
      } catch (err) {
        console.error(err);
      } finally {
        // setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // console.log(products);

  return (
    <div className="min-h-screen bg-brand-bg font-main flex flex-col">
      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-brand-secondary/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <span className="text-xl font-black uppercase tracking-tighter text-brand-primary">
            Snitch<span className="text-brand-accent1">.</span>
          </span>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/seller/dashboard"
              className="text-xs font-semibold uppercase tracking-widest text-brand-primary transition-colors duration-200"
            >
              Dashboard
            </Link>
            {["Products", "Inventory", "Orders"].map((item) => (
              <button
                key={item}
                className="text-xs font-semibold uppercase tracking-widest text-brand-secondary hover:text-brand-primary transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </nav>

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
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-brand-accent1/10 flex items-center justify-center">
                <RiDashboardLine size={14} className="text-brand-accent1" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary">
                Seller Hub
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-brand-primary leading-tight">
              Products <span className="text-brand-accent1">Dashboard</span>
            </h1>
            <p className="text-sm text-brand-secondary mt-2">
              Manage your active product listings across the Snitch marketplace.
            </p>
          </div>

          <Link
            to="/seller/create-product"
            className="group flex items-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-accent1 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
          >
            <RiAddLine
              size={16}
              className="text-white/70 group-hover:text-white transition-colors"
            />
            Create Product
          </Link>
        </div>

        {/* Filters and Search Bar (Placeholder UI) */}
        <div className="flex items-center justify-between bg-white border border-brand-secondary/10 p-4 mb-8 shadow-[0_4px_20px_rgba(43,45,66,0.03)]">
          <div className="flex gap-4 items-center">
            <div className="text-xs font-bold text-brand-primary px-3 border-r border-brand-secondary/20">
              All Products ({products?.length})
            </div>
            <button className="text-xs text-brand-secondary hover:text-brand-primary transition-colors font-medium">
              Active
            </button>
            <button className="text-xs text-brand-secondary hover:text-brand-primary transition-colors font-medium">
              Drafts
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div
              key={product._id}
              className="group bg-white overflow-hidden shadow-[0_4px_20px_rgba(43,45,66,0.03)] hover:shadow-[0_10px_40px_rgba(43,45,66,0.08)] transition-all duration-300 flex flex-col border border-brand-secondary/10"
            >
              {/* Image Frame */}
              <div className="relative aspect-4/5 bg-brand-bg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <RiBox3Line size={32} className="text-brand-secondary/40" />
                  </div>
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 bg-white/90 backdrop-blur flex items-center justify-center text-brand-primary hover:text-brand-accent1 transition-colors">
                    <RiMore2Fill size={16} />
                  </button>
                </div>
              </div>

              {/* Data Underneath */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-sm font-bold text-brand-primary tracking-tight leading-snug truncate">
                    {product.title}
                  </h3>
                  <span className="text-xs font-bold text-brand-accent1 whitespace-nowrap">
                    {formatCurrency(
                      product.price.amount,
                      product.price.currency,
                    )}
                  </span>
                </div>

                <p className="text-xs text-brand-secondary/70 line-clamp-2 leading-relaxed mb-4 flex-1">
                  {product.description}
                </p>

                <div className="pt-4 mt-auto border-t border-brand-secondary/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-secondary/60">
                    {formatDate(product.createdAt)}
                  </span>
                  <Link
                    to={`/seller/product/${product._id}`}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-accent1 transition-colors"
                  >
                    View Detail
                    <RiArrowRightUpLine size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Create New Card */}
          {products?.length < 12 && (
            <Link
              to="/seller/create-product"
              className="group border-2 border-dashed border-brand-secondary/20 hover:border-brand-accent1/50 bg-white/40 hover:bg-brand-accent1/5 transition-all duration-300 flex flex-col items-center justify-center aspect-4/5 gap-4 p-6 min-h-[300px]"
            >
              <div className="w-12 h-12 bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_4px_20px_rgba(43,45,66,0.06)]">
                <RiAddLine size={24} className="text-brand-accent1" />
              </div>
              <div className="text-center">
                <span className="block text-sm font-bold text-brand-primary mb-1">
                  Add New Product
                </span>
                <span className="block text-xs text-brand-secondary">
                  Expand your catalog
                </span>
              </div>
            </Link>
          )}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-brand-secondary/10 py-8 bg-white/50">
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

export default GetProducts;
