import { IRequestHandler, requestHandler } from "mediatr-ts";
import { UpdatePlayerCommand } from "./UpdatePlayerCommand";
import { inject, injectable } from "inversify";
import { ErrorOr } from "../../../../../shared/domain/errors/ErrorOr";
import { PlayerResponse, PlayerTeamDetailsResponse } from "../CreatePlayerResponse";
import { constants } from "../../../../../app/constants";
import { PlayerRepository } from "../../../../domain/player/PlayerRepository";
import { PlayerId } from "../../../../domain/player/PlayerId";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";

@requestHandler(UpdatePlayerCommand)
@injectable()
export class UpdatePlayerCommandHandler
  implements IRequestHandler<UpdatePlayerCommand, ErrorOr<PlayerResponse>>
{
  constructor(
    @inject(constants.PlayerRepository)
    private playerRepository: PlayerRepository
  ) { }

  async handle(command: UpdatePlayerCommand): Promise<ErrorOr<PlayerResponse>> {
    const id = new PlayerId(command.id);
    const player = await this.playerRepository.findById(id);

    if (!player) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "PlayerNotFound",
          "The player with the provided id does not exists"
        )
      );
    }

    player.update({
      fullName: command.fullName,
      age: command.age,
      photo: command.photo!
    })

    player.teamDetails.update({
      position: command.position,
      jerseyNumber: command.jerseyNumber
    });

    await this.playerRepository.update(id, player);

    return ErrorOr.success(
      new PlayerResponse(
        player.id.value,
        new PlayerTeamDetailsResponse(
          player.teamDetails.id.value,
          player.teamDetails.teamId.value,
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
