import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class GameId extends Uuid {
  static create(): GameId {
    return new GameId(Uuid.random().value);
  }
}
