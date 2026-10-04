import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Product, Category } from '../types/index.js';
import { api } from '../services/api.js';
import { ProductCard } from '../components/products/ProductCard.js';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.products.getProducts({ limit: 8 }),
          api.products.getCategories(),
        ]);
        if (prodRes.data) {
          // Select featured or top products
          const featured = prodRes.data.filter(p => Number(p.is_featured) === 1);
          setFeaturedProducts(featured.length > 0 ? featured : prodRes.data.slice(0, 4));
        }
        if (catRes.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white pt-12 sm:pt-20 pb-16 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Next-Generation Full-Stack Store</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-[1.1]">
                Curated essentials, engineered for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  modern living.
                </span>
              </h1>

              <p className="text-lg text-zinc-600 max-w-xl leading-relaxed">
                Discover high-performance audio, minimalist workspace tech, and refined everyday
                carry goods with real-time stock sync and transactional order checkout.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 group transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Catalog Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/shop?category=all"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-sm border border-zinc-200 shadow-xs transition"
                >
                  Explore Categories
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-200/60 max-w-lg">
                <div>
                  <span className="text-2xl font-extrabold text-zinc-900">20+</span>
                  <p className="text-xs text-zinc-500 font-medium">Curated Items</p>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-zinc-900">MySQL 8.0</span>
                  <p className="text-xs text-zinc-500 font-medium">Transactional DB</p>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-indigo-600">100%</span>
                  <p className="text-xs text-zinc-500 font-medium">Live Server Sync</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
                    alt="AuraWave Headphones Hero Showcase"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 max-w-xs flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Free Shipping</span>
                    <span className="text-[11px] text-zinc-500">Orders over ₹999 ship free automatically</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Browse Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-zinc-900 flex flex-col justify-end p-5 shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={cat.image_url || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 group-hover:opacity-60 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-indigo-300 transition">
                  {cat.name}
                </h3>
                <p className="text-zinc-300 text-xs mt-0.5">
                  {cat.product_count !== undefined ? `${cat.product_count} products` : 'Explore'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Staff Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            <span>Browse Full Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-4 animate-pulse">
                <div className="aspect-square bg-zinc-200 rounded-xl" />
                <div className="h-4 bg-zinc-200 rounded-md w-3/4" />
                <div className="h-3 bg-zinc-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-zinc-900 text-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1000&auto=format&fit=crop&q=80"
              alt="Workspace Tech Display"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Tag className="w-3.5 h-3.5" />
              <span>Limited Demonstration Offer</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Upgrade Your Everyday Gear with Precision Hardware
            </h2>

            <p className="text-zinc-300 text-sm leading-relaxed">
              Explore our mechanical tactile keyboards, studio-reference monitors, and aerospace titanium wallets.
              All items are backed by our 30-day return policy and live tracking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="px-6 py-3 rounded-xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 shadow-md transition"
              >
                Shop Electronics Now
              </Link>
              <div className="text-xs text-zinc-400">
                Sample Promo Code: <strong className="text-indigo-400 font-mono">SHOPSPHERE10</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">Server-Authoritative Pricing</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Client totals and pricing cannot be tampered with. The backend calculates true subtotals,
              taxes, and reduces inventory inside atomic database transactions.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">Real-Time Order Tracking</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              From Pending to Confirmed, Shipped and Delivered — view step-by-step progress
              updates and status audit notes directly in your account dashboard.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">Instant Stock Restocking</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              When an order is cancelled by customer or admin, the application automatically
              restores product inventory counts back to the catalog.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="text-2xl font-bold text-zinc-900">Stay Updated with ShopSphere</h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Subscribe to receive notifications when new electronics and limited-run inventory drop.
        </p>

        {newsletterSubscribed ? (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you for subscribing! Check your inbox for updates.</span>
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
