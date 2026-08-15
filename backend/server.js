require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message.model');
const User = require('./models/User.model');
const PrivateMessage = require('./models/PrivateMessage.model');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            callback(null, true);
        },
        credentials: true
    }
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true
}));

// Serve static files (admin avatar, etc.)
app.use('/public', express.static('public'));

// Basic route
app.get('/', (req, res) => {
    res.send('CampusPulse API is running...');
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/private-chat', require('./routes/privateChat.routes'));
app.use('/api/societies', require('./routes/society.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Keep track of connected users { userId: socketId }
const onlineUsers = new Map();

// Socket Auth Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.userId = decoded.id;
        next();
    });
});

io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.id} (User: ${socket.userId})`);
    
    // Add to online users
    onlineUsers.set(socket.userId, socket.id);
    
    // Update user status in DB
    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    io.emit('online_users_update', onlineUsers.size); // Broadcast count
    io.emit('user_status_change', { userId: socket.userId, isOnline: true });

    // Join Global Chat Room
    socket.join('global_chat');

    socket.on('send_global_message', async (data) => {
        try {
            // Save to DB
            const newMsg = await Message.create({
                senderId: socket.userId,
                text: data.text,
                attachment: data.attachment,
                replyToId: data.replyToId
            });

            // Populate sender info before broadcasting
            await newMsg.populate('senderId', 'name anonUsername avatar isOnline');

            const formattedMsg = {
                id: newMsg._id.toString(),
                senderId: newMsg.senderId._id.toString(),
                senderInfo: newMsg.senderId,
                text: newMsg.text,
                attachment: newMsg.attachment,
                replyToId: newMsg.replyToId ? newMsg.replyToId.toString() : null,
                isEdited: newMsg.isEdited,
                timestamp: new Date(newMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reactions: []
            };

            // Broadcast to everyone in global room
            io.to('global_chat').emit('receive_global_message', formattedMsg);
        } catch (error) {
            console.error('Socket error saving message:', error);
        }
    });

    socket.on('edit_global_message', async (data) => {
        try {
            const { messageId, newText } = data;
            const msg = await Message.findOne({ _id: messageId, senderId: socket.userId });
            if (msg) {
                msg.text = newText;
                msg.isEdited = true;
                await msg.save();
                io.to('global_chat').emit('update_global_message', { messageId, newText, isEdited: true });
            }
        } catch (error) {
            console.error('Socket edit error:', error);
        }
    });

    socket.on('delete_global_message', async (messageId) => {
        try {
            const user = await User.findById(socket.userId);
            if (!user) return;
            
            const query = user.role === 'admin' ? { _id: messageId } : { _id: messageId, senderId: socket.userId };
            const msg = await Message.findOneAndDelete(query);
            
            if (msg) {
                io.to('global_chat').emit('message_deleted', messageId);
            }
        } catch (error) {
            console.error('Socket delete error:', error);
        }
    });

    socket.on('react_global_message', async ({ messageId, emoji }) => {
        try {
            const msg = await Message.findById(messageId);
            if (msg) {
                const existingReaction = msg.reactions.find(r => r.userId.toString() === socket.userId);
                if (existingReaction) {
                    existingReaction.emoji = emoji;
                } else {
                    msg.reactions.push({ emoji, userId: socket.userId });
                }
                await msg.save();
                io.to('global_chat').emit('update_reactions', { messageId, reactions: msg.reactions });
            }
        } catch (error) {
            console.error('Socket react error:', error);
        }
    });

    // ==========================================
    // PRIVATE MESSAGING SOCKET EVENTS
    // ==========================================

    socket.on('send_private_message', async (data) => {
        try {
            const { receiverId, text } = data;
            
            // Check if sender is blocked by receiver
            const receiver = await User.findById(receiverId);
            if (receiver && receiver.blockedUsers && receiver.blockedUsers.includes(socket.userId)) {
                return; // Silently drop if blocked
            }

            const msg = await PrivateMessage.create({
                senderId: socket.userId,
                receiverId,
                text
            });

            const formattedMsg = {
                id: msg._id,
                senderId: msg.senderId,
                conversationId: msg.senderId, // from receiver's perspective
                text: msg.text,
                isEdited: msg.isEdited,
                read: msg.read,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            // Send to receiver if online
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_private_message', formattedMsg);
            }

            // Send back to sender
            const senderFormattedMsg = { ...formattedMsg, conversationId: receiverId };
            socket.emit('receive_private_message', senderFormattedMsg);

        } catch (error) {
            console.error('Socket private msg error:', error);
        }
    });

    socket.on('edit_private_message', async (data) => {
        try {
            const { messageId, newText } = data;
            const msg = await PrivateMessage.findOneAndUpdate(
                { _id: messageId, senderId: socket.userId },
                { text: newText, isEdited: true },
                { new: true }
            );

            if (msg) {
                const updatePayload = { messageId, newText, isEdited: true, senderId: msg.senderId, conversationId: msg.receiverId };
                
                // Notify sender
                socket.emit('update_private_message', updatePayload);
                
                // Notify receiver
                const receiverSocketId = onlineUsers.get(msg.receiverId.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('update_private_message', { ...updatePayload, conversationId: msg.senderId });
                }
            }
        } catch (error) {
            console.error('Socket edit private error:', error);
        }
    });

    socket.on('delete_private_message', async (messageId) => {
        try {
            const msg = await PrivateMessage.findOneAndDelete({ _id: messageId, senderId: socket.userId });
            if (msg) {
                // Notify sender
                socket.emit('private_message_deleted', messageId);
                
                // Notify receiver
                const receiverSocketId = onlineUsers.get(msg.receiverId.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('private_message_deleted', messageId);
                }
            }
        } catch (error) {
            console.error('Socket delete private error:', error);
        }
    });

    socket.on('mark_private_read', async (senderIdToMarkRead) => {
        try {
            await PrivateMessage.updateMany(
                { senderId: senderIdToMarkRead, receiverId: socket.userId, read: false },
                { $set: { read: true } }
            );
            
            // Tell the user who sent the messages that they were read
            const senderSocketId = onlineUsers.get(senderIdToMarkRead);
            if (senderSocketId) {
                io.to(senderSocketId).emit('private_messages_read', socket.userId);
            }
        } catch (error) {
            console.error('Socket read private error:', error);
        }
    });

    socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.id}`);
        onlineUsers.delete(socket.userId);
        
        await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: Date.now() });
        io.emit('online_users_update', onlineUsers.size);
        io.emit('user_status_change', { userId: socket.userId, isOnline: false });
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
