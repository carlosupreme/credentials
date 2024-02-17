import { UserRepository } from "../../../domain/UserRepository";
import { RegisterErrors } from "../../../domain/errors/RegisterErrors";
import { User } from "../../../domain/User";
import { UserId } from "../../../domain/value-objects/UserId";
import { Email } from "../../../domain/value-objects/Email";
import { Password } from "../../../domain/value-objects/Password";
import { AuthenticationResponse } from "../../AuthenticationResponse";
import { IJWTProvider } from "../../../domain/IJWTProvider";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { RegisterCommand } from "./RegisterCommand";
import { IRequestHandler, requestHandler } from "mediatr-ts";
import { inject, injectable } from "inversify";
import { constants } from "../../../../app/constants";
import { DefaultPhotoProvider } from "../../../domain/DefaultPhotoProvider";

@requestHandler(RegisterCommand)
@injectable()
export class RegisterCommandHandler
  implements IRequestHandler<RegisterCommand, ErrorOr<AuthenticationResponse>>
{
  constructor(
    @inject(constants.UserRepository)
    private userRepository: UserRepository,
    @inject(constants.IJWTProvider)
    private JWTProvider: IJWTProvider,
    @inject(constants.DefaultPhotoProvider)
    private defaultPhotoProvider: DefaultPhotoProvider
  ) {}

  handle = async (
    command: RegisterCommand
  ): Promise<ErrorOr<AuthenticationResponse>> => {
    if (await this.userRepository.findByEmail(command.email)) {
      return ErrorOr.failure(RegisterErrors.EmailAlreadyExists);
    }

    const user = User.create(
      UserId.create(),
      new Email(command.email),
      Password.hash(command.password),
      command.isAdmin,
      await this.defaultPhotoProvider.getPhotoUrlByEmail(command.email)
    );

    await this.userRepository.add(user);

    const token = this.JWTProvider.generate(user.toPrimitives());

    return ErrorOr.success(
      new AuthenticationResponse(
        user.id.value,
        user.email.value,
        user.photo,
        token
      )
    );
  };
}
