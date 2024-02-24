import { IRequestHandler, requestHandler } from "mediatr-ts";
import { CreateMatchCommand } from "./CreateMatchCommand";
import { inject, injectable } from "inversify";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { AttendanceResponse, MatchResponse } from "../../MatchResponse";
import { constants } from "../../../../app/constants";
import { MatchRepository } from "../../../domain/match/MatchRepository";
import { Match } from "../../../domain/match/Match";
import { TeamRepository } from "../../../domain/team/TeamRepository";
import { TeamId } from "../../../domain/team/TeamId";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

@requestHandler(CreateMatchCommand)
@injectable()
export class CreateMatchCommandHandler
  implements IRequestHandler<CreateMatchCommand, ErrorOr<MatchResponse>>
{
  constructor(
    @inject(constants.MatchRepository)
    readonly matchRepository: MatchRepository,
    @inject(constants.TeamRepository)
    readonly teamRepository: TeamRepository
  ) {}

  async handle(command: CreateMatchCommand): Promise<ErrorOr<MatchResponse>> {
    const homeTeam = await this.teamRepository.findById(
      new TeamId(command.homeTeamId)
    );
    const awayTeam = await this.teamRepository.findById(
      new TeamId(command.awayTeamId)
    );

    if (!homeTeam || !awayTeam) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "TeamNotFound",
          "The home or away team with the provided id does not exists"
        )
      );
    }

    const playerIds = [...homeTeam.playerIds, ...awayTeam.playerIds];

    const match = Match.create(
      command.seasonId,
      homeTeam.id.value,
      awayTeam.id.value,
      command.name,
      command.date,
      playerIds
    );

    await this.matchRepository.add(match);

    return ErrorOr.success(
      new MatchResponse(
        match.id.value,
        match.seasonId.value,
        match.homeTeamId.value,
        match.awayTeamId.value,
        match.name,
        match.date,
        match.homeScore,
        match.awayScore,
        match.attendanceList.map(
          (a) => new AttendanceResponse(a.playerId.value, a.assists)
        )
      )
    );
  }
}
