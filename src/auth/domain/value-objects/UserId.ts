import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class UserId extends Uuid {
  static create(): UserId {
    return new UserId(Uuid.random().value);
  }
}
