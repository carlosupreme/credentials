import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class PlayerStatsId extends Uuid {
  static create(): PlayerStatsId {
    return new PlayerStatsId(Uuid.random().value);
  }
}
