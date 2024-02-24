import { IRequestHandler, requestHandler } from "mediatr-ts";
import { CreateMatchCommand } from "./CreateMatchCommand";
import { inject, injectable } from "inversify";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { MatchResponse } from "../../MatchResponse";
import { constants } from "../../../../app/constants";
import { MatchRepository } from "../../../domain/match/MatchRepository";
import { Match } from "../../../domain/match/Match";

@requestHandler(CreateMatchCommand)
@injectable()
export class CreateMatchCommandHandler
  implements IRequestHandler<CreateMatchCommand, ErrorOr<MatchResponse>>
{
  constructor(
    @inject(constants.MatchRepository)
    readonly matchRepository: MatchRepository
  ) {}

  async handle(command: CreateMatchCommand): Promise<ErrorOr<MatchResponse>> {
    const match = Match.create(
      command.seasonId,
      command.homeTeamId,
      command.awayTeamId,
      command.name,
      command.date
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
        match.awayScore
      )
    );
  }
}
