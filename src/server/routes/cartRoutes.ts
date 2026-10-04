import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { addToCartSchema, updateCartItemSchema } from '../validators/schemas.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const cartRouter = Router();

// Helper to resolve cart for user or guest session
async function resolveCart(req: AuthenticatedRequest) {
  const userId = req.user?.id;
  const sessionId = req.sessionId;
  return db.cart.getOrCreate(userId, sessionId);
}

// GET /api/cart
cartRouter.get('/', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const cart = await resolveCart(req);
    const items = await db.cart.getItems(cart.id);

    const subtotal = Number(
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: {
        cartId: cart.id,
        items,
        subtotal,
        itemCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/cart/items
cartRouter.post('/items', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = addToCartSchema.parse(req.body);
    const cart = await resolveCart(req);

    const result = await db.cart.addItem(cart.id, validated.productId, validated.quantity);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    const items = await db.cart.getItems(cart.id);
    const subtotal = Number(
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      success: true,
      message: 'Item added to your shopping cart',
      data: {
        cartId: cart.id,
        items,
        subtotal,
        itemCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/cart/items/:id
cartRouter.patch('/items/:id', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const validated = updateCartItemSchema.parse(req.body);
    const cart = await resolveCart(req);

    const result = await db.cart.updateItem(cart.id, id, validated.quantity);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    const items = await db.cart.getItems(cart.id);
    const subtotal = Number(
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      message: 'Cart item updated',
      data: {
        cartId: cart.id,
        items,
        subtotal,
        itemCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/items/:id
cartRouter.delete('/items/:id', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const cart = await resolveCart(req);

    await db.cart.removeItem(cart.id, id);

    const items = await db.cart.getItems(cart.id);
    const subtotal = Number(
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        cartId: cart.id,
        items,
        subtotal,
        itemCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart
cartRouter.delete('/', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const cart = await resolveCart(req);
    await db.cart.clear(cart.id);

    res.json({
      success: true,
      message: 'Cart cleared',
      data: {
        cartId: cart.id,
        items: [],
        subtotal: 0,
        itemCount: 0,
      },
    });
  } catch (err) {
    next(err);
  }
});
