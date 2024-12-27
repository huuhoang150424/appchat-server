"use-strict"

import { Request, Response, NextFunction } from "express";
import {  ConversationSchema, UserSchema, MessageSchema } from '../model';
import { NotFoundError, UnauthorizedError, TokenError } from '../helper';
import { Server } from "socket.io";
import { getReceiverSocketId, io } from "../../src";

class ConversationController {
  //[create conversation]
  static async createConversation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { senderId, receiverId } = req.body;
      if (!senderId || !receiverId) {
        throw new UnauthorizedError("Sender and receiver IDs are required.", 400);
      }
      const participants = [senderId, receiverId].sort();
      const existingConversation = await ConversationSchema.findOne({ participants });
      if (existingConversation) {
        throw new UnauthorizedError("Cuộc hội thoại này đã tồn tại.", 400);
      }
      const conversation = new ConversationSchema({
        participants,  
      });
      await conversation.save();  
      return res.status(201).json({ message: "Cuộc hội thoại được tạo thành công", conversation });
    } catch (error) {
      next(error);  
    }
  }
  //[getConversation]
  static async getConversation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { userId } = req.params;
      const allConversation = await ConversationSchema.find({
        participants: userId
      }).populate('participants','avatar username');
      return res.status(200).json({
        message: 'success',
        allConversation
      });
    } catch (error) {
      next(error);
    }
  }
  //[findUser]
  static async findUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { keyword } = req.query;
      console.log(keyword)
      if (!keyword) {
        throw new NotFoundError('Vui lòng cung cấp từ khóa để tìm kiếm.',404);
      }
      const allUser = await UserSchema.find({
        username: { $regex: keyword, $options: 'i' } 
      });
  
      return res.status(200).json({
        message: 'success',
        allUser
      });
    } catch (error) {
      next(error);
    }
  }

  //[getMessage]
  static async getMessage(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { conversationId } = req.params;
      const allMessage = await MessageSchema.find({ conversationId: conversationId }).populate("senderId","avatar username");
      const conversation = await ConversationSchema.findById(conversationId)
    
      if (!conversation) {
        throw new NotFoundError('Cuộc hội thoại không tồn tại.',404);
      }
      return res.status(200).json({
        message: 'Success',
        allMessage
      });
    } catch (error) {
      next(error);
    }
  }

  //[send Message]
  static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { conversationId } = req.params;
      const { receiverId, content, senderId } = req.body;
      if (!conversationId || !content || !senderId) {
        throw new UnauthorizedError('Conversation ID, nội dung tin nhắn, và senderId là bắt buộc', 400);
      }
  
      const conversation = await ConversationSchema.findById(conversationId);
      if (!conversation || !conversation.participants.includes(senderId)) {
        throw new UnauthorizedError('Người gửi không phải là thành viên trong cuộc hội thoại này', 400);
      }
  
      const newMessage = new MessageSchema({
        conversationId,
        content,
        messageType: 'text',
        senderId,
      });
      await newMessage.save();
      const populatedMessage = await MessageSchema.findById(newMessage._id)
        .populate('senderId', 'username avatar'); 
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', populatedMessage);
      }
  
      return res.status(201).json({ message: 'Tin nhắn đã được gửi và lưu thành công.' });
    } catch (error) {
      next(error);
    }
  }
  
  
}

export default ConversationController;
