import { IRequestHandler, requestHandler } from "mediatr-ts";
import { inject, injectable } from "inversify";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { AttendanceResponse, MatchResponse } from "../../MatchResponse";
import { constants } from "../../../../app/constants";
import { MatchRepository } from "../../../domain/match/MatchRepository";
import { MatchId } from "../../../domain/match/MatchId";
import { PlayerAssistsCommand } from "./PlayerAssistsCommand";
import { DomainError } from "../../../../shared/domain/errors/DomainError";
import { PlayerId } from "../../../domain/player/PlayerId";

@requestHandler(PlayerAssistsCommand)
@injectable()
export class PlayerAssistsCommandHandler
  implements IRequestHandler<PlayerAssistsCommand, ErrorOr<MatchResponse>>
{
  constructor(
    @inject(constants.MatchRepository)
    readonly matchRepository: MatchRepository
  ) {}

  async handle(command: PlayerAssistsCommand): Promise<ErrorOr<MatchResponse>> {
    const match = await this.matchRepository.findById(
      new MatchId(command.matchId)
    );

    if (!match) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "MatchNotFound",
          "The match with the provided id does not exists"
        )
      );
    }

    const playerId = new PlayerId(command.playerId);
    match.playerAssists(playerId);
    await this.matchRepository.addPlayerAttendance(match.id, playerId);

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
