import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { formatINR } from '../utils/currency.js';

export const CartPage: React.FC = () => {
  const { items, subtotal, shippingCost, totalAmount, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-zinc-900">Your Shopping Cart is Empty</h1>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto">
            You haven't added any items to your bag yet. Browse our curated catalog to start shopping.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Order Review
          </span>
          <h1 className="text-3xl font-black text-zinc-900 mt-1">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Entire Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cart Item Table / List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-xs divide-y divide-zinc-100">
            {items.map(item => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-zinc-50/50 transition"
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/product/${item.product.slug || item.product.id}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${item.product.slug || item.product.id}`}
                      className="font-bold text-zinc-900 hover:text-indigo-600 text-sm sm:text-base truncate block transition"
                    >
                      {item.product.name}
                    </Link>
                  </div>

                  <p className="text-xs text-zinc-500 mt-0.5">
                    Category: {item.product.category_name || 'Standard'} • {formatINR(item.product.price)} each
                  </p>

                  <div className="text-xs text-zinc-400 mt-1">
                    Available Stock: {item.product.stock_quantity}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="flex items-center border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-zinc-100 text-zinc-600 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-zinc-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock_quantity}
                      className="p-2 hover:bg-zinc-100 text-zinc-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right w-28">
                    <span className="font-extrabold text-zinc-900 text-base block">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-indigo-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatINR(subtotal)}</span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Shipping Estimate</span>
                <span>
                  {shippingCost === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatINR(shippingCost)
                  )}
                </span>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-between text-base font-extrabold text-zinc-900">
                <span>Estimated Total</span>
                <span className="text-xl text-indigo-600">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {subtotal < 999 && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-800">
                Add <strong>{formatINR(999 - subtotal)}</strong> more to your cart to receive{' '}
                <strong>Free Standard Delivery</strong>!
              </div>
            )}

            <Link
              to="/checkout"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe, transactional order confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
