import { Package } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const OrdersPage = () => (
  <Layout>
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-display font-bold mb-8">
        My <span className="gold-gradient-text">Orders</span>
      </h1>
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
    </div>
  </Layout>
);

export default OrdersPage;
