import "reflect-metadata";
import "./loader";
import cors from "cors";
import express from "express";
import { server } from "./server";
import createHttpError, { HttpError } from "http-errors";
import helmet from "helmet";
import morgan from "morgan";

server
  .setConfig((app: express.Application) => {
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  })
  .setErrorConfig((_app) => {
    // catch 404 and forward to error handler
    _app.use(
      (
        _req: express.Request,
        _res: express.Response,
        next: express.NextFunction
      ) => {
        next(createHttpError(404));
      }
    );

    // production error handler
    // no stacktraces leaked to user
    _app.use(
      (
        err: HttpError,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ): void => {
        res.status(err.status || 500);
        res.json({
          error: {},
          message: err.message,
        });
      }
    );
  });

const app = server.build();
const port = parseInt(process.env.PORT!) || 3000;

app.listen(port, "0.0.0.0", function () {
  console.log(`Server running on port ${port}`);
});
