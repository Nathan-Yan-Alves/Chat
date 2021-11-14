import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./routes";
import { db } from "./db/initMongoose";
import cors from "cors";
import "dotenv/config";

db.dbRun().then(() => console.log("Banco de dados conectado"));

const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(`New connection by ${socket.id}`);
});

app.use(express.json({ limit: "50mb" })).use(router);

httpServer.listen(8080, () => console.log("Server is running"));

export { io };
