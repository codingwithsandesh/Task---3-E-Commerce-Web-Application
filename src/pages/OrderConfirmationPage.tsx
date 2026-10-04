import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Calendar, MapPin } from 'lucide-react';
import { Order } from '../types/index.js';
import { api } from '../services/api.js';
import { formatINR } from '../utils/currency.js';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderNumber) return;
      try {
        const res = await api.orders.getOrder(orderNumber);
        if (res.data) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* Celebration Icon */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
          Thank you for your order!
        </h1>
        <p className="text-zinc-600 text-sm max-w-md mx-auto">
          We have received your purchase and reserved your items in inventory.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 text-left shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Order Number</span>
            <span className="text-xl font-black text-indigo-600 font-mono tracking-tight">
              {orderNumber}
            </span>
          </div>

          <Link
            to={`/order/${orderNumber}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {order && (
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1">
                <span className="text-zinc-400 font-medium block">Customer</span>
                <span className="font-bold text-zinc-900 block">{order.customer_name}</span>
                <span className="text-zinc-500 block">{order.customer_email}</span>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1">
                <span className="text-zinc-400 font-medium block">Shipping Destination</span>
                <span className="font-bold text-zinc-900 block">{order.shipping_address}</span>
                <span className="text-zinc-500 block">
                  {order.city}, {order.state} {order.postal_code}, {order.country}
                </span>
              </div>
            </div>

            {/* Items */}
            {order.items && (
              <div className="divide-y divide-zinc-100 pt-2">
                {order.items.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900 block">{item.product_name}</span>
                      <span className="text-xs text-zinc-500">
                        Qty: {item.quantity} × {formatINR(item.unit_price)}
                      </span>
                    </div>
                    <span className="font-bold text-zinc-900">{formatINR(item.line_total)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-zinc-100 pt-4 flex justify-between items-center text-base font-black text-zinc-900">
              <span>Total Paid / Due</span>
              <span className="text-xl text-indigo-600">{formatINR(order.total_amount)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/order/${orderNumber}`}
          className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition"
        >
          View Order Status
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 font-bold text-sm rounded-xl transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
