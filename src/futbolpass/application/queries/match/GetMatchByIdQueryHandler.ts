import { IRequestHandler, requestHandler } from "mediatr-ts";
import { GetMatchByIdQuery } from "./GetMatchByIdQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { inject, injectable } from "inversify";
import { constants } from "../../../../app/constants";
import { DomainError } from "../../../../shared/domain/errors/DomainError";
import { MatchResponse } from "../../MatchResponse";
import { MatchRepository } from "../../../domain/match/MatchRepository";
import { MatchId } from "../../../domain/match/MatchId";

@requestHandler(GetMatchByIdQuery)
@injectable()
export class GetMatchByIdQueryHandler
  implements IRequestHandler<GetMatchByIdQuery, ErrorOr<MatchResponse>>
{
  constructor(
    @inject(constants.MatchRepository)
    readonly matchRepository: MatchRepository
  ) {}

  async handle(query: GetMatchByIdQuery): Promise<ErrorOr<MatchResponse>> {
    const match = await this.matchRepository.findById(new MatchId(query.id));

    if (!match) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "MatchNotFound",
          "The match with the provided id does not exists"
        )
      );
    }

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
