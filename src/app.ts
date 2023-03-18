import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middleWares/globalErrorHandler";
import notFound from "./app/middleWares/notFound";
import { AppointmentService } from "./app/modules/appointment/appointment.service";
import cron from "node-cron";

import { ScheduleService } from "./app/modules/schedule/schedule.service";
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "./app/services/prisma.service";
import { configureSocket } from "./sockets/socket";

const app: Application = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
    })
);

export const httpServer = createServer(app);

// export const io = new Server(httpServer, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     },
// });
export const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_BASE_URL,
        methods: ["GET", "POST"],
    },
});
configureSocket();

// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Join a room based on user ID
//     socket.on("join_room", (userId) => {
//         socket.join(userId);
//         console.log(`User ${userId} joined room`);
//     });

//     // Handle incoming messages
//     socket.on("send_message", async (data) => {
//         const { senderId, receiverId, message } = data;

//         // Save message to the database
//         await prisma.chatMessage.create({
//             data: {
//                 senderId,
//                 receiverId,
//                 message,
//             },
//         });

//         // Emit the message to the receiver's room
//         io.to(receiverId).emit("receive_message", data);
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded used in sslCommerz

app.use("/api/v1", router);

cron.schedule("*/10 * * * *", async (): Promise<void> => {
    try {
        await AppointmentService.cleanUnpaidAppointments();
        await ScheduleService.cleanUpSchedules();
    } catch (error) {
        console.error(error);
    }
});

app.use(notFound);

app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("server is running");
});

export default app;
