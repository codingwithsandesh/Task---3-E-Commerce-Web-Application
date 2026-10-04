import React from 'react';
import { RotateCcw, Filter, Check } from 'lucide-react';
import { Category, ProductFilters as FilterType } from '../../types/index.js';

interface ProductFiltersProps {
  categories: Category[];
  filters: FilterType;
  onFilterChange: (newFilters: Partial<FilterType>) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-zinc-900 text-sm">Filters & Sorting</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-zinc-500 hover:text-indigo-600 flex items-center gap-1 font-medium transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Sort Options */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy || 'newest'}
          onChange={e => onFilterChange({ sortBy: e.target.value as any, page: 1 })}
          className="w-full text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2.5">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ category: 'all', page: 1 })}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              !filters.category || filters.category === 'all'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <span>All Categories</span>
            {(!filters.category || filters.category === 'all') && (
              <Check className="w-3.5 h-3.5 text-indigo-600" />
            )}
          </button>

          {categories.map(cat => {
            const isSelected = filters.category === cat.slug || filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.slug, page: 1 })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {cat.product_count !== undefined && (
                  <span className="text-[11px] text-zinc-400 font-normal">
                    {cat.product_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2.5">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-zinc-400 block mb-1">Min</span>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={filters.minPrice ?? ''}
              onChange={e =>
                onFilterChange({
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
              className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block mb-1">Max</span>
            <input
              type="number"
              placeholder="50000"
              min="0"
              value={filters.maxPrice ?? ''}
              onChange={e =>
                onFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
              className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-2 border-t border-zinc-100">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-medium text-zinc-700 group-hover:text-zinc-900 transition">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={e => onFilterChange({ inStockOnly: e.target.checked, page: 1 })}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 transition"
          />
        </label>
      </div>
    </div>
  );
};
