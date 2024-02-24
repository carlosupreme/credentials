import { IRequestHandler, requestHandler } from "mediatr-ts";
import { GetAllMatchesQuery } from "./GetAllMatchesQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { inject, injectable } from "inversify";
import { constants } from "../../../../app/constants";
import { MatchResponse } from "../../MatchResponse";
import { MatchRepository } from "../../../domain/match/MatchRepository";

@requestHandler(GetAllMatchesQuery)
@injectable()
export class GetAllMatchesQueryHandler
  implements IRequestHandler<GetAllMatchesQuery, ErrorOr<MatchResponse[]>>
{
  constructor(
    @inject(constants.MatchRepository)
    readonly matchRepository: MatchRepository
  ) {}

  async handle(_query: GetAllMatchesQuery): Promise<ErrorOr<MatchResponse[]>> {
    const matches = await this.matchRepository.all();
    const matchesResponse: MatchResponse[] = [];

    for (const match of matches) {
      matchesResponse.push(
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

    return ErrorOr.success(matchesResponse);
  }
}
