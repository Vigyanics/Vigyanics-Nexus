import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Star, Heart, ShoppingCart, CheckCircle, Package, Zap, Users, Shield, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/store/CartDrawer";
import ProductCard from "@/components/store/ProductCard";
import { getProductById, products, formatPrice, getDiscount, type Product } from "@/data/products";

interface Props {
  productId: string;
}

export default function ProductDetail({ productId }: Props) {
  const [, navigate] = useLocation();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const product: Product | undefined = getProductById(productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <h2 className="text-2xl font-display font-bold text-vigyanics-blue">Product not found</h2>
        <button onClick={() => navigate("/store")} className="px-6 py-3 rounded-full bg-vigyanics-cyan text-vigyanics-blue font-semibold">
          Back to Store
        </button>
      </div>
    );
  }

  const discount = getDiscount(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);
  const related = products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  function handleAddToCart() {
    addToCart(product, qty);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  }

  return (
    <div className="min-h-screen bg-white" ref={ref}>
      <CartDrawer />

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-vigyanics-blue transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate("/store")} className="hover:text-vigyanics-blue transition-colors">Store</button>
          <span>/</span>
          <span className="text-vigyanics-blue font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <button
          onClick={() => navigate("/store")}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-vigyanics-blue transition-colors mb-8 font-medium"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Main image */}
            <div
              className="relative w-full aspect-square rounded-3xl flex flex-col items-center justify-center overflow-hidden mb-4"
              style={{ background: `linear-gradient(135deg, ${product.colorAccent}12, ${product.colorAccent}04)`, border: `2px solid ${product.colorAccent}20` }}
            >
              {product.isNew && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "#8B5CF6" }}>NEW</div>
              )}
              {product.isBestSeller && (
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-vigyanics-blue" style={{ background: "#00C896" }}>BEST SELLER</div>
              )}
              <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 40%, ${product.colorAccent}, transparent 60%)` }} />
              <div
                className="w-40 h-40 rounded-3xl flex items-center justify-center shadow-2xl mb-4"
                style={{ background: `${product.colorAccent}25`, border: `2px solid ${product.colorAccent}50` }}
              >
                <Zap className="w-20 h-20" style={{ color: product.colorAccent }} />
              </div>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{product.category}</span>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center cursor-pointer border-2 transition-all"
                  style={{
                    background: `${product.colorAccent}${i === 1 ? "20" : "08"}`,
                    borderColor: i === 1 ? product.colorAccent : "transparent",
                  }}
                >
                  <Zap className="w-6 h-6" style={{ color: product.colorAccent, opacity: i === 1 ? 1 : 0.4 }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ color: product.colorAccent, borderColor: `${product.colorAccent}40`, background: `${product.colorAccent}10` }}>
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                Ages {product.ageGroup}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-vigyanics-blue mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5" fill={star <= Math.round(product.rating) ? "#F59E0B" : "transparent"} stroke={star <= Math.round(product.rating) ? "#F59E0B" : "#D1D5DB"} />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-semibold">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-display font-bold text-vigyanics-blue">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  {discount && (
                    <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: "#EF4444" }}>{discount}% OFF</span>
                  )}
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-vigyanics-green animate-pulse" />
              <span className="text-sm font-semibold text-vigyanics-green">
                {product.inStock ? `In Stock${product.stock ? ` — Only ${product.stock} left` : ""}` : "Out of Stock"}
              </span>
            </div>

            {/* Qty + CTA */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-vigyanics-cyan transition-colors" data-testid="button-qty-minus">−</button>
                <span className="w-6 text-center font-bold text-vigyanics-blue">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-vigyanics-cyan transition-colors" data-testid="button-qty-plus">+</button>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  background: addedAnim ? "#00C896" : product.colorAccent,
                  color: addedAnim ? "#fff" : product.colorAccent === "#00D4FF" ? "#0B1F3A" : "#fff",
                  boxShadow: `0 8px 30px ${product.colorAccent}40`,
                }}
                data-testid="button-add-to-cart"
              >
                {addedAnim ? <><span>✓</span> Added to Cart!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </motion.button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"
                data-testid="button-wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Shield, label: "1-Year Warranty" },
                { icon: RotateCcw, label: "7-Day Free Returns" },
                { icon: Package, label: "Free Shipping ₹999+" },
                { icon: Users, label: "Expert Support" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Icon className="w-4 h-4 text-vigyanics-cyan flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Details tabs */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* What's in the box */}
          <div className="p-7 rounded-3xl bg-gray-50/60 border border-gray-100">
            <h3 className="font-display font-bold text-vigyanics-blue text-lg mb-5 flex items-center gap-2">
              <Package className="w-5 h-5 text-vigyanics-cyan" /> What's in the Box
            </h3>
            <ul className="space-y-3">
              {product.components.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-vigyanics-green mt-0.5 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* What students will learn */}
          <div
            className="p-7 rounded-3xl border"
            style={{ background: `${product.colorAccent}08`, borderColor: `${product.colorAccent}20` }}
          >
            <h3 className="font-display font-bold text-vigyanics-blue text-lg mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: product.colorAccent }} /> What Students Learn
            </h3>
            <ul className="space-y-3">
              {product.learningOutcomes.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: product.colorAccent }} />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="p-7 rounded-3xl bg-vigyanics-blue/[0.03] border border-vigyanics-blue/10">
            <h3 className="font-display font-bold text-vigyanics-blue text-lg mb-5">Specifications</h3>
            <dl className="space-y-3">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">{key}</dt>
                  <dd className="text-sm font-semibold text-vigyanics-blue text-right">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-display font-bold text-vigyanics-blue mb-8">More in {product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
