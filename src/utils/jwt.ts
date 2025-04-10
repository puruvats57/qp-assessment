import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'super_secret';

export const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, secret, { expiresIn: '1d' });
};
