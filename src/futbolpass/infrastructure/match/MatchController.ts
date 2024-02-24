import { controller, request, response } from "inversify-express-utils";
import {
  ApiController,
  authenticated,
} from "../../../shared/infrastructure/ApiController";
import { Request, Response } from "express";
import { Mediator } from "mediatr-ts";
import { ErrorOr } from "../../../shared/domain/errors/ErrorOr";
import { GetAllMatchesQuery } from "../../application/queries/match/GetAllMatchesQuery";
import { MatchResponse } from "../../application/MatchResponse";
import { GetMatchByIdQuery } from "../../application/queries/match/GetMatchByIdQuery";
import { CreateMatchCommand } from "../../application/commands/match/CreateMatchCommand";
import { PlayerAssistsCommand } from "../../application/commands/match/PlayerAssistsCommand";

@controller("/match")
export class MatchController extends ApiController {
  constructor(private mediator: Mediator) {
    super();
  }

  @authenticated("get", "/")
  async index(@request() _req: Request, @response() res: Response) {
    const query = new GetAllMatchesQuery();
    const result = await this.mediator.send<ErrorOr<MatchResponse[]>>(query);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      matches: result.getValue(),
    });
  }

  @authenticated("get", "/:id")
  async show(@request() req: Request, @response() res: Response) {
    const { id } = req.params;
    const query = new GetMatchByIdQuery(id);
    const result = await this.mediator.send<ErrorOr<MatchResponse>>(query);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      match: result.getValue(),
    });
  }

  @authenticated("post", "/assists/:id")
  async assists(@request() req: Request, @response() res: Response) {
    const { id } = req.params;
    const { playerId } = req.body;
    const command = new PlayerAssistsCommand(id, playerId);

    const result = await this.mediator.send<ErrorOr<MatchResponse>>(command);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      message: "Assist added",
      match: result.getValue(),
    });
  }

  @authenticated("post", "/")
  async create(@request() req: Request, @response() res: Response) {
    const { seasonId, name, date, homeTeamId, awayTeamId } = req.body;
    const command = new CreateMatchCommand(
      seasonId,
      homeTeamId,
      awayTeamId,
      name,
      date
    );

    const result = await this.mediator.send<ErrorOr<MatchResponse>>(command);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      message: "Match created",
      match: result.getValue(),
    });
  }
}
