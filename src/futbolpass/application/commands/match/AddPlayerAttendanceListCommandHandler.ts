import { IRequestHandler, requestHandler } from "mediatr-ts";
import { inject, injectable } from "inversify";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { MatchResponse } from "../../MatchResponse";
import { constants } from "../../../../app/constants";
import { MatchRepository } from "../../../domain/match/MatchRepository";
import { MatchId } from "../../../domain/match/MatchId";
import { AddPlayerAttendanceListCommand } from "./AddPlayerAttendanceListCommand";
import { DomainError } from "../../../../shared/domain/errors/DomainError";
import { PlayerId } from "../../../domain/player/PlayerId";

@requestHandler(AddPlayerAttendanceListCommand)
@injectable()
export class AddPlayerAttendanceListCommandHandler
  implements
    IRequestHandler<
      AddPlayerAttendanceListCommand,
      ErrorOr<MatchResponse>
    >
{
  constructor(
    @inject(constants.MatchRepository)
    readonly matchRepository: MatchRepository
  ) {}

  async handle(
    command: AddPlayerAttendanceListCommand
  ): Promise<ErrorOr<MatchResponse>> {
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

    match.addPlayerAttendance(new PlayerId(command.playerId));
    await this.matchRepository.saveAttendanceList(
      match.id,
      match.attendanceList
    );

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
        match.attendanceList.map((id) => id.value)
      )
    );
  }
}
