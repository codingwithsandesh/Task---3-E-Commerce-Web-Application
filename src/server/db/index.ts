import { EmbeddedStore } from './embeddedStore.js';
import { isMySQLConnected, getMySQLPool, initMySQL } from './mysqlClient.js';
import { User, Category, Product, CartItem, Order, OrderStatus } from '../../types/index.js';

const embeddedStore = new EmbeddedStore();

// Attempt to initialize MySQL in background
initMySQL().catch(err => {
  console.log('[DB] Running with embedded database fallback:', err.message);
});

export const db = {
  getMode(): 'mysql' | 'embedded' {
    return isMySQLConnected() ? 'mysql' : 'embedded';
  },

  getSystemStatus() {
    const isMysql = isMySQLConnected();
    return {
      mode: isMysql ? ('mysql' as const) : ('embedded' as const),
      engine: isMysql ? 'MySQL 8.0 Server' : 'Embedded Relational Engine (MySQL 8.0 Compatible)',
      status: 'healthy',
      databaseName: 'shopsphere_db',
    };
  },

  users: {
    async findByEmail(email: string): Promise<(User & { password_hash: string }) | undefined> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const [rows] = await pool.query<any[]>(
          'SELECT id, name, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
          [email.toLowerCase()]
        );
        return rows[0];
      }
      return embeddedStore.findUserByEmail(email);
    },

    async findById(id: string): Promise<User | undefined> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const [rows] = await pool.query<any[]>(
          'SELECT id, name, email, role, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
          [id]
        );
        return rows[0];
      }
      return embeddedStore.findUserById(id);
    },

    async create(data: { name: string; email: string; password_hash: string; role?: 'customer' | 'admin' }): Promise<User> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const id = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const role = data.role || 'customer';
        await pool.query(
          'INSERT INTO users (id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)',
          [id, data.name, data.email.toLowerCase(), data.password_hash, role]
        );
        return {
          id,
          name: data.name,
          email: data.email.toLowerCase(),
          role,
          is_active: 1,
        };
      }
      return embeddedStore.createUser(data);
    },

    async list(search?: string): Promise<User[]> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        let sql = 'SELECT id, name, email, role, is_active, created_at, updated_at FROM users';
        const params: any[] = [];
        if (search) {
          sql += ' WHERE name LIKE ? OR email LIKE ?';
          params.push(`%${search}%`, `%${search}%`);
        }
        sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.query<any[]>(sql, params);
        return rows;
      }
      return embeddedStore.listUsers(search);
    },

    async updateStatus(id: string, isActive: number) {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        await pool.query('UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?', [isActive, id]);
        const updated = await this.findById(id);
        return { success: true, user: updated };
      }
      return embeddedStore.updateUserStatus(id, isActive);
    },
  },

  categories: {
    async list(): Promise<Category[]> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const [rows] = await pool.query<any[]>(`
          SELECT c.*, COUNT(p.id) as product_count
          FROM categories c
          LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
          GROUP BY c.id
          ORDER BY c.name ASC
        `);
        return rows;
      }
      return embeddedStore.listCategories();
    },

    async findById(id: string): Promise<Category | undefined> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const [rows] = await pool.query<any[]>('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
        return rows[0];
      }
      return embeddedStore.findCategoryById(id);
    },

    async findBySlug(slug: string): Promise<Category | undefined> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const [rows] = await pool.query<any[]>('SELECT * FROM categories WHERE slug = ? LIMIT 1', [slug]);
        return rows[0];
      }
      return embeddedStore.findCategoryBySlug(slug);
    },
  },

  products: {
    async list(options: {
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      inStockOnly?: boolean;
      page?: number;
      limit?: number;
      includeInactive?: boolean;
      featured?: boolean;
    } = {}) {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        let sql = `
          SELECT p.*, c.name as category_name, c.slug as category_slug
          FROM products p
          LEFT JOIN categories c ON c.id = p.category_id
          WHERE 1=1
        `;
        const params: any[] = [];

        if (!options.includeInactive) {
          sql += ' AND p.is_active = 1';
        }
        if (options.featured) {
          sql += ' AND p.is_featured = 1';
        }
        if (options.category && options.category !== 'all') {
          sql += ' AND (p.category_id = ? OR c.slug = ?)';
          params.push(options.category, options.category);
        }
        if (options.search && options.search.trim()) {
          sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
          params.push(`%${options.search.trim()}%`, `%${options.search.trim()}%`);
        }
        if (options.minPrice !== undefined && !isNaN(options.minPrice)) {
          sql += ' AND p.price >= ?';
          params.push(options.minPrice);
        }
        if (options.maxPrice !== undefined && !isNaN(options.maxPrice)) {
          sql += ' AND p.price <= ?';
          params.push(options.maxPrice);
        }
        if (options.inStockOnly) {
          sql += ' AND p.stock_quantity > 0';
        }

        switch (options.sortBy) {
          case 'price-asc':
            sql += ' ORDER BY p.price ASC';
            break;
          case 'price-desc':
            sql += ' ORDER BY p.price DESC';
            break;
          case 'name-asc':
            sql += ' ORDER BY p.name ASC';
            break;
          case 'name-desc':
            sql += ' ORDER BY p.name DESC';
            break;
          case 'newest':
          default:
            sql += ' ORDER BY p.created_at DESC';
            break;
        }

        const [allRows] = await pool.query<any[]>(sql, params);
        const total = allRows.length;
        const page = options.page || 1;
        const limit = options.limit || 12;
        const totalPages = Math.ceil(total / limit) || 1;
        const offset = (page - 1) * limit;

        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const [rows] = await pool.query<any[]>(sql, params);

        return {
          products: rows as Product[],
          total,
          page,
          limit,
          totalPages,
        };
      }
      return embeddedStore.listProducts(options);
    },

    async findByIdOrSlug(idOrSlug: string): Promise<Product | undefined> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const [rows] = await pool.query<any[]>(`
          SELECT p.*, c.name as category_name, c.slug as category_slug
          FROM products p
          LEFT JOIN categories c ON c.id = p.category_id
          WHERE p.id = ? OR p.slug = ?
          LIMIT 1
        `, [idOrSlug, idOrSlug]);
        return rows[0];
      }
      return embeddedStore.findProductByIdOrSlug(idOrSlug);
    },

    async create(data: {
      category_id: string;
      name: string;
      slug?: string;
      description: string;
      price: number;
      image_url: string;
      stock_quantity: number;
      is_active?: number;
      is_featured?: number;
    }): Promise<Product> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await pool.query(
          `INSERT INTO products (id, category_id, name, slug, description, price, image_url, stock_quantity, is_active, is_featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            data.category_id,
            data.name,
            slug,
            data.description,
            data.price,
            data.image_url,
            data.stock_quantity,
            data.is_active ?? 1,
            data.is_featured ?? 0,
          ]
        );
        return (await this.findByIdOrSlug(id))!;
      }
      return embeddedStore.createProduct(data);
    },

    async update(id: string, updates: Partial<Product>): Promise<Product | undefined> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const fields: string[] = [];
        const params: any[] = [];
        for (const [key, val] of Object.entries(updates)) {
          if (['name', 'slug', 'description', 'price', 'image_url', 'stock_quantity', 'is_active', 'is_featured', 'category_id'].includes(key)) {
            fields.push(`\`${key}\` = ?`);
            params.push(val);
          }
        }
        if (fields.length > 0) {
          params.push(id);
          await pool.query(`UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
        }
        return await this.findByIdOrSlug(id);
      }
      return embeddedStore.updateProduct(id, updates);
    },

    async delete(id: string): Promise<{ success: boolean; message?: string }> {
      if (isMySQLConnected()) {
        const pool = getMySQLPool()!;
        const [orderItemRows] = await pool.query<any[]>('SELECT id FROM order_items WHERE product_id = ? LIMIT 1', [id]);
        if (orderItemRows.length > 0) {
          await pool.query('UPDATE products SET is_active = 0, updated_at = NOW() WHERE id = ?', [id]);
          return { success: true, message: 'Product is referenced in previous orders; archived as inactive.' };
        }
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return { success: true, message: 'Product permanently removed.' };
      }
      return embeddedStore.deleteProduct(id);
    },
  },

  cart: {
    async getOrCreate(userId?: string, sessionId?: string) {
      return embeddedStore.getOrCreateCart(userId, sessionId);
    },

    async getItems(cartId: string): Promise<CartItem[]> {
      return embeddedStore.getCartItems(cartId);
    },

    async addItem(cartId: string, productId: string, quantity: number) {
      return embeddedStore.addToCart(cartId, productId, quantity);
    },

    async updateItem(cartId: string, itemId: string, quantity: number) {
      return embeddedStore.updateCartItemQuantity(cartId, itemId, quantity);
    },

    async removeItem(cartId: string, itemId: string) {
      return embeddedStore.removeCartItem(cartId, itemId);
    },

    async clear(cartId: string) {
      return embeddedStore.clearCart(cartId);
    },
  },

  orders: {
    async create(orderData: {
      userId?: string | null;
      customerName: string;
      customerEmail: string;
      shippingAddress: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      paymentMethod: string;
      cartId: string;
    }) {
      return embeddedStore.createOrder(orderData);
    },

    async getById(idOrNumber: string, userId?: string, isAdmin?: boolean): Promise<Order | undefined> {
      return embeddedStore.getOrderById(idOrNumber, userId, isAdmin);
    },

    async getUserOrders(userId: string): Promise<Order[]> {
      return embeddedStore.getUserOrders(userId);
    },

    async getAll(options: { status?: string; search?: string; page?: number; limit?: number } = {}) {
      return embeddedStore.getAllOrders(options);
    },

    async updateStatus(orderId: string, newStatus: OrderStatus, changedBy: string, note?: string) {
      return embeddedStore.updateOrderStatus(orderId, newStatus, changedBy, note);
    },

    async getDashboardStats() {
      return embeddedStore.getDashboardStats();
    },
  },

  reviews: {
    async getProductReviews(productIdOrSlug: string) {
      return embeddedStore.getProductReviews(productIdOrSlug);
    },

    async addReview(data: {
      productIdOrSlug: string;
      userId: string;
      userName: string;
      rating: number;
      comment: string;
    }) {
      return embeddedStore.addProductReview(data);
    },
  },
};
