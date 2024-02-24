import { IRequestHandler, requestHandler } from "mediatr-ts";
import { CreateSeasonCommand } from "./CreateSeasonCommand";
import { SeasonRepository } from "../../../domain/season/SeasonRepository";
import { Season } from "../../../domain/season/Season";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { SeasonResponse } from "../../SeasonResponse";
import { inject, injectable } from "inversify";
import { constants } from "../../../../app/constants";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

@requestHandler(CreateSeasonCommand)
@injectable()
export class CreateSeasonCommandHandler
  implements IRequestHandler<CreateSeasonCommand, ErrorOr<SeasonResponse>>
{
  constructor(
    @inject(constants.SeasonRepository)
    private seasonRepository: SeasonRepository
  ) {}

  async handle(command: CreateSeasonCommand): Promise<ErrorOr<SeasonResponse>> {
    if (await this.seasonRepository.findByName(command.name)) {
      return ErrorOr.failure(
        DomainError.Conflict("SeasonName", "Season name already exists")
      );
    }

    const season = Season.create(
      command.name,
      command.startDate,
      command.endDate
    );

    await this.seasonRepository.add(season);

    return ErrorOr.success(
      new SeasonResponse(
        season.id.value,
        [],
        [],
        season.name,
        season.startDate,
        season.endDate
      )
    );
  }
}
