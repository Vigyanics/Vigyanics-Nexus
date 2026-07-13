import { useState, useEffect, useCallback } from "react";
import supabase from "@/lib/supabase";

export interface StoreProduct {
  id: number;
  name: string;
  short_description: string | null;
  long_description: string | null;
  price: string;
  sale_price: string | null;
  sku: string | null;
  quantity: number;
  status: string;
  stock_status: string;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  thumbnail: string | null;
  tags: string[] | null;
  age_group: string | null;
  rating: string | null;
  review_count: number | null;
  color_accent: string | null;
  features: string[] | null;
  specifications: Record<string, string> | null;
  category_id: number | null;
  categories: { name: string; slug: string; color: string | null; icon: string | null } | null;
  product_images: { id: number; url: string; alt: string | null; sort_order: number }[];
  created_at: string;
}

export interface StoreCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useProducts(filters: {
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  trending?: boolean;
  categorySlug?: string;
  search?: string;
  limit?: number;
} = {}) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("products")
        .select("*, categories(name, slug, color, icon), product_images(*)")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (filters.featured) query = query.eq("is_featured", true);
      if (filters.bestSeller) query = query.eq("is_best_seller", true);
      if (filters.newArrival) query = query.eq("is_new_arrival", true);
      if (filters.trending) query = query.eq("is_trending", true);
      if (filters.search) query = query.ilike("name", `%${filters.search}%`);
      if (filters.limit) query = query.limit(filters.limit);

      if (filters.categorySlug) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filters.categorySlug)
          .single();
        if (cat) query = query.eq("category_id", cat.id);
      }

      const { data, error: err } = await query;
      if (err) throw new Error(err.message);
      setProducts((data ?? []) as StoreProduct[]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load products";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime subscription for product updates (only after initial load)
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel("products-realtime")
        .on("postgres_changes" as Parameters<ReturnType<typeof supabase.channel>["on"]>[0], { event: "*", schema: "public", table: "products" }, () => {
          fetch();
        })
        .subscribe();
    } catch {
      // Realtime not available yet — no-op
    }
    return () => {
      if (channel) supabase.removeChannel(channel).catch(() => {});
    };
  }, []);

  return { products, loading, error, refetch: fetch };
}

export function useProduct(id: number | string) {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const isNumeric = typeof id === "number" || /^\d+$/.test(String(id));
      let query = supabase
        .from("products")
        .select("*, categories(name, slug, color, icon), product_images(*)")
        .eq("status", "published");

      const { data, error: err } = isNumeric
        ? await query.eq("id", Number(id)).single()
        : await query.eq("sku", String(id)).single();

      if (err) setError(err.message);
      else setProduct(data as StoreProduct);
      setLoading(false);
    }
    load();
  }, [id]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => { setCategories((data ?? []) as StoreCategory[]); setLoading(false); });
  }, []);

  return { categories, loading };
}
