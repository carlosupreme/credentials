import { AsyncValidator } from "fluentvalidation-ts";
import { RegisterCommand } from "./RegisterCommand";
import { injectable } from "inversify";

@injectable()
export class RegisterCommandValidator extends AsyncValidator<RegisterCommand> {
  constructor() {
    super();

    this.ruleFor("email")
      .notEmpty()
      .withMessage("Email is required")
      .emailAddress()
      .withMessage("Email must be valid");

    this.ruleFor("password")
      .notEmpty()
      .withMessage("Password is required")
      .minLength(8)
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
      .withMessage(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number. Can contain special characters"
      );

    this.ruleFor("isAdmin")
      .notNull()
      .withMessage("The value of isAdmin is required");
  }
}