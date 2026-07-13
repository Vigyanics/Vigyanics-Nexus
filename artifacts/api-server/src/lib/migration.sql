-- =====================================================
-- VIGYANICS FULL SUPABASE SCHEMA MIGRATION
-- Run this in Supabase SQL Editor:
-- app.supabase.com → your project → SQL Editor → New query
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- CATEGORIES
-- =====================
create table if not exists public.categories (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  description text,
  parent_id bigint references public.categories(id) on delete set null,
  icon text,
  color text,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- PRODUCTS
-- =====================
create table if not exists public.products (
  id bigserial primary key,
  name text not null,
  short_description text,
  long_description text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  sku text unique,
  quantity int not null default 0,
  category_id bigint references public.categories(id) on delete set null,
  brand text,
  tags text[],
  thumbnail text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  stock_status text not null default 'in_stock' check (stock_status in ('in_stock','low_stock','out_of_stock')),
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  weight text,
  dimensions text,
  specifications jsonb,
  features text[],
  age_group text,
  rating numeric(3,2) default 0,
  review_count int default 0,
  color_accent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- PRODUCT IMAGES
-- =====================
create table if not exists public.product_images (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =====================
-- CUSTOMERS (linked to Supabase auth.users)
-- =====================
create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer','admin','super_admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create customer record on auth signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.customers (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================
-- ADDRESSES
-- =====================
create table if not exists public.addresses (
  id bigserial primary key,
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================
-- ORDERS
-- =====================
create table if not exists public.orders (
  id bigserial primary key,
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text,
  customer_email text,
  customer_phone text,
  status text not null default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  total numeric(10,2) not null default 0,
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  coupon_code text,
  shipping_address jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- ORDER ITEMS
-- =====================
create table if not exists public.order_items (
  id bigserial primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id bigint references public.products(id) on delete set null,
  product_name text not null,
  quantity int not null default 1,
  price numeric(10,2) not null,
  total numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- =====================
-- WISHLIST
-- =====================
create table if not exists public.wishlist (
  id bigserial primary key,
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(customer_id, product_id)
);

-- =====================
-- CART
-- =====================
create table if not exists public.cart (
  id bigserial primary key,
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  quantity int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(customer_id, product_id)
);

-- =====================
-- REVIEWS
-- =====================
create table if not exists public.reviews (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  is_verified boolean not null default false,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================
-- COUPONS
-- =====================
create table if not exists public.coupons (
  id bigserial primary key,
  code text not null unique,
  description text,
  discount_type text not null default 'percent' check (discount_type in ('percent','fixed')),
  discount_value numeric(10,2) not null,
  min_order_value numeric(10,2) not null default 0,
  max_uses int,
  used_count int not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- =====================
-- BANNERS (Homepage)
-- =====================
create table if not exists public.banners (
  id bigserial primary key,
  title text not null,
  subtitle text,
  image_url text,
  link_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- BLOGS
-- =====================
create table if not exists public.blogs (
  id bigserial primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  thumbnail text,
  author text,
  category text,
  tags text[],
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- EVENTS
-- =====================
create table if not exists public.events (
  id bigserial primary key,
  title text not null,
  slug text not null unique,
  description text,
  thumbnail text,
  venue text,
  event_date timestamptz,
  registration_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- COURSES
-- =====================
create table if not exists public.courses (
  id bigserial primary key,
  title text not null,
  slug text not null unique,
  description text,
  thumbnail text,
  price numeric(10,2) not null default 0,
  duration text,
  level text,
  instructor text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- WORKSHOPS
-- =====================
create table if not exists public.workshops (
  id bigserial primary key,
  title text not null,
  slug text not null unique,
  description text,
  thumbnail text,
  price numeric(10,2) not null default 0,
  duration text,
  max_participants int,
  venue text,
  workshop_date timestamptz,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- CONTACT MESSAGES
-- =====================
create table if not exists public.contact_messages (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================
-- NEWSLETTER SUBSCRIBERS
-- =====================
create table if not exists public.newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  name text,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now()
);

-- =====================
-- TESTIMONIALS
-- =====================
create table if not exists public.testimonials (
  id bigserial primary key,
  name text not null,
  role text,
  school text,
  content text not null,
  rating int default 5 check (rating between 1 and 5),
  avatar_url text,
  is_approved boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =====================
-- GALLERY
-- =====================
create table if not exists public.gallery (
  id bigserial primary key,
  title text,
  image_url text not null,
  category text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =====================
-- SETTINGS
-- =====================
create table if not exists public.settings (
  key text primary key,
  value text,
  description text,
  updated_at timestamptz not null default now()
);

-- =====================
-- ADMIN ACTIVITY LOGS
-- =====================
create table if not exists public.admin_logs (
  id bigserial primary key,
  admin_id uuid references public.customers(id) on delete set null,
  admin_email text,
  action text not null,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- =====================
-- STORAGE BUCKETS
-- =====================
insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),
  ('course-images', 'course-images', true),
  ('workshop-images', 'workshop-images', true),
  ('gallery', 'gallery', true),
  ('blog-images', 'blog-images', true),
  ('banners', 'banners', true),
  ('avatars', 'avatars', false)
on conflict (id) do nothing;

-- =====================
-- ROW LEVEL SECURITY
-- =====================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist enable row level security;
alter table public.cart enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.banners enable row level security;
alter table public.blogs enable row level security;
alter table public.events enable row level security;
alter table public.courses enable row level security;
alter table public.workshops enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery enable row level security;
alter table public.settings enable row level security;
alter table public.admin_logs enable row level security;

-- Public read policies
create policy "Public read published products" on public.products for select using (status = 'published');
create policy "Public read active categories" on public.categories for select using (is_active = true);
create policy "Public read product images" on public.product_images for select using (true);
create policy "Public read published blogs" on public.blogs for select using (status = 'published');
create policy "Public read active events" on public.events for select using (is_active = true);
create policy "Public read published courses" on public.courses for select using (status = 'published');
create policy "Public read published workshops" on public.workshops for select using (status = 'published');
create policy "Public read approved testimonials" on public.testimonials for select using (is_approved = true);
create policy "Public read active gallery" on public.gallery for select using (is_active = true);
create policy "Public read active banners" on public.banners for select using (is_active = true);
create policy "Public read settings" on public.settings for select using (true);

-- Customer self-access policies
create policy "Customers read own profile" on public.customers for select using (auth.uid() = id);
create policy "Customers update own profile" on public.customers for update using (auth.uid() = id);
create policy "Customers manage own addresses" on public.addresses for all using (auth.uid() = customer_id);
create policy "Customers read own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Customers read own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_items.order_id and customer_id = auth.uid())
);
create policy "Customers manage wishlist" on public.wishlist for all using (auth.uid() = customer_id);
create policy "Customers manage cart" on public.cart for all using (auth.uid() = customer_id);
create policy "Customers submit reviews" on public.reviews for insert with check (auth.uid() = customer_id);
create policy "Customers read own reviews" on public.reviews for select using (auth.uid() = customer_id);

-- Public write policies
create policy "Anyone can submit contact" on public.contact_messages for insert with check (true);
create policy "Anyone can subscribe newsletter" on public.newsletter_subscribers for insert with check (true);

-- Storage policies (public buckets are readable by all)
create policy "Public read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Public read course images" on storage.objects for select using (bucket_id = 'course-images');
create policy "Public read workshop images" on storage.objects for select using (bucket_id = 'workshop-images');
create policy "Public read gallery" on storage.objects for select using (bucket_id = 'gallery');
create policy "Public read blog images" on storage.objects for select using (bucket_id = 'blog-images');
create policy "Public read banners" on storage.objects for select using (bucket_id = 'banners');

-- =====================
-- SEED: DEFAULT SETTINGS
-- =====================
insert into public.settings (key, value, description) values
  ('site_name', 'Vigyanics', 'Website name'),
  ('site_tagline', 'Learn by Doing', 'Site tagline'),
  ('whatsapp_number', '919999999999', 'WhatsApp contact number'),
  ('contact_email', 'contact@vigyanics.com', 'Contact email address'),
  ('shipping_fee', '99', 'Default shipping fee in INR'),
  ('free_shipping_above', '999', 'Free shipping above this order value')
on conflict (key) do nothing;
