import { controller, request, response } from "inversify-express-utils";
import {
  ApiController,
  authenticated,
} from "../../../shared/infrastructure/ApiController";
import { Request, Response } from "express";
import { Mediator } from "mediatr-ts";
import { ErrorOr } from "../../../shared/domain/errors/ErrorOr";
import { CreateTeamCommand } from "../../application/commands/team/CreateTeamCommand";
import { TeamResponse } from "../../application/commands/team/TeamResponse";
import { GetTeamByIdQuery } from "../../application/queries/team/GetTeamByIdQuery";
import { TeamSignsPlayerCommand } from "../../application/commands/team/sign/TeamSignsPlayerCommand";

@controller("/team")
export class TeamController extends ApiController {
  constructor(private mediator: Mediator) {
    super();
  }

  @authenticated("post", "/")
  async create(@request() req: Request, @response() res: Response) {
    const { seasonId, name, logo } = req.body;
    const command = new CreateTeamCommand(seasonId, name, logo);

    const result = await this.mediator.send<ErrorOr<TeamResponse>>(command);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      message: "Team created",
      team: result.getValue(),
    });
  }

  @authenticated("get", "/:id")
  async show(@request() req: Request, @response() res: Response) {
    const { id } = req.params;
    const query = new GetTeamByIdQuery(id);
    const result = await this.mediator.send<ErrorOr<TeamResponse[]>>(query);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return this.json({
      teams: result.getValue(),
    });
  }

  @authenticated("post", "/sign/:id")
  async sign(@request() req: Request, @response() res: Response) {
    const { id } = req.params;
    const { playerId, position, jerseyNumber } = req.body;

    const command = new TeamSignsPlayerCommand(
      id,
      playerId,
      position,
      jerseyNumber
    );
    const result = await this.mediator.send<ErrorOr<TeamResponse>>(command);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      message: "Team signed player succesfully",
      team: result.getValue(),
    });
  }
}
