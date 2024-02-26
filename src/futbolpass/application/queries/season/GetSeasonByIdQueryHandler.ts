import { IRequestHandler, requestHandler } from "mediatr-ts";
import { GetSeasonByIdQuery } from "./GetSeasonByIdQuery";
import { inject, injectable } from "inversify";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { SeasonResponse } from "../../SeasonResponse";
import { constants } from "../../../../app/constants";
import { SeasonRepository } from "../../../domain/league/SeasonRepository";
import { SeasonId } from "../../../domain/league/SeasonId";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

@requestHandler(GetSeasonByIdQuery)
@injectable()
export class GetSeasonByIdQueryHandler
  implements IRequestHandler<GetSeasonByIdQuery, ErrorOr<SeasonResponse>>
{
  constructor(
    @inject(constants.SeasonRepository)
    readonly seasonRepository: SeasonRepository
  ) {}

  async handle(query: GetSeasonByIdQuery): Promise<ErrorOr<SeasonResponse>> {
    const season = await this.seasonRepository.findById(new SeasonId(query.id));

    if (!season) {
      return ErrorOr.failure(
        DomainError.NotFound(
          "SeasonNotFound",
          `The season id <${query.id}> does not exists`
        )
      );
    }

    return ErrorOr.success(
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
}
