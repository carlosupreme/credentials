import { IRequestHandler, requestHandler } from "mediatr-ts";
import { GetAllPlayersQuery } from "./GetAllPlayersQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { inject, injectable } from "inversify";
import { constants } from "../../../../app/constants";
import {
  PlayerResponse,
  PlayerTeamDetailsResponse,
} from "../../commands/player/CreatePlayerResponse";
import { PlayerRepository } from "../../../domain/player/PlayerRepository";

@requestHandler(GetAllPlayersQuery)
@injectable()
export class GetAllPlayersQueryHandler
  implements IRequestHandler<GetAllPlayersQuery, ErrorOr<PlayerResponse[]>>
{
  constructor(
    @inject(constants.PlayerRepository)
    readonly playerRepository: PlayerRepository
  ) {}

  async handle(_query: GetAllPlayersQuery): Promise<ErrorOr<PlayerResponse[]>> {
    const players = await this.playerRepository.all();
    const playerResponse: PlayerResponse[] = [];

    for (const player of players) {
      playerResponse.push(
        new PlayerResponse(
          player.id.value,
          new PlayerTeamDetailsResponse(
            player.teamDetails.id.value,
            player.teamDetails.teamId ? player.teamDetails.teamId.value : null,
            player.teamDetails.position,
            player.teamDetails.jerseyNumber
          ),
          player.fullName,
          player.age,
          player.photo
        )
      );
    }

    return ErrorOr.success(playerResponse);
  }
}
