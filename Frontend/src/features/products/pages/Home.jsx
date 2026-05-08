import React, { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const FONT = { fontFamily: "'Be Vietnam Pro', sans-serif" };

const Hero = () => (
  <section className="relative w-full h-[60vh] bg-[#FAF7F2] border-b border-[#D4BFB0] flex flex-col items-center justify-center text-center overflow-hidden">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
      <h1 className="text-[25vw] font-bold text-black uppercase tracking-tighter select-none leading-none">
        ORCERAL
      </h1>
    </div>
    <div className="z-10 px-4">
      <p className="text-[10px] tracking-[0.3em] font-bold text-[#B89A82] uppercase mb-6">
        Fall / Winter Collection
      </p>
      <h2 className="text-4xl md:text-6xl font-light text-black tracking-[0.1em] uppercase mb-8 leading-tight">
        Elevate Your
        <br />
        Everyday
      </h2>
      <button className="bg-black text-white px-10 py-4 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#B89A82] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(212,191,176,0.6)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
        Shop Now
      </button>
    </div>
  </section>
);

const ProductCard = ({ product, onClickFn }) => (
  <div onClick={onClickFn} className="group cursor-pointer flex flex-col ">
    {/* Image Container */}
    <div className="relative aspect-[3/4] bg-[#FAF7F2] overflow-hidden mb-5 border border-[#D4BFB0] group-hover:border-black transition-colors duration-300">
      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0].url}
          alt={product.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[#B89A82]">
          <span className="text-[10px] tracking-widest uppercase font-medium">
            No Image
          </span>
        </div>
      )}

      {/* Quick Add Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <button className="w-full bg-white/95 backdrop-blur-sm border border-black text-black py-3 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-black hover:text-white transition-colors">
          Add to cart
        </button>
      </div>
    </div>

    {/* Details */}
    <div className="flex flex-col text-center px-2">
      <h3 className="text-[13px] font-medium text-black uppercase tracking-[0.1em] mb-1.5 group-hover:text-[#B89A82] transition-colors">
        {product.title}
      </h3>
      <p className="text-[11px] text-[#B89A82] line-clamp-1 mb-2.5 px-4 font-light">
        {product.description}
      </p>
      <span className="text-[12px] tracking-widest font-bold text-black uppercase">
        {product.price?.currency} {product.price?.amount?.toLocaleString()}
      </span>
    </div>
  </div>
);

const ProductCardSkeleton = () => (
  <div className="flex flex-col animate-pulse">
    <div className="aspect-[3/4] bg-[#D4BFB0]/30 mb-5 border border-[#D4BFB0]/50"></div>
    <div className="flex flex-col items-center text-center px-2">
      <div className="h-3 w-3/4 bg-[#D4BFB0]/40 mb-3"></div>
      <div className="h-2 w-full bg-[#D4BFB0]/30 mb-1"></div>
      <div className="h-2 w-5/6 bg-[#D4BFB0]/30 mb-4"></div>
      <div className="h-3 w-1/4 bg-[#D4BFB0]/40"></div>
    </div>
  </div>
);

const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      await handleGetAllProducts();
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#F5EDE3] flex flex-col" style={FONT}>
        <Hero />

        <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 md:px-12 py-24">
          <div className="flex flex-col items-center mb-16 text-center">
            <h3 className="text-2xl font-light tracking-[0.15em] uppercase text-black mb-4">
              New Arrivals
            </h3>
            <div className="w-12 h-[2px] bg-[#D4BFB0]"></div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-20 border border-[#D4BFB0] bg-[#FAF7F2] shadow-[4px_4px_0px_0px_rgba(212,191,176,0.3)] max-w-2xl mx-auto">
              <p className="text-[12px] tracking-[0.1em] uppercase font-medium text-[#B89A82]">
                No products available right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product) => (
                <ProductCard
                  onClickFn={() => navigate(`/product/${product._id}`)}
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#D4BFB0] bg-[#FAF7F2] py-12 mt-auto">
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

export default Home;
