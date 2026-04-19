import React from "react";
import { useParams, Link } from "react-router";
import { RiArrowLeftLine } from "@remixicon/react";

const ProductDetailed = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-brand-bg font-main flex flex-col items-center justify-center">
      <h1 className="text-3xl font-black text-brand-primary uppercase tracking-tight mb-4">
        Product Details
      </h1>
      <p className="text-brand-secondary mb-8">
        Detailed view for Product ID:{id}
        <span className="font-bold text-brand-accent1">{id}</span>
      </p>
      <Link
        to="/seller/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-secondary transition-colors duration-200"
      >
        <RiArrowLeftLine size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ProductDetailed;
