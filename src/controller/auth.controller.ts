"use-strict"

import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import { UserSchema } from '../model';
import generaToken from '../helper/genera-token';
import { NotFoundError, UnauthorizedError, TokenError } from '../helper';

class AuthController {
  //[login]
  static async login(req: Request, res: Response, next: NextFunction) : Promise<Response | void> {
    try {
      const { email, password } = req.body;

      const user = await UserSchema.findOne({ email });
      if (!user) {
        throw new NotFoundError("Người dùng không tồn tại", 404);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedError("Mật khẩu không chính xác", 403);
      }

      const token = await generaToken(user);
      return res.status(200).json({ message: "Đăng nhập thành công", user, token });
    } catch (error) {
      next(error);
    }
  }

  //[register]
  static async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { username, email, password, confirmPassword } = req.body;

      const existsUser = await UserSchema.findOne({ email });
      if (existsUser) {
        throw new UnauthorizedError("Email đã được đăng ký", 403);
      }

      if (password !== confirmPassword) {
        throw new UnauthorizedError("Xác nhận mật khẩu không khớp", 403);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserSchema({
        username,
        email,
        password: hashedPassword,
      });
      await user.save();

      return res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
