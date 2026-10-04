import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  XCircle,
  FileText,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/index.js';
import { api } from '../services/api.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { ConfirmModal } from '../components/common/ConfirmModal.js';
import { useToast } from '../context/ToastContext.js';
import { formatINR } from '../utils/currency.js';

export const OrderTrackingPage: React.FC = () => {
  const { idOrNumber } = useParams<{ idOrNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { success, error: toastError } = useToast();

  const loadOrder = async () => {
    if (!idOrNumber) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.orders.getOrder(idOrNumber);
      if (res.data) {
        setOrder(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Order not found or permission denied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [idOrNumber]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await api.orders.cancelOrder(order.id);
      if (res.data) {
        setOrder(res.data);
        success('Order has been cancelled and stock inventory restored.');
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
      setCancelModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 bg-zinc-200 rounded w-1/4" />
        <div className="h-32 bg-zinc-200 rounded-3xl" />
        <div className="h-64 bg-zinc-200 rounded-3xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900">Order Not Found</h2>
        <p className="text-zinc-600 text-sm max-w-sm mx-auto">
          {error || 'Unable to locate order records. Check your order number or sign in to your account.'}
        </p>
        <Link
          to="/account"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const isCancelled = order.order_status === 'Cancelled';
  const currentStepIndex = steps.indexOf(order.order_status as OrderStatus);

  const canCancel = ['Pending', 'Confirmed'].includes(order.order_status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Account</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 font-mono">
              {order.order_number}
            </h1>
            <StatusBadge status={order.order_status} />
          </div>
          <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        {canCancel && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition self-start sm:self-auto"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Visual Timeline Progress */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-bold text-zinc-900 mb-8 uppercase tracking-wider">
          Fulfillment Timeline
        </h3>

        {isCancelled ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700">
            <XCircle className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold text-sm">Order Cancelled</p>
              <p className="text-xs mt-0.5">
                This order was cancelled. Reserved inventory was restored to the store catalog.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Progress line */}
            <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-zinc-100 z-0">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <div className="text-left sm:text-center">
                      <span
                        className={`text-xs font-bold block ${
                          isCurrent ? 'text-indigo-600' : isPassed ? 'text-zinc-900' : 'text-zinc-400'
                        }`}
                      >
                        {step}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        {step === 'Pending' && 'Order Placed'}
                        {step === 'Confirmed' && 'Verified'}
                        {step === 'Processing' && 'Packed & Ready'}
                        {step === 'Shipped' && 'With Courier'}
                        {step === 'Delivered' && 'Completed'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Details & Audit History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Line Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
              Ordered Items ({order.items?.length || 0})
            </h3>

            <div className="divide-y divide-zinc-100">
              {order.items?.map(item => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-16 h-16 rounded-xl object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm text-zinc-900 block truncate">
                      {item.product_name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Qty: {item.quantity} × {formatINR(item.unit_price)}
                    </span>
                  </div>

                  <span className="font-extrabold text-sm text-zinc-900">
                    {formatINR(item.line_total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-zinc-100 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span>{Number(order.shipping_cost) === 0 ? <strong className="text-emerald-600">FREE</strong> : formatINR(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-zinc-900 pt-2 border-t border-zinc-100">
                <span>Grand Total</span>
                <span className="text-indigo-600">{formatINR(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Status Audit History Timeline */}
          {order.history && order.history.length > 0 && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Status Audit Log</span>
              </h3>

              <div className="space-y-4 pl-2 border-l-2 border-indigo-100 ml-2">
                {order.history.map(hist => (
                  <div key={hist.id} className="relative pl-4">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                      <StatusBadge status={hist.new_status} size="sm" />
                      <span className="text-zinc-500 font-normal">
                        by {hist.changed_by} • {new Date(hist.created_at).toLocaleString()}
                      </span>
                    </div>
                    {hist.note && (
                      <p className="text-xs text-zinc-600 mt-1 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                        {hist.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Delivery Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 block">{order.customer_name}</span>
                  <span className="text-zinc-600 block">{order.shipping_address}</span>
                  <span className="text-zinc-600 block">
                    {order.city}, {order.state} {order.postal_code}, {order.country}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <span className="text-zinc-400 block">Payment Method</span>
                <span className="font-semibold text-zinc-800 block mt-0.5">
                  {order.payment_method} ({order.payment_status.toUpperCase()})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? Once cancelled, reserved product quantities will automatically be restored back to store stock."
        confirmLabel={cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
        isDestructive={true}
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};
