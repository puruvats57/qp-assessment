"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = exports.updateInventory = exports.deleteGrocery = exports.updateGrocery = exports.addGrocery = exports.listGroceries = void 0;
const service = __importStar(require("../services/grocery.service"));
const listGroceries = async (_, res) => {
    const items = await service.listGroceries();
    res.json(items);
};
exports.listGroceries = listGroceries;
const addGrocery = async (req, res) => {
    if (req.user?.role !== 'ADMIN')
        return res.status(403).json({ message: 'Forbidden' });
    const item = await service.addGrocery(req.body);
    res.json(item);
};
exports.addGrocery = addGrocery;
const updateGrocery = async (req, res) => {
    if (req.user?.role !== 'ADMIN')
        return res.status(403).json({ message: 'Forbidden' });
    const item = await service.updateGrocery(Number(req.params.id), req.body);
    res.json(item);
};
exports.updateGrocery = updateGrocery;
const deleteGrocery = async (req, res) => {
    if (req.user?.role !== 'ADMIN')
        return res.status(403).json({ message: 'Forbidden' });
    await service.deleteGrocery(Number(req.params.id));
    res.json({ message: 'Deleted' });
};
exports.deleteGrocery = deleteGrocery;
const updateInventory = async (req, res) => {
    if (req.user?.role !== 'ADMIN')
        return res.status(403).json({ message: 'Forbidden' });
    const updated = await service.updateInventory(Number(req.params.id), req.body.quantity);
    res.json(updated);
};
exports.updateInventory = updateInventory;
const placeOrder = async (req, res) => {
    if (req.user?.role !== 'USER')
        return res.status(403).json({ message: 'Forbidden' });
    const order = await service.placeOrder(req.user.id, req.body.items);
    res.json(order);
};
exports.placeOrder = placeOrder;
