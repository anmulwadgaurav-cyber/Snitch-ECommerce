import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

const DetailedPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    async function fetchById() {
      setIsLoading(true);
      try {
        const data = await handleGetProductById(productId);
        setProduct(data);
        if (data?.images?.length > 0) {
          setActiveImage(data.images[0].url);
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (productId) {
      fetchById();
    }
  }, [productId]);

  const handlePrevImage = () => {
    if (!product?.images || product.images.length <= 1) return;
    const currentIndex = product.images.findIndex((img) => img.url === activeImage);
    if (currentIndex > 0) {
      setActiveImage(product.images[currentIndex - 1].url);
    } else {
      setActiveImage(product.images[product.images.length - 1].url);
    }
  };

  const handleNextImage = () => {
    if (!product?.images || product.images.length <= 1) return;
    const currentIndex = product.images.findIndex((img) => img.url === activeImage);
    if (currentIndex < product.images.length - 1) {
      setActiveImage(product.images[currentIndex + 1].url);
    } else {
      setActiveImage(product.images[0].url);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-main">
        <div className="w-12 h-12 border-4 border-brand-bg border-t-brand-accent1 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center font-main text-brand-primary">
        <h2 className="text-2xl font-black uppercase tracking-widest mb-4">
          Product Not Found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-bg transition-colors uppercase tracking-widest text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg font-main text-brand-primary">
      {/* Header */}
      <nav
        className="w-full px-6 md:px-12 py-5 flex items-center justify-between border-b"
        style={{ borderColor: "var(--color-brand-secondary)20" }}
      >
        <button
          onClick={() => navigate("/")}
          className="text-brand-secondary hover:text-brand-accent1 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        >
          &larr; Back
        </button>
        <h1
          className="text-2xl font-black tracking-[0.2em] uppercase cursor-pointer text-brand-primary"
          onClick={() => navigate("/")}
        >
          Snitch
        </h1>
        <div className="w-16"></div> {/* Spacer for center alignment */}
      </nav>

      {/* Main Content Product View */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col-reverse md:grid md:grid-cols-12 gap-4 md:gap-6">
            {/* Thumbnails (If more than one image) - Rendered vertically on the left on Desktop */}
            {product.images && product.images.length > 1 ? (
              <div className="md:col-span-2">
                <div className="flex flex-row md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-y-auto w-full max-h-none md:max-h-[600px] lg:max-h-[750px] scrollbar-none pb-2 md:pb-0">
                  {product.images.map((img, index) => (
                    <button
                      key={img._id || index}
                      onClick={() => setActiveImage(img.url)}
                      className={`shrink-0 w-20 md:w-full aspect-3/4 overflow-hidden border-2 transition-all duration-200 ${
                        activeImage === img.url
                          ? "border-brand-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Main Active Image */}
            <div className={product.images && product.images.length > 1 ? "md:col-span-10" : "md:col-span-10 md:col-start-3"}>
              <div className="aspect-3/4 w-full bg-gray-200 overflow-hidden relative group">
                {activeImage ? (
                  <>
                    <img
                      src={activeImage}
                      alt={product.title}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Left / Right Swipe Navigation Buttons */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-primary p-2 md:p-3 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                          aria-label="Previous image"
                        >
                          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-primary p-2 md:p-3 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                          aria-label="Next image"
                        >
                          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-secondary font-medium tracking-widest uppercase">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Product Detail Form */}
          <div className="flex flex-col lg:pt-8">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-brand-primary mb-4 wrap-break-word">
              {product.title}
            </h1>

            <p className="text-xl md:text-2xl font-medium text-brand-secondary mb-8">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: product.price?.currency || "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(product.price?.amount || 0)}
            </p>

            <div className="w-full h-px bg-brand-primary/10 mb-8"></div>

            <div className="mb-12 grow">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">
                Description
              </h3>
              <p className="text-sm md:text-base text-brand-secondary leading-relaxed font-medium whitespace-pre-wrap">
                {product.description ||
                  "No description provided for this item."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-auto">
              <button className="w-full py-4 px-6 bg-transparent border border-brand-primary text-brand-primary text-sm font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-brand-bg transition-colors duration-300">
                Add to Cart
              </button>
              <button className="w-full py-4 px-6 bg-brand-accent1 text-brand-bg text-sm font-bold uppercase tracking-widest hover:bg-brand-accent2 transition-colors duration-300 shadow-xl shadow-brand-accent1/20">
                Buy Now
              </button>
            </div>

            {/* Premium Badges */}
            <div className="mt-10 pt-8 border-t border-brand-primary/10 flex flex-col gap-4 text-xs text-brand-secondary tracking-wider font-semibold uppercase">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  ></path>
                </svg>
                Free Standard Shipping & Returns
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                100% Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailedPage;
