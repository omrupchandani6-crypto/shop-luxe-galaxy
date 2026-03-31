import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Layout from "@/components/layout/Layout";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.rating < minRating) return false;
      return true;
    });
  }, [selectedCategory, priceRange, minRating, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 200000]);
    setMinRating(0);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-3">Category</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !selectedCategory ? "gold-gradient-bg text-primary-foreground border-transparent" : "border-border hover:border-primary"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedCategory === c.id ? "gold-gradient-bg text-primary-foreground border-transparent" : "border-border hover:border-primary"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-3">Max Price: ₹{priceRange[1].toLocaleString("en-IN")}</h4>
        <input
          type="range"
          min={0}
          max={200000}
          step={1000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-primary"
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-3">Min Rating: {minRating}+</h4>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                minRating === r ? "gold-gradient-bg text-primary-foreground border-transparent" : "border-border hover:border-primary"
              }`}
            >
              {r === 0 ? "All" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">
              {searchQuery ? (
                <>Results for "<span className="gold-gradient-text">{searchQuery}</span>"</>
              ) : (
                <>All <span className="gold-gradient-text">Products</span></>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} products found</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 text-sm border border-border px-3 py-2 rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="glass-card rounded-xl p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                  Clear
                </button>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden p-6 overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel />
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 gold-gradient-bg text-primary-foreground py-3 rounded-lg font-semibold text-sm"
              >
                Apply Filters
              </button>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
