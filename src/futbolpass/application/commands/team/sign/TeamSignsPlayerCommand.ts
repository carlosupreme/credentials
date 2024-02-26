import { ICommand } from "../../../../../shared/application/commands/ICommand";
import { ErrorOr } from "../../../../../shared/domain/errors/ErrorOr";
import { TeamResponse } from "../TeamResponse";

export class TeamSignsPlayerCommand implements ICommand<ErrorOr<TeamResponse>> {
  constructor(
    readonly teamId: string,
    readonly playerId: string,
    readonly position: string,
    readonly jerseyNumber: number
  ) {}
}
