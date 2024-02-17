import { AsyncValidator } from "fluentvalidation-ts";
import { injectable } from "inversify";
import { LoginQuery } from "./LoginQuery";

@injectable()
export class LoginQueryValidator extends AsyncValidator<LoginQuery> {
  constructor() {
    super();

    this.ruleFor("email")
      .notEmpty()
      .withMessage("Email is required")
      .emailAddress()
      .withMessage("Email must be valid");
      
    this.ruleFor("password").notEmpty().withMessage("Password is required");
  }
}
