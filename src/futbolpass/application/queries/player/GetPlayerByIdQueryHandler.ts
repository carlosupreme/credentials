import { IRequestHandler, requestHandler } from "mediatr-ts";
import { GetPlayerByIdQuery } from "./GetPlayerByIdQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import {
  PlayerResponse,
  PlayerTeamDetailsResponse,
} from "../../commands/player/CreatePlayerResponse";
import { inject, injectable } from "inversify";
import { PlayerRepository } from "../../../domain/player/PlayerRepository";
import { constants } from "../../../../app/constants";
import { PlayerId } from "../../../domain/player/PlayerId";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

@requestHandler(GetPlayerByIdQuery)
@injectable()
export class GetPlayerByIdQueryHanler
  implements IRequestHandler<GetPlayerByIdQuery, ErrorOr<PlayerResponse>>
{
  constructor(
    @inject(constants.PlayerRepository)
    readonly playerRepository: PlayerRepository
  ) {}

  async handle(query: GetPlayerByIdQuery): Promise<ErrorOr<PlayerResponse>> {
    const player = await this.playerRepository.findById(new PlayerId(query.id));

    if (!player) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "PlayerNotFound",
          "The player with the provided id does not exists"
        )
      );
    }

    return ErrorOr.success(
      new PlayerResponse(
        player.id.value,
        player.userId.value,
        new PlayerTeamDetailsResponse(
          player.teamDetails.id.value,
          player.teamDetails.teamId && player.teamDetails.teamId.value,
          player.teamDetails.position,
          player.teamDetails.jerseyNumber
        ),
        player.fullName,
        player.age,
        player.photo
      )
    );
  }
}
