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
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<UserId> {
  constructor(
    id: UserId,
    readonly email: Email,
    readonly password: Password,
    readonly isAdmin: boolean,
    readonly photo: string
  ) {
    super(id);
  }

  static create(
    id: UserId,
    email: Email,
    password: Password,
    isAdmin: boolean,
    photo: string
  ): User {
    const user = new User(id, email, password, isAdmin, photo);

    user.addDomainEvent(new UserRegistered(id.value, email.value, isAdmin));

    return user;
  }

  static fromPrimitives(props: UserPrimitive): User {
    const user = new User(
      new UserId(props.id),
      new Email(props.email),
      new Password(props.password),
      props.isAdmin,
      props.photo
    );

    user.createdAt = props.createdAt;
    user.updatedAt = props.updatedAt;
    return user;
  }

  toPrimitives(): any {
    return {
      id: this.id.value,
      email: this.email.value,
      password: this.password.value,
      isAdmin: this.isAdmin,
      photo: this.photo,
    };
  }

  passwordMatches(passwordPlainText: string): boolean {
    return this.password.matches(passwordPlainText);
  }
}
