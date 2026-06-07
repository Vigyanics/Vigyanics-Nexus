import StoreHero from "@/components/store/StoreHero";
import FeaturedCategories from "@/components/store/FeaturedCategories";
import ProductGrid from "@/components/store/ProductGrid";
import SchoolSolutions from "@/components/store/SchoolSolutions";
import CartDrawer from "@/components/store/CartDrawer";
import { featuredProducts, bestSellers, newArrivals } from "@/data/products";

export default function Store() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <CartDrawer />
      <StoreHero />
      <FeaturedCategories />

      <ProductGrid
        id="featured-products"
        title="Featured Products"
        subtitle="Handpicked by our STEM educators for maximum learning impact"
        products={featuredProducts}
        badge="Featured"
        badgeColor="#00D4FF"
        bgClass="bg-white"
        viewAllHref="#best-sellers"
      />

      <ProductGrid
        id="best-sellers"
        title="Best Sellers"
        subtitle="Loved by students, trusted by schools across India"
        products={bestSellers}
        badge="Best Sellers"
        badgeColor="#00C896"
        bgClass="bg-gray-50/60"
        viewAllHref="#new-arrivals"
      />

      <ProductGrid
        id="new-arrivals"
        title="New Arrivals"
        subtitle="The latest kits and innovations just added to our store"
        products={newArrivals}
        badge="New"
        badgeColor="#8B5CF6"
        bgClass="bg-white"
      />

      <SchoolSolutions />

      {/* Social proof strip */}
      <section className="py-16 bg-gray-50/60 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "5,000+", label: "Students using our kits" },
              { stat: "80+", label: "Partner schools" },
              { stat: "4.8★", label: "Average product rating" },
              { stat: "100%", label: "Free returns within 7 days" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-display font-bold text-vigyanics-blue mb-1">{item.stat}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
