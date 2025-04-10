"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = exports.updateInventory = exports.listGroceries = exports.deleteGrocery = exports.updateGrocery = exports.addGrocery = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../prisma");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    const { email, password, role } = req.body;
    const hash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({ data: { email, password: hash, role } });
    res.status(201).json(user);
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    res.json({ token });
};
exports.login = login;
const addGrocery = async (req, res) => {
    const { name, price, quantity } = req.body;
    const item = await prisma_1.prisma.grocery.create({
        data: {
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        }
    });
    res.status(201).json(item);
};
exports.addGrocery = addGrocery;
const updateGrocery = async (req, res) => {
    const id = Number(req.params.id);
    const { name, price, quantity } = req.body;
    const updated = await prisma_1.prisma.grocery.update({
        where: { id },
        data: {
            name,
            price: price ? parseFloat(price) : undefined,
            quantity: quantity ? parseInt(quantity) : undefined
        }
    });
    res.json(updated);
};
exports.updateGrocery = updateGrocery;
const deleteGrocery = async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.prisma.grocery.delete({ where: { id } });
    res.status(204).send();
};
exports.deleteGrocery = deleteGrocery;
const listGroceries = async (_, res) => {
    const items = await prisma_1.prisma.grocery.findMany({
        where: {
            quantity: { gt: 0 } // Only show items with quantity > 0
        }
    });
    res.json(items);
};
exports.listGroceries = listGroceries;
const updateInventory = async (req, res) => {
    const id = Number(req.params.id);
    const { quantity } = req.body;
    const updated = await prisma_1.prisma.grocery.update({
        where: { id },
        data: { quantity: parseInt(quantity) },
    });
    res.json(updated);
};
exports.updateInventory = updateInventory;
const placeOrder = async (req, res) => {
    const { items } = req.body;
    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ message: 'Invalid order items' });
        return;
    }
    // Start a transaction
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        // Create the order
        const order = await tx.order.create({
            data: {
                userId: req.user.id,
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
exports.placeOrder = placeOrder;
