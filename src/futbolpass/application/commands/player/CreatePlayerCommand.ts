import { ICommand } from "../../../../shared/application/commands/ICommand";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { PlayerResponse } from "./CreatePlayerResponse";

export class CreatePlayerCommand implements ICommand<ErrorOr<PlayerResponse>> {
  constructor(
    readonly userId: string,
    readonly fullName: string,
    readonly age: number,
    readonly photo: string | null
  ) {}
}
