import React from "react";
import { Link } from "react-router";

const Nav = ({ count }) => {
  return (
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
        <Link
          to="/cart"
          className="text-black hover:text-[#B89A82] transition-colors relative"
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
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center font-bold">
            {count}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
