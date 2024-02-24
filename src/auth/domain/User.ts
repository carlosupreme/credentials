import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { UserRegistered } from "./events/UserRegistered";
import { Password } from "./value-objects/Password";
import { UserId } from "./value-objects/UserId";
import { Email } from "./value-objects/Email";

export interface UserPrimitive {
  id: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export class User extends AggregateRoot<UserId> {
  constructor(
    id: UserId,
    readonly email: Email,
    readonly password: Password,
    readonly isAdmin: boolean
  ) {
    super(id);
  }

  static create(
    id: UserId,
    email: Email,
    password: Password,
    isAdmin: boolean
  ): User {
    const user = new User(id, email, password, isAdmin);

    user.addDomainEvent(new UserRegistered(id.value, email.value, isAdmin));

    return user;
  }

  static fromPrimitives(props: UserPrimitive): User {
    const user = new User(
      new UserId(props.id),
      new Email(props.email),
      new Password(props.password),
      props.isAdmin
    );

    return user;
  }

  toPrimitives(): any {
    return {
      id: this.id.value,
      email: this.email.value,
      password: this.password.value,
      isAdmin: this.isAdmin,
    };
  }

  passwordMatches(passwordPlainText: string): boolean {
    return this.password.matches(passwordPlainText);
  }
}
