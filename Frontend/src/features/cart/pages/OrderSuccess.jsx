import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const FONT = { fontFamily: "'Be Vietnam Pro', sans-serif" };

/* ── tiny tick-mark animation ── */
const CheckIcon = () => {
  const circleRef = useRef(null);
  const checkRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    const check = checkRef.current;
    if (!circle || !check) return;

    // Animate circle stroke
    const circleLen = circle.getTotalLength?.() ?? 200;
    circle.style.strokeDasharray = circleLen;
    circle.style.strokeDashoffset = circleLen;
    circle.style.transition =
      "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)";

    // Animate check stroke
    const checkLen = check.getTotalLength?.() ?? 60;
    check.style.strokeDasharray = checkLen;
    check.style.strokeDashoffset = checkLen;
    check.style.transition =
      "stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1) 0.5s";

    requestAnimationFrame(() => {
      circle.style.strokeDashoffset = "0";
      check.style.strokeDashoffset = "0";
    });
  }, []);

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-24 h-24"
      aria-hidden="true"
    >
      <circle
        ref={circleRef}
        cx="40"
        cy="40"
        r="36"
        stroke="#B89A82"
        strokeWidth="1.5"
      />
      <polyline
        ref={checkRef}
        points="24,41 35,52 56,30"
        stroke="#5A4F46"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ── tiny animated counter ── */
const steps = [
  {
    label: "Order Confirmed",
    detail: "We've received your order and are preparing it.",
    done: true,
  },
  {
    label: "Being Processed",
    detail: "Our team is carefully picking your items.",
    done: true,
  },
  {
    label: "Shipped",
    detail: "Your order will be dispatched within 24–48 hours.",
    done: false,
  },
  {
    label: "Delivered",
    detail: "Estimated arrival in 5–7 business days.",
    done: false,
  },
];

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <>
      <FontLink />
      <div
        className="min-h-screen bg-[#F5EDE3] flex flex-col selection:bg-[#D4BFB0] selection:text-black"
        style={FONT}
      >
        {/* ── Main ── */}
        <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
          <div className="w-full max-w-2xl flex flex-col items-center text-center">
            {/* animated check */}
            <div className="mb-8">
              <CheckIcon />
            </div>

            {/* headline */}
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#B89A82] mb-3">
              Payment Successful
            </p>
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase text-black leading-tight mb-5">
              Thank You for Your Order
            </h1>
            <p className="text-sm text-[#5A4F46] tracking-[0.05em] leading-relaxed max-w-md mb-10">
              Your purchase has been confirmed. A confirmation email will be
              sent to you shortly with your invoice and tracking details.
            </p>

            {/* order id pill */}
            {orderId && (
              <div className="border border-[#D4BFB0] bg-[#FAF7F2] px-6 py-4 mb-12 w-full flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#B89A82]">
                  Order Reference
                </span>
                <span className="text-[12px] tracking-[0.08em] font-medium text-[#5A4F46] break-all">
                  {orderId}
                </span>
              </div>
            )}

            {/* order timeline */}
            <div className="w-full border border-[#D4BFB0] bg-[#FAF7F2] p-8 md:p-10 mb-12 text-left">
              <h2 className="text-[11px] tracking-[0.2em] uppercase font-bold text-black mb-8 pb-4 border-b border-[#D4BFB0]">
                Order Status
              </h2>

              <ol className="relative">
                {steps.map((step, index) => {
                  const isLast = index === steps.length - 1;
                  return (
                    <li key={step.label} className="flex gap-5 relative">
                      {/* connector line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[9px] top-[22px] w-px h-full ${
                            step.done ? "bg-[#B89A82]" : "bg-[#D4BFB0]"
                          }`}
                          style={{
                            bottom: "-8px",
                            height: "calc(100% - 14px)",
                          }}
                        />
                      )}

                      {/* dot */}
                      <div className="shrink-0 mt-[3px]">
                        {step.done ? (
                          <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full border border-[#B89A82] bg-[#B89A82]">
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              viewBox="0 0 12 12"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline
                                points="2,6 5,9 10,3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full border border-[#D4BFB0] bg-[#FAF7F2]" />
                        )}
                      </div>

                      {/* text */}
                      <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                        <p
                          className={`text-[11px] tracking-[0.12em] uppercase font-bold mb-1 ${
                            step.done ? "text-black" : "text-[#B89A82]"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[11px] tracking-[0.04em] text-[#5A4F46] leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* what's next */}
            <div className="w-full border border-[#D4BFB0] bg-[#FAF7F2] p-8 md:p-10 mb-12 text-left">
              <h2 className="text-[11px] tracking-[0.2em] uppercase font-bold text-black mb-6 pb-4 border-b border-[#D4BFB0]">
                What Happens Next
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: (
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    title: "Confirmation Email",
                    desc: "An invoice will arrive in your inbox shortly.",
                  },
                  {
                    icon: (
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
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    ),
                    title: "Careful Packaging",
                    desc: "Your items are wrapped with care in sustainable packaging.",
                  },
                  {
                    icon: (
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
                          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                        />
                      </svg>
                    ),
                    title: "Swift Delivery",
                    desc: "Dispatched within 24–48 hrs. Track via email link.",
                  },
                ].map((card) => (
                  <div key={card.title} className="flex flex-col gap-3">
                    <div className="text-[#B89A82]">{card.icon}</div>
                    <p className="text-[10px] tracking-[0.15em] font-bold uppercase text-black">
                      {card.title}
                    </p>
                    <p className="text-[11px] tracking-[0.04em] text-[#5A4F46] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link
                to="/"
                className="flex-1 bg-black text-white px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase text-center hover:bg-[#B89A82] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(212,191,176,0.6)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              >
                Shop More
              </Link>
              <Link
                to="/cart"
                className="flex-1 border border-black text-black px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase text-center hover:border-[#B89A82] hover:text-[#B89A82] transition-colors duration-300"
              >
                View Cart
              </Link>
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
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

export default OrderSuccess;
