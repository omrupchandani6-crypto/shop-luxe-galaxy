import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Authentication requires backend setup. Enable Lovable Cloud to proceed!");
  };

  return (
    <Layout>
      <div className="container py-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 gold-border">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Sign in to your ShopLux account" : "Join ShopLux for exclusive deals"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-secondary rounded-lg pl-10 pr-10 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full gold-gradient-bg text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
