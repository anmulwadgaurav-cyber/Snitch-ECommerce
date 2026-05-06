import React, { useEffect, useState, useRef } from "react";
import { useProduct } from "../hook/useProduct";
import { useParams, useNavigate } from "react-router";
import {
  Plus,
  Minus,
  X,
  UploadCloud,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ArrowLeft,
  Check,
  Info,
  Package,
  DollarSign,
  Tag,
  Save,
} from "lucide-react";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@200;300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
);

const FONT = { fontFamily: "'Be Vietnam Pro', sans-serif" };

const SellerProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetailsById, handleAddProductVariant } = useProduct();

  // PRIMARY SOURCE OF TRUTH (Do NOT create separate variants state)
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const data = await handleGetProductDetailsById(productId);
        setProduct(data);
      } catch (error) {
        console.log("Error fetching products", error);
      }
    }
    fetchProductDetails();
  }, [productId]);

  // Form State for creating/editing a variant locally before pushing to product state
  const defaultFormState = {
    attributes: {},
    stock: 0,
    price: { amount: "", currency: "INR" },
    images: [],
    previewImages: [],
  };

  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [variantForm, setVariantForm] = useState(defaultFormState);

  // Attribute Form State
  const [attrKey, setAttrKey] = useState("");
  const [attrValue, setAttrValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddAttribute = () => {
    if (!attrKey.trim() || !attrValue.trim()) return;
    setVariantForm((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attrKey.trim()]: attrValue.trim() },
    }));
    setAttrKey("");
    setAttrValue("");
  };

  const handleRemoveAttribute = (keyToRemove) => {
    setVariantForm((prev) => {
      const newAttrs = { ...prev.attributes };
      delete newAttrs[keyToRemove];
      return { ...prev, attributes: newAttrs };
    });
  };

  const processFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (variantForm.images.length + imageFiles.length > 7) {
      alert("Maximum 7 images allowed per variant");
      return;
    }

    const newImages = imageFiles.map((file) => ({
      url: URL.createObjectURL(file), // Local preview only requirement
    }));

    console.log(imageFiles);

    setVariantForm((prev) => ({
      ...prev,
      images: [...prev.images, ...imageFiles],
      previewImages: [...prev.images, ...newImages],
    }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveImage = (index) => {
    setVariantForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleStockChange = (amount) => {
    setVariantForm((prev) => ({
      ...prev,
      stock: Math.max(0, prev.stock + amount),
    }));
  };

  const handleSaveVariant = async () => {
    if (Object.keys(variantForm.attributes).length === 0) {
      alert("At least one attribute is required before saving variant.");
      return;
    }

    const payload = { ...variantForm };
    if (!payload.price.amount) {
      delete payload.price; // Optional price, defaults to base product price
    } else {
      payload.price.amount = Number(payload.price.amount);
    }

    await handleAddProductVariant(productId, payload);

    // MUTATING product.variants STRICTLY
    setProduct((prev) => {
      const updatedVariants = prev.variants ? [...prev.variants] : [];
      if (editingVariantIndex !== null) {
        updatedVariants[editingVariantIndex] = payload;
      } else {
        updatedVariants.push(payload);
      }
      return { ...prev, variants: updatedVariants };
    });

    console.log(payload);

    resetForm();
  };

  const resetForm = () => {
    setVariantForm(defaultFormState);
    setShowVariantForm(false);
    setEditingVariantIndex(null);
    setAttrKey("");
    setAttrValue("");
  };

  const handleEditVariant = (index) => {
    if (!product || !product.variants) return;
    const v = product.variants[index];
    setVariantForm({
      attributes: { ...v.attributes },
      stock: v.stock || 0,
      price: v.price ? { ...v.price } : { amount: "", currency: "INR" },
      images: v.images ? [...v.images] : [],
    });
    setEditingVariantIndex(index);
    setShowVariantForm(true);
  };

  const handleDeleteVariant = (index) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      setProduct((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  if (!product) {
    return (
      <div
        className="min-h-screen bg-[#F5EDE3] flex items-center justify-center"
        style={FONT}
      >
        <FontLink />
        <div className="flex flex-col items-center">
          <Package className="w-10 h-10 text-[#D4BFB0] mb-4 animate-pulse" />
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B89A82]">
            Loading Product
          </p>
        </div>
      </div>
    );
  }

  const currentVariants = product.variants || [];

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#F5EDE3] flex flex-col" style={FONT}>
        {/* Topbar matching Dashboard.jsx exactly */}
        <header className="h-20 border-b border-[#D4BFB0] bg-[#F5EDE3] flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="text-black hover:text-[#B89A82] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-[#D4BFB0]" />
            <h1 className="text-sm font-medium tracking-[0.2em] uppercase text-black hidden sm:block">
              Product Details
            </h1>
            <div className="w-px h-6 bg-[#D4BFB0] hidden sm:block" />
            <span className="text-[10px] tracking-[0.2em] text-[#B89A82] uppercase line-clamp-1 max-w-[150px] sm:max-w-[250px]">
              {product.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                console.log("Final product state to save:", product)
              }
              className="bg-black text-white px-6 py-3 sm:px-8 sm:py-3 text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#B89A82] transition-colors duration-300 shadow-sm flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5 hidden sm:block" />
              Save Product
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Product Overview Section */}
            <div className="flex flex-col md:flex-row gap-8 bg-white border border-[#D4BFB0] p-6 lg:p-10 shadow-[4px_4px_0px_0px_rgba(212,191,176,0.3)] hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="w-full md:w-1/3 space-y-4">
                <div className="aspect-[4/5] bg-[#FAF7F2] border border-[#D4BFB0] overflow-hidden group">
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#B89A82]">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-[10px] tracking-widest uppercase">
                        No Image
                      </span>
                    </div>
                  )}
                </div>
                {/* Thumbnails */}
                {product.images?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.slice(1).map((img, i) => (
                      <div
                        key={i}
                        className="w-16 h-20 flex-shrink-0 border border-[#D4BFB0] overflow-hidden bg-[#FAF7F2] hover:border-black transition-colors"
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-8 flex flex-col">
                <div>
                  <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-4">
                    <h2 className="text-3xl font-light tracking-[0.1em] uppercase text-black">
                      {product.title}
                    </h2>
                    <span className="inline-flex items-center px-4 py-2 bg-[#FAF7F2] border border-[#D4BFB0] text-[12px] font-bold tracking-widest uppercase text-black">
                      {product.price?.currency}{" "}
                      {(product.price?.amount || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#B89A82] leading-relaxed max-w-2xl">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-[#D4BFB0] mt-auto">
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-[#B89A82] uppercase mb-2">
                      Product ID
                    </p>
                    <p
                      className="text-xs text-black font-medium tracking-wider truncate"
                      title={product._id}
                    >
                      {product._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-[#B89A82] uppercase mb-2">
                      Seller ID
                    </p>
                    <p
                      className="text-xs text-black font-medium tracking-wider truncate"
                      title={product.seller}
                    >
                      {product.seller}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-[#B89A82] uppercase mb-2">
                      Created
                    </p>
                    <p className="text-xs text-black font-medium tracking-wider">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-[#B89A82] uppercase mb-2">
                      Variants
                    </p>
                    <p className="text-xs text-black font-medium tracking-wider">
                      {currentVariants.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D4BFB0] pb-6 mt-16">
              <div>
                <h2 className="text-2xl font-light tracking-[0.1em] uppercase text-black mb-2">
                  Product Variants
                </h2>
                <p className="text-[11px] text-[#B89A82] tracking-[0.1em] uppercase">
                  Manage stock, pricing, and specific options
                </p>
              </div>
              {!showVariantForm && (
                <button
                  onClick={() => setShowVariantForm(true)}
                  className="bg-black text-white px-6 py-3 text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#B89A82] transition-colors duration-300 shadow-sm flex items-center gap-2 border border-black"
                >
                  <Plus className="w-3 h-3" />
                  New Variant
                </button>
              )}
            </div>

            {/* Variant Form */}
            {showVariantForm && (
              <div className="bg-white border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 lg:p-10 transition-all duration-300 animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#D4BFB0]">
                  <h3 className="text-lg font-medium tracking-[0.15em] uppercase text-black flex items-center gap-3">
                    <Tag className="w-5 h-5 text-[#B89A82]" />
                    {editingVariantIndex !== null
                      ? "Edit Variant"
                      : "Create Variant"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 text-[#B89A82] hover:text-black hover:bg-[#FAF7F2] transition-colors border border-transparent hover:border-[#D4BFB0]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-12">
                  {/* Attributes */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-black">
                        Attributes
                      </h4>
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 uppercase tracking-widest">
                        Required
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {Object.entries(variantForm.attributes).map(([k, v]) => (
                        <div
                          key={k}
                          className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#D4BFB0] px-3 py-2 text-xs group hover:border-black transition-colors"
                        >
                          <span className="text-[#B89A82] uppercase tracking-wider">
                            {k}:
                          </span>
                          <span className="font-bold text-black uppercase tracking-wider">
                            {v}
                          </span>
                          <button
                            onClick={() => handleRemoveAttribute(k)}
                            className="ml-2 text-[#B89A82] hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {Object.keys(variantForm.attributes).length === 0 && (
                        <p className="text-[11px] text-[#B89A82] tracking-wider italic py-2">
                          No attributes. Add at least one (e.g., Size: XL).
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-end gap-4 max-w-xl bg-[#FAF7F2] p-5 border border-[#D4BFB0]">
                      <div className="flex-1 min-w-[140px]">
                        <label className="block text-[10px] font-bold tracking-widest text-black uppercase mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Color, Size"
                          value={attrKey}
                          onChange={(e) => setAttrKey(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#D4BFB0] text-xs focus:outline-none focus:border-black transition-all placeholder:text-[#D4BFB0] tracking-wider text-black font-medium"
                        />
                      </div>
                      <div className="flex-1 min-w-[140px]">
                        <label className="block text-[10px] font-bold tracking-widest text-black uppercase mb-2">
                          Value
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Black, XL"
                          value={attrValue}
                          onChange={(e) => setAttrValue(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddAttribute()
                          }
                          className="w-full px-4 py-3 bg-white border border-[#D4BFB0] text-xs focus:outline-none focus:border-black transition-all placeholder:text-[#D4BFB0] tracking-wider text-black font-medium"
                        />
                      </div>
                      <button
                        onClick={handleAddAttribute}
                        disabled={!attrKey.trim() || !attrValue.trim()}
                        className="px-6 py-3 bg-black text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#B89A82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-black"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#D4BFB0]">
                    {/* Stock */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-black flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#B89A82]" />
                        Inventory
                      </h4>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-[#D4BFB0] bg-white transition-colors hover:border-black">
                          <button
                            onClick={() => handleStockChange(-1)}
                            className="p-3 hover:bg-[#FAF7F2] text-[#B89A82] hover:text-black transition-colors border-r border-[#D4BFB0]"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={variantForm.stock}
                            onChange={(e) =>
                              setVariantForm((p) => ({
                                ...p,
                                stock: Math.max(
                                  0,
                                  parseInt(e.target.value) || 0,
                                ),
                              }))
                            }
                            className="w-20 text-center py-3 text-sm font-bold text-black focus:outline-none"
                          />
                          <button
                            onClick={() => handleStockChange(1)}
                            className="p-3 hover:bg-[#FAF7F2] text-[#B89A82] hover:text-black transition-colors border-l border-[#D4BFB0]"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {variantForm.stock > 0 && (
                          <div
                            className={`px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase border ${
                              variantForm.stock < 10
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : "bg-[#FAF7F2] text-black border-[#D4BFB0]"
                            }`}
                          >
                            {variantForm.stock < 10 ? "Low Stock" : "In Stock"}
                          </div>
                        )}
                        {variantForm.stock <= 0 && (
                          <div className="px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase border bg-red-50 text-red-700 border-red-200">
                            Out of Stock
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-black flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#B89A82]" />
                          Custom Price
                        </h4>
                        <span className="text-[9px] font-bold text-[#B89A82] bg-[#FAF7F2] border border-[#D4BFB0] px-2 py-1 uppercase tracking-widest">
                          Optional
                        </span>
                      </div>
                      <div className="flex border border-[#D4BFB0] bg-white transition-colors hover:border-black">
                        <select
                          value={variantForm.price.currency}
                          onChange={(e) =>
                            setVariantForm((p) => ({
                              ...p,
                              price: { ...p.price, currency: e.target.value },
                            }))
                          }
                          className="px-4 py-3 bg-[#FAF7F2] border-r border-[#D4BFB0] text-xs font-bold text-black tracking-wider focus:outline-none uppercase cursor-pointer"
                        >
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                          <option value="JPY">JPY</option>
                        </select>
                        <input
                          type="number"
                          placeholder={`Base: ${product.price?.amount || "0"}`}
                          value={variantForm.price.amount}
                          onChange={(e) =>
                            setVariantForm((p) => ({
                              ...p,
                              price: { ...p.price, amount: e.target.value },
                            }))
                          }
                          className="w-full px-4 py-3 text-sm font-medium focus:outline-none placeholder:text-[#D4BFB0] text-black tracking-wider"
                        />
                      </div>
                      {!variantForm.price.amount && (
                        <p className="text-[10px] text-[#B89A82] flex items-center gap-2 font-medium tracking-widest uppercase">
                          <Info className="w-3.5 h-3.5" />
                          Using base product price ({
                            product.price?.currency
                          }{" "}
                          {product.price?.amount?.toLocaleString()})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-6 pt-8 border-t border-[#D4BFB0]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-black flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#B89A82]" />
                        Images
                      </h4>
                      <span className="text-[10px] text-black font-bold tracking-widest border border-[#D4BFB0] bg-[#FAF7F2] px-3 py-1 uppercase">
                        {variantForm.images.length} / 7
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {variantForm.previewImages.map((img, i) => (
                        <div
                          key={i}
                          className="aspect-[4/5] border border-[#D4BFB0] overflow-hidden relative group bg-[#FAF7F2] hover:border-black transition-colors"
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => handleRemoveImage(i)}
                              className="p-3 bg-red-600 text-white hover:bg-red-700 transition-colors border border-black transform scale-90 group-hover:scale-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {variantForm.images.length < 7 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`aspect-[4/5] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all
                            ${isDragging ? "border-black bg-[#F5EDE3] text-black scale-[1.02]" : "border-[#D4BFB0] hover:border-black hover:bg-[#FAF7F2] text-[#B89A82] bg-white"}
                          `}
                        >
                          <UploadCloud
                            className={`w-6 h-6 ${isDragging ? "text-black" : "text-[#D4BFB0]"}`}
                          />
                          <span className="text-[9px] font-bold tracking-widest uppercase">
                            Upload
                          </span>
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="pt-10 border-t border-[#D4BFB0] flex justify-end gap-4">
                    <button
                      onClick={resetForm}
                      className="px-8 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-black hover:bg-[#FAF7F2] border border-transparent hover:border-[#D4BFB0] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveVariant}
                      className="px-10 py-3 text-[10px] font-bold tracking-[0.15em] uppercase bg-black text-white hover:bg-[#B89A82] transition-colors shadow-[4px_4px_0px_0px_rgba(212,191,176,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 flex items-center gap-2 border border-black"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {editingVariantIndex !== null
                        ? "Save Changes"
                        : "Create Variant"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Variants List */}
            {currentVariants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentVariants.map((v, i) => (
                  <div
                    key={i}
                    className="group bg-white border border-[#D4BFB0] flex flex-col transition-all duration-300 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 relative"
                  >
                    {/* Action Overlay */}
                    <div className="absolute top-4 right-4 z-10 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <button
                        onClick={() => handleEditVariant(i)}
                        className="p-2.5 bg-white border border-[#D4BFB0] text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(i)}
                        className="p-2.5 bg-white border border-[#D4BFB0] text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex h-full">
                      <div className="w-1/3 aspect-[4/5] bg-[#FAF7F2] border-r border-[#D4BFB0] group-hover:border-black transition-colors overflow-hidden relative">
                        {v.images?.length > 0 ? (
                          <img
                            src={v.images[0].url}
                            alt="Variant"
                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#B89A82]">
                            <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                            <span className="text-[8px] tracking-widest uppercase">
                              No Img
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="w-2/3 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2 mb-4 pr-12">
                            {Object.entries(v.attributes).map(([ak, av]) => (
                              <span
                                key={ak}
                                className="px-2 py-1 bg-[#FAF7F2] border border-[#D4BFB0] text-black text-[9px] font-bold tracking-widest uppercase truncate max-w-full"
                              >
                                {ak}: {av}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#F5EDE3] group-hover:border-[#D4BFB0] transition-colors space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold tracking-widest uppercase text-black">
                              {v.price?.amount
                                ? `${v.price.currency} ${v.price.amount.toLocaleString()}`
                                : "Uses Base Price"}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <div
                              className={`px-2.5 py-1 text-[9px] tracking-widest uppercase font-bold border ${
                                v.stock <= 0
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : v.stock < 10
                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                    : "bg-[#FAF7F2] text-black border-[#D4BFB0]"
                              }`}
                            >
                              Stock: {v.stock || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showVariantForm && (
                <div className="bg-white border border-[#D4BFB0] p-16 text-center shadow-[4px_4px_0px_0px_rgba(212,191,176,0.3)] max-w-3xl mx-auto">
                  <div className="w-16 h-16 border-2 border-dashed border-[#D4BFB0] rounded-full flex items-center justify-center mx-auto mb-6 bg-[#FAF7F2]">
                    <Tag className="w-6 h-6 text-[#B89A82]" />
                  </div>
                  <h3 className="text-sm font-medium tracking-[0.15em] uppercase text-black mb-2">
                    No Variants Found
                  </h3>
                  <p className="text-[11px] text-[#B89A82] mb-8 leading-relaxed max-w-md mx-auto tracking-wide">
                    Create variants for your product if it comes in multiple
                    options like sizes, colors, or materials.
                  </p>
                  <button
                    onClick={() => setShowVariantForm(true)}
                    className="bg-black text-white px-8 py-3 text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#B89A82] transition-colors duration-300 inline-flex items-center gap-2 border border-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create First Variant
                  </button>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default SellerProductDetails;
