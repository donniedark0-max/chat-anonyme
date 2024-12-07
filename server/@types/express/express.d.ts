// server/src/types/express.d.ts
import { IUser } from '../models/User';

declare namespace Express {
  export interface Request {
    userId?: string;
    user?: IUser; // Opcional: Puedes agregar el usuario completo si lo prefieres
  }
}