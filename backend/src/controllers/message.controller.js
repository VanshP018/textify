import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      delivered: false,
      deliveredAt: null,
      read: false,
      readAt: null,
    });

    await newMessage.save();

    // prepare a JSON-safe message object (stringify ObjectIds)
    const messageObj = newMessage.toObject ? newMessage.toObject() : JSON.parse(JSON.stringify(newMessage));
    if (messageObj._id) messageObj._id = String(messageObj._id);
    if (messageObj.senderId) messageObj.senderId = String(messageObj.senderId);
    if (messageObj.receiverId) messageObj.receiverId = String(messageObj.receiverId);

    // emit to receiver if online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageObj);
      // mark as delivered and notify sender
      newMessage.delivered = true;
      newMessage.deliveredAt = new Date();
      await newMessage.save();
      io.to(senderSocketId).emit("messageStatus", {
        messageId: newMessage._id,
        delivered: true,
        deliveredAt: newMessage.deliveredAt,
        read: false,
        readAt: null,
      });
    }

    // also emit to sender's other connected sockets (if any) so multiple tabs receive the message
    const senderSocketId = getReceiverSocketId(String(senderId));
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", messageObj);
    }

    // return the saved message (with string ids)
    res.status(201).json(messageObj);
  } catch (error) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// mark message as read
export const markMessageRead = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (String(message.receiverId) !== String(userId)) return res.status(403).json({ error: "Forbidden" });
    message.read = true;
    message.readAt = new Date();
    await message.save();
    // notify sender
    const senderSocketId = getReceiverSocketId(String(message.senderId));
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageStatus", {
        messageId: message._id,
        delivered: true,
        deliveredAt: message.deliveredAt,
        read: true,
        readAt: message.readAt,
      });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
