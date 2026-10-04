import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, User as UserIcon, Calendar, ArrowRight, LogOut, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Order } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { formatINR } from '../utils/currency.js';

export const AccountPage: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      try {
        const res = await api.orders.getMyOrders();
        if (res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-indigo-600/20">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-zinc-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex-1 md:flex-initial px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="flex-1 md:flex-initial px-4 py-2.5 border border-zinc-200 text-zinc-700 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Orders History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <span>Order History ({orders.length})</span>
          </h2>
          <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-zinc-200 p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-zinc-200 rounded w-1/4" />
            <div className="h-16 bg-zinc-100 rounded-xl" />
            <div className="h-16 bg-zinc-100 rounded-xl" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-zinc-900 text-lg">No orders placed yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              You haven't made any purchases with this account. Discover our collection of tech and apparel.
            </p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs divide-y divide-zinc-100">
            {orders.map(order => (
              <div
                key={order.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/50 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-zinc-900 font-mono">
                      {order.order_number}
                    </span>
                    <StatusBadge status={order.order_status} size="sm" />
                  </div>
                  <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    Placed on {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} items
                  </p>
                  <p className="text-xs text-zinc-600 pt-1 font-medium">
                    Shipped to: {order.shipping_address}, {order.city}
                  </p>
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
                      Order Total
                    </span>
                    <span className="font-black text-base text-zinc-900">
                      {formatINR(order.total_amount)}
                    </span>
                  </div>

                  <Link
                    to={`/order/${order.order_number}`}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                  >
                    <span>View / Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
