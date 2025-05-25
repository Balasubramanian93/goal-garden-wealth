import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/userService';
import { AuthResponse } from '@supabase/supabase-js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'Missing required fields: email, password, firstName, lastName' });
      return;
    }

    const { data, error } = await registerUser(email, password, firstName, lastName) as any;

    if (error) {
      res.status(400).json({ message: error.message || 'Registration failed' });
      return;
    }

    res.status(201).json({ message: 'User registered successfully', user: data?.user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Missing required fields: email, password' });
      return;
    }

    const { data, error } = await loginUser(email, password) as any;

    if (error) {
      res.status(401).json({ message: error.message || 'Login failed' });
      return;
    }

    res.status(200).json({ message: 'Login successful', user: data?.user, session: data?.session });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Failed to login user', error: (error as Error).message });
  }
};