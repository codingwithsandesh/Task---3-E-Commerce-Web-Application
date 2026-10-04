import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Users,
  Clock,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { AdminStats } from '../../types/index.js';
import { api } from '../../services/api.js';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { formatINR } from '../../utils/currency.js';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dbHealth, setDbHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [dashRes, healthRes] = await Promise.all([
          api.admin.getDashboard(),
          api.getHealth(),
        ]);
        if (dashRes.data) {
          setStats(dashRes.data);
        }
        if (healthRes) {
          setDbHealth(healthRes);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Executive Overview
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Real-time transactional business metrics calculated from live database records.
            </p>
          </div>

          {/* Database Engine Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-xl shadow-xs self-start sm:self-auto">
            <Database className="w-4 h-4 text-indigo-600" />
            <div className="text-[11px]">
              <span className="text-zinc-500 block">Database Storage:</span>
              <span className="font-bold text-zinc-900 block">
                {dbHealth?.database?.engine || 'MySQL 8.0 Compatible Storage'}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Revenue */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 font-medium block">Net Revenue</span>
              <span className="text-2xl font-black text-zinc-900">
                {stats ? formatINR(stats.totalRevenue) : '₹0'}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Excludes cancelled orders</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 font-medium block">Total Orders</span>
              <span className="text-2xl font-black text-zinc-900">
                {stats?.totalOrders ?? 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Lifetime orders placed</span>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 font-medium block">Pending Orders</span>
              <span className="text-2xl font-black text-amber-600">
                {stats?.pendingOrders ?? 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Awaiting fulfillment</span>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 font-medium block">Catalog Products</span>
              <span className="text-2xl font-black text-zinc-900">
                {stats?.totalProducts ?? 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Active listings</span>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 font-medium block">Registered Users</span>
              <span className="text-2xl font-black text-zinc-900">
                {stats?.totalCustomers ?? 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Customer accounts</span>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Low Stock Alert & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Orders List */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>Recent Orders</span>
              </h2>
              <Link
                to="/admin/orders"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-16 bg-zinc-100 rounded-xl" />
                ))}
              </div>
            ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No orders registered yet.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {stats.recentOrders.map(order => (
                  <div
                    key={order.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-zinc-50/50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-900 font-mono">
                          {order.order_number}
                        </span>
                        <StatusBadge status={order.order_status} size="sm" />
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {order.customer_name} • {order.items?.length || 0} items
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-xs text-zinc-900 block">
                        {formatINR(order.total_amount)}
                      </span>
                      <Link
                        to="/admin/orders"
                        className="text-[11px] text-indigo-600 font-bold hover:underline"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Inventory Watch</span>
              </h2>
              <Link
                to="/admin/products"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                Manage Stock
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map(n => (
                  <div key={n} className="h-14 bg-zinc-100 rounded-xl" />
                ))}
              </div>
            ) : !stats?.lowStockProducts || stats.lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <span>All catalog products are healthy and well-stocked.</span>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {stats.lowStockProducts.map(p => (
                  <div key={p.id} className="py-3 flex items-center gap-3">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-zinc-900 truncate block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {formatINR(p.price)}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      {p.stock_quantity} remaining
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
