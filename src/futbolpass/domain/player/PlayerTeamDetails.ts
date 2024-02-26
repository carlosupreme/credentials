import { Entity } from "../../../shared/domain/Entity";
import { TeamId } from "../team/TeamId";
import { PlayerTeamDetailsId } from "./PlayerTeamDetailsId";

export class PlayerTeamDetails extends Entity<PlayerTeamDetailsId> {
  constructor(
    id: PlayerTeamDetailsId,
    private _teamId: TeamId | null,
    private _position: string | null,
    private _jerseyNumber: number | null
  ) {
    super(id);
  }

  static create(
    teamId: TeamId | null,
    position: string | null,
    jerseyNumber: number | null
  ) {
    const details = new PlayerTeamDetails(
      PlayerTeamDetailsId.create(),
      teamId,
      position,
      jerseyNumber
    );

    return details;
  }

  get teamId(): TeamId | null {
    return this._teamId;
  }

  set teamId(teamId: TeamId) {
    this._teamId = teamId;
  }

  get position(): string | null {
    return this._position;
  }

  set position(position: string) {
    this._position = position;
  }

  get jerseyNumber(): number | null {
    return this._jerseyNumber;
  }

  set jerseyNumber(jerseyNumber: number) {
    this._jerseyNumber = jerseyNumber;
  }
}
