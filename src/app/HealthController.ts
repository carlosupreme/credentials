import { Request, Response } from "express";
import {
  controller,
  httpGet,
  request,
  response,
} from "inversify-express-utils";

@controller("/health")
export class HealthController {
  @httpGet("/")
  public get(@request() _req: Request, @response() res: Response) {
    return res.json({
      message: "OK",
      uptime: process.uptime(),
      date: new Date(Date.now()),
    });
  }
}
