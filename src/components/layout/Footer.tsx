import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 bg-card mt-20">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-display font-bold gold-gradient-text mb-4">ShopLux</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium shopping experience with curated luxury products from world-class brands.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Shop</h4>
          <div className="flex flex-col gap-2">
            {["Electronics", "Fashion", "Watches", "Accessories"].map((c) => (
              <Link key={c} to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {c}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Account</h4>
          <div className="flex flex-col gap-2">
            {["My Orders", "Wishlist", "Cart", "Profile"].map((c) => (
              <Link key={c} to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {c}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Support</h4>
          <div className="flex flex-col gap-2">
            {["Help Center", "Shipping", "Returns", "Contact Us"].map((c) => (
              <span key={c} className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 mt-8 pt-6 text-center text-xs text-muted-foreground">
        © 2026 ShopLux. All rights reserved. Prices in ₹ (INR).
      </div>
    </div>
  </footer>
);

export default Footer;
