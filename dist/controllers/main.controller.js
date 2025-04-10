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
exports.placeOrder = exports.updateInventory = exports.listGroceries = exports.deleteGrocery = exports.updateGrocery = exports.addGrocery = exports.login = exports.register = void 0;
const service = __importStar(require("../services/main.service"));
const register = (req, res) => service.register(req, res);
exports.register = register;
const login = (req, res) => service.login(req, res);
exports.login = login;
const addGrocery = (req, res) => service.addGrocery(req, res);
exports.addGrocery = addGrocery;
const updateGrocery = (req, res) => service.updateGrocery(req, res);
exports.updateGrocery = updateGrocery;
const deleteGrocery = (req, res) => service.deleteGrocery(req, res);
exports.deleteGrocery = deleteGrocery;
const listGroceries = (req, res) => service.listGroceries(req, res);
exports.listGroceries = listGroceries;
const updateInventory = (req, res) => service.updateInventory(req, res);
exports.updateInventory = updateInventory;
const placeOrder = (req, res) => service.placeOrder(req, res);
exports.placeOrder = placeOrder;
