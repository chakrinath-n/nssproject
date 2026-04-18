import { Request, Response, NextFunction } from "express";

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // ← case-insensitive comparison
    if (user.role?.toLowerCase() !== role.toLowerCase()) {
      res.status(403).json({ message: "Access denied. Insufficient permissions." });
      return;
    }

    next();
  };
};