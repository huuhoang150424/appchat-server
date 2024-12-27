import { Express } from 'express';
import authRouter from "./auth";
import conversationRouter from "./conversation";
import userRouter from "./user";

const route=(app:Express)=>{
  app.use("/auth",authRouter)
  app.use("/conversation",conversationRouter)
  app.use("/user",userRouter)
}

export default route;