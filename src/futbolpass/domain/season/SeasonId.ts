import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class SeasonId extends Uuid {
  static create(): SeasonId {
    return new SeasonId(Uuid.random().value);
  }
}
