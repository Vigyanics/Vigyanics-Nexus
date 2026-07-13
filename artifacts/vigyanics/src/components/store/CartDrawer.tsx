import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full z-50 w-full max-w-md flex flex-col shadow-2xl"
            style={{ background: "#ffffff" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-vigyanics-blue" />
                <h2 className="font-display font-bold text-lg text-vigyanics-blue">
                  Your Cart
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-semibold text-vigyanics-cyan">({totalItems})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                data-testid="button-close-cart"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="font-display font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-gray-400 mb-6">Add products to get started</p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 rounded-full bg-vigyanics-blue text-white text-sm font-semibold hover:bg-vigyanics-blue/90 transition-colors"
                    data-testid="button-continue-shopping"
                  >
                    Browse Store
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => {
                    const discount = item.product.originalPrice
                      ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
                      : null;

                    return (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50"
                      >
                        {/* Product icon */}
                        <div
                          className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl font-bold"
                          style={{ background: `${item.product.colorAccent}15`, border: `1.5px solid ${item.product.colorAccent}30` }}
                        >
                          <span style={{ color: item.product.colorAccent }} className="text-sm font-display font-bold text-center leading-tight px-1">
                            {item.product.name.split(" ").slice(0, 2).join("\n")}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-vigyanics-blue leading-tight mb-1 truncate">{item.product.name}</h4>
                          {discount && (
                            <span className="text-xs text-vigyanics-green font-semibold">{discount}% off</span>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-vigyanics-cyan transition-colors"
                                data-testid={`button-decrease-${item.product.id}`}
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="text-sm font-bold text-vigyanics-blue w-5 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-vigyanics-cyan transition-colors"
                                data-testid={`button-increase-${item.product.id}`}
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-vigyanics-blue">{formatPrice(item.product.price * item.quantity)}</span>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                                data-testid={`button-remove-${item.product.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                {/* Coupon */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-vigyanics-cyan transition-colors"
                    data-testid="input-coupon"
                  />
                  <button className="px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-700">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-vigyanics-green font-semibold">Free on orders above ₹999</span>
                  </div>
                  <div className="flex justify-between font-bold text-vigyanics-blue pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-lg">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl bg-vigyanics-blue text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-vigyanics-blue/20 transition-all duration-200"
                  data-testid="button-checkout"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </motion.button>

                <p className="text-center text-xs text-gray-400">Secure checkout · Free returns · 1-year warranty</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
