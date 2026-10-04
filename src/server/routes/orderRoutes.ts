import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { checkoutSchema } from '../validators/schemas.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

export const orderRouter = Router();

// POST /api/orders - Checkout & place order
orderRouter.post('/', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = checkoutSchema.parse(req.body);

    // Resolve cart
    const userId = req.user?.id;
    const sessionId = req.sessionId;
    const cart = await db.cart.getOrCreate(userId, sessionId);

    // Create order with transactional inventory reduction
    const result = await db.orders.create({
      userId: userId || null,
      customerName: validated.customerName.trim(),
      customerEmail: validated.customerEmail.toLowerCase().trim(),
      shippingAddress: validated.shippingAddress.trim(),
      city: validated.city.trim(),
      state: validated.state.trim(),
      postalCode: validated.postalCode.trim(),
      country: validated.country.trim(),
      paymentMethod: validated.paymentMethod,
      cartId: cart.id,
    });

    if (!result.success || !result.order) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Failed to place order',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Thank you for shopping with ShopSphere.',
      data: result.order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/my - Authenticated customer's orders
orderRouter.get('/my', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const orders = await db.orders.getUserOrders(req.user!.id);
    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:idOrNumber - Order details & status tracking
orderRouter.get('/:idOrNumber', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { idOrNumber } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const order = await db.orders.getById(idOrNumber, userId, isAdmin);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission to view it.',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/:id/cancel - Customer cancellation
orderRouter.post('/:id/cancel', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const order = await db.orders.getById(id, req.user!.id, false);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied.',
      });
    }

    if (!['Pending', 'Confirmed'].includes(order.order_status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already in "${order.order_status}" status.`,
      });
    }

    const result = await db.orders.updateStatus(
      order.id,
      'Cancelled',
      req.user!.name,
      'Order cancelled by customer request.'
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: 'Order has been successfully cancelled and inventory restored.',
      data: result.order,
    });
  } catch (err) {
    next(err);
  }
});
