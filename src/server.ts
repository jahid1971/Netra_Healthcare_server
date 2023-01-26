import { Server } from "http";
import app from "./app";

import config from "./app/config";

import { errorlogger, logger } from "./app/services/logger";

async function main() {
    const server: Server = app.listen(config.port, () => {
        logger.info(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {
        if (server) {
            server.close(() => {
                logger.info("Server closed");
            });
        }
        process.exit(1);
    };

    const unexpectedErrorHandler = (error: unknown) => {
        errorlogger.error(error);
        exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    // process.on('SIGTERM', () => {
    //   logger.info('SIGTERM received');
    //   if (server) {
    //     server.close();
    //   }
    // });
}

main();
