import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class PlayerTeamDetailsId extends Uuid {
  static create() {
    return new PlayerTeamDetailsId(Uuid.random().value);
  }
}
