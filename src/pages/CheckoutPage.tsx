import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { formatINR } from '../utils/currency.js';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shippingCost, totalAmount, clearCart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'Cash on Delivery',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        customerEmail: prev.customerEmail || user.email || '',
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900">Your cart is empty</h2>
        <p className="text-zinc-600 text-sm">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.orders.createOrder({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        paymentMethod: formData.paymentMethod,
      });

      if (res.data) {
        // Refresh client-side cart after server cleared it
        await refreshCart();
        navigate(`/order-confirmation/${res.data.order_number}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please review your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="pb-4 border-b border-zinc-200">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Cart</span>
        </Link>
        <h1 className="text-3xl font-black text-zinc-900">Checkout & Order Placement</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review your delivery details and choose your fulfillment method.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Checkout Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Contact */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
                1
              </span>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="customerName"
                  placeholder="e.g. Sandesh Heda"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="customerEmail"
                  placeholder="you@example.com"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
                2
              </span>
              Shipping Destination
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  name="shippingAddress"
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    placeholder="Springfield"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    placeholder="OR"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    placeholder="97477"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
                3
              </span>
              Payment & Fulfillment Method
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  formData.paymentMethod === 'Cash on Delivery'
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/20'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={handleChange}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-bold text-zinc-900 block">
                    Cash on Delivery (Standard)
                  </span>
                  <span className="text-xs text-zinc-500 leading-relaxed block mt-0.5">
                    Pay securely upon package arrival and courier inspection. No upfront credit card entry needed.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  formData.paymentMethod === 'Demo Checkout'
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/20'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Demo Checkout"
                  checked={formData.paymentMethod === 'Demo Checkout'}
                  onChange={handleChange}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-bold text-zinc-900 block">
                    Demo / Presentation Checkout
                  </span>
                  <span className="text-xs text-zinc-500 leading-relaxed block mt-0.5">
                    Instant demonstration transaction for evaluators. Locks inventory and simulates instant confirmation.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">
              Order Review ({items.length} items)
            </h2>

            {/* Item Mini-List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100 pr-1 space-y-2">
              {items.map(item => (
                <div key={item.id} className="pt-2 flex items-center gap-3">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Qty: {item.quantity} × {formatINR(item.product.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-3 border-t border-zinc-100 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatINR(subtotal)}</span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Standard Delivery</span>
                <span>
                  {shippingCost === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatINR(shippingCost)
                  )}
                </span>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-between text-base font-black text-zinc-900">
                <span>Total Due</span>
                <span className="text-xl text-indigo-600">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Locking Inventory & Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Order ({formatINR(totalAmount)})</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs text-zinc-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transactional stock reduction guaranteed</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
