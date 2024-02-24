import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class PlayerId extends Uuid {
  static create(): PlayerId {
    return new PlayerId(Uuid.random().value);
  }
}
