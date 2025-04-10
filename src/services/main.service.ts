import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../types/express.d';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, role } });
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = generateToken(user.id, user.role);
  res.json({ token });
};

export const addGrocery = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, price, quantity } = req.body;
  const item = await prisma.grocery.create({ 
    data: { 
      name, 
      price: parseFloat(price), 
      quantity: parseInt(quantity) 
    } 
  });
  res.status(201).json(item);
};

export const updateGrocery = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { name, price, quantity } = req.body;
  const updated = await prisma.grocery.update({ 
    where: { id }, 
    data: { 
      name,
      price: price ? parseFloat(price) : undefined,
      quantity: quantity ? parseInt(quantity) : undefined
    } 
  });
  res.json(updated);
};

export const deleteGrocery = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  await prisma.grocery.delete({ where: { id } });
  res.status(204).send();
};

export const listGroceries = async (_: Request, res: Response): Promise<void> => {
  const items = await prisma.grocery.findMany({
    where: {
      quantity: { gt: 0 } // Only show items with quantity > 0
    }
  });
  res.json(items);
};

export const updateInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { quantity } = req.body;
  const updated = await prisma.grocery.update({
    where: { id },
    data: { quantity: parseInt(quantity) },
  });
  res.json(updated);
};

export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { items } = req.body;
  
  // Validate items
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: 'Invalid order items' });
    return;
  }

  // Start a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create the order
    const order = await tx.order.create({
      data: {
        userId: req.user!.id,
        status: 'PENDING'
      }
    });

    // Process each item
    for (const item of items) {
      const { groceryId, quantity } = item;
      
      // Get the grocery item
      const grocery = await tx.grocery.findUnique({
        where: { id: groceryId }
      });

      if (!grocery) {
        throw new Error(`Grocery item ${groceryId} not found`);
      }

      if (grocery.quantity < quantity) {
        throw new Error(`Insufficient quantity for item ${grocery.name}`);
      }

      // Create order item
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          groceryId,
          quantity,
          price: grocery.price
        }
      });

      // Update inventory
      await tx.grocery.update({
        where: { id: groceryId },
        data: { quantity: grocery.quantity - quantity }
      });
    }

    // Update order status to completed
    return tx.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' },
      include: {
        orderItems: {
          include: {
            grocery: true
          }
        }
      }
    });
  });

  res.status(201).json(order);
};
