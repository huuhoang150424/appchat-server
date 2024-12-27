import express, { Request, Response } from "express";
const Router = express.Router();
import { UserController } from "../controller";

// [create conversation]
Router.get("/allUser", UserController.getAllUser as any);

export default Router;
