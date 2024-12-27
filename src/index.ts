import express, { Request, Response,NextFunction } from "express";
import { Server } from "socket.io";
import { createServer } from 'node:http';


import cors from 'cors';
import body_parser from 'body-parser';
import morgan from 'morgan';
import connect from "./config/database";
import route from './router';
import { errorMiddleware } from "./middleware";


const app = express();
const server = createServer(app);
export const io = new Server(server,{cors: {origin: '*'}});
const PORT = 3000;
connect();


app.use(express.json());


app.use(
  cors({
    origin: (origin, callback) => {
      if (origin) {
        callback(null, origin); // Cho phép tất cả các URL
      } else {
        callback(null, '*'); // Cho phép các request không có origin (ví dụ: Postman)
      }
    },
    credentials: true, // Cho phép gửi cookie/credentials
  })
);


app.use(body_parser.json({ limit: '50mb' }));
app.use(morgan('combined'));


app.get("/", (req: Request, res: Response) => {
  res.send("Hello word");
});

route(app);


//socket
const userSocketMap: any = {}; // { userId: socketId }

export function getReceiverSocketId(userId: any) {
  return userSocketMap[userId];
}
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  const userId: any = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log('User socket map updated:', userSocketMap);
  }
  socket.on('joinConversation', (conversationId) => {
    console.log('A user joined the conversation:', conversationId);
    socket.join(conversationId); 
  });
  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    console.log('Updated userSocketMap:', userSocketMap);
  });
  
});



app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(err, req, res, next);
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
