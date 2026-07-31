type Row = Record<string, any>;

export function productToAdmin(row: Row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    salePrice: row.sale_price,
    sku: row.sku,
    quantity: row.quantity,
    status: row.status,
    stockStatus: row.stock_status,
    thumbnail: row.thumbnail,
    isFeatured: row.is_featured,
    isTrending: row.is_trending,
    isBestSeller: row.is_best_seller,
    isNewArrival: row.is_new_arrival,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? null,
    brand: row.brand,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function categoryToAdmin(row: Row, productCount = 0) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    parentId: row.parent_id,
    icon: row.icon,
    color: row.color,
    imageUrl: row.image_url,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    productCount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function customerToAdmin(row: Row) {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function orderToAdmin(row: Row) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    status: row.status,
    total: row.total,
    subtotal: row.subtotal,
    discount: row.discount,
    shippingFee: row.shipping_fee,
    couponCode: row.coupon_code,
    shippingAddress: row.shipping_address,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function adminRequestToAdmin(row: Row) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    message: row.message,
    status: row.status,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
  };
}
