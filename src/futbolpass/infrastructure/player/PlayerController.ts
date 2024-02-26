import { controller, request, response } from "inversify-express-utils";
import {
  ApiController,
  authenticated,
} from "../../../shared/infrastructure/ApiController";
import { Request, Response } from "express";
import { CreatePlayerCommand } from "../../application/commands/player/CreatePlayerCommand";
import { Mediator } from "mediatr-ts";
import { ErrorOr } from "../../../shared/domain/errors/ErrorOr";
import { PlayerResponse } from "../../application/commands/player/CreatePlayerResponse";
import { GetPlayerByIdQuery } from "../../application/queries/player/GetPlayerByIdQuery";
import { GetAllPlayersQuery } from "../../application/queries/player/GetAllPlayersQuery";

@controller("/player")
export class PlayerController extends ApiController {
  constructor(private mediator: Mediator) {
    super();
  }

  @authenticated("get", "/")
  async index(@request() _req: Request, @response() res: Response) {
    const query = new GetAllPlayersQuery();
    const result = await this.mediator.send<ErrorOr<PlayerResponse[]>>(query);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      players: result.getValue(),
    });
  }

  @authenticated("get", "/:id")
  async show(@request() req: Request, @response() res: Response) {
    const { id } = req.params;
    console.log(id);

    const query = new GetPlayerByIdQuery(id);
    console.log({ query });

    const result = await this.mediator.send<ErrorOr<PlayerResponse>>(query);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      player: result.getValue(),
    });
  }

  @authenticated("post", "/")
  async create(@request() req: Request, @response() res: Response) {
    const { fullName, age, photo, teamId, position, jerseyNumber } = req.body;
    const command = new CreatePlayerCommand(
      fullName,
      age,
      photo,
      teamId,
      position,
      jerseyNumber
    );

    const result = await this.mediator.send<ErrorOr<PlayerResponse>>(command);

    if (result.isError()) {
      return this.problem(result.errors!, res);
    }

    return res.json({
      message: "Player created",
      player: result.getValue(),
    });
  }
}
