import Message from "../models/MessageModel";
import { Request, Response } from "express";
import { io } from "../server";

interface IMessage {
    userId: string;
    avatarUrl?: string;
    text: string;
    createdAt: string;
}

class MessageHandler {
    createMessage(req: Request, res: Response) {
        const { username, avatarUrl, text } = req.body;
        let message = new Message({
            username,
            avatarUrl,
            text,
        });

        message
            .save()
            .then(() => {
                io.emit("new_messages", message);
                res.send(message);
            })
            .catch((err) => res.status(404).send(err));
    }

    async showAllMessages(req: Request, res: Response) {
        let allMessages: IMessage[] = await Message.find();

        res.json(allMessages);
    }
}

export { MessageHandler };
