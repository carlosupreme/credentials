import { IRequestHandler, requestHandler } from "mediatr-ts";
import { CreatePlayerCommand } from "./CreatePlayerCommand";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import {
  PlayerResponse,
  PlayerTeamDetailsResponse,
} from "./CreatePlayerResponse";
import { inject, injectable } from "inversify";
import { DefaultPhotoProvider } from "../../../domain/player/DefaultPhotoProvider";
import { constants } from "../../../../app/constants";
import { Player } from "../../../domain/player/Player";
import { PlayerRepository } from "../../../domain/player/PlayerRepository";
import { PlayerTeamDetails } from "../../../domain/player/PlayerTeamDetails";

@requestHandler(CreatePlayerCommand)
@injectable()
export class CreatePlayerCommandHandler
  implements IRequestHandler<CreatePlayerCommand, ErrorOr<PlayerResponse>>
{
  constructor(
    @inject(constants.PlayerRepository)
    private playerRepository: PlayerRepository,
    @inject(constants.DefaultPhotoProvider)
    private defaultPhotoProvider: DefaultPhotoProvider
  ) {}

  async handle(command: CreatePlayerCommand): Promise<ErrorOr<PlayerResponse>> {
    const photo =
      command.photo ||
      (await this.defaultPhotoProvider.getPhotoUrlByName(command.fullName));

    const player = Player.create(
      command.fullName,
      command.age,
      photo,
      PlayerTeamDetails.create(
        command.teamId,
        command.position,
        command.jerseyNumber
      )
    );

    await this.playerRepository.add(player);

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
