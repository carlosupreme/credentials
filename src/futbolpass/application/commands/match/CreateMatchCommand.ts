import { ICommand } from "../../../../shared/application/commands/ICommand";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { MatchResponse } from "../../MatchResponse";

export class CreateMatchCommand implements ICommand<ErrorOr<MatchResponse>> {
  constructor(
    readonly seasonId: string,
    readonly homeTeamId: string,
    readonly awayTeamId: string,
    readonly name: string,
    readonly date: Date
  ) {}
}
