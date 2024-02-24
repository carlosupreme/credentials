import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class MatchId extends Uuid {
  static create(): MatchId {
    return new MatchId(Uuid.random().value);
  }
}
