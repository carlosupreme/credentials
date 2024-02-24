import { IRequestHandler, requestHandler } from "mediatr-ts";
import { GetTeamByIdQuery } from "./GetTeamByIdQuery";
import { inject, injectable } from "inversify";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { constants } from "../../../../app/constants";
import { DomainError } from "../../../../shared/domain/errors/DomainError";
import { TeamResponse } from "../../commands/team/TeamResponse";
import { TeamId } from "../../../domain/team/TeamId";
import { TeamRepository } from "../../../domain/team/TeamRepository";

@requestHandler(GetTeamByIdQuery)
@injectable()
export class GetTeamByIdQueryHandler
  implements IRequestHandler<GetTeamByIdQuery, ErrorOr<TeamResponse>>
{
  constructor(
    @inject(constants.TeamRepository)
    readonly teamRepository: TeamRepository
  ) {}

  async handle(query: GetTeamByIdQuery): Promise<ErrorOr<TeamResponse>> {
    const team = await this.teamRepository.findById(new TeamId(query.id));

    if (team === null) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "TeamNotFound",
          `The team id <${query.id}> does not exists`
        )
      );
    }

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
