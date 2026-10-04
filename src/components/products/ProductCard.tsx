import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Star } from 'lucide-react';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { formatINR } from '../../utils/currency.js';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const success = await addToCart(product.id, 1);
    setAdding(false);

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300">
      {/* Product Image & Badges */}
      <Link
        to={`/product/${product.slug || product.id}`}
        className="relative aspect-square overflow-hidden bg-zinc-100 block"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.category_name && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-zinc-800 rounded-lg shadow-xs">
              {product.category_name}
            </span>
          )}

          {isOutOfStock ? (
            <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-600 text-white rounded-md shadow-xs">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500 text-white rounded-md shadow-xs">
              Only {product.stock_quantity} left
            </span>
          ) : null}
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/product/${product.slug || product.id}`}
            className="font-bold text-zinc-900 hover:text-indigo-600 text-base line-clamp-1 transition"
          >
            {product.name}
          </Link>

          {product.average_rating ? (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-xs font-bold text-zinc-800">
                {product.average_rating.toFixed(1)}
              </span>
              <span className="text-[11px] text-zinc-400">
                ({product.review_count})
              </span>
            </div>
          ) : null}

          <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-zinc-900 tracking-tight">
              {formatINR(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : adding ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
