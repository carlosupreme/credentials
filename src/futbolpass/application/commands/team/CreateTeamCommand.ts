import { ICommand } from "../../../../shared/application/commands/ICommand";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { TeamResponse } from "./TeamResponse";

export class CreateTeamCommand implements ICommand<ErrorOr<TeamResponse>> {
  constructor(
    readonly seasonId: string,
    readonly name: string,
    readonly logo: string | null
  ) {}
}
