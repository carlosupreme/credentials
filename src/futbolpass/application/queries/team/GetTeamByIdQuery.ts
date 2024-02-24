import { IQuery } from "../../../../shared/application/queries/IQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { TeamResponse } from "../../commands/team/TeamResponse";

export class GetTeamByIdQuery implements IQuery<ErrorOr<TeamResponse>> {
  constructor(readonly id: string) {}
}
