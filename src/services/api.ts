import {
  User,
  Category,
  Product,
  CartItem,
  Order,
  OrderStatus,
  AdminStats,
  ApiResponse,
  ProductFilters,
  ProductReview,
  ReviewsResponseData,
} from '../types/index.js';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('shopsphere_auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'An error occurred during the request', response.status, data);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    async register(payload: { name: string; email: string; password: string; confirmPassword: string }) {
      const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.data?.token) {
        localStorage.setItem('shopsphere_auth_token', res.data.token);
      }
      return res;
    },

    async login(payload: { email: string; password: string }) {
      const res = await request<ApiResponse<{ user: User; token: string }>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.data?.token) {
        localStorage.setItem('shopsphere_auth_token', res.data.token);
      }
      return res;
    },

    async logout() {
      localStorage.removeItem('shopsphere_auth_token');
      return request<ApiResponse>('/auth/logout', { method: 'POST' });
    },

    async getMe() {
      return request<ApiResponse<{ user: User }>>('/auth/me');
    },
  },

  // Products & Categories
  products: {
    async getCategories() {
      return request<ApiResponse<Category[]>>('/categories');
    },

    async getProducts(filters: ProductFilters = {}) {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.inStockOnly) params.append('inStockOnly', 'true');
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return request<ApiResponse<Product[]>>(`/products${queryStr}`);
    },

    async getProduct(idOrSlug: string) {
      return request<ApiResponse<Product>>(`/products/${idOrSlug}`);
    },
  },

  // Cart
  cart: {
    async getCart() {
      return request<ApiResponse<{ cartId: string; items: CartItem[]; subtotal: number; itemCount: number }>>('/cart');
    },

    async addToCart(productId: string, quantity = 1) {
      return request<ApiResponse<{ cartId: string; items: CartItem[]; subtotal: number; itemCount: number }>>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
    },

    async updateQuantity(itemId: string, quantity: number) {
      return request<ApiResponse<{ cartId: string; items: CartItem[]; subtotal: number; itemCount: number }>>(`/cart/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      });
    },

    async removeItem(itemId: string) {
      return request<ApiResponse<{ cartId: string; items: CartItem[]; subtotal: number; itemCount: number }>>(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
    },

    async clearCart() {
      return request<ApiResponse<{ cartId: string; items: CartItem[]; subtotal: number; itemCount: number }>>('/cart', {
        method: 'DELETE',
      });
    },
  },

  // Orders
  orders: {
    async createOrder(checkoutData: {
      customerName: string;
      customerEmail: string;
      shippingAddress: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      paymentMethod: string;
    }) {
      return request<ApiResponse<Order>>('/orders', {
        method: 'POST',
        body: JSON.stringify(checkoutData),
      });
    },

    async getMyOrders() {
      return request<ApiResponse<Order[]>>('/orders/my');
    },

    async getOrder(idOrNumber: string) {
      return request<ApiResponse<Order>>(`/orders/${idOrNumber}`);
    },

    async cancelOrder(id: string) {
      return request<ApiResponse<Order>>(`/orders/${id}/cancel`, {
        method: 'POST',
      });
    },
  },

  // Admin
  admin: {
    async getDashboard() {
      return request<ApiResponse<AdminStats>>('/admin/dashboard');
    },

    async getProducts(params?: { category?: string; search?: string; page?: number; limit?: number }) {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.search) q.append('search', params.search);
      if (params?.page) q.append('page', params.page.toString());
      if (params?.limit) q.append('limit', params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<ApiResponse<Product[]>>(`/admin/products${queryStr}`);
    },

    async createProduct(productData: Partial<Product>) {
      return request<ApiResponse<Product>>('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },

    async updateProduct(id: string, updates: Partial<Product>) {
      return request<ApiResponse<Product>>(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    async deleteProduct(id: string) {
      return request<ApiResponse>(`/admin/products/${id}`, {
        method: 'DELETE',
      });
    },

    async getOrders(params?: { status?: string; search?: string; page?: number; limit?: number }) {
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      if (params?.page) q.append('page', params.page.toString());
      if (params?.limit) q.append('limit', params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<ApiResponse<Order[]>>(`/admin/orders${queryStr}`);
    },

    async updateOrderStatus(id: string, status: OrderStatus, note?: string) {
      return request<ApiResponse<Order>>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    },

    async getUsers(search?: string) {
      const queryStr = search ? `?search=${encodeURIComponent(search)}` : '';
      return request<ApiResponse<User[]>>(`/admin/users${queryStr}`);
    },

    async updateUserStatus(id: string, is_active: number) {
      return request<ApiResponse<User>>(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active }),
      });
    },
  },

  // Product Reviews
  reviews: {
    async getByProduct(productIdOrSlug: string) {
      return request<ApiResponse<ReviewsResponseData>>(`/products/${productIdOrSlug}/reviews`);
    },

    async create(productIdOrSlug: string, payload: { rating: number; comment: string }) {
      return request<ApiResponse<ProductReview>>(`/products/${productIdOrSlug}/reviews`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // Health
  async getHealth() {
    return request<any>('/health');
  },
};
