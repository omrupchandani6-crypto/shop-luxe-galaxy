import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, User, Menu, X, LogOut, Shield, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { products } from "@/data/products";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, isAdmin, signOut } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/orders", label: "Orders" },
  ];

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate("/");
  };

  // Search suggestions
  const searchResults = searchQuery.trim().length > 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchItemClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold gold-gradient-text">ShopLux</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          {isAdmin && (
            <Link
              to="/admin"
              className="p-2 rounded-full hover:bg-secondary transition-colors text-primary"
              title="Admin Panel"
            >
              <Shield className="w-5 h-5" />
            </Link>
          )}
          <Link to="/cart" className="p-2 rounded-full hover:bg-secondary transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full gold-gradient-bg text-primary-foreground text-xs flex items-center justify-center font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          {/* Profile Dropdown */}
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <div className="w-7 h-7 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold uppercase">
                  {displayName.charAt(0)}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform hidden md:block ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-border/50">
                      <p className="text-sm font-semibold truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-foreground"
                      >
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-primary"
                        >
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="p-2 rounded-full hover:bg-secondary transition-colors">
              <User className="w-5 h-5" />
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full hover:bg-secondary transition-colors md:hidden"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 overflow-hidden"
          >
            <div className="container py-3 relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search for products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                  autoFocus
                />
              </form>
              {/* Search Suggestions */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mx-4 mt-1 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSearchItemClick(p.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-left"
                    >
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand} • ₹{p.price.toLocaleString("en-IN")}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit as any}
                    className="w-full px-4 py-2.5 text-xs text-primary hover:bg-secondary transition-colors text-center font-medium"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/50 overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors ${
                    location.pathname === l.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium py-2 text-primary flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" /> Admin Panel
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className="text-sm font-medium py-2 text-destructive flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium py-2 text-primary flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
