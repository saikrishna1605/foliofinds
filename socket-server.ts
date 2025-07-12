/**
 * Socket.io server - DISABLED
 * 
 * This file contains the Socket.io server implementation for real-time chat functionality.
 * Currently disabled as per project requirements.
 */

import { ObjectId } from 'mongodb';
import clientPromise from './src/lib/mongodb';

/**
 * Gets the MongoDB database instance
 * @returns MongoDB database connection
 */
async function getDb() {
    const client = await clientPromise;
    return client.db("Folio");
}

export { getDb };

/**
 * Socket.io functionality is currently disabled
 * The commented code below shows the original implementation for reference
 */

/*
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Interface for chat messages
interface ChatMessage {
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Date;
  read: boolean;
  id?: string;
}

const app = express();
const NEXT_JS_CLIENT_URL = 'http://localhost:9002';
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: NEXT_JS_CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

const PORT = process.env.SOCKET_PORT || 3001;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinChat', async (chatId, userId) => {
    socket.join(chatId);
    // Handle marking messages as read
  });

  socket.on('sendMessage', async (data, callback) => {
    // Handle saving and sending messages
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
*/

//   socket.on('joinChat', async (chatId: string, userId: string) => {
//     if (!chatId || !userId) return;
    
//     socket.join(chatId);
//     console.log(`User ${userId} (${socket.id}) joined chat ${chatId}`);

//     try {
//         const db = await getDb();
//         await db.collection('messages').updateMany(
//             { chatId, senderId: { $ne: userId }, read: false },
//             { $set: { read: true } }
//         );
//         await db.collection('chats').updateOne(
//             { _id: new ObjectId(chatId) },
//             { $set: { [`unreadCounts.${userId}`]: 0 } }
//         );
//         // Notify the sender's client that the messages have been read by this user
//         io.to(chatId).emit('messagesRead', { chatId, readerId: userId });

//     } catch(error) {
//         console.error(`Error marking messages as read for user ${userId} in chat ${chatId}:`, error);
//     }
//   });

//   socket.on('sendMessage', async (data: { chatId: string, senderId: string, receiverId: string, text: string }, callback) => {
//     const { chatId, senderId, text, receiverId } = data;

//     if (!senderId || !receiverId || !ObjectId.isValid(chatId)) {
//         console.error('Invalid sendMessage data:', data);
//         if (callback) callback({ error: 'Invalid data provided.' });
//         return;
//     }
    
//     try {
//         const db = await getDb();
        
//         const newMessage: ChatMessage = {
//             chatId,
//             senderId,
//             receiverId,
//             text,
//             createdAt: new Date(),
//             read: false,
//         };

//         const result = await db.collection('messages').insertOne(newMessage);
//         const savedMessage = { ...newMessage, id: result.insertedId.toString() };

//         await db.collection('chats').updateOne(
//             { _id: new ObjectId(chatId) },
//             { 
//                 $set: { 
//                     lastMessage: savedMessage,
//                     updatedAt: new Date()
//                 },
//                 $inc: { [`unreadCounts.${receiverId}`]: 1 }
//             }
//         );
        
//         io.to(chatId).emit('receiveMessage', savedMessage);
        
//         // Acknowledge the message was sent and saved, returning the final message object
//         if (callback) callback(savedMessage);

//     } catch (error) {
//         console.error("Error sending message:", error);
//         if (callback) callback({ error: 'Failed to save message to the database.' });
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Socket.IO server running on port ${PORT}`);
// });
