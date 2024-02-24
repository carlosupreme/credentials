import { ICommand } from "../../../../shared/application/commands/ICommand";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { SeasonResponse } from "../../SeasonResponse";

export class CreateSeasonCommand implements ICommand<ErrorOr<SeasonResponse>> {
  constructor(
    readonly name: string,
    readonly startDate: Date,
    readonly endDate: Date
  ) {}
}
