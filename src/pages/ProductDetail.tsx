import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingBag, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/components/ProductCard";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl overflow-hidden aspect-square"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <p className="text-sm text-primary font-medium mb-1">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.reviewCount.toLocaleString()} reviews
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-sm font-semibold text-primary">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.features.map((f) => (
                <span key={f} className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary">
                  {f}
                </span>
              ))}
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => {
                addItem(product);
                toast.success(`${product.name} added to cart`);
              }}
              className="gold-gradient-bg text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-6"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </button>

            {/* Info */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: Shield, label: "Genuine Product" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="glass-card rounded-lg p-3 text-center">
                  <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Sold by: <span className="text-foreground">{product.seller}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
