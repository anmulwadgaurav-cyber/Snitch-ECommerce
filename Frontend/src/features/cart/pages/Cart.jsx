import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hook/useCart";
import { Link } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import { useNavigate } from "react-router-dom";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const FONT = { fontFamily: "'Be Vietnam Pro', sans-serif" };

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items); // [{_id, items:[...], total, currency}]
  const {
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveCartItem,
    handleCreateCartOrder,
    handleVerifyCartOrder,
  } = useCart();
  const { error, isLoading, Razorpay } = useRazorpay();
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    handleGetCart();
  }, []);

  async function handleCheckout() {
    const order = await handleCreateCartOrder();

    const options = {
      key: "rzp_test_Sna52iFEdmX2mW", //no problem if it is go as it is on frontend
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "ORCERAL",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async (response) => {
        const isValid = await handleVerifyCartOrder(response);
        if (isValid) {
          navigate(`/order-success?order_id=${response?.razorpay_order_id}`);
        }
      },
      prefill: {
        name: user?.fullname,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color: "#F5EDE3",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

  // Extract from the new nested structure
  const cart = cartItems[0];
  const items = cart?.items || [];
  const total = cart?.total || 0;
  const currency = cart?.currency || "INR";

  return (
    <>
      <FontLink />
      <div
        className="min-h-screen bg-[#F5EDE3] flex flex-col font-['Be_Vietnam_Pro'] selection:bg-[#D4BFB0] selection:text-black"
        style={FONT}
      >
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 md:px-12 py-12 md:py-20">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase text-black mb-12 leading-tight border-b border-[#D4BFB0] pb-8">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-[12px] tracking-widest uppercase font-medium text-[#B89A82] mb-6">
                Your cart is currently empty
              </p>
              <Link
                to="/"
                className="bg-black text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#B89A82] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
              {/* Cart Items List */}
              <div className="w-full lg:w-[65%] flex flex-col">
                {items.map((item) => {
                  const product = item.product;
                  // In the new format, product.variants is the already-matched single variant object
                  const variant = product?.variants;
                  const displayImage =
                    variant?.images?.[0]?.url || product?.images?.[0]?.url;
                  const attributes = variant?.attributes || {};

                  return (
                    <div
                      key={item._id}
                      className="flex py-8 border-b border-[#D4BFB0] gap-6 md:gap-10"
                    >
                      {/* Product Image */}
                      <div className="w-28 md:w-40 h-36 md:h-52 bg-[#FAF7F2] border border-[#D4BFB0] shrink-0">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={product?.title}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#F5EDE3]"></div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-lg md:text-xl font-medium tracking-[0.1em] text-black uppercase mb-2">
                              {product?.title}
                            </h2>
                            <div className="text-[12px] text-[#B89A82] tracking-[0.05em] mb-4">
                              {item.price?.currency}{" "}
                              {item.price?.amount?.toLocaleString()}
                            </div>
                          </div>
                          {/* Remove Button */}
                          <button
                            onClick={() =>
                              handleRemoveCartItem({
                                productId: product._id,
                                variantId: item.variant,
                              })
                            }
                            className="text-[#B89A82] hover:text-black transition-colors p-2 -mr-2"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Variant Attributes */}
                        {Object.keys(attributes).length > 0 && (
                          <div className="mb-4 space-y-1">
                            {Object.entries(attributes).map(([key, val]) => (
                              <div
                                key={key}
                                className="text-[10px] uppercase tracking-[0.1em] text-[#5A4F46]"
                              >
                                <span className="font-bold">{key}:</span> {val}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-[#D4BFB0]">
                            <button
                              onClick={() =>
                                handleDecrementCartItem({
                                  productId: product._id,
                                  variantId: item.variant,
                                })
                              }
                              className="w-8 h-8 flex items-center justify-center text-black hover:bg-[#FAF7F2] transition-colors"
                            >
                              -
                            </button>
                            <div className="w-10 text-center text-[12px] font-medium">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() =>
                                handleIncrementCartItem({
                                  productId: product._id,
                                  variantId: item.variant,
                                })
                              }
                              className="w-8 h-8 flex items-center justify-center text-black hover:bg-[#FAF7F2] transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-sm md:text-base font-medium tracking-[0.1em] text-black uppercase">
                            {item.price?.currency}{" "}
                            {(
                              (item.price?.amount || 0) * item.quantity
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary — uses server-computed total */}
              <div className="w-full lg:w-[35%]">
                <div className="bg-[#FAF7F2] border border-[#D4BFB0] p-8 md:p-10 sticky top-32">
                  <h3 className="text-xl font-medium tracking-[0.1em] text-black uppercase mb-8 pb-4 border-b border-[#D4BFB0]">
                    Order Summary
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-[12px] tracking-[0.1em] uppercase text-[#5A4F46]">
                      <span>Subtotal</span>
                      <span>
                        {currency} {total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[12px] tracking-[0.1em] uppercase text-[#5A4F46]">
                      <span>Shipping</span>
                      <span>Complimentary</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-lg font-medium tracking-[0.1em] uppercase text-black mb-10 pt-6 border-t border-[#D4BFB0]">
                    <span>Total</span>
                    <span>
                      {currency} {total.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black border border-black text-white px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#B89A82] hover:border-[#B89A82] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(212,191,176,0.6)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

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

export default Cart;
