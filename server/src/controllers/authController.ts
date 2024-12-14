// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'El usuario ya existe' });
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    // Generar token JWT para el usuario registrado
    const token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    console.error('Error en el registro:', error); // Agrega este log
    res.status(500).json({ message: 'Error en el registro', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    // Generar token JWT para el usuario logueado
    const token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error });
  }
};