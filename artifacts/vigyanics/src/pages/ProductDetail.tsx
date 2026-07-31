import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, Heart, ShoppingCart, CheckCircle, Package,
  Zap, Users, Shield, RotateCcw, Share2, Copy, Check,
  ThumbsUp, MessageCircle, Clock, Truck, Eye, X
} from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/store/CartDrawer";
import ProductCard from "@/components/store/ProductCard";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ProductImagePlaceholder, ThumbnailPlaceholder } from "@/components/ui/ProductPlaceholder";

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

// ─── Recently Viewed ─────────────────────────────────────────────────────────
const RECENTLY_VIEWED_KEY = "vigyanics_recently_viewed";
const MAX_RECENTLY_VIEWED = 6;

function getRecentlyViewedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
  } catch { return []; }
}

function addRecentlyViewedId(id: string) {
  try {
    const ids = getRecentlyViewedIds().filter((i) => i !== id);
    ids.unshift(id);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids.slice(0, MAX_RECENTLY_VIEWED)));
  } catch { /* noop */ }
}

// ─── Mock Reviews (since we don't have a reviews table yet) ──────────────────
interface MockReview {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
}

function generateMockReviews(productName: string, rating: number, reviewCount: number): MockReview[] {
  const names = ["Arjun S.", "Priya M.", "Rahul K.", "Ananya D.", "Vikram P.", "Neha G.", "Rohit S.", "Kavya R.", "Aditya V.", "Sneha T."];
  const titles = [
    "Amazing learning experience!",
    "Perfect for my child's school project",
    "High quality components",
    "Great value for money",
    "My students loved it!",
    "Excellent STEM kit",
    "Worth every rupee",
    "Easy to follow instructions",
    "Built it in one afternoon",
    "Highly recommend for beginners",
  ];
  const contents = [
    "The kit exceeded my expectations. Everything was well-packaged and the instructions were crystal clear. My son built his first robot in under 2 hours!",
    "I bought this for my daughter's science fair project and it was perfect. The components are high quality and the project book is very well written.",
    "As a teacher, I'm always looking for good STEM resources. This kit is fantastic - the curriculum alignment is excellent and my students were engaged throughout.",
    "Really impressed with the build quality. The PCB is professionally made and all components are genuine. The online course is a nice bonus too.",
    "Bought this for my nephew who's interested in robotics. He absolutely loved it! The step-by-step guide made it easy for him to follow along.",
    "Great starter kit for anyone interested in electronics. The 30 experiments cover a wide range of concepts and the workbook is very detailed.",
    "The best part is the customer support - when I had a question about one of the projects, they responded within hours. Excellent service!",
    "I've tried several STEM kits and this one is by far the best. The components are organized well and the instructions are easy to follow.",
    "Perfect for homeschooling. We've been using it for our science curriculum and it's been a fantastic hands-on learning tool.",
    "The kit arrived quickly and was well-packaged. My 12-year-old was able to assemble everything with minimal help. Highly recommended!",
  ];

  const count = Math.min(reviewCount, 8);
  const reviews: MockReview[] = [];
  const baseRating = Number(rating);

  for (let i = 0; i < count; i++) {
    const offset = (Math.random() - 0.5) * 1.2;
    const reviewRating = Math.min(5, Math.max(1, Math.round(baseRating + offset)));
    reviews.push({
      id: i + 1,
      author: names[i % names.length],
      avatar: "",
      rating: reviewRating,
      date: new Date(Date.now() - Math.random() * 90 * 86400000).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
      title: titles[i % titles.length],
      content: contents[i % contents.length],
      verified: Math.random() > 0.2,
      helpful: Math.floor(Math.random() * 48) + 2,
    });
  }

  return reviews.sort((a, b) => b.rating - a.rating);
}

const ratingLabels = ["Excellent", "Good", "Average", "Below Average", "Poor"];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProductDetail({ productId }: Props) {
  const [, navigate] = useLocation();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewSort, setReviewSort] = useState<"newest" | "highest" | "lowest">("newest");
  const [reviewPage, setReviewPage] = useState(1);
