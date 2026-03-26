export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  inStock: boolean;
  seller: string;
}

export const categories = [
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "watches", name: "Watches", icon: "⌚" },
  { id: "accessories", name: "Accessories", icon: "👜" },
  { id: "footwear", name: "Footwear", icon: "👟" },
  { id: "beauty", name: "Beauty", icon: "✨" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Quantum Pro Wireless Headphones",
    brand: "SoundLux",
    price: 12999,
    originalPrice: 18999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
    ],
    category: "electronics",
    rating: 4.5,
    reviewCount: 2341,
    description: "Experience premium sound with active noise cancellation, 40-hour battery life, and luxurious memory foam ear cushions.",
    features: ["Active Noise Cancellation", "40hr Battery", "Bluetooth 5.3", "Hi-Res Audio"],
    inStock: true,
    seller: "SoundLux Official",
  },
  {
    id: "2",
    name: "Chronos Elite Smartwatch",
    brand: "TimeCraft",
    price: 24999,
    originalPrice: 34999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"],
    category: "watches",
    rating: 4.8,
    reviewCount: 1892,
    description: "Titanium body smartwatch with AMOLED display, health monitoring, and 14-day battery life.",
    features: ["AMOLED Display", "Heart Rate Monitor", "GPS", "Water Resistant 50m"],
    inStock: true,
    seller: "TimeCraft Store",
  },
  {
    id: "3",
    name: "Noir Leather Crossbody Bag",
    brand: "Maison Élégance",
    price: 8999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"],
    category: "accessories",
    rating: 4.6,
    reviewCount: 567,
    description: "Handcrafted Italian leather crossbody with gold-tone hardware and adjustable strap.",
    features: ["Italian Leather", "Gold Hardware", "Adjustable Strap", "Dust Bag Included"],
    inStock: true,
    seller: "Maison Élégance",
  },
  {
    id: "4",
    name: "Velocity X Running Shoes",
    brand: "StridePro",
    price: 6499,
    originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    category: "footwear",
    rating: 4.3,
    reviewCount: 3456,
    description: "Ultra-lightweight running shoes with responsive cushioning and breathable mesh upper.",
    features: ["Responsive Cushioning", "Breathable Mesh", "Non-slip Sole", "Lightweight 220g"],
    inStock: true,
    seller: "StridePro Official",
  },
  {
    id: "5",
    name: "Silk Blend Blazer",
    brand: "Atelier Noir",
    price: 15999,
    originalPrice: 22999,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"],
    category: "fashion",
    rating: 4.7,
    reviewCount: 234,
    description: "Premium silk-blend blazer with Italian tailoring and modern slim-fit silhouette.",
    features: ["Silk Blend", "Italian Tailoring", "Slim Fit", "Satin Lining"],
    inStock: true,
    seller: "Atelier Noir",
  },
  {
    id: "6",
    name: "Lumière Face Serum",
    brand: "GlowVie",
    price: 2999,
    originalPrice: 4499,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"],
    category: "beauty",
    rating: 4.4,
    reviewCount: 5678,
    description: "Vitamin C + Hyaluronic Acid face serum for radiant, youthful skin.",
    features: ["Vitamin C", "Hyaluronic Acid", "Paraben Free", "30ml"],
    inStock: true,
    seller: "GlowVie Beauty",
  },
  {
    id: "7",
    name: "UltraBook Pro 14",
    brand: "TechNova",
    price: 89999,
    originalPrice: 109999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"],
    category: "electronics",
    rating: 4.9,
    reviewCount: 1234,
    description: "14-inch OLED laptop with M3 chip, 32GB RAM, and all-day battery life.",
    features: ["M3 Chip", "32GB RAM", "1TB SSD", "14\" OLED"],
    inStock: true,
    seller: "TechNova Official",
  },
  {
    id: "8",
    name: "Classic Aviator Sunglasses",
    brand: "OptiLux",
    price: 4999,
    originalPrice: 7499,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"],
    category: "accessories",
    rating: 4.5,
    reviewCount: 890,
    description: "Polarized aviator sunglasses with titanium frame and UV400 protection.",
    features: ["Polarized Lenses", "Titanium Frame", "UV400", "Case Included"],
    inStock: true,
    seller: "OptiLux Store",
  },
];
