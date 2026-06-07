import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Eye, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getDiscount, type Product } from "@/data/products";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [addedAnim, setAddedAnim] = useState(false);
  const [, navigate] = useLocation();
  const discount = getDiscount(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    toggleWishlist(product.id);
  }

  function handleCardClick() {
    navigate(`/store/${product.id}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onClick={handleCardClick}
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-400 overflow-hidden cursor-pointer flex flex-col"
      data-testid={`product-card-${product.id}`}
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#8B5CF6" }}>NEW</span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold text-vigyanics-blue" style={{ background: "#00C896" }}>BEST SELLER</span>
        )}
        {discount && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#EF4444" }}>{discount}% OFF</span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform"
        data-testid={`wishlist-${product.id}`}
      >
        <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </button>

      {/* Product visual */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${product.colorAccent}10, ${product.colorAccent}05)` }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at 50% 50%, ${product.colorAccent}, transparent 70%)` }}
        />

        {/* SVG icon + text visual */}
        <div className="relative flex flex-col items-center gap-3 px-6 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `${product.colorAccent}20`, border: `2px solid ${product.colorAccent}40` }}
          >
            <Zap className="w-8 h-8" style={{ color: product.colorAccent }} />
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{product.category}</span>
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-vigyanics-blue/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-vigyanics-blue text-sm font-bold shadow-lg"
            data-testid={`quickview-${product.id}`}
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display font-bold text-base text-vigyanics-blue leading-tight mb-1 line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3.5 h-3.5"
                fill={star <= Math.round(product.rating) ? "#F59E0B" : "transparent"}
                stroke={star <= Math.round(product.rating) ? "#F59E0B" : "#D1D5DB"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.shortDescription}</p>

        {/* Price row */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-display font-bold text-vigyanics-blue">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: addedAnim ? "#00C896" : product.colorAccent,
              color: addedAnim ? "#fff" : product.colorAccent === "#00D4FF" ? "#0B1F3A" : "#fff",
              boxShadow: `0 4px 20px ${product.colorAccent}35`,
            }}
            data-testid={`add-to-cart-${product.id}`}
          >
            {addedAnim ? (
              <><span>✓</span> Added!</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
