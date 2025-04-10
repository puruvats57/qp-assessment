"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = exports.listGroceries = exports.updateInventory = exports.deleteGrocery = exports.updateGrocery = exports.addGrocery = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addGrocery = async (data) => {
    return prisma.groceryItem.create({ data });
};
exports.addGrocery = addGrocery;
const updateGrocery = async (id, data) => {
    return prisma.groceryItem.update({ where: { id }, data });
};
exports.updateGrocery = updateGrocery;
const deleteGrocery = async (id) => {
    return prisma.groceryItem.delete({ where: { id } });
};
exports.deleteGrocery = deleteGrocery;
const updateInventory = async (id, quantity) => {
    return prisma.groceryItem.update({ where: { id }, data: { quantity } });
};
exports.updateInventory = updateInventory;
const listGroceries = async () => {
    return prisma.groceryItem.findMany({ where: { quantity: { gt: 0 } } });
};
exports.listGroceries = listGroceries;
const placeOrder = async (userId, items) => {
    const order = await prisma.order.create({
        data: {
            userId,
            items: {
                create: items.map(item => ({
                    groceryItemId: item.groceryItemId,
                    quantity: item.quantity,
                })),
            },
        },
    });
    for (const item of items) {
        await prisma.groceryItem.update({
            where: { id: item.groceryItemId },
            data: { quantity: { decrement: item.quantity } },
        });
    }
    return order;
};
exports.placeOrder = placeOrder;
