import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middleWares/globalErrorHandler";
import notFound from "./app/middleWares/notFound";
import { AppointmentService } from "./app/modules/appointment/appointment.service";
import cron from "node-cron";
import { errorlogger } from "./app/services/logger";

const app: Application = express();

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded used in sslCommerz

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/api/v1", router);

cron.schedule("*/10 * * * *", async (): Promise<void> => {
    try {
        await AppointmentService.cleanUnpaidAppointments();
    } catch (error) {
        errorlogger.error(error);
    }
});

app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("server is running");
});

app.use(notFound);

export default app;
