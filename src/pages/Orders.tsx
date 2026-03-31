import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ChevronDown, ChevronUp, MapPin, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/components/ProductCard";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
  order_items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  shipped: "bg-blue-500/10 text-blue-500",
  delivered: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
};

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) || []);
      setLoading(false);
    };
    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-2">Please login to view orders</h2>
          <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-8">
          My <span className="gold-gradient-text">Orders</span>
        </h1>

        {orders.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-display font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Your orders will appear here after you make a purchase.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 gold-gradient-bg text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-5"
              >
                <div
                  className="flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div>
                    <p className="font-semibold text-sm">#{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.status] || "bg-secondary"}`}>
                      {order.status}
                    </span>
                    <span className="font-semibold text-sm">{formatPrice(order.total)}</span>
                    {expandedOrder === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-4 border-t border-border pt-4 space-y-4"
                  >
                    {/* Delivery Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Delivery Details</h4>
                        <p className="text-sm font-medium">{order.full_name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Phone className="w-3 h-3" /> {order.phone}
                        </div>
                        <div className="flex items-start gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>{order.address}, {order.city}, {order.state} - {order.pincode}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Payment</h4>
                        <p className="text-sm capitalize">{order.payment_method}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Items</h4>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {item.product_image && (
                              <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-secondary/50 rounded-lg p-3 space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</span></div>
                      {order.discount > 0 && <div className="flex justify-between text-primary"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                      <div className="flex justify-between font-semibold border-t border-border pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
