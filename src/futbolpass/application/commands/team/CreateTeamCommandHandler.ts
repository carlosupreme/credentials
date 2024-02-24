import { IRequestHandler, requestHandler } from "mediatr-ts";
import { CreateTeamCommand } from "./CreateTeamCommand";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { TeamResponse } from "./TeamResponse";
import { inject, injectable } from "inversify";
import { constants } from "../../../../app/constants";
import { DomainError } from "../../../../shared/domain/errors/DomainError";
import { Team } from "../../../domain/team/Team";
import { TeamRepository } from "../../../domain/team/TeamRepository";
import { DefaultPhotoProvider } from "../../../domain/player/DefaultPhotoProvider";

@requestHandler(CreateTeamCommand)
@injectable()
export class CreateTeamCommandHandler
  implements IRequestHandler<CreateTeamCommand, ErrorOr<TeamResponse>>
{
  constructor(
    @inject(constants.TeamRepository)
    private teamRepository: TeamRepository,
    @inject(constants.DefaultPhotoProvider)
    private defaultPhotoProvider: DefaultPhotoProvider
  ) {}

  async handle(command: CreateTeamCommand): Promise<ErrorOr<TeamResponse>> {
    if (await this.teamRepository.findByName(command.name)) {
      return ErrorOr.failure(
        DomainError.Conflict("TeamName", "Team name already exists")
      );
    }

    const logo =
      command.logo ||
      (await this.defaultPhotoProvider.getPhotoUrlByName(command.name));

    const team = Team.create(command.seasonId, command.name, logo);

    await this.teamRepository.add(team);

    return ErrorOr.success(
      new TeamResponse(
        team.id.value,
        team.seasonId.value,
        team.name,
        team.logo,
        team.getPlayerIds()
      )
    );
  }
}
