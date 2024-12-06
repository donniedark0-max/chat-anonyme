// server/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {  // Removemos `: void`
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    res.status(403).json({ message: 'Acceso denegado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' });
    return;
  }
};

export default authenticateToken;