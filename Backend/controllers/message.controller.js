import {Conversation} from "../models/conversation.model.js"
import {Message} from "../models/message.model.js"
export const sendMsg = async (req , res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId , receiverId]}
        });

        // make a conversation

        if (!conversation) {
            conversation = await Conversation.create({
                participants:[senderId , receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
   if (newMessage) conversation.message.push(newMessage._id);
    await Promise.all([conversation.save(),newMessage.save()]);

    return res.status(2001).json({
        success: true,
        newMessage
    })
    } catch (error) {
        console.log(error);
        
    }
}

export const getMessage = async(req , res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.find({
            participants:{$all :[senderId , receiverId]}
        });
        if(!conversation) return res.status(200).json({success:true , message:[]});
        return res.status(200).json({success: true , message:conversation?.message});
    } catch (error) {
        console.log(error);
        
    }
}