import { DomainEvent } from "../../../shared/domain/DomainEvent";

export class UserRegistered extends DomainEvent {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly isAdmin: boolean
  ) {
    super();
  }
}