const reviewsPerPage = 4;
  const isMobile = useIsMobile();

  const { product, loading, error } = useProduct(productId);
  const { products: related } = useProducts({
    categorySlug: product?.categories?.slug ?? "",
    limit: 4,
  });

// Recently viewed
  useEffect(() => {
    if (product?.id) {
      addRecentlyViewedId(String(product.id));
    }
  }, [product?.id]);

  // Fetch products for recently viewed (we'll filter them client-side)
  const { products: allProducts } = useProducts({
    limit: 20,
  });

  const recentlyViewed = allProducts
    .filter((p) => {
      const ids = getRecentlyViewedIds();
      return ids.includes(String(p.id)) && String(p.id) !== String(product?.id ?? "");
    })
    .slice(0, 4);

  // Mock reviews
  const mockReviews = product ? generateMockReviews(product.name, Number(product.rating ?? 0), Number(product.review_count ?? 0)) : [];
  const sortedReviews = [...mockReviews].sort((a, b) => {
    if (reviewSort === "highest") return b.rating - a.rating;
    if (reviewSort === "lowest") return a.rating - b.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const pagedReviews = sortedReviews.slice(0, reviewPage * reviewsPerPage);

  // Rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0];
  mockReviews.forEach((r) => { ratingDistribution[5 - r.rating]++; });

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
  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 4);
  const inStock = product.stock_status !== "out_of_stock";

  // Check if product has real images from the database
  const hasRealImages = product.product_images.length > 0;
  // Real image URLs from DB
  const realImages = product.product_images.map((img) => img.url);

  function handleAddToCart() {
    addToCart(
      {
        id: String(product!.id),
        name: product!.name,
        price: Number(displayPrice),
        originalPrice: product!.sale_price ? Number(product!.price) : undefined,
        colorAccent,
        thumbnail: product!.thumbnail ?? undefined,
        category: product!.categories?.name ?? "",
        categorySlug: product!.categories?.slug ?? "",
      },
      qty,
    );
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  }

  function handleShare() {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.short_description ?? product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShowShareMenu(!showShareMenu);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  const deliveryEstimate = inStock
    ? product.stock_status === "low_stock"
      ? "5–7 business days"
      : "2–4 business days"
    : "N/A";

  return (
    <div className="min-h-screen bg-white" style={{ background: "white", color: "#0B1F3A" }}>
      <CartDrawer />

      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-vigyanics-blue transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate("/store")} className="hover:text-vigyanics-blue transition-colors">Store</button>
          <span>/</span>
          <span className="text-vigyanics-blue font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <button
          onClick={() => navigate("/store")}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-vigyanics-blue transition-colors mb-6 md:mb-8 font-medium"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
{/* ── Left: Visual Gallery ────────────────────────────────────── */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Main image with zoom */}
            <div
              className="relative w-full aspect-square rounded-3xl flex flex-col items-center justify-center overflow-hidden mb-4 cursor-crosshair"
              style={{
                background: `linear-gradient(135deg, ${colorAccent}12, ${colorAccent}04)`,
                border: `2px solid ${colorAccent}20`,
              }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onClick={() => hasRealImages && setIsLightboxOpen(true)}
            >
              {product.is_new_arrival && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "#8B5CF6" }}>NEW</div>
              )}
              {product.is_best_seller && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold text-vigyanics-blue" style={{ background: "#00C896" }}>BEST SELLER</div>
              )}
              {discount !== null && (
                <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "#EF4444" }}>{discount}% OFF</div>
              )}

              <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 40%, ${colorAccent}, transparent 60%)` }} />

              {hasRealImages || product.thumbnail ? (
                <img
                  src={hasRealImages ? realImages[selectedImageIdx] : (product.thumbnail ?? "")}
                  alt={product.name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.dataset.fallback) return;
                    target.dataset.fallback = "1";
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const placeholder = document.createElement("div");
                      placeholder.className = "w-full h-full flex items-center justify-center";
                      const fallbackColor = colorAccent;
                      placeholder.innerHTML = `<div style="width:80px;height:80px;border-radius:24px;background:${fallbackColor}20;border:2px solid ${fallbackColor}40;display:flex;align-items:center;justify-content:center">⚡</div>`;
                      parent.appendChild(placeholder);
                    }
                  }}
                  className="relative w-full h-full object-contain p-8 transition-transform duration-200"
                  style={{
                    transform: isZoomed ? `scale(1.8)` : "scale(1)",
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
              ) : (
                <ProductImagePlaceholder color={colorAccent} label={product.categories?.name ?? ""} />
              )}

              {/* Zoom hint */}
              {!isMobile && hasRealImages && (
                <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1.5">
                  <Eye className="w-3 h-3" /> Hover to zoom
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {hasRealImages ? (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {realImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 hover:opacity-80"
                    style={{ borderColor: i === selectedImageIdx ? colorAccent : "transparent" }}
                  >
                    <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-3">
                <ThumbnailPlaceholder color={colorAccent} isActive={true} />
                <ThumbnailPlaceholder color={colorAccent} />
                <ThumbnailPlaceholder color={colorAccent} />
              </div>
            )}
          </motion.div>

{/* ── Right: Info ─────────────────────────────────────────────── */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col pb-24 md:pb-0"
          >
            {/* Badges row */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {product.categories && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{ color: colorAccent, borderColor: `${colorAccent}40`, background: `${colorAccent}10` }}
                >
                  {product.categories.name}
                </span>
              )}
              {product.age_group && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  Ages {product.age_group}
                </span>
              )}
              {product.sku && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-vigyanics-blue mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5"
                    fill={star <= Math.round(Number(product.rating ?? 0)) ? "#F59E0B" : "transparent"}
                    stroke={star <= Math.round(Number(product.rating ?? 0)) ? "#F59E0B" : "#D1D5DB"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-semibold">{Number(product.rating ?? 0).toFixed(1)}</span>
              <span className="text-sm text-gray-400">({(product.review_count ?? 0).toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-4 flex-wrap">
              <span className="text-4xl font-display font-bold text-vigyanics-blue">{formatPrice(displayPrice)}</span>
              {product.sale_price && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                  {discount !== null && (
                    <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: "#EF4444" }}>
                      Save {formatPrice(Number(product.price) - Number(displayPrice))} ({discount}% OFF)
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-gray-600 leading-relaxed mb-6">{product.long_description ?? product.short_description}</p>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${inStock ? "bg-vigyanics-green animate-pulse" : "bg-red-400"}`} />
              <span className={`text-sm font-semibold ${inStock ? "text-vigyanics-green" : "text-red-500"}`}>
                {product.stock_status === "in_stock"
                  ? `In Stock${product.quantity < 20 ? ` — Only ${product.quantity} left` : ""}`
                  : product.stock_status === "low_stock"
                    ? `Low Stock — Only ${product.quantity} left`
                    : "Out of Stock"}
              </span>
            </div>

            {/* Delivery estimate */}
            {inStock && (
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <Truck className="w-4 h-4 text-vigyanics-cyan" />
                <span>Estimated delivery: <strong className="text-gray-700">{deliveryEstimate}</strong></span>
              </div>
            )}

            {/* Qty + CTA */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-vigyanics-cyan transition-colors"
                  data-testid="button-qty-minus"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-vigyanics-blue">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-vigyanics-cyan transition-colors"
                  data-testid="button-qty-plus"
                >
                  +
                </button>
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
                {addedAnim ? (
                  <>Added to Cart!</>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </motion.button>

              <button
                onClick={() => toggleWishlist(String(product.id))}
                className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"
                data-testid="button-wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>

              {/* Share button */}
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-vigyanics-cyan transition-colors"
                  data-testid="button-share"
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>

                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[180px]"
                  >
                    <button
                      onClick={handleCopyLink}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-vigyanics-green" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Link copied!" : "Copy link"}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${product.name} - ${window.location.href}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-green-500" /> Share on WhatsApp
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} at Vigyanics! ${window.location.href}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Share on X
                    </a>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
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

        {/* ─── Product Details Tabs ──────────────────────────────────────── */}
        <div className="mt-16">
          {isMobile ? (
            /* Mobile: Accordion view */
            <Accordion type="single" collapsible className="w-full">
              {product.long_description && (
                <AccordionItem value="description">
                  <AccordionTrigger className="font-display font-bold text-vigyanics-blue text-lg">
                    Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 leading-relaxed">{product.long_description}</p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {product.features && product.features.length > 0 && (
                <AccordionItem value="features">
                  <AccordionTrigger className="font-display font-bold text-vigyanics-blue text-lg">
                    What's in the Box ({product.features.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-vigyanics-green mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <AccordionItem value="specifications">
                  <AccordionTrigger className="font-display font-bold text-vigyanics-blue text-lg">
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent>
                    <dl className="space-y-3">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
                          <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">{key}</dt>
                          <dd className="text-sm font-semibold text-vigyanics-blue text-right">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              )}

              {product.tags && product.tags.length > 0 && (
                <AccordionItem value="tags">
                  <AccordionTrigger className="font-display font-bold text-vigyanics-blue text-lg">
                    Tags
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                          style={{ background: `${colorAccent}15`, color: colorAccent }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          ) : (
            /* Desktop: Tabs view */
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-100 rounded-none bg-transparent p-0 h-auto gap-0">
                {product.long_description && (
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-vigyanics-cyan data-[state=active]:text-vigyanics-blue data-[state=active]:shadow-none px-6 py-3 text-sm font-semibold text-gray-500"
                  >
                    Description
                  </TabsTrigger>
                )}
                {product.features && product.features.length > 0 && (
                  <TabsTrigger
                    value="features"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-vigyanics-cyan data-[state=active]:text-vigyanics-blue data-[state=active]:shadow-none px-6 py-3 text-sm font-semibold text-gray-500"
                  >
                    What's in the Box ({product.features.length})
                  </TabsTrigger>
                )}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <TabsTrigger
                    value="specifications"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-vigyanics-cyan data-[state=active]:text-vigyanics-blue data-[state=active]:shadow-none px-6 py-3 text-sm font-semibold text-gray-500"
                  >
                    Specifications
                  </TabsTrigger>
                )}
                {product.tags && product.tags.length > 0 && (
                  <TabsTrigger
                    value="tags"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-vigyanics-cyan data-[state=active]:text-vigyanics-blue data-[state=active]:shadow-none px-6 py-3 text-sm font-semibold text-gray-500"
                  >
                    Tags
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="mt-8">
                {product.long_description && (
                  <TabsContent value="description" className="mt-0">
                    <div className="max-w-3xl">
                      <p className="text-gray-600 leading-relaxed text-base">{product.long_description}</p>
                    </div>
                  </TabsContent>
                )}

                {product.features && product.features.length > 0 && (
                  <TabsContent value="features" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                      {product.features.map((f) => (
                        <div key={f} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
                          <CheckCircle className="w-5 h-5 text-vigyanics-green mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{f}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <TabsContent value="specifications" className="mt-0">
                    <div className="max-w-xl">
                      <dl className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                        {Object.entries(product.specifications).map(([key, val], idx) => (
                          <div
                            key={key}
                            className={cn(
                              "flex justify-between items-center px-6 py-4",
                              idx % 2 === 0 ? "bg-gray-50/40" : "bg-white",
                            )}
                          >
                            <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{key}</dt>
                            <dd className="text-sm font-semibold text-vigyanics-blue text-right">{val}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </TabsContent>
                )}

                {product.tags && product.tags.length > 0 && (
                  <TabsContent value="tags" className="mt-0">
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full text-sm font-semibold capitalize border"
                          style={{ background: `${colorAccent}10`, color: colorAccent, borderColor: `${colorAccent}25` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </div>
            </Tabs>
          )}
        </div>

        {/* ─── Customer Reviews ─────────────────────────────────────────── */}
        <div className="mt-16">
          <Separator className="mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Rating summary */}
            <div>
              <h2 className="text-2xl font-display font-bold text-vigyanics-blue mb-6">Customer Reviews</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-display font-bold text-vigyanics-blue">
                  {Number(product.rating ?? 0).toFixed(1)}
                </div>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4"
                        fill={star <= Math.round(Number(product.rating ?? 0)) ? "#F59E0B" : "transparent"}
                        stroke={star <= Math.round(Number(product.rating ?? 0)) ? "#F59E0B" : "#D1D5DB"}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{(product.review_count ?? 0).toLocaleString()} reviews</p>
                </div>
              </div>

              {/* Rating distribution bars */}
              <div className="space-y-2.5">
                {ratingDistribution.map((count, i) => {
                  const total = mockReviews.length || 1;
                  const pct = (count / total) * 100;
                  const starCount = 5 - i;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 w-16 text-right">{ratingLabels[i]}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: starCount >= 4 ? "#00C896" : starCount >= 3 ? "#F59E0B" : "#EF4444" }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-2">
              {/* Sort controls */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  Showing {Math.min(reviewPage * reviewsPerPage, sortedReviews.length)} of {sortedReviews.length} reviews
                </p>
                <select
                  value={reviewSort}
                  onChange={(e) => {
                    setReviewSort(e.target.value as "newest" | "highest" | "lowest");
                    setReviewPage(1);
                  }}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-vigyanics-cyan"
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>

              {/* Reviews */}
              <div className="space-y-5">
                {pagedReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vigyanics-blue/10 flex items-center justify-center text-vigyanics-blue font-bold text-sm">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-vigyanics-blue">{review.author}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-vigyanics-green/10 text-vigyanics-green border-0">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="w-3 h-3"
                                  fill={star <= review.rating ? "#F59E0B" : "transparent"}
                                  stroke={star <= review.rating ? "#F59E0B" : "#D1D5DB"}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold text-sm text-vigyanics-blue mb-1.5">{review.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.content}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <button className="flex items-center gap-1.5 hover:text-vigyanics-cyan transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-vigyanics-cyan transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> Reply
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load more / pagination */}
              {pagedReviews.length < sortedReviews.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setReviewPage((p) => p + 1)}
                    className="px-6 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-vigyanics-cyan hover:text-vigyanics-blue transition-all"
                  >
                    Load More Reviews
                  </button>
                </div>
              )}

              {sortedReviews.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Related Products ──────────────────────────────────────────── */}
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

        {/* ─── Recently Viewed Products ──────────────────────────────────── */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-10" />
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-5 h-5 text-vigyanics-cyan" />
              <h2 className="text-2xl font-display font-bold text-vigyanics-blue">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Lightbox ────────────────────────────────────────────────────── */}
      {isLightboxOpen && hasRealImages && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={realImages[selectedImageIdx]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          {/* Lightbox thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {realImages.map((url, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedImageIdx(i); }}
                className="w-14 h-14 rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: i === selectedImageIdx ? "#00D4FF" : "transparent", opacity: i === selectedImageIdx ? 1 : 0.5 }}
              >
                <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Sticky Mobile Bottom Bar ──────────────────────────────────── */}
      {isMobile && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-display font-bold text-vigyanics-blue">{formatPrice(displayPrice)}</span>
              {product.sale_price && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${inStock ? "bg-vigyanics-green" : "bg-red-400"}`} />
              <span className={`text-xs font-semibold ${inStock ? "text-vigyanics-green" : "text-red-500"}`}>
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs"
              >
                -
              </button>
              <span className="w-5 text-center font-bold text-vigyanics-blue text-sm">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs"
              >
                +
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={!inStock}
              className="px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: addedAnim ? "#00C896" : colorAccent,
                color: addedAnim ? "#fff" : colorAccent === "#00D4FF" ? "#0B1F3A" : "#fff",
              }}
            >
              {addedAnim ? "Added!" : "Add to Cart"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
