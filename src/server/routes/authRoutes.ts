import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';
import { generateToken, requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { config } from '../config/config.js';

export const authRouter = Router();

authRouter.post('/register', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await db.users.findByEmail(validated.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);
    // Explicit requirement: Public registration must always create a Customer account.
    const newUser = await db.users.create({
      name: validated.name.trim(),
      email: validated.email.toLowerCase().trim(),
      password_hash: passwordHash,
      role: 'customer',
    });

    const token = generateToken(newUser);

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully. Welcome to ShopSphere!',
      data: {
        user: newUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = loginSchema.parse(req.body);

    const userWithHash = await db.users.findByEmail(validated.email);
    if (!userWithHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
    }

    if (!Number(userWithHash.is_active)) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await bcrypt.compare(validated.password, userWithHash.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user } = userWithHash;
    const token = generateToken(user);

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout', (_req, res: Response) => {
  res.clearCookie(config.cookieName);
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const user = await db.users.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
});
