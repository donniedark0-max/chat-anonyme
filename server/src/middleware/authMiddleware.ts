import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Acceso denegado' });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Token inválido' });
      return;
    }
    req.userId = (decoded as jwt.JwtPayload).id; // `userId` ahora está tipado correctamente
    next();
  });
};

export default authenticateToken;