import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Check,
  PackageOpen,
  Star,
} from 'lucide-react';
import { Product } from '../types/index.js';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.js';
import { ProductCard } from '../components/products/ProductCard.js';
import { ProductReviewsSection } from '../components/products/ProductReviewsSection.js';
import { formatINR } from '../utils/currency.js';

export const ProductDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!idOrSlug) return;
      setLoading(true);
      setError(null);
      setQuantity(1);

      try {
        const res = await api.products.getProduct(idOrSlug);
        if (res.data) {
          setProduct(res.data);

          // Fetch related products from same category
          if (res.data.category_id) {
            const relRes = await api.products.getProducts({
              category: res.data.category_id,
              limit: 4,
            });
            if (relRes.data) {
              setRelatedProducts(relRes.data.filter(p => p.id !== res.data!.id));
            }
          }
        }
      } catch (err: any) {
        setError(err.message || 'Product not found or is currently unavailable.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug]);

  const handleAddToCart = async () => {
    if (!product || product.stock_quantity <= 0 || adding) return;

    setAdding(true);
    const success = await addToCart(product.id, quantity);
    setAdding(false);

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-4 bg-zinc-200 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-zinc-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-zinc-200 rounded w-3/4" />
            <div className="h-6 bg-zinc-200 rounded w-1/3" />
            <div className="h-24 bg-zinc-200 rounded" />
            <div className="h-12 bg-zinc-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900">Product Not Found</h2>
        <p className="text-zinc-600 text-sm max-w-md mx-auto">
          The item you are searching for might have been archived, discontinued, or the URL might be invalid.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        <Link to="/" className="hover:text-indigo-600 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <Link to="/shop" className="hover:text-indigo-600 transition">
          Shop
        </Link>
        {product.category_name && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <Link
              to={`/shop?category=${product.category_slug || product.category_id}`}
              className="hover:text-indigo-600 transition"
            >
              {product.category_name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-900 font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Product Media Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200/80 shadow-md">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {product.category_name && (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-lg">
                  {product.category_name}
                </span>
              )}

              {isOutOfStock ? (
                <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-700 rounded-lg">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-lg">
                  Low Stock ({product.stock_quantity} left)
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-lg">
                  In Stock ({product.stock_quantity} available)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              {product.name}
            </h1>

            {product.average_rating ? (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(product.average_rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-900">
                  {product.average_rating.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-400">
                  ({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            ) : null}

            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-zinc-900">
                {formatINR(product.price)}
              </span>
              <span className="text-xs text-zinc-500">Taxes & authoritative price calculated at checkout</span>
            </div>
          </div>

          <div className="border-t border-b border-zinc-100 py-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Product Overview
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Purchasing Form Controls */}
          {!isOutOfStock ? (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Quantity
                </span>
                <div className="flex items-center border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-zinc-100 text-zinc-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-zinc-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2.5 hover:bg-zinc-100 text-zinc-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-zinc-400">
                  Max available: {product.stock_quantity}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98 shadow-indigo-600/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : adding ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add {quantity} to Cart • {formatINR(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-semibold">
              This product is currently out of stock. Check back soon or contact support for restock schedules.
            </div>
          )}

          {/* Value Props List */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Free standard delivery on orders over ₹999</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>30-Day hassle-free return guarantee</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Transactional inventory allocation</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <ShoppingBag className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Authentic merchandise warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings & Reviews */}
      <ProductReviewsSection
        productIdOrSlug={product.slug || product.id}
        productName={product.name}
      />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-zinc-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
              Related from this Category
            </h2>
            <Link
              to={`/shop?category=${product.category_slug || product.category_id}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
