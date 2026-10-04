import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { formatINR } from '../../utils/currency.js';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, items, subtotal, shippingCost, totalAmount, updateQuantity, removeItem } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-zinc-900">Your Shopping Cart</h2>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-zinc-900 text-lg mb-1">Your cart is empty</h3>
                <p className="text-zinc-500 text-sm max-w-xs mb-6">
                  Looks like you haven't added anything to your cart yet. Explore our curated catalog!
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 transition bg-zinc-50/50"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-zinc-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug || item.product.id}`}
                          onClick={closeCart}
                          className="font-medium text-sm text-zinc-900 hover:text-indigo-600 line-clamp-1 transition"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-rose-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{formatINR(item.product.price)} each</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-zinc-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold text-sm text-zinc-900">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-100 bg-white space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-600">Free</strong> : formatINR(shippingCost)}</span>
                </div>
                <div className="border-t border-zinc-100 pt-2 flex justify-between text-base font-bold text-zinc-900">
                  <span>Total</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
              </div>

              {subtotal < 999 && (
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-800">
                  Add <strong>{formatINR(999 - subtotal)}</strong> more to qualify for <strong>Free Standard Shipping</strong>!
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full py-2.5 text-center text-sm font-semibold border border-zinc-300 rounded-xl text-zinc-700 hover:bg-zinc-50 transition"
                >
                  View Full Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full py-2.5 flex items-center justify-center gap-1.5 text-center text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
