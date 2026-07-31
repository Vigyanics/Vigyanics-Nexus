import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import type { StoreProduct } from "@/hooks/useProducts";
import { ProductImagePlaceholder } from "@/components/ui/ProductPlaceholder";

interface ProductCardProps {
  product: StoreProduct;
  index?: number;
}

function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(price));
}

function getDiscount(price: number | string, salePrice: number | string | null): number | null {
  if (!salePrice) return null;
  const orig = Number(price);
  const sale = Number(salePrice);
  if (sale >= orig) return null;
  return Math.round(((orig - sale) / orig) * 100);
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [addedAnim, setAddedAnim] = useState(false);
  const [, navigate] = useLocation();

  const colorAccent = product.color_accent ?? product.categories?.color ?? "#00D4FF";
  const displayPrice = product.sale_price ?? product.price;
  const discount = getDiscount(product.price, product.sale_price);
  const wishlisted = isWishlisted(String(product.id));

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addToCart({
      id: String(product.id),
      name: product.name,
      price: Number(displayPrice),
      originalPrice: product.sale_price ? Number(product.price) : undefined,
      colorAccent,
      thumbnail: product.thumbnail ?? undefined,
      category: product.categories?.name ?? "",
      categorySlug: product.categories?.slug ?? "",
    });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    toggleWishlist(String(product.id));
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
        {product.is_new_arrival && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#8B5CF6" }}>NEW</span>
        )}
        {product.is_best_seller && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold text-vigyanics-blue" style={{ background: "#00C896" }}>BEST SELLER</span>
        )}
        {discount !== null && (
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
        style={{ background: `linear-gradient(135deg, ${colorAccent}10, ${colorAccent}05)` }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at 50% 50%, ${colorAccent}, transparent 70%)` }}
        />

{product.thumbnail ? (
            <img src={product.thumbnail} alt={product.name} className="relative w-full h-full object-contain p-6" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          ) : (
            <ProductImagePlaceholder color={colorAccent} label={product.categories?.name ?? ""} className="w-full h-full" />
          )}

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
                fill={star <= Math.round(Number(product.rating ?? 0)) ? "#F59E0B" : "transparent"}
                stroke={star <= Math.round(Number(product.rating ?? 0)) ? "#F59E0B" : "#D1D5DB"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {Number(product.rating ?? 0).toFixed(1)} ({(product.review_count ?? 0).toLocaleString()})
          </span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.short_description}</p>

        {/* Price row */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-display font-bold text-vigyanics-blue">{formatPrice(displayPrice)}</span>
            {product.sale_price && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock_status === "out_of_stock"}
            className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: addedAnim ? "#00C896" : colorAccent,
              color: addedAnim ? "#fff" : colorAccent === "#00D4FF" ? "#0B1F3A" : "#fff",
              boxShadow: `0 4px 20px ${colorAccent}35`,
            }}
            data-testid={`add-to-cart-${product.id}`}
          >
            {product.stock_status === "out_of_stock" ? (
              "Out of Stock"
            ) : addedAnim ? (
              <>Added!</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
