import express from "express";
const Router = express.Router();
import { ConversationController } from "../controller";

// [create conversation]
Router.post("/createConversation", ConversationController.createConversation as any);

// [get all conversation]
Router.get("/getConversation/:userId", ConversationController.getConversation as any);

// [get all conversation for message]
Router.get("/getMessage/:conversationId", ConversationController.getMessage as any);

// [send message ]
Router.post("/sendMessage/:conversationId", ConversationController.sendMessage as any);

// [get all conversation for message]
Router.get("/findUser", ConversationController.findUser as any);

export default Router;
