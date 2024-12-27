"use-strict"

import { Request, Response, NextFunction } from "express";
import {  ConversationSchema, UserSchema } from '../model';
import { NotFoundError, UnauthorizedError, TokenError } from '../helper';

class UserController {


  //[getAllUser]
  static async getAllUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const users = await UserSchema.find();
      return res.status(200).json({ message: "Danh sách người dùng", users });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
