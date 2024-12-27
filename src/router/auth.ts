import express, { Request, Response } from "express";
const Router = express.Router();
import { AuthController } from "../controller";

// [login]
Router.post("/login", AuthController.login as any);

// [register]
Router.post("/register", AuthController.register as any);

export default Router;
