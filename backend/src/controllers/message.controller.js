import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json({ filteredUsers });
    } catch (error) {
        console.log("Error in getting Contacts: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessageByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const message = await Message.find({
            $or: [
                {
                    senderId: myId,
                    receiverId: userToChatId
                },
                {
                    senderId: userToChatId,
                    receiverId: myId
                }
            ]
        })
        return res.status(200).json(message);
    } catch (error) {
        console.log("Error in getting Messages: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imgUrl;
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image);
            imgUrl = uploadRes.secure_url;
        }

        const newMsg = new Message({
            senderId,
            receiverId,
            text,
            image: imgUrl
        })
        await newMsg.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMsg);
        }

        return res.status(200).json(newMsg)
    } catch (error) {
        console.log("Error in sending Messages: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { receiverId: loggedInUserId },
                { senderId: loggedInUserId }
            ]
        })

        const chatPartnersIds = [...new Set(messages.map(msg => msg.senderId.toString() == loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))];

        const chatPartners = await User.find({ _id: { $in: chatPartnersIds } }).select("-password");

        return res.status(200).json(chatPartners)


    } catch (error) {
        console.log("Error in getting chat Partners: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}