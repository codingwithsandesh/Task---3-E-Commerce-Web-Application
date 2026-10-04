import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  console.error('[API Error]:', err);

  if (err instanceof ZodError) {
    const issues = err.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      message: issues[0]?.message || 'Validation failed',
      errors: issues,
    });
  }

  const error = err as Error;
  const statusCode = (err as any).statusCode || 500;
  const message = error.message || 'An unexpected internal server error occurred';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}
