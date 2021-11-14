import { Router } from "express";
import { MessageHandler } from "./controllers/messageHandler";
import { UserHandler } from "./controllers/userHandler";

const router = Router();

router
    .post("/users/new", new UserHandler().createUser)
    .get("/users/token", new UserHandler().authenticateToken)
    .post("/messages/new", new MessageHandler().createMessage)
    .get("/messages/all", new MessageHandler().showAllMessages);

export default router;
