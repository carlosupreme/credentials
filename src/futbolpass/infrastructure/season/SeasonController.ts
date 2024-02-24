import { controller, request, response } from "inversify-express-utils";
import {
  ApiController,
  authenticated,
} from "../../../shared/infrastructure/ApiController";
import { Request, Response } from "express";
import { Mediator } from "mediatr-ts";
import { ErrorOr } from "../../../shared/domain/errors/ErrorOr";
import { SeasonResponse } from "../../application/SeasonResponse";
import { CreateSeasonCommand } from "../../application/commands/season/CreateSeasonCommand";
import { GetAllSeasonsQuery } from "../../application/queries/season/GetAllSeasonsQuery";
import { GetSeasonByIdQuery } from "../../application/queries/season/GetSeasonByIdQuery";

@controller("/season")
export class SeasonController extends ApiController {
  constructor(private mediator: Mediator) {
    super();
  }

  @authenticated("post", "/")
  async create(@request() req: Request, @response() res: Response) {
    const { name, startDate, endDate } = req.body;
    const command = new CreateSeasonCommand(name, startDate, endDate);

    const result = await this.mediator.send<ErrorOr<SeasonResponse>>(command);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return this.json({
      message: "Season created",
      season: result.getValue(),
    });
  }

  @authenticated("get", "/")
  async index(@request() _req: Request, @response() res: Response) {
    const query = new GetAllSeasonsQuery();
    const result = await this.mediator.send<ErrorOr<SeasonResponse[]>>(query);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return this.json({
      seasons: result.getValue(),
    });
  }

  @authenticated("get", "/:id")
  async show(@request() req: Request, @response() res: Response) {
    const { id } = req.params;
    const query = new GetSeasonByIdQuery(id);
    const result = await this.mediator.send<ErrorOr<SeasonResponse[]>>(query);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return this.json({
      seasons: result.getValue(),
    });
  }
}
