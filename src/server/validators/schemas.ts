import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  email: z.string().email('Please enter a valid email address').max(191),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be under 100 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(200),
  category_id: z.string().min(1, 'Category is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  image_url: z.string().url('Must be a valid image URL'),
  stock_quantity: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  is_active: z.coerce.number().int().min(0).max(1).optional().default(1),
  is_featured: z.coerce.number().int().min(0).max(1).optional().default(0),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Full name is required').max(100),
  customerEmail: z.string().email('Valid email is required'),
  shippingAddress: z.string().min(5, 'Street address is required').max(255),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State / Province is required').max(100),
  postalCode: z.string().min(3, 'Postal code is required').max(20),
  country: z.string().min(2, 'Country is required').max(100).default('United States'),
  paymentMethod: z.enum(['Cash on Delivery', 'Demo Checkout']).default('Cash on Delivery'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  note: z.string().max(255).optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().nonnegative('Quantity cannot be negative'),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().min(3, 'Comment must be at least 3 characters').max(1000, 'Comment cannot exceed 1000 characters'),
});
