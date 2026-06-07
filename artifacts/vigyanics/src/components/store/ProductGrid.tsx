import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  badge?: string;
  badgeColor?: string;
  id?: string;
  viewAllHref?: string;
  bgClass?: string;
}

export default function ProductGrid({ title, subtitle, products, badge, badgeColor = "#00D4FF", id, viewAllHref, bgClass = "bg-gray-50/50" }: ProductGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className={`py-20 ${bgClass}`} ref={ref} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4"
        >
          <div>
            {badge && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                style={{ background: `${badgeColor}15`, color: badgeColor, border: `1px solid ${badgeColor}30` }}
              >
                {badge}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-vigyanics-blue">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-2 max-w-lg">{subtitle}</p>}
          </div>

          {viewAllHref && (
            <a
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-vigyanics-cyan font-semibold hover:gap-3 transition-all duration-200 flex-shrink-0"
            >
              View all <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
