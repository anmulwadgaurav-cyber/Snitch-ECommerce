import React from "react";

const ContinueWithGoogle = () => {
  return (
    <a
      id="register-google"
      href={"/api/auth/google"}
      className="mt-4 w-full py-3 flex items-center justify-center gap-3 border border-[#D4BFB0] bg-transparent text-[11px] tracking-[0.25em] uppercase text-black hover:border-black hover:bg-white transition-all duration-300 active:scale-[0.99]"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* Google G logo */}
      <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M44.5 20H24v8.5h11.8C34.1 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 2.9l6.4-6.4C34.5 5.9 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-7.9 19.7-20 0-1.3-.1-2.7-.2-4z"
        />
        <path
          fill="#34A853"
          d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3 0 5.8 1.1 7.9 2.9l6.4-6.4C34.5 5.9 29.5 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
        />
        <path
          fill="#FBBC05"
          d="M24 44c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.6 35.4 26.9 36 24 36c-5.6 0-10.1-2.9-11.8-7.5l-7 5.4C8.6 39.8 15.8 44 24 44z"
        />
        <path
          fill="#EA4335"
          d="M44.5 20H24v8.5h11.8c-.9 2.6-2.7 4.8-5 6.3l6.5 5.3C41.3 36.7 44.5 31 44.5 24c0-1.3-.1-2.7-.2-4z"
        />
      </svg>
      Continue with Google
    </a>
  );
};

export default ContinueWithGoogle;
