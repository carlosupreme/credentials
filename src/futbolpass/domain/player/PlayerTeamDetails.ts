import { Entity } from "../../../shared/domain/Entity";
import { TeamId } from "../team/TeamId";
import { PlayerTeamDetailsId } from "./PlayerTeamDetailsId";

export class PlayerTeamDetails extends Entity<PlayerTeamDetailsId> {
  constructor(
    id: PlayerTeamDetailsId,
    readonly teamId: TeamId,
    readonly position: string,
    readonly jerseyNumber: number
  ) {
    super(id);
  }

  static create(teamId: string, position: string, jerseyNumber: number) {
    const details = new PlayerTeamDetails(
      PlayerTeamDetailsId.create(),
      new TeamId(teamId),
      position,
      jerseyNumber
    );

    return details;
  }
}
