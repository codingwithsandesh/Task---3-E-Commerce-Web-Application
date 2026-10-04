import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, PackageOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Product, Category, ProductFilters as FilterType } from '../types/index.js';
import { api } from '../services/api.js';
import { ProductCard } from '../components/products/ProductCard.js';
import { ProductFilters } from '../components/products/ProductFilters.js';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [meta, setMeta] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filters from URL search params
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sortByParam = (searchParams.get('sortBy') as any) || 'newest';
  const inStockParam = searchParams.get('inStockOnly') === 'true';
  const pageParam = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const currentFilters: FilterType = {
    category: categoryParam,
    search: searchParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    sortBy: sortByParam,
    inStockOnly: inStockParam,
    page: pageParam,
    limit: 12,
  };

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.products.getCategories();
        if (res.data) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever searchParams change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.products.getProducts(currentFilters);
      if (res.data) {
        setProducts(res.data);
        if (res.meta) {
          setMeta({
            page: res.meta.page || 1,
            limit: res.meta.limit || 12,
            total: res.meta.total || 0,
            totalPages: res.meta.totalPages || 1,
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newFilters: Partial<FilterType>) => {
    const updated = { ...currentFilters, ...newFilters };
    const nextParams = new URLSearchParams();

    if (updated.category && updated.category !== 'all') nextParams.set('category', updated.category);
    if (updated.search) nextParams.set('search', updated.search);
    if (updated.minPrice !== undefined) nextParams.set('minPrice', updated.minPrice.toString());
    if (updated.maxPrice !== undefined) nextParams.set('maxPrice', updated.maxPrice.toString());
    if (updated.sortBy) nextParams.set('sortBy', updated.sortBy);
    if (updated.inStockOnly) nextParams.set('inStockOnly', 'true');
    if (updated.page && updated.page > 1) nextParams.set('page', updated.page.toString());

    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled as user types or hits enter
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Catalog Storefront
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-1">
            Shop Products
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Showing {meta.total} {meta.total === 1 ? 'item' : 'items'} available with real-time stock availability.
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Search catalog..."
              value={currentFilters.search || ''}
              onChange={e => updateFilters({ search: e.target.value, page: 1 })}
              className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
            {currentFilters.search && (
              <button
                onClick={() => updateFilters({ search: '', page: 1 })}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition flex items-center gap-2 text-sm font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilters
            categories={categories}
            filters={currentFilters}
            onFilterChange={updateFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Cards Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 animate-pulse">
                  <div className="aspect-square bg-zinc-100 rounded-xl" />
                  <div className="h-4 bg-zinc-200 rounded-md w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded-md w-1/2" />
                  <div className="h-8 bg-zinc-200 rounded-lg w-full mt-4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No products match your criteria</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                Try loosening your filters, broadening your price range, or searching for a different keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 pt-6">
              <span className="text-xs text-zinc-500 font-medium">
                Page {meta.page} of {meta.totalPages} ({meta.total} total items)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateFilters({ page: meta.page - 1 })}
                  disabled={meta.page <= 1}
                  className="p-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => updateFilters({ page: p })}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                      meta.page === p
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => updateFilters({ page: meta.page + 1 })}
                  disabled={meta.page >= meta.totalPages}
                  className="p-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
                <h3 className="font-bold text-zinc-900">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                categories={categories}
                filters={currentFilters}
                onFilterChange={newFilters => {
                  updateFilters(newFilters);
                }}
                onReset={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
              />

              <div className="pt-6">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
