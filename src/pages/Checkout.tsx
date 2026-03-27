import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/components/ProductCard";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Banknote, Lock } from "lucide-react";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [paymentMethod] = useState<"cod">("cod");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const delivery = totalPrice() > 999 ? 0 : 99;
  const subtotal = totalPrice();
  const total = subtotal + delivery - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "FIRST20") {
      const d = Math.round(subtotal * 0.2);
      setDiscount(d);
      toast.success(`Coupon applied! You saved ${formatPrice(d)}`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleOrder = () => {
    const { fullName, phone, pincode, address, city, state } = form;
    if (!fullName || !phone || !pincode || !address || !city || !state) {
      toast.error("Please fill in all address fields");
      return;
    }
    toast.success("Order placed successfully! 🎉");
    clearCart();
    navigate("/orders");
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-2">No items to checkout</h2>
          <Link to="/products" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-8">
          <span className="gold-gradient-text">Checkout</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Delivery Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "fullName", label: "Full Name", type: "text" },
                  { key: "phone", label: "Phone Number", type: "tel" },
                  { key: "pincode", label: "Pincode", type: "text" },
                  { key: "city", label: "City", type: "text" },
                  { key: "state", label: "State", type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-secondary rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    className="w-full bg-secondary rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <div className="w-full flex items-center gap-3 p-4 rounded-xl border border-border opacity-50 cursor-not-allowed">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Razorpay (UPI / Card / Net Banking)</span>
                  <span className="ml-auto text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Unavailable</span>
                </div>
                <div className="w-full flex items-center gap-3 p-4 rounded-xl border border-primary bg-primary/5">
                  <Banknote className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card rounded-xl p-6 h-fit sticky top-20">
            <h3 className="font-display font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">
                    {product.name} × {quantity}
                  </span>
                  <span className="shrink-0">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={applyCoupon} className="text-xs font-semibold text-primary hover:underline px-2">
                Apply
              </button>
            </div>

            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={delivery === 0 ? "text-primary" : ""}>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleOrder}
              className="block w-full mt-6 gold-gradient-bg text-primary-foreground py-3.5 rounded-xl font-semibold text-sm text-center hover:opacity-90 transition-opacity"
            >
              Place Order <ArrowRight className="w-4 h-4 inline ml-1" />
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
