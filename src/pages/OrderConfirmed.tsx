import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const OrderConfirmed = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="container py-16 flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
        {/* Confetti particles */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  y: -20,
                  x: Math.random() * 100 + "%",
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: "110vh",
                  opacity: 0,
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 1,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#D4AF37", "#FFD700", "#F5E6CC", "#C0A062", "#E8D5A3"][
                    Math.floor(Math.random() * 5)
                  ],
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative mb-8"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: 2, ease: "easeInOut" }}
            className="w-28 h-28 rounded-full gold-gradient-bg flex items-center justify-center shadow-2xl"
          >
            <CheckCircle className="w-14 h-14 text-primary-foreground" strokeWidth={2.5} />
          </motion.div>
          {/* Glow ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.5, 2] }}
            transition={{ duration: 2, repeat: 1, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
          />
        </motion.div>

        {/* Text content */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-display font-bold mb-3 text-center"
        >
          Order <span className="gold-gradient-text">Confirmed!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-muted-foreground text-center mb-2 text-sm md:text-base"
        >
          Thank you for shopping with ShopLux! 🎉
        </motion.p>

        {orderNumber && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-muted-foreground mb-8"
          >
            Order Number: <span className="font-semibold text-foreground">#{orderNumber}</span>
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="glass-card rounded-xl p-6 text-center max-w-md w-full mb-8"
        >
          <Package className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Your order has been placed successfully and will be delivered soon. You can track your order status in <span className="text-foreground font-medium">My Orders</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 gold-gradient-bg text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            View My Orders <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OrderConfirmed;
