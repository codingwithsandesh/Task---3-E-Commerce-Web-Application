import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { productSchema, updateOrderStatusSchema } from '../validators/schemas.js';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';

export const adminRouter = Router();

// Protect all admin endpoints with requireAdmin
adminRouter.use(requireAdmin);

// GET /api/admin/dashboard
adminRouter.get('/dashboard', async (_req, res: Response, next) => {
  try {
    const stats = await db.orders.getDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/products - List all products including inactive
adminRouter.get('/products', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { category, search, page, limit, sortBy } = req.query;
    const result = await db.products.list({
      category: category as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
      sortBy: (sortBy as string) || 'newest',
      includeInactive: true,
    });

    res.json({
      success: true,
      data: result.products,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/products - Create product
adminRouter.post('/products', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = productSchema.parse(req.body);
    const product = await db.products.create({
      category_id: validated.category_id,
      name: validated.name.trim(),
      description: validated.description.trim(),
      price: validated.price,
      image_url: validated.image_url.trim(),
      stock_quantity: validated.stock_quantity,
      is_active: validated.is_active,
      is_featured: validated.is_featured,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/products/:id - Edit product
adminRouter.put('/products/:id', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const validated = productSchema.partial().parse(req.body);

    const updated = await db.products.update(id, validated);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/products/:id - Delete / Archive product
adminRouter.delete('/products/:id', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const result = await db.products.delete(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Product not found',
      });
    }

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/orders - View all orders with filters
adminRouter.get('/orders', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { status, search, page, limit } = req.query;
    const result = await db.orders.getAll({
      status: status as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    });

    res.json({
      success: true,
      data: result.orders,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/orders/:id/status - Update order status
adminRouter.patch('/orders/:id/status', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { status, note } = updateOrderStatusSchema.parse(req.body);

    const adminName = req.user?.name || 'Administrator';
    const result = await db.orders.updateStatus(id, status, adminName, note);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Failed to update order status',
      });
    }

    res.json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: result.order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users - Customer management
adminRouter.get('/users', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { search } = req.query;
    const users = await db.users.list(search as string);

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/status - Toggle active status
adminRouter.patch('/users/:id/status', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active !== 0 && is_active !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid is_active value. Must be 0 or 1.',
      });
    }

    const result = await db.users.updateStatus(id, is_active);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: `User account has been ${is_active ? 'activated' : 'deactivated'}.`,
      data: result.user,
    });
  } catch (err) {
    next(err);
  }
});
