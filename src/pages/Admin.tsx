import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/components/ProductCard";
import Layout from "@/components/layout/Layout";
import {
  Package, Users, ShoppingCart, IndianRupee,
  MapPin, Phone, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  user_id: string;
  order_items: OrderItem[];
}

interface Profile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

const statusOptions = ["pending", "shipped", "delivered", "cancelled"];
const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  shipped: "bg-blue-500/10 text-blue-500",
  delivered: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
};

const AdminPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"dashboard" | "orders" | "users">("dashboard");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      const [ordersRes, profilesRes] = await Promise.all([
        supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);
      setOrders((ordersRes.data as Order[]) || []);
      setProfiles((profilesRes.data as Profile[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [user, isAdmin, authLoading, navigate]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">Loading...</div>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  const totalSales = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalUsers = profiles.length;

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-8">
          <span className="gold-gradient-text">Admin Panel</span>
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {(["dashboard", "orders", "users"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? "gold-gradient-bg text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: IndianRupee, label: "Total Sales", value: formatPrice(totalSales), color: "text-green-500" },
              { icon: ShoppingCart, label: "Total Orders", value: totalOrders.toString(), color: "text-blue-500" },
              { icon: Users, label: "Total Users", value: totalUsers.toString(), color: "text-purple-500" },
            ].map(({ icon: Icon, label, value, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-secondary ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
                <p className="text-2xl font-display font-bold">{value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">No orders yet</p>
            ) : (
              orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-5"
                >
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div>
                      <p className="font-semibold text-sm">#{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.full_name} • {new Date(order.created_at).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize border-none outline-none cursor-pointer ${statusColors[order.status] || "bg-secondary"}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="bg-background text-foreground">{s}</option>
                        ))}
                      </select>
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
                      {/* Customer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Customer Details</h4>
                          <p className="text-sm font-medium">{order.full_name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Phone className="w-3 h-3" /> {order.phone}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Delivery Address</h4>
                          <div className="flex items-start gap-1 text-sm">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                            <span>{order.address}, {order.city}, {order.state} - {order.pincode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Items Ordered</h4>
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              {item.product_image && (
                                <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm">{item.product_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity} × {formatPrice(item.price)}
                                </p>
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
                        <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="capitalize">{order.payment_method}</span></div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.user_id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-medium">{p.full_name || "—"}</td>
                      <td className="p-4 text-muted-foreground">{p.email || "—"}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
