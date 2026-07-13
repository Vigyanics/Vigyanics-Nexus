import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Star, Heart, ShoppingCart, CheckCircle, Package, Zap, Users, Shield, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/store/CartDrawer";
import ProductCard from "@/components/store/ProductCard";
import { useProduct, useProducts } from "@/hooks/useProducts";

interface Props {
  productId: string;
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

export default function ProductDetail({ productId }: Props) {
  const [, navigate] = useLocation();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { product, loading, error } = useProduct(productId);
  const { products: related } = useProducts({
    categorySlug: product?.categories?.slug ?? "",
    limit: 4,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-vigyanics-cyan border-t-transparent animate-spin" />
          <p className="text-gray-400 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <h2 className="text-2xl font-display font-bold text-vigyanics-blue">Product not found</h2>
        <button onClick={() => navigate("/store")} className="px-6 py-3 rounded-full bg-vigyanics-cyan text-vigyanics-blue font-semibold">
          Back to Store
        </button>
      </div>
    );
  }

  const colorAccent = product.color_accent ?? product.categories?.color ?? "#00D4FF";
  const displayPrice = product.sale_price ?? product.price;
  const discount = getDiscount(product.price, product.sale_price);
  const wishlisted = isWishlisted(String(product.id));
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 4);

  function handleAddToCart() {
    addToCart({
      id: String(product!.id),
      name: product!.name,
      price: Number(displayPrice),
      originalPrice: product!.sale_price ? Number(product!.price) : undefined,
      colorAccent,
      thumbnail: product!.thumbnail ?? undefined,
      category: product!.categories?.name ?? "",
      categorySlug: product!.categories?.slug ?? "",
    }, qty);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  }

  const inStock = product.stock_status !== "out_of_stock";

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
              style={{ background: `linear-gradient(135deg, ${colorAccent}12, ${colorAccent}04)`, border: `2px solid ${colorAccent}20` }}
            >
              {product.is_new_arrival && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "#8B5CF6" }}>NEW</div>
              )}
              {product.is_best_seller && (
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-vigyanics-blue" style={{ background: "#00C896" }}>BEST SELLER</div>
              )}
              <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 40%, ${colorAccent}, transparent 60%)` }} />

              {product.thumbnail ? (
                <img src={product.thumbnail} alt={product.name} className="relative w-full h-full object-contain p-8" />
              ) : (
                <>
                  <div
                    className="w-40 h-40 rounded-3xl flex items-center justify-center shadow-2xl mb-4"
                    style={{ background: `${colorAccent}25`, border: `2px solid ${colorAccent}50` }}
                  >
                    <Zap className="w-20 h-20" style={{ color: colorAccent }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{product.categories?.name ?? ""}</span>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.product_images.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.product_images.slice(0, 4).map((img, i) => (
                  <div key={img.id}
                    className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all"
                    style={{ borderColor: i === 0 ? colorAccent : "transparent" }}
                  >
                    <img src={img.url} alt={img.alt ?? product.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center cursor-pointer border-2 transition-all"
                    style={{
                      background: `${colorAccent}${i === 1 ? "20" : "08"}`,
                      borderColor: i === 1 ? colorAccent : "transparent",
                    }}
                  >
                    <Zap className="w-6 h-6" style={{ color: colorAccent, opacity: i === 1 ? 1 : 0.4 }} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="flex gap-2 mb-4 flex-wrap">
              {product.categories && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ color: colorAccent, borderColor: `${colorAccent}40`, background: `${colorAccent}10` }}>
                  {product.categories.name}
                </span>
              )}
              {product.age_group && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  Ages {product.age_group}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-vigyanics-blue mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5"
                    fill={star <= Math.round(Number(product.rating ?? 0)) ? "#F59E0B" : "transparent"}
                    stroke={star <= Math.round(Number(product.rating ?? 0)) ? "#F59E0B" : "#D1D5DB"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-semibold">{Number(product.rating ?? 0).toFixed(1)}</span>
              <span className="text-sm text-gray-400">({(product.review_count ?? 0).toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6 flex-wrap">
              <span className="text-4xl font-display font-bold text-vigyanics-blue">{formatPrice(displayPrice)}</span>
              {product.sale_price && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                  {discount !== null && (
                    <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: "#EF4444" }}>{discount}% OFF</span>
                  )}
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.long_description ?? product.short_description}</p>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${inStock ? "bg-vigyanics-green animate-pulse" : "bg-red-400"}`} />
              <span className={`text-sm font-semibold ${inStock ? "text-vigyanics-green" : "text-red-500"}`}>
                {product.stock_status === "in_stock"
                  ? `In Stock${product.quantity < 20 ? ` — Only ${product.quantity} left` : ""}`
                  : product.stock_status === "low_stock"
                    ? `Low Stock — Only ${product.quantity} left`
                    : "Out of Stock"
                }
              </span>
            </div>

            {/* Qty + CTA */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-vigyanics-cyan transition-colors" data-testid="button-qty-minus">-</button>
                <span className="w-6 text-center font-bold text-vigyanics-blue">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-vigyanics-cyan transition-colors" data-testid="button-qty-plus">+</button>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: addedAnim ? "#00C896" : colorAccent,
                  color: addedAnim ? "#fff" : colorAccent === "#00D4FF" ? "#0B1F3A" : "#fff",
                  boxShadow: `0 8px 30px ${colorAccent}40`,
                }}
                data-testid="button-add-to-cart"
              >
                {addedAnim ? <>Added to Cart!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </motion.button>

              <button
                onClick={() => toggleWishlist(String(product.id))}
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
                { icon: Package, label: "Free Shipping Rs.999+" },
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
          {product.features && product.features.length > 0 && (
            <div className="p-7 rounded-3xl bg-gray-50/60 border border-gray-100">
              <h3 className="font-display font-bold text-vigyanics-blue text-lg mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-vigyanics-cyan" /> What's in the Box
              </h3>
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-vigyanics-green mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags as learning points */}
          {product.tags && product.tags.length > 0 && (
            <div
              className="p-7 rounded-3xl border"
              style={{ background: `${colorAccent}08`, borderColor: `${colorAccent}20` }}
            >
              <h3 className="font-display font-bold text-vigyanics-blue text-lg mb-5 flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: colorAccent }} /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                    style={{ background: `${colorAccent}15`, color: colorAccent }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="p-7 rounded-3xl bg-vigyanics-blue/[0.03] border border-vigyanics-blue/10">
              <h3 className="font-display font-bold text-vigyanics-blue text-lg mb-5">Specifications</h3>
              <dl className="space-y-3">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">{key}</dt>
                    <dd className="text-sm font-semibold text-vigyanics-blue text-right">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Related products */}
        {relatedFiltered.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-display font-bold text-vigyanics-blue mb-8">More in {product.categories?.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedFiltered.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
