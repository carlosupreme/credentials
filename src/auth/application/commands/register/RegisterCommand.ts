import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { AuthenticationResponse } from "../../AuthenticationResponse";
import { ICommand } from "../../../../shared/application/commands/ICommand";

export class RegisterCommand
  implements ICommand<ErrorOr<AuthenticationResponse>>
{
  constructor(
    readonly email: string,
    readonly password: string,
    readonly isAdmin: boolean
  ) {}
}
