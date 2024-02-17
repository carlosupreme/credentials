import { DomainError } from "../../../shared/domain/errors/DomainError";

export class RegisterErrors {
  static InvalidPassword: DomainError = DomainError.Validation(
    "InvalidPassword",
    "Must be at least 8 characters. Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number. Can contain special characters"
  );

  static InvalidEmail: DomainError = DomainError.Validation(
    "InvalidEmail",
    "The email provided is not a valid email"
  );

  static EmailAlreadyExists: DomainError = DomainError.Conflict(
    "EmailAlreadyExists",
    "Email already exists"
  );
}
