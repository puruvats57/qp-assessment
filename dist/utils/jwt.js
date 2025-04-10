"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'super_secret';
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, secret, { expiresIn: '1d' });
};
exports.generateToken = generateToken;
