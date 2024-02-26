import { IRequestHandler, requestHandler } from "mediatr-ts";
import { GetAllSeasonsQuery } from "./GetAllSeasonsQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { SeasonResponse } from "../../SeasonResponse";
import { inject, injectable } from "inversify";
import { constants } from "../../../../app/constants";
import { SeasonRepository } from "../../../domain/league/SeasonRepository";

@requestHandler(GetAllSeasonsQuery)
@injectable()
export class GetAllSeasonsQueryHandler
  implements IRequestHandler<GetAllSeasonsQuery, ErrorOr<SeasonResponse[]>>
{
  constructor(
    @inject(constants.SeasonRepository)
    readonly seasonRepository: SeasonRepository
  ) {}

  async handle(_query: GetAllSeasonsQuery): Promise<ErrorOr<SeasonResponse[]>> {
    const seasons = await this.seasonRepository.all();
    const seasonResponses: SeasonResponse[] = [];

    for (const season of seasons) {
      seasonResponses.push(
        new SeasonResponse(
          season.id.value,
          season.matchIds.map((id) => id.value),
          season.teamIds.map((id) => id.value),
          season.name,
          season.startDate,
          season.endDate
        )
      );
    }

    return ErrorOr.success(seasonResponses);
  }
}
