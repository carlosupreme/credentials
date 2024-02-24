import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class TeamId extends Uuid {
  static create(): TeamId {
    return new TeamId(Uuid.random().value);
  }
}
