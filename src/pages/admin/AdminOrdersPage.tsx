import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Edit,
  Eye,
  X,
  FileText,
  Calendar,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';
import { api } from '../../services/api.js';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { useToast } from '../../context/ToastContext.js';
import { formatINR } from '../../utils/currency.js';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Status Change Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Invoice Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const { success, error: toastError } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined,
        limit: 50,
      });
      if (res.data) {
        setOrders(res.data);
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const openStatusModal = (order: Order) => {
    setActiveOrder(order);
    setNewStatus(order.order_status as OrderStatus);
    setStatusNote('');
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    setUpdating(true);
    try {
      const res = await api.admin.updateOrderStatus(
        activeOrder.id,
        newStatus,
        statusNote.trim() || undefined
      );

      if (res.data) {
        success(`Order ${activeOrder.order_number} status updated to ${newStatus}`);
        setStatusModalOpen(false);
        loadOrders();
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const openDetailModal = async (order: Order) => {
    try {
      const res = await api.orders.getOrder(order.id);
      if (res.data) {
        setViewingOrder(res.data);
        setDetailModalOpen(true);
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to load order invoice details');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Customer Order Fulfillment
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Track customer orders, manage shipment lifecycle, and process status transitions.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Order Table */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      No orders found matching your filters.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                        {order.order_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-zinc-900 block truncate max-w-xs">
                          {order.customer_name}
                        </span>
                        <span className="text-[10px] text-zinc-400 block truncate">
                          {order.customer_email}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-zinc-900">
                        {formatINR(order.total_amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-zinc-700 block">
                          {order.payment_method}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            order.payment_status === 'paid' ? 'text-emerald-600' : 'text-zinc-400'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.order_status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openDetailModal(order)}
                            className="p-1.5 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 rounded-lg transition"
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openStatusModal(order)}
                            className="p-1.5 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 rounded-lg transition"
                            title="Update Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Status Modal */}
        {statusModalOpen && activeOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="font-extrabold text-zinc-900 text-base">
                  Update Order Status
                </h3>
                <button
                  onClick={() => setStatusModalOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                <div className="flex justify-between font-bold text-zinc-900">
                  <span>Order Number:</span>
                  <span className="font-mono text-indigo-600">{activeOrder.order_number}</span>
                </div>
                <div className="flex justify-between text-zinc-500 mt-1">
                  <span>Current Status:</span>
                  <StatusBadge status={activeOrder.order_status} size="sm" />
                </div>
              </div>

              <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Transition To *
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-800"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled (Restores Inventory)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Audit Note / Tracking Info (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dispatched via Express Courier AWB #SP-8821"
                    value={statusNote}
                    onChange={e => setStatusNote(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2"
                  />
                </div>

                {newStatus === 'Cancelled' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
                    <strong>Note:</strong> Transitioning this order to "Cancelled" will automatically restore all line item quantities back into available store stock.
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(false)}
                    className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl font-bold hover:bg-zinc-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition"
                  >
                    {updating ? 'Updating...' : 'Save Transition'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Invoice Modal */}
        {detailModalOpen && viewingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-zinc-100 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-zinc-900 text-base">
                    Order Invoice Details
                  </h3>
                </div>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 block">Order Number</span>
                  <span className="font-black text-sm text-zinc-900 font-mono">
                    {viewingOrder.order_number}
                  </span>
                  <span className="text-zinc-500 block mt-1">
                    {new Date(viewingOrder.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-zinc-400 block">Status</span>
                  <StatusBadge status={viewingOrder.order_status} size="sm" />
                </div>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs space-y-1">
                <span className="font-bold text-zinc-900 block">{viewingOrder.customer_name}</span>
                <span className="text-zinc-600 block">{viewingOrder.customer_email}</span>
                <span className="text-zinc-600 block">
                  {viewingOrder.shipping_address}, {viewingOrder.city}, {viewingOrder.state}{' '}
                  {viewingOrder.postal_code}, {viewingOrder.country}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-zinc-100 text-xs">
                {viewingOrder.items?.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900 block">{item.product_name}</span>
                      <span className="text-zinc-500">
                        Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                      </span>
                    </div>
                    <span className="font-bold text-zinc-900">
                      ${Number(item.line_total).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 text-xs space-y-1 text-right">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>${Number(viewingOrder.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span>${Number(viewingOrder.shipping_cost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-100">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">${Number(viewingOrder.total_amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-5 py-2 bg-zinc-900 text-white font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
