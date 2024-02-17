import { Entity } from "../../shared/domain/Entity";
import { PlayerStatsId } from "./value-objects/PlayerStatsId";

export class PlayerStats extends Entity<PlayerStatsId> {
  constructor(id: PlayerStatsId, readonly goals: number) {
    super(id);
  }
}
