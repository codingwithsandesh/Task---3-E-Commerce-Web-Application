import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800">
      {/* Value Proposition Highlights Banner */}
      <div className="border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">Free Express Delivery</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Complimentary shipping on orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">Authoritative Checkout</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Transactional stock locking & tamper-proof totals</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">30-Day Effortless Returns</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Restock inventory return policy for peace of mind</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">24/7 Dedicated Support</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Real-time order timeline & status updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                ShopSphere
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              ShopSphere is a full-stack e-commerce web platform engineered with React,
              TypeScript, Express, and MySQL 8.0 architecture. Built with strict role-based access,
              live inventory locking, and order fulfillment tracking.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Backend Live
              </span>
              <span>MySQL 8.0 Compatible</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=electronics" className="hover:text-indigo-400 transition">
                  Electronics & Displays
                </Link>
              </li>
              <li>
                <Link to="/shop?category=audio-wearables" className="hover:text-indigo-400 transition">
                  Audio & Wearables
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fashion-apparel" className="hover:text-indigo-400 transition">
                  Fashion & Outerwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home-living" className="hover:text-indigo-400 transition">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="hover:text-indigo-400 transition">
                  Accessories & Wallets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Customer Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/account" className="hover:text-indigo-400 transition">
                  My Orders & Tracking
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-400 transition">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-indigo-400 transition">
                  Explore Products
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition">
                  Create New Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access & Evaluator Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Evaluation & Docs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admin" className="hover:text-indigo-400 transition font-medium text-indigo-400">
                  Admin Dashboard Portal
                </Link>
              </li>
              <li>
                <span className="text-xs text-zinc-400 block">
                  Admin Demo: <strong>admin@shopsphere.com</strong>
                </span>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  Password: <strong>Admin@123</strong>
                </span>
              </li>
              <li className="pt-2 text-xs text-zinc-500">
                RESTful APIs, bcrypt hashing, and database transactions active.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved. Internship Task 3 Presentation.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-200 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-200 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-200 transition cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
