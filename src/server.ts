// import { Server } from "http";
// import app, { httpServer } from "./app";

// import config from "./app/config";

// import { errorconsole, console } from "./app/services/console";

// async function main() {
//   const server: Server = httpServer.listen(config.port, () => {
//     console.info(`Server running on port ${config.port}`);
//   });

//   const exitHandler = () => {
//     if (server) {
//       server.close(() => {
//         console.info("Server closed");
//       });
//     }
//     process.exit(1);
//   };

//   const unexpectedErrorHandler = (error: unknown) => {
//     errorconsole.error(error);
//     exitHandler();
//   };

//   process.on("uncaughtException", unexpectedErrorHandler);
//   process.on("unhandledRejection", unexpectedErrorHandler);

//   // process.on('SIGTERM', () => {
//   //   console.info('SIGTERM received');
//   //   if (server) {
//   //     server.close();
//   //   }
//   // });
// }

// main();

import { httpServer } from "./app";
import config from "./app/config";


async function bootstrap() {
    try {
        httpServer.listen(config.port, () => {
            console.info(`Server running on port ${config.port}`);
        });

        const exitHandler = () => {
            httpServer.close(() => {
                console.info("Server closed");
                process.exit(1);
            });
        };

        const unexpectedErrorHandler = (error: unknown) => {
            console.error(error);
            exitHandler();
        };

        process.on("uncaughtException", unexpectedErrorHandler);
        process.on("unhandledRejection", unexpectedErrorHandler);
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

bootstrap();
