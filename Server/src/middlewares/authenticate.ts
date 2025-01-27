import { Request, Response, NextFunction } from 'express';
import { TokenPayload, verifyAccessToken } from '../utils/jwtUtils';
import AppError from '../utils/appError';
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from '../models/Users';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};


