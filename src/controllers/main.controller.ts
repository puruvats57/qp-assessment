import { Request, Response, RequestHandler } from 'express';
import { AuthRequest } from '../types/express.d';
import * as service from '../services/main.service';

export const register: RequestHandler = (req: Request, res: Response) => service.register(req, res);
export const login: RequestHandler = (req: Request, res: Response) => service.login(req, res);
export const addGrocery: RequestHandler = (req: AuthRequest, res: Response) => service.addGrocery(req, res);
export const updateGrocery: RequestHandler = (req: AuthRequest, res: Response) => service.updateGrocery(req, res);
export const deleteGrocery: RequestHandler = (req: AuthRequest, res: Response) => service.deleteGrocery(req, res);
export const listGroceries: RequestHandler = (req: Request, res: Response) => service.listGroceries(req, res);
export const updateInventory: RequestHandler = (req: AuthRequest, res: Response) => service.updateInventory(req, res);
export const placeOrder: RequestHandler = (req: AuthRequest, res: Response) => service.placeOrder(req, res);
