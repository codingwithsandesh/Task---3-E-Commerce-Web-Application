import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { reviewSchema } from '../validators/schemas.js';

export const productRouter = Router();

// GET /api/categories
productRouter.get('/categories', async (_req, res: Response, next) => {
  try {
    const categories = await db.categories.list();
    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products
productRouter.get('/products', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, inStockOnly, page, limit, featured } = req.query;

    const result = await db.products.list({
      category: category as string,
      search: search as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      sortBy: sortBy as string,
      inStockOnly: inStockOnly === 'true',
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 12,
      featured: featured === 'true',
      includeInactive: false,
    });

    res.json({
      success: true,
      message: 'Products retrieved successfully',
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

// GET /api/products/:idOrSlug
productRouter.get('/products/:idOrSlug', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { idOrSlug } = req.params;
    const product = await db.products.findByIdOrSlug(idOrSlug);

    if (!product || !Number(product.is_active)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or is currently unavailable.',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:idOrSlug/reviews
productRouter.get('/products/:idOrSlug/reviews', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { idOrSlug } = req.params;
    const data = await db.reviews.getProductReviews(idOrSlug);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/products/:idOrSlug/reviews - Authenticated users only
productRouter.post('/products/:idOrSlug/reviews', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { idOrSlug } = req.params;
    const validated = reviewSchema.parse(req.body);
    const userId = req.user!.id;
    const userName = req.user!.name;

    const result = await db.reviews.addReview({
      productIdOrSlug: idOrSlug,
      userId,
      userName,
      rating: validated.rating,
      comment: validated.comment.trim(),
    });

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Product not found',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your product review has been submitted.',
      data: result.review,
    });
  } catch (err) {
    next(err);
  }
});
