import express from 'express';
import * as controller from '../controllers/main.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

// Auth
router.post('/auth/register', controller.register);
router.post('/auth/login', controller.login);

// Grocery (Admin)
router.post('/groceries', authenticate, authorize(['ADMIN']), controller.addGrocery);
router.put('/groceries/:id', authenticate, authorize(['ADMIN']), controller.updateGrocery);
router.delete('/groceries/:id', authenticate, authorize(['ADMIN']), controller.deleteGrocery);
router.patch('/groceries/:id/inventory', authenticate, authorize(['ADMIN']), controller.updateInventory);

// Grocery (All Users)
router.get('/groceries', controller.listGroceries);

// Orders (User)
router.post('/orders', authenticate, authorize(['USER']), controller.placeOrder);

export default router;
