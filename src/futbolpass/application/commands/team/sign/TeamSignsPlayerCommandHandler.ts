import { IRequestHandler, requestHandler } from "mediatr-ts";
import { TeamSignsPlayerCommand } from "./TeamSignsPlayerCommand";
import { ErrorOr } from "../../../../../shared/domain/errors/ErrorOr";
import { TeamResponse } from "../TeamResponse";
import { inject, injectable } from "inversify";
import { constants } from "../../../../../app/constants";
import { TeamRepository } from "../../../../domain/team/TeamRepository";
import { TeamId } from "../../../../domain/team/TeamId";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { PlayerRepository } from "../../../../domain/player/PlayerRepository";
import { PlayerId } from "../../../../domain/player/PlayerId";

@requestHandler(TeamSignsPlayerCommand)
@injectable()
export class TeamSignsPlayerCommandHandler
  implements IRequestHandler<TeamSignsPlayerCommand, ErrorOr<TeamResponse>>
{
  constructor(
    @inject(constants.TeamRepository)
    readonly teamRepository: TeamRepository,
    @inject(constants.PlayerRepository)
    readonly playerRepository: PlayerRepository
  ) {}

  async handle(
    command: TeamSignsPlayerCommand
  ): Promise<ErrorOr<TeamResponse>> {
    const team = await this.teamRepository.findById(new TeamId(command.teamId));

    if (team === null) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "TeamNotFound",
          `The team id <${command.teamId}> does not exists`
        )
      );
    }

    const player = await this.playerRepository.findById(
      new PlayerId(command.playerId)
    );

    if (player === null) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "PayerNotFound",
          `The player id <${command.playerId}> does not exists`
        )
      );
    }

    player.teamDetails.teamId = team.id;
    player.teamDetails.position = command.position;
    player.teamDetails.jerseyNumber = command.jerseyNumber;

    team.addPlayer(player.id);
    await this.playerRepository.addTeamDetails(player.teamDetails);

    return ErrorOr.success(
      new TeamResponse(
        team.id.value,
        team.seasonId.value,
        team.name,
        team.logo,
        team.playerIds.map((id) => id.value)
      )
    );
  }
}
