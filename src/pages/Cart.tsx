import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/components/ProductCard";
import Layout from "@/components/layout/Layout";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const delivery = totalPrice() > 999 ? 0 : 99;
  const total = totalPrice() + delivery;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 gold-gradient-bg text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm"
          >
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-8">
          Shopping <span className="gold-gradient-text">Cart</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-xl p-4 flex gap-4"
              >
                <Link to={`/product/${product.id}`} className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium truncate hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
                  <p className="font-semibold text-sm mt-2">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 hover:bg-secondary transition-colors rounded-l-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 hover:bg-secondary transition-colors rounded-r-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-sm shrink-0">
                  {formatPrice(product.price * quantity)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass-card rounded-xl p-6 h-fit sticky top-20">
            <h3 className="font-display font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={delivery === 0 ? "text-primary" : ""}>
                  {delivery === 0 ? "Free" : formatPrice(delivery)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full mt-6 gold-gradient-bg text-primary-foreground py-3 rounded-xl font-semibold text-sm text-center hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {delivery > 0 ? `Add ₹${(999 - totalPrice()).toLocaleString("en-IN")} more for free delivery` : "✓ Free delivery applied"}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
