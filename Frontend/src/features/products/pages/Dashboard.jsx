import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const FONT = { fontFamily: "'Be Vietnam Pro', sans-serif" };

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#F5EDE3] flex flex-col" style={FONT}>
        {/* Topbar */}
        <header className="h-20 border-b border-[#D4BFB0] bg-[#F5EDE3] flex items-center justify-between px-8 lg:px-12 sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <h1 className="text-sm font-medium tracking-[0.2em] uppercase text-black">
              Dashboard
            </h1>
            <div className="w-px h-6 bg-[#D4BFB0]" />
            <span className="text-[10px] tracking-[0.2em] text-[#B89A82] uppercase">
              Products
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/seller/create-product")}
              className="bg-black text-white px-6 py-3 sm:px-8 sm:py-3 text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#B89A82] transition-colors duration-300 shadow-sm"
            >
              New Product
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D4BFB0] pb-6">
              <div>
                <h2 className="text-2xl font-light tracking-[0.1em] uppercase text-black mb-2">
                  Your Products
                </h2>
                <p className="text-[11px] text-[#B89A82] tracking-[0.1em] uppercase">
                  Manage your listings
                </p>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-black uppercase bg-white px-3 py-1.5 border border-[#D4BFB0]">
                {sellerProducts?.length || 0} ITEMS
              </p>
            </div>

            {/* Products Grid */}
            {!sellerProducts || sellerProducts.length === 0 ? (
              <div className="bg-white border border-[#D4BFB0] p-16 text-center shadow-[4px_4px_0px_0px_rgba(212,191,176,0.3)] max-w-2xl mx-auto mt-12">
                <div className="w-16 h-16 border-2 border-dashed border-[#D4BFB0] rounded-full flex items-center justify-center mx-auto mb-6 bg-[#FAF7F2]">
                  <svg
                    className="w-6 h-6 text-[#B89A82]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium tracking-[0.15em] uppercase text-black mb-2">
                  No Products Found
                </h3>
                <p className="text-[11px] text-[#B89A82] mb-8 leading-relaxed">
                  You haven't listed any products yet. Get started by creating your first product listing to reach your customers.
                </p>
                <button
                  onClick={() => navigate("/seller/create-product")}
                  className="bg-black text-white px-8 py-3 text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#B89A82] transition-colors duration-300"
                >
                  Create Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
                {sellerProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white border border-[#D4BFB0] flex flex-col transition-all duration-300 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] bg-[#FAF7F2] overflow-hidden border-b border-[#D4BFB0] group-hover:border-black transition-colors duration-300">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#B89A82]">
                          <svg
                            className="w-8 h-8 mb-2 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a.75.75 0 00.75-.75V6.375a2.625 2.625 0 00-2.625-2.625H4.875A2.625 2.625 0 002.25 6.375V20.25A.75.75 0 003 21z"
                            />
                          </svg>
                          <span className="text-[9px] tracking-widest uppercase">
                            No Image
                          </span>
                        </div>
                      )}
                      
                      {/* Date Overlay */}
                      <div className="absolute top-0 left-0 p-3 w-full bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-[9px] tracking-widest uppercase font-medium drop-shadow-md">
                          {new Date(product.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Details Area */}
                    <div className="p-5 flex flex-col flex-1 justify-between bg-white relative">
                      <div>
                        <h3 className="text-sm font-medium text-black uppercase tracking-[0.1em] line-clamp-1 mb-1 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-[11px] text-[#B89A82] line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#F5EDE3] flex items-center justify-between group-hover:border-[#D4BFB0] transition-colors duration-300">
                        <span className="text-[10px] tracking-widest font-bold text-black uppercase">
                          {product.price?.currency} {product.price?.amount?.toLocaleString()}
                        </span>
                        
                        <div className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#D4BFB0] flex items-center justify-center text-black group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
